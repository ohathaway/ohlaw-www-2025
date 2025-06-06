// server/utils/reports/index.js
import {
  PutObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { r2Client } from '../r2';

/**
 * Upload a PDF buffer to Cloudflare R2 bucket
 * @param {Buffer} pdfBuffer - The PDF file as a buffer
 * @param {string} fileName - The name for the file (without extension)
 * @param {string} bucketName - The R2 bucket name
 * @returns {Promise<string>} The URL of the uploaded file
 */
export const uploadPdfToR2 = async (pdfBuffer, fileName, bucketName, prefix) => {
  const key = `${fileName}`;
  
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
    ContentDisposition: `attachment; filename="${fileName}"`
  })

  try {
    await r2Client.send(putCommand)
    
    // Return the public URL (adjust domain as needed for your R2 setup)
    const publicUrl = `https://${bucketName}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`
    console.info('uploaded quiz report file to r2:', fileName)
    return publicUrl
  } catch (error) {
    console.error('Error uploading PDF to R2:', error)
    throw new Error(`Failed to upload PDF: ${error.message}`)
  }
}