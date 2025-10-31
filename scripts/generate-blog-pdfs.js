#!/usr/bin/env node

/**
 * Batch Blog PDF Generation Script
 * Generates PDFs for all published blog posts
 */

import { generateAndStoreBlogPDF } from '../server/utils/blog/generateBlogPDF.js'

const STRAPI_URL = process.env.STRAPI_URL || 'https://strapi.ohlawcolorado.com'
const BATCH_SIZE = 5 // Process 5 posts at a time to avoid overwhelming the server

/**
 * Build query string from params object
 */
const buildQueryString = (params) => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * Fetches all published blog posts from Strapi
 */
async function fetchAllBlogPosts() {
  console.log('Fetching blog posts from Strapi...')

  const posts = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const params = buildQueryString({
        'pagination[page]': page,
        'pagination[pageSize]': 25,
        'filters[publishedAt][$notNull]': true,
        'sort[0]': 'publishedAt:desc',
        'populate': '*',
      })

      const url = `${STRAPI_URL}/api/posts?${params}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      posts.push(...data.data)
      hasMore = data.meta.pagination.page < data.meta.pagination.pageCount
      page++

      console.log(`Fetched page ${page - 1}: ${data.data.length} posts`)
    }
    catch (error) {
      console.error(`Error fetching page ${page}:`, error.message)
      break
    }
  }

  return posts
}

/**
 * Processes posts in batches
 */
async function processBatch(posts, startIndex) {
  const batch = posts.slice(startIndex, startIndex + BATCH_SIZE)
  const results = []

  for (const post of batch) {
    try {
      console.log(`Processing: ${post.title} (${post.slug})`)

      const pdfUrl = await generateAndStoreBlogPDF(post.documentId, post.slug)

      results.push({
        success: true,
        slug: post.slug,
        title: post.title,
        pdfUrl,
      })

      console.log(`✅ Generated PDF: ${post.slug}`)
    }
    catch (error) {
      console.error(`❌ Failed to generate PDF for ${post.slug}:`, error.message)

      results.push({
        success: false,
        slug: post.slug,
        title: post.title,
        error: error.message,
      })
    }
  }

  return results
}

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now()

  console.log('🚀 Starting blog PDF generation batch process...')
  console.log(`Strapi URL: ${STRAPI_URL}`)
  console.log(`Batch size: ${BATCH_SIZE}`)
  console.log('')

  try {
    // Fetch all blog posts
    const posts = await fetchAllBlogPosts()
    console.log(`Found ${posts.length} published blog posts`)
    console.log('')

    // Process posts in batches
    const allResults = []
    const totalBatches = Math.ceil(posts.length / BATCH_SIZE)

    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      console.log(`Processing batch ${batchNumber}/${totalBatches}...`)

      const batchResults = await processBatch(posts, i)
      allResults.push(...batchResults)

      // Add delay between batches to avoid overwhelming the server
      if (i + BATCH_SIZE < posts.length) {
        console.log('Waiting 2 seconds before next batch...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      console.log('')
    }

    // Generate summary report
    const successful = allResults.filter(r => r.success)
    const failed = allResults.filter(r => !r.success)
    const duration = (Date.now() - startTime) / 1000

    console.log('📊 BATCH PROCESS SUMMARY')
    console.log('========================')
    console.log(`Total posts processed: ${allResults.length}`)
    console.log(`Successful: ${successful.length}`)
    console.log(`Failed: ${failed.length}`)
    console.log(`Duration: ${duration}s`)
    console.log('')

    if (failed.length > 0) {
      console.log('❌ FAILED POSTS:')
      failed.forEach((result) => {
        console.log(`  - ${result.slug}: ${result.error}`)
      })
      console.log('')
    }

    console.log('✅ Batch process completed!')

    // Exit with appropriate code
    process.exit(failed.length > 0 ? 1 : 0)
  }
  catch (error) {
    console.error('💥 Batch process failed:', error.message)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Process interrupted by user')
  process.exit(1)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Process terminated')
  process.exit(1)
})

// Run the main function
main()
