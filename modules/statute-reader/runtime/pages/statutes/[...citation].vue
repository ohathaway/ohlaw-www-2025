<template>
  <div class="sr-statute-detail-page">
    <!-- Loading State -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <ProgressSpinner size="3rem" />
        <p class="mt-4 text-lg text-slate-600">Loading statute...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md">
        <Icon name="pi-exclamation-triangle" class="text-6xl text-red-500 mb-4" />
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Statute Not Found</h1>
        <p class="text-slate-600 mb-6">
          The statute "{{ citation }}" could not be found. It may have been repealed, superseded, or the citation may be incorrect.
        </p>
        
        <div class="space-y-3">
          <Button
            @click="goToSearch"
            severity="info"
            class="w-full"
          >
            <Icon name="pi-search" class="mr-2" />
            Search for Similar Statutes
          </Button>
          
          <Button
            @click="goToBrowser"
            severity="secondary"
            outlined
            class="w-full"
          >
            <Icon name="pi-list" class="mr-2" />
            Browse All Statutes
          </Button>
        </div>
      </div>
    </div>

    <!-- Statute Content -->
    <div v-else-if="statute" class="min-h-screen">
      <!-- Page Header -->
      <div class="sr-bg-white border-b border-slate-200 sticky top-0 z-10">
        <div class="sr-max-w-7xl sr-mx-auto sr-px-4 sm:sr-px-6 lg:sr-px-8">
          <div class="py-4">
            <!-- Navigation Bar -->
            <div class="flex items-center justify-between mb-4">
              <!-- Back Navigation -->
              <div class="flex items-center space-x-2">
                <Button
                  @click="goBack"
                  text
                  severity="secondary"
                  size="small"
                >
                  <Icon name="pi-arrow-left" class="mr-1" />
                  Back
                </Button>
                
                <div class="text-gray-300">|</div>
                
                <Button
                  @click="goToBrowser"
                  text
                  severity="secondary"
                  size="small"
                >
                  <Icon name="pi-list" class="mr-1" />
                  Browse
                </Button>
                
                <Button
                  @click="goToSearch"
                  text
                  severity="secondary"
                  size="small"
                >
                  <Icon name="pi-search" class="mr-1" />
                  Search
                </Button>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <Button
                  @click="toggleBookmark"
                  :severity="isBookmarked ? 'info' : 'secondary'"
                  size="small"
                  :title="isBookmarked ? 'Remove bookmark' : 'Add bookmark'"
                >
                  <Icon :name="isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark'" class="mr-1" />
                  {{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}
                </Button>
                
                <Button
                  @click="shareStatute"
                  severity="secondary"
                  size="small"
                  title="Share this statute"
                >
                  <Icon name="pi-share-alt" class="mr-1" />
                  Share
                </Button>
                
                <Button
                  @click="printStatute"
                  severity="secondary"
                  size="small"
                  title="Print this statute"
                >
                  <Icon name="pi-print" class="mr-1" />
                  Print
                </Button>
              </div>
            </div>

            <!-- Breadcrumbs -->
            <StatuteNavigation
              v-if="statute"
              :statute="statute"
              @navigate="onNavigate"
            />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="sr-max-w-7xl sr-mx-auto sr-px-4 sm:sr-px-6 lg:sr-px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Main Statute Content -->
          <div class="lg:col-span-3">
            <StatuteViewer
              :citation="citation"
              :show-navigation="false"
              @navigate="onNavigate"
            />
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Table of Contents -->
            <Card v-if="statute.children?.length">
              <template #title>
                <div class="flex items-center">
                  <Icon name="pi-list" class="mr-2" />
                  Contents
                </div>
              </template>
              <template #content>
                <div class="space-y-1">
                  <div
                    v-for="child in statute.children"
                    :key="child.id"
                    class="p-2 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                    @click="onNavigate(child)"
                  >
                    <div class="font-medium text-sm text-blue-600">
                      {{ child.citation }}
                    </div>
                    <div v-if="child.name" class="text-xs text-slate-600 mt-1 line-clamp-2">
                      {{ child.name }}
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Related Statutes -->
            <Card v-if="relatedStatutes.length > 0">
              <template #title>
                <div class="flex items-center">
                  <Icon name="pi-link" class="mr-2" />
                  Related Statutes
                </div>
              </template>
              <template #content>
                <div class="space-y-2">
                  <div
                    v-for="related in relatedStatutes"
                    :key="related.citation"
                    class="p-2 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                    @click="navigateToRelated(related)"
                  >
                    <div class="font-medium text-sm text-blue-600">
                      {{ related.citation }}
                    </div>
                    <div v-if="related.name" class="text-xs text-slate-600 mt-1">
                      {{ related.name }}
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Statute Information -->
            <Card>
              <template #title>
                <div class="flex items-center">
                  <Icon name="pi-info-circle" class="mr-2" />
                  Information
                </div>
              </template>
              <template #content>
                <div class="space-y-3 text-sm">
                  <div>
                    <dt class="font-medium text-slate-900">Status</dt>
                    <dd class="mt-1">
                      <Badge
                        :value="statute.status"
                        :severity="getStatusSeverity(statute.status)"
                      />
                    </dd>
                  </div>
                  
                  <div v-if="statute.effective_date">
                    <dt class="font-medium text-slate-900">Effective Date</dt>
                    <dd class="mt-1 text-slate-600">{{ formatDate(statute.effective_date) }}</dd>
                  </div>
                  
                  <div v-if="statute.last_modified">
                    <dt class="font-medium text-slate-900">Last Modified</dt>
                    <dd class="mt-1 text-slate-600">{{ formatDate(statute.last_modified) }}</dd>
                  </div>
                  
                  <div v-if="statute.publication">
                    <dt class="font-medium text-slate-900">Publication</dt>
                    <dd class="mt-1 text-slate-600">{{ statute.publication.name }}</dd>
                  </div>
                  
                  <div>
                    <dt class="font-medium text-slate-900">Unit Type</dt>
                    <dd class="mt-1 text-slate-600 capitalize">{{ statute.unit_type }}</dd>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Quick Actions -->
            <Card>
              <template #title>
                <div class="flex items-center">
                  <Icon name="pi-bolt" class="mr-2" />
                  Quick Actions
                </div>
              </template>
              <template #content>
                <div class="space-y-2">
                  <Button
                    @click="copyToClipboard(statute.citation)"
                    text
                    size="small"
                    severity="secondary"
                    class="w-full justify-start"
                  >
                    <Icon name="pi-copy" class="mr-2" />
                    Copy Citation
                  </Button>
                  
                  <Button
                    @click="copyToClipboard(window.location.href)"
                    text
                    size="small"
                    severity="secondary"
                    class="w-full justify-start"
                  >
                    <Icon name="pi-link" class="mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button
                    @click="emailStatute"
                    text
                    size="small"
                    severity="secondary"
                    class="w-full justify-start"
                  >
                    <Icon name="pi-envelope" class="mr-2" />
                    Email Link
                  </Button>
                  
                  <Button
                    @click="exportToPdf"
                    text
                    size="small"
                    severity="secondary"
                    class="w-full justify-start"
                  >
                    <Icon name="pi-download" class="mr-2" />
                    Export PDF
                  </Button>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LegalUnit } from '../../types'

