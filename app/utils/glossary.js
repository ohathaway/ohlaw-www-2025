// GraphQL queries for glossary terms

export const allTermsQuery = gql`
query {
  terms(sort: "term:asc") {
    data {
      id
      attributes {
        term
        slug
        definition
        tags {
          data {
            id
            attributes {
              name
              slug
            }
          }
        }
      }
    }
  }
}
`

export const singleTermQuery = (slug) => {
  return gql`
  query {
    terms(filters: { slug: { eq: "${slug}" } }) {
      data {
        id
        attributes {
          term
          slug
          definition
          sources
          tags {
            data {
              id
              attributes {
                name
                slug
              }
            }
          }
          posts {
            data {
              id
              attributes {
                Title
                slug
              }
            }
          }
        }
      }
    }
  }
  `
}

// Format tags to match the categories format in the glossary component
export const formatTagsToCategories = (tags) => {
  if (!tags || !tags.data || !tags.data.length) return []
  
  return tags.data.map(tag => ({
    id: tag.id,
    name: tag.attributes.name,
    slug: tag.attributes.slug
  }))
}

// Format posts to match the relatedArticles format in the glossary component
export const formatPostsToRelatedArticles = (posts) => {
  if (!posts || !posts.data || !posts.data.length) return []
  
  return posts.data.map(post => ({
    id: post.id,
    title: post.attributes.Title,
    slug: post.attributes.slug
  }))
}