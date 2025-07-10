#!/usr/bin/env node

/**
 * Simple Blog PDF Generation Script
 * Calls the batch generation API endpoint
 */

const API_URL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function main() {
  console.log('🚀 Starting blog PDF batch generation...')
  console.log(`API URL: ${API_URL}`)
  console.log('')

  try {
    const response = await fetch(`${API_URL}/api/blog/batch-generate-pdfs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    console.log('📊 BATCH GENERATION SUMMARY')
    console.log('===========================')
    console.log(`Total posts: ${result.summary.total}`)
    console.log(`Successful: ${result.summary.successful}`)
    console.log(`Failed: ${result.summary.failed}`)
    console.log(`Duration: ${result.summary.duration}`)
    console.log('')

    if (result.failures && result.failures.length > 0) {
      console.log('❌ FAILED POSTS:')
      result.failures.forEach(failure => {
        console.log(`  - ${failure.slug}: ${failure.error}`)
      })
      console.log('')
    }

    console.log('✅ Batch generation completed!')
    process.exit(result.summary.failed > 0 ? 1 : 0)
  }
  catch (error) {
    console.error('💥 Failed to run batch generation:', error.message)
    console.log('')
    console.log('Make sure your development server is running with:')
    console.log('  pnpm dev')
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Process interrupted by user')
  process.exit(1)
})

// Run the main function
main()