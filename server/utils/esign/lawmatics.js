// Lawmatics API client for matter/contact
// lookups. Used to auto-fill engagement
// letter template variables.

const getConfig = () => {
  const config = useRuntimeConfig()
  return {
    baseUrl: config.lawmatics.url,
    token: config.lawmatics.key,
  }
}

const lawmaticsGet = async (path, params = {}) => {
  const { baseUrl, token } = getConfig()

  const url = new URL(`${baseUrl}${path}`)
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, v),
  )

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `Lawmatics ${response.status}: ${text}`,
    )
  }

  return response.json()
}

// Search matters by last name using
// Lawmatics ilike filter for partial matching
export const searchMatters = async (query) => {
  const data = await lawmaticsGet(
    '/prospects',
    {
      fields: 'all',
      filter_field: 'last_name',
      filter_value: `%${query}%`,
      filter_operator: 'ilike',
    },
  )
  return data.data ?? []
}

// Get a single matter with all fields
export const getMatter = async (id) => {
  const data = await lawmaticsGet(
    `/prospects/${id}`,
    { fields: 'all' },
  )
  return data.data ?? null
}

// Get a contact with all fields
export const getContact = async (id) => {
  const data = await lawmaticsGet(
    `/contacts/${id}`,
    { fields: 'all' },
  )
  return data.data ?? null
}

// Get relationships for a matter
export const getRelationships = async (
  matterId,
) => {
  const data = await lawmaticsGet(
    '/relationships',
    {
      filter_by: 'prospect_id',
      filter_on: matterId,
      fields: 'all',
    },
  )
  return data.data ?? []
}

// Clean prefix — strip trailing period,
// normalize casing
const cleanPrefix = (prefix) => {
  if (!prefix) return ''
  return prefix.replace(/\.$/, '').trim()
}

// Convert cents to dollars
const centsToDollars = cents =>
  cents ? Math.round(cents / 100) : 0

// Build template variables from a matter
export const buildTemplateVarsFromMatter
  = async (matterId) => {
    const matter = await getMatter(matterId)
    if (!matter) return null

    const attrs = matter.attributes ?? {}

    // Build client address
    const address = [
      attrs.street,
      attrs.street2,
      [attrs.city, attrs.state, attrs.zipcode]
        .filter(Boolean)
        .join(', '),
    ].filter(Boolean).join(', ')

    // Attorney fee from estimated_value_cents
    const attorneyFee
      = centsToDollars(attrs.estimated_value_cents)

    const vars = {
      clientName: [
        attrs.first_name,
        attrs.last_name,
      ].filter(Boolean).join(' '),
      clientLastName: attrs.last_name ?? '',
      clientPrefix:
        cleanPrefix(attrs.name_prefix) || 'Mr',
      clientAddress: address
        || attrs.full_address
        || '',
      clientEmail: attrs.email
        ?? attrs.email_address
        ?? '',
      attorneyFee: attorneyFee || '',
    }

    // Detect spouse/co-debtor and build
    // joint signer info
    let isJoint = false
    let spouseInfo = null

    try {
      const rels
        = await getRelationships(matterId)
      const spouseRel = rels.find((r) => {
        const name
          = r.attributes?.name?.toLowerCase()
        return name === 'spouse'
          || name === 'co-debtor'
          || name === 'co-applicant'
      })

      if (spouseRel?.attributes?.contact_id) {
        const spouse = await getContact(
          spouseRel.attributes.contact_id,
        )
        if (spouse?.attributes) {
          const sa = spouse.attributes
          isJoint = true
          spouseInfo = {
            name: [
              sa.first_name,
              sa.last_name,
            ].filter(Boolean).join(' '),
            prefix:
              cleanPrefix(sa.name_prefix)
              || 'Mrs',
            email: sa.email
              ?? sa.email_address
              ?? '',
            attrs: sa,
          }
          vars.jointClientName = spouseInfo.name
          vars.jointClientPrefix
            = spouseInfo.prefix
        }
      }
    }
    catch (err) {
      console.error(
        'Failed to fetch relationships:',
        err,
      )
    }

    // Detect practice area for template type
    // suggestion
    const practiceArea
      = attrs.practice_area?.name
        ?? ''
    const caseTitle
      = (attrs.case_title ?? '').toLowerCase()

    let suggestedTemplate = null
    if (
      practiceArea.toLowerCase()
        .includes('bankrupt')
        || caseTitle.includes('bankrupt')
        || caseTitle.includes('ch 7')
        || caseTitle.includes('ch 13')
        || caseTitle.includes('chapter')
    ) {
      const isCh13 = caseTitle.includes('13')
        || caseTitle.includes('ch13')
        || caseTitle.includes('chapter 13')

      if (isCh13) {
        suggestedTemplate = isJoint
          ? 'ch13_joint'
          : 'ch13_single'
      }
      else {
        suggestedTemplate = isJoint
          ? 'ch7_joint'
          : 'ch7_single'
      }
    }

    // All available Lawmatics fields for
    // template mapping
    const lmFields = {
      // Computed
      clientName: vars.clientName,
      clientLastName: vars.clientLastName,
      clientPrefix: vars.clientPrefix,
      clientAddress: vars.clientAddress,
      clientEmail: vars.clientEmail,
      attorneyFee: String(vars.attorneyFee),
      // Raw matter attributes
      firstName: attrs.first_name ?? '',
      middleName: attrs.middle_name ?? '',
      lastName: attrs.last_name ?? '',
      namePrefix: cleanPrefix(
        attrs.name_prefix,
      ),
      nameSuffix: attrs.name_suffix ?? '',
      email: attrs.email ?? '',
      phone: attrs.phone ?? '',
      street: attrs.street ?? '',
      city: attrs.city ?? '',
      state: attrs.state ?? '',
      zipcode: attrs.zipcode ?? '',
      cityStateZip: [
        attrs.city,
        [attrs.state, attrs.zipcode]
          .filter(Boolean).join(' '),
      ].filter(Boolean).join(', '),
      caseTitle: attrs.case_title ?? '',
      caseNumber: attrs.case_number ?? '',
      birthdate: attrs.birthdate ?? '',
      maritalStatus:
        attrs.marital_status ?? '',
      date: new Date()
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
    }

    // Add spouse fields if found
    if (spouseInfo) {
      const sa = spouseInfo.attrs ?? {}
      lmFields.jointClientName
        = spouseInfo.name
      lmFields.jointFirstName
        = sa.first_name ?? ''
      lmFields.jointMiddleName
        = sa.middle_name ?? ''
      lmFields.jointLastName
        = sa.last_name ?? ''
      lmFields.jointClientPrefix
        = spouseInfo.prefix
      lmFields.jointNameSuffix
        = sa.name_suffix ?? ''
      lmFields.jointClientEmail
        = spouseInfo.email
    }

    return {
      matterId,
      matterTitle: attrs.case_title ?? '',
      practiceArea,
      suggestedTemplate,
      isJoint,
      spouseInfo,
      lmFields,
      ...vars,
    }
  }
