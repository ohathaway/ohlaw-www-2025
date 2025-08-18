import { ColoradoParser } from './parsers/colorado'

/**
 * Simple test function to debug the Colorado parser
 */
export async function testColoradoParser(url: string) {
  try {
    console.log(`Testing Colorado parser with URL: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    
    const html = await response.text()
    console.log(`HTML length: ${html.length} characters`)
    
    const { load } = await import('cheerio')
    const $ = load(html)
    
    console.log(`Page title: ${$('title').text()}`)
    console.log(`Body text length: ${$('body').text().length}`)
    
    // Test the parser
    const statutes = ColoradoParser.parseStatutes($, url)
    
    console.log(`Parser results: ${statutes.length} statutes found`)
    statutes.forEach((statute, index) => {
      console.log(`${index + 1}. ${statute.unit_type}: ${statute.citation} - ${statute.name}`)
    })
    
    return statutes
    
  } catch (error) {
    console.error('Test failed:', error)
    throw error
  }
}