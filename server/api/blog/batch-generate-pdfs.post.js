/**
 * Batch Blog PDF Generation API
 * Generates PDFs for all published blog posts
 */

import { generateBlogPDFBuffer } from '../../utils/blog/generateBlogPDF.js'
import { uploadPdfToR2 } from '../../utils/reports/index.js'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  const BATCH_SIZE = 5
  const isDev = process.env.NODE_ENV === 'development'

  try {
    console.log('🚀 Starting batch blog PDF generation...')

    // Fetch all published blog posts
    const allPosts = await fetchAllBlogPosts()
    console.log(`Found ${allPosts.length} published blog posts`)

    if (allPosts.length === 0) {
      console.log('No published blog posts found. Check Strapi connection and data.')
      return {
        success: true,
        message: 'No published blog posts found',
        summary: { total: 0, successful: 0, failed: 0, duration: '0s' },
        results: [],
      }
    }

    // Process posts in batches
    const results = []
    const totalBatches = Math.ceil(allPosts.length / BATCH_SIZE)

    for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      console.log(`Processing batch ${batchNumber}/${totalBatches}...`)

      const batch = allPosts.slice(i, i + BATCH_SIZE)
      const batchResults = await processBatch(batch)
      results.push(...batchResults)

      console.log(`Batch ${batchNumber} completed`)
    }

    // Generate summary
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    const duration = (Date.now() - startTime) / 1000

    console.log('✅ Batch generation completed!')

    return {
      success: true,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        duration: `${duration}s`,
      },
      results,
      failures: failed,
    }
  }
  catch (error) {
    console.error('💥 Batch generation failed:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Batch PDF generation failed',
      data: { error: error.message },
    })
  }
})

/**
 * Fetches all published blog posts from Strapi
 */
async function fetchAllBlogPosts() {
  const posts = []
  let page = 1
  let hasMore = true
  const strapiUrl = useRuntimeConfig().public.strapiUrl
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) console.log(`Fetching blog posts from: ${strapiUrl}`)

  while (hasMore) {
    try {
      if (isDev) console.log(`Fetching page ${page}...`)

      const url = `${strapiUrl}/api/posts?pagination[page]=${page}&pagination[pageSize]=25&filters[publishedAt][$notNull]=true&sort[0]=publishedAt:desc&populate=*`
      if (isDev) {
        console.log(`=== FETCHING URL ===`)
        console.log(url)
        console.log(`=== END URL ===`)
      }

      const response = await $fetch(url)

      if (isDev) {
        console.log(`Page ${page} response:`, {
          dataLength: response.data?.length || 0,
          pagination: response.meta?.pagination,
        })

        // Debug: Log first post structure to understand data format
        if (response.data && response.data.length > 0 && page === 1) {
          console.log('=== FIRST POST STRUCTURE ===')
          console.log(JSON.stringify(response.data[0], null, 2))
          console.log('=== END POST STRUCTURE ===')
        }
      }

      if (response.data) {
        posts.push(...response.data)
      }

      hasMore = response.meta?.pagination?.page < response.meta?.pagination?.pageCount
      page++
    }
    catch (error) {
      console.error(`Error fetching page ${page}:`, error.message)
      console.error('Full error:', error)
      break
    }
  }

  console.log(`Total posts fetched: ${posts.length}`)
  return posts
}

/**
 * Processes a batch of posts
 */
async function processBatch(posts) {
  const results = []
  const isDev = process.env.NODE_ENV === 'development'

  for (const post of posts) {
    try {
      if (isDev) {
        console.log(`Processing: ${post.Title} (${post.slug})`)
        console.log(`Post data:`, {
          documentId: post.documentId,
          slug: post.slug,
          title: post.Title,
          hasContent: !!post.Content,
        })
      }

      // Generate PDF buffer
      if (isDev) console.log('Generating PDF buffer...')
      const { buffer: pdfBuffer } = await generateBlogPDFBuffer(post.documentId)
      if (isDev) console.log(`PDF buffer generated: ${pdfBuffer.length} bytes`)

      // Store in NuxtHub blob storage
      const filename = `${post.slug}.pdf`
      if (isDev) console.log(`Storing PDF: ${filename}`)

      let pdfUrl
      try {
        // Use the public bucket for blog PDFs
        const appConfig = useAppConfig()
        const bucketName = appConfig.blogPdfs.bucketName
        const keyName = `${appConfig.blogPdfs.prefix}/${filename}`

        if (isDev) console.log(`Uploading to R2: ${bucketName}/${keyName}`)
        await uploadPdfToR2(pdfBuffer, keyName, bucketName)

        // Construct the public URL
        pdfUrl = `${appConfig.blogPdfs.publicDomain}/${keyName}`
        if (isDev) console.log(`PDF stored successfully: ${filename} -> ${pdfUrl}`)
      }
      catch (storageError) {
        console.error('R2 storage error:', storageError)
        throw new Error(`Failed to store PDF: ${storageError.message}`)
      }

      results.push({
        success: true,
        slug: post.slug,
        title: post.Title,
        pdfUrl,
      })

      console.log(`✅ Generated PDF: ${post.slug}`)
    }
    catch (error) {
      console.error(`❌ Failed to generate PDF for ${post.slug}:`, error.message)
      console.error('Full error details:', error)
      console.error('Stack trace:', error.stack)

      results.push({
        success: false,
        slug: post.slug,
        title: post.Title,
        error: error.message,
        stack: error.stack,
        errorName: error.name,
        cause: error.cause?.message,
      })
    }
  }

  return results
}
