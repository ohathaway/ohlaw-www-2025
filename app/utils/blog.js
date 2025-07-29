import qs from 'qs'
// const nuxtApp = useNuxtApp()

// console.debug('nuxtApp: ', nuxtApp)
// const { strapiUrl } = nuxtApp.runWithContext(() => useAppConfig())
const strapiUrl = 'https://strapi.ohlawcolorado.com'

const isModifier = (brick) => {
  const modifierTypes = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
  ]
  return intersection(modifierTypes, Object.keys(brick)).length > 0
}

const getThumbnailUrl = (url) => {
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
const getStrapiThumbnailUrl = (image) => {
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
const getStrapiUrl = (image) => {
  const url = image?.data?.attributes?.url ?? image?.url
  return url ? strapiUrl + url : ''
}

const richTextToPlainText = (rich) => {
  try {
    return rich.map((brick) => {
      if (brick.type === 'paragraph') {
        return brick.children.map((child) => {
          return child.type === 'text'
            ? child.text
            : child.children[0].text
        }).join(' ').trim()
      }
    })[0]
  }
  catch (error) {
    console.error(error)
    return error
  }
}

const addScrollSpy = () => {

}

const getMultipleRandom = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())

  return shuffled.slice(0, num)
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
  'provider',
]

const singlePostQueryREST = (slug) => {
  try {
    const params = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        category: {
          fields: [
            'slug',
            'Name',
          ],
        },
        Image: {
          fields: imageFields,
        },
        populate: {
          Image: {
            fields: imageFields,
          },
          tags: {
            fields: [
              'Name',
              'slug',
            ],
          },
        },
      },
      fields: [
        'Content',
        'CTA',
        'publishDate',
        'slug',
        'Snippet',
        'Title',
      ],
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('error parsing parameters for all posts query', error)
    return ''
  }
}

const allPostsQueryREST = (limit) => {
  try {
    const params = {
      sort: [
        'publishDate:desc',
      ],
      populate: {
        Image: {
          fields: imageFields,
        },
        populate: {
          Image: {
            fields: imageFields,
          },
          tags: {
            fields: [
              'Name',
              'slug',
            ],
          },
        },
      },
      fields: [
        'Content',
        'CTA',
        'publishDate',
        'slug',
        'Snippet',
        'Title',
      ],
      pagination: {
        pageSize: limit,
        page: 1,
      },
      status: 'published',
      locale: [
        'en',
      ],
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('error parsing parameters for all posts query', error)
    return ''
  }
}

const postListQueryREST = (filterSlug, listType = 'category', limit = 6) => {
  try {
    const fields = []
    if (listType === 'category') fields.push('hero')

    const populate = {
      posts: {
        sort: [
          'publishDate:desc',
        ],
        populate: {
          Image: {
            fields: imageFields,
          },
          tags: {
            fields: [
              'Name',
              'slug',
            ],
          },
        },
      },
    }
    if (listType === 'category') populate.Image = { fields: imageFields }

    const params = {
      filters: {
        slug: {
          $eq: filterSlug,
        },
      },
      populate,
      fields,
      pagination: {
        pageSize: limit,
        page: 1,
      },
      status: 'published',
      locale: [
        'en',
      ],
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('error parsing parameters for category query', error)
    return ''
  }
}

const featuredPostQueryREST = () => {
  try {
    const params = {
      populate: {
        post: {
          populate: {
            Image: {
              fields: imageFields,
            },
            tags: {
              fields: [
                'Name',
                'slug',
              ],
            },
            category: {
              fields: [
                'Name',
                'slug',
              ],
            },
          },
          fields: [
            'Content',
            'Title',
            'slug',
            'publishDate',
            'Snippet',
            'CTA',
          ],
        },
      },
      fields: [
        'createdAt',
        'updatedAt',
        'publishedAt',
      ],
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('error parsing parameters for featured post query', error)
    return ''
  }
}

const spotlightPostsQueryREST = () => {
  try {
    const params = {
      populate: {
        posts: {
          populate: {
            Image: {
              fields: imageFields,
            },
            tags: {
              fields: [
                'Name',
                'slug',
              ],
            },
            category: {
              fields: [
                'Name',
                'slug',
              ],
            },
          },
          fields: [
            'Content',
            'Title',
            'slug',
            'publishDate',
            'Snippet',
            'CTA',
          ],
        },
      },
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('error parsing parameters for spotlight posts query', error)
    return ''
  }
}

const tagPostsQueryREST = (tag, limit = 3) => {
  try {
    const params = {
      filters: {
        slug: {
          $eq: tag,
        },
      },
      populate: {
        terms: {
          fields: [
            'term',
            'definition',
            'sources',
            'slug',
          ],
        },
        posts: {
          sort: [
            'publishDate:desc',
          ],
          populate: {
            Image: {
              fields: imageFields,
            },
            tags: {
              fields: [
                'Name',
                'slug',
              ],
            },
            terms: {
              fields: [
                'term',
                'definition',
                'sources',
                'slug',
              ],
            },
          },
          fields: [
            'Title',
            'Snippet',
          ],
          pagination: {
            pageSize: limit,
            page: 1,
          },
        },
      },
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('error parsing parameters for tag posts query', error)
    return ''
  }
}

const dedupPosts = (posts) => {
  return posts.filter((value, index, self) => {
    return self.findIndex(v => v.documentId === value.documentId) === index
  })
}

export {
  allPostsQueryREST,
  dedupPosts,
  featuredPostQueryREST,
  getMultipleRandom,
  getStrapiThumbnailUrl,
  getStrapiUrl,
  getThumbnailUrl,
  isModifier,
  postListQueryREST,
  richTextToPlainText,
  singlePostQueryREST,
  spotlightPostsQueryREST,
  tagPostsQueryREST,
}
