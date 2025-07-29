// server/utils/quizzes/richTextToPdf.js

// Core transformation function that processes rich text blocks to PDF-ready format
export const richTextToPdf = (blocks = [], options = {}) => {
  const config = {
    indent: 20,
    listBullet: '• ',
    headingLevelBaseSize: 18,
    ...options,
  }

  // Early return for invalid input
  if (!Array.isArray(blocks)) {
    return [createParagraphBlock('No content available')]
  }

  // Transform each block using type-specific transformers
  return blocks.flatMap(block => transformBlock(block, config))
}

// Type-specific transformers

const transformBlock = (block, config) => {
  const transformers = {
    heading: transformHeading,
    paragraph: transformParagraph,
    list: transformList,
    // Add more block types as needed
  }

  const transformer = transformers[block.type]
  return transformer ? transformer(block, config) : []
}

const transformHeading = (block, config) => [{
  type: 'heading',
  level: block.level,
  text: extractText(block.children),
  fontSize: config.headingLevelBaseSize - ((block.level - 1) * 2),
  style: 'bold',
  id: block.children[0]?.text?.replaceAll(' ', '-').toLowerCase() || null,
}]

const transformParagraph = (block, config) => {
  if (!block.children?.length) {
    return [{ type: 'spacer', height: 12 }]
  }

  return [{
    type: 'paragraph',
    spans: block.children.map(transformInlineElement),
  }]
}

const transformList = (block, config) => [{
  type: 'list',
  format: block.format || 'unordered',
  items: block.children.map(item => ({
    spans: item.children.map(transformInlineElement),
  })),
}]

// Helper functions for transformations

const transformInlineElement = (element) => {
  if (element.type === 'link') {
    return {
      text: extractText(element.children),
      style: 'link',
      url: element.url,
      bold: false,
      italic: false,
      underline: true,
    }
  }

  return {
    text: element.text || '',
    style: determineStyle(element),
    bold: !!element.bold,
    italic: !!element.italic,
    underline: !!element.underline,
    strikethrough: !!element.strikethrough,
    code: !!element.code,
  }
}

const extractText = (children = []) =>
  children
    .map(child => child.type === 'text' ? child.text : extractText(child.children))
    .join('')

const determineStyle = (node) => {
  if (node.code) return 'code'

  const modifiers = [
    node.bold && 'bold',
    node.italic && 'italic',
    node.underline && 'underline',
    node.strikethrough && 'strikethrough',
  ].filter(Boolean)

  return modifiers.length > 0 ? modifiers.join('-') : 'normal'
}

// Factory functions for creating blocks
const createParagraphBlock = text => ({
  type: 'paragraph',
  spans: [{
    text,
    style: 'normal',
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
  }],
})
