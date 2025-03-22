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

/*
 * graphQl queries
 */
const singlePostQuery = slug => {
  return gql`
  query {
    posts(filters: { slug: { eq: "${slug}" } }) {
      data {
        id,
        attributes {
          Content,
          CTA,
          publishDate,
          updatedAt,
          Title,
          Snippet,
          category {
            data {
              id,
              attributes{
                Name,
                slug
              }
            }
          },
          tags {
            data {
              id,
              attributes {
                Name,
                slug
              }
            }
          },
          Image {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }
  }`
}

const allPostsQuery = gql`
query {
  posts(sort: "publishDate:DESC") {
    data {
      id
      attributes {
        Title,
        Snippet,
        publishDate,
        Image {
          data {
            attributes {
              name
              url
            }
          }
        },
        slug,
        tags {
          data {
            id,
            attributes {
              Name,
              slug
            }
          }
        }
      }
    }
  }
}`

const featuredPostQuery = gql`
query {
  featuredPost{
    data{
      attributes{
        post {
          data {
            id,
              attributes {
              Content,
                CTA,
                publishDate,
                Title,
                slug,
                category {
                data {
                  id,
                    attributes{
                    Name,
                    slug
                  }
                }
              },
              Image {
                data {
                  id,
                  attributes {
                    name,
                    url
                  }
                }
              }
              tags {
                data {
                  id,
                    attributes {
                    Name,
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

const spotlightPostsQuery = gql`
query {
  spotlight{
    data{
      attributes{
        posts (sort: "publishDate:DESC") {
          data {
            id,
              attributes {
              Content,
                CTA,
                publishDate,
                slug,
                Title,
                category {
                data {
                  id,
                    attributes{
                    Name,
                    slug
                  }
                }
              },
              Image {
                data {
                  attributes {
                    name,
                    url
                  }
                }
              },
              tags {
                data {
                  id,
                    attributes {
                    Name,
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

const categoryPostsQuery = (category, limit = 3) => {
  return gql`
  query {
    categories(
      pagination: { start: 0, limit: ${limit} },
      filters: { Name: { eq: "${category}" } }
    ) {
      data {
        attributes {
          posts (sort: "publishDate:DESC") {
            data {
              id,
              attributes {
                Snippet,
                Title,
                slug,
                publishDate,
                tags {
                  data {
                    id,
                    attributes {
                      Name,
                      slug
                    }
                  }
                },
                Image {
                  data {
                    attributes {
                      name
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`
}

const tagPostsQuery = (tag, limit = 3) => {
  return gql`
  query {
    tags(
      pagination: { start: 0, limit: ${limit} },
      filters: { slug: { eq: "${tag}" } }
    ) {
      data {
        attributes {
          posts (sort: "publishDate:DESC") {
            data {
              id,
              attributes {
                Snippet,
                Title,
                slug,
                tags {
                  data {
                    id,
                    attributes {
                      Name,
                      slug
                    }
                  }
                },
                Image {
                  data {
                    attributes {
                      name
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`
}

export {
  allPostsQuery,
  categoryPostsQuery,
  getStrapiThumbnailUrl,
  getStrapiUrl,
  getThumbnailUrl,
  featuredPostQuery,
  isModifier,
  richTextToPlainText,
  singlePostQuery,
  spotlightPostsQuery,
  tagPostsQuery
}