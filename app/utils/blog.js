import qs from 'qs'
// const nuxtApp = useNuxtApp()

// console.debug('nuxtApp: ', nuxtApp)
// const { strapiUrl } = nuxtApp.runWithContext(() => useAppConfig())
const strapiUrl = 'https://strapi.ohlawcolorado.com'

const isModifier = brick => {
  const modifierTypes = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code'
  ]
  return intersection(modifierTypes, Object.keys(brick)).length > 0
}

const getThumbnailUrl = url => {
  const urlParts = url.split('/')
  urlParts.push(urlParts.pop().replace(/^/, 'thumbnail_'))
  return urlParts.join('/')
}

/*
const getStrapiThumbnailUrl = image => {
  const { data: { attributes: {url } } } = image
  const urlParts = url.split('/')
  urlParts.push(urlParts.pop().replace(/^/, 'thumbnail_'))
  return strapiUrl+urlParts.join('/')
}
*/
const getStrapiThumbnailUrl = image => {
  const url = image?.data?.attributes?.url ?? image?.url
  if (!url) return ''
  const urlParts = url.split('/')
  urlParts.push(urlParts.pop().replace(/^/, 'thumbnail_'))
  return strapiUrl + urlParts.join('/')
}

/*
const getStrapiUrl = image => {
  const { data: { attributes: {url } } } = image
  return strapiUrl+url
}
*/
const getStrapiUrl = image => {
  const url = image?.data?.attributes?.url ?? image?.url
  return url ? strapiUrl + url : ''
}

const richTextToPlainText = rich => {
  try {
    return rich.map(brick => {
      if (brick.type === 'paragraph') {
        return brick.children.map( child => {
          return child.type === 'text'
            ? child.text
            : child.children[0].text
        }).join(' ').trim()
      }
    })[0]
  } catch (error) {
    console.error(error)
    return error
  }
}

const addScrollSpy = () => {

}

const getMultipleRandom = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

/*
 * API queries
 */

const imageFields = [
  'name',
  'caption',
  'alternativeText',
  'url',
  'previewUrl',
  'provider'
]

const singlePostQuery = slug => {
  return gql`
    query Posts {
      posts(
        filters: {
          slug: {
            eq: "${slug}"
          }
        }
      ) {
        documentId
        Content
        Title
        Image {
          name
          caption
          alternativeText
          url
          previewUrl
          provider
        }
        tags {
          Name
          slug
        }
        category {
          Name
          slug
        }
        slug
        publishDate
        Snippet
        CTA
        createdAt
        updatedAt
        publishedAt
        terms {
            term
            definition
            slug
            sources
        }
      }
    }
  `
}

const allPostsQuery = gql`
query Posts {
  posts {
      documentId
      Content
      Title
      slug
      Image {
          name
          caption
          alternativeText
          url
          previewUrl
          provider
      }
      tags {
          Name
          slug
      }
      category {
          Name
          slug
      }
      CTA
      createdAt
      updatedAt
      publishedAt
  }
}
`

const allPostsQueryREST = limit => {
  try {
    const params = {
      sort: [
        'publishDate:desc'
      ],
      populate: {
        Image: {
          fields: imageFields
        },
        populate: {
          Image: {
            fields: imageFields
          },
          tags: {
            fields: [
              'Name',
              'slug'
            ]
          }
        }
      },
      fields: [
        'Content',
        'CTA',
        'publishDate',
        'slug',
        'Snippet',
        'Title'
      ],
      pagination: {
        pageSize: limit,
        page: 1
      },
      status: 'published',
      locale: [
        'en'
      ]
    }
    return qs.stringify(params, { encode: false })
  } catch (error) {
    console.error('error parsing parameters for all posts query', error)
    return ''
  }
}

const featuredPostQuery = gql`
query FeaturedPost {
  featuredPost {
    documentId
    createdAt
    updatedAt
    publishedAt
    post {
      documentId
      Content
      Title
      slug
      publishDate
      Snippet
      CTA
      createdAt
      updatedAt
      publishedAt
      category {
        documentId
        Name
        slug
        createdAt
        updatedAt
        publishedAt
      }
      Image {
        name
        caption
        alternativeText
        url
        previewUrl
        provider
      }
      tags {
        Name
        slug
      }
    }
  }
}`

const spotlightPostsQuery = gql`
query Spotlight {
  spotlight {
    posts {
      documentId
      Content
      Title
      slug
      publishDate
      Snippet
      CTA
      createdAt
      updatedAt
      publishedAt
      Image {
        name
        caption
        alternativeText
        url
        previewUrl
        provider
      }
      tags {
        documentId
        Name
        slug
      }
      category {
        Name
        slug
      }
    }
  }
}
`
/*
const categoryPostsQuery = (category, limit = 3) => {
  return gql`
  query Categories {
    categories(
      pagination: { start: 0, limit: ${limit} },
      filters: { Name: { eq: "${category}" } }
    ) {
      hero
      faq {
          question
          answer
      },
      Image {
        name
        alternativeText
        caption
        url
        previewUrl
        provider
      },
      posts(sort: "publishDate:DESC") {
        documentId
        Snippet
        Title
        slug
        publishDate
        tags {
          Name
          slug
        }
        Image {
          name
          caption
          alternativeText
          url
          previewUrl
          provider
        }
      }
    }
  }
  `
}
*/

const postListQueryREST = (filterSlug, listType = 'category', limit = 6) => {
  try {
    const fields = []
    if (listType === 'category') fields.push('hero')

    const populate = {
      posts: {
        sort: [
          'publishDate:desc'
        ],
        populate: {
          Image: {
            fields: imageFields
          },
          tags: {
            fields: [
              'Name',
              'slug'
            ]
          }
        }
      }
    }
    if (listType === 'category') populate.Image = { fields: imageFields }


    const params = {
      filters: {
        slug: {
          '$eq': filterSlug
        }
      },
      populate,
      fields, 
      pagination: {
        pageSize: limit,
        page: 1
      },
      status: 'published',
      locale: [
        'en'
      ]
    }
    return qs.stringify(params, { encode: false })
  } catch (error) {
    console.error('error parsing parameters for category query', error)
    return ''
  }
}

const tagPostsQuery = (tag, limit = 3) => {
  return gql`
  query Tags {
    tags(
      pagination: { start: 0, limit: ${limit} },
      filters: { slug: { eq: "${tag}" } }
    ) {
      terms {
        term
        definition
        sources
        slug
      }
      posts (
        sort: "publishDate:DESC"
      ) {
        documentId
        Title
        Image {
          name
          caption
          alternativeText
          url
          previewUrl
          provider
        }
        tags {
          Name
          slug
        }
        Snippet
        terms {
          term
          definition
          sources
          slug
        }
      }
    }
  }
  `
}

const dedupPosts = posts =>{
  return posts.filter((value, index, self) => {
    return self.findIndex(v => v.documentId === value.documentId) === index
  })
}

export {
  allPostsQuery,
  allPostsQueryREST,
  dedupPosts,
  getMultipleRandom,
  getStrapiThumbnailUrl,
  getStrapiUrl,
  getThumbnailUrl,
  featuredPostQuery,
  isModifier,
  postListQueryREST ,
  richTextToPlainText,
  singlePostQuery,
  spotlightPostsQuery,
  tagPostsQuery
}