// Get route parameters
const route = useRoute()
const router = useRouter()

// Extract citation from route params
const citation = computed(() => {
  const rawCitation = route.params.citation as string | string[]
  return Array.isArray(rawCitation) ? rawCitation.join('/') : rawCitation
})

// Fetch statute data
const { data: statuteData, pending, error, refresh } = useLazyAsyncData(
  `statute-detail:${citation.value}`,
  () => $fetch(`/api/statutes/citations/${encodeURIComponent(citation.value)}`, {
    query: {
      include_children: true,
      include_related: true,
      include_history: true,
      include_metadata: true
    }
  }),
  {
    watch: [citation],
    server: false // Client-side only for dynamic routes
  }
)

const statute = computed(() => statuteData.value?.data || null)

// Use bookmarks
const { isBookmarked: checkBookmarked, toggleBookmark: toggleBookmarkAction } = useStatuteBookmarks()

const isBookmarked = computed(() => 
  statute.value ? checkBookmarked(statute.value.citation) : false
)

// Related statutes (simplified - would come from cross-references or search)
const relatedStatutes = computed(() => {
  if (!statute.value?.cross_references) return []
  
  return statute.value.cross_references
    .filter(ref => ref.to_unit)
    .map(ref => ref.to_unit!)
    .slice(0, 5) // Limit to 5 related statutes
})

// Static page meta
definePageMeta({
  layout: 'default'
})

// SEO and meta
watchEffect(() => {
  if (statute.value) {
    const title = `${statute.value.citation}${statute.value.name ? ` - ${statute.value.name}` : ''} | Colorado Statutes`
    const description = statute.value.content_text?.substring(0, 160) + '...' || 
                      `View the full text of ${statute.value.citation} in the Colorado Revised Statutes.`
    
    useSeoMeta({
      title,
      ogTitle: title,
      description,
      ogDescription: description,
      ogUrl: `${useRuntimeConfig().public.siteUrl}/statutes/${encodeURIComponent(statute.value.citation)}`,
      ogType: 'article',
      twitterCard: 'summary'
    })
  }
})

// Utility functions
const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    active: 'success',
    repealed: 'danger',
    superseded: 'warning'
  }
  return severityMap[status] || 'secondary'
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Unknown'
  }
}

// Event handlers
const onNavigate = (unit: LegalUnit) => {
  router.push(`/statutes/${encodeURIComponent(unit.citation)}`)
}

const goBack = () => {
  router.back()
}

const goToBrowser = () => {
  router.push('/statutes?tab=0')
}

const goToSearch = () => {
  router.push('/statutes/search')
}

const toggleBookmark = () => {
  if (statute.value) {
    toggleBookmarkAction(statute.value)
  }
}

const shareStatute = async () => {
  if (!statute.value) return
  
  const url = window.location.href
  const title = `${statute.value.citation}${statute.value.name ? ` - ${statute.value.name}` : ''}`
  const text = statute.value.content_text?.substring(0, 200) + '...' || ''
  
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
    } catch (error) {
      await copyToClipboard(url)
    }
  } else {
    await copyToClipboard(url)
  }
}

const printStatute = () => {
  window.print()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show success toast
    useToast().add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Copied to clipboard',
      life: 2000
    })
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const emailStatute = () => {
  if (!statute.value) return
  
  const subject = encodeURIComponent(`Colorado Statute: ${statute.value.citation}`)
  const body = encodeURIComponent(`Check out this Colorado statute: ${window.location.href}`)
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

const exportToPdf = () => {
  // This would integrate with a PDF generation service
  console.log('Export to PDF not implemented yet')
}

const navigateToRelated = (related: LegalUnit) => {
  onNavigate(related)
}

// Handle 404 errors
watch(error, (newError) => {
  if (newError?.statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: `Statute "${citation.value}" not found`
    })
  }
})
</script>

<style scoped>
@media print {
  .sr-statute-detail-page {
    background-color: var(--sr-white);
  }
  
  /* Hide navigation and actions when printing */
  .sticky,
  button {
    @apply print:hidden;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>