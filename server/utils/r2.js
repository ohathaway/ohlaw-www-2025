// server/utils/r2.js
import {
  GetObjectCommand,
  NoSuchKey,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import Cloudflare from 'cloudflare'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})

const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_KEY,
})

/**
 * Create temporary read-only R2 credentials for a specific key
 * @param {string} key - The specific R2 object key to grant access to
 * @returns {Promise<object>} Temporary credentials object
 */
export const createTemporaryR2Credentials = async (key) => {
  const config = useRuntimeConfig()
  const accountId = config.cloudflare.accountId
  const bucketName = config.cloudflare.bucketName

  try {
    const params = {
      account_id: accountId,
      bucket: bucketName,
      parentAccessKeyId: config.cloudflare.accessKeyId,
      permission: 'object-read-only',
      objects: [key],
      ttlSeconds: 7 * 24 * 60 * 60, // 7 days in seconds
    }
    console.info('credentials params:', params)
    const response = await cf.r2.temporaryCredentials.create(params)

    return {
      accessKeyId: response.accessKeyId,
      secretAccessKey: response.secretAccessKey,
      sessionToken: response.sessionToken,
      accountId,
      bucketName,
      key,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    }
  }
  catch (error) {
    console.error('Error creating temporary R2 credentials:', error)
    throw new Error(`Failed to create temporary credentials: ${error.message}`)
  }
}

export const getPresignedUrl = async (key) => {
  try {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    })

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    })

    return presignedUrl
  }
  catch (error) {
    console.error('failed to get presigned url:', error)
    throw error
  }
}

export { GetObjectCommand, NoSuchKey, r2Client }
