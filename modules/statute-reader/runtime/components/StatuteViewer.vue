<template>
  <div class="statute-viewer">
    <!-- Loading State -->
    <div v-if="isLoading" class="sr-flex sr-items-center sr-justify-center sr-p-8">
      <ProgressSpinner size="2rem" />
      <span class="sr-ml-2 sr-text-slate-600">Loading statute...</span>
    </div>

    <!-- Error State -->
    <Message
      v-else-if="error"
      severity="error"
      :closable="false"
      class="sr-mt-4 sr-mb-4 sr-ml-4 sr-mr-4"
    >
      {{ error }}
    </Message>

    <!-- Statute Content -->
    <div v-else-if="statute" class="sr-h-full sr-flex sr-flex-col">
      <!-- Statute Header -->
      <div class="statute-header sr-bg-white sr-border-b sr-border-slate-200 sr-p-6 sr-flex-shrink-0">
        <!-- Breadcrumbs and Navigation -->
        <StatuteNavigation
          v-if="showNavigation"
          :statute="statute"
          @navigate="onNavigate"
          class="sr-mb-4"
        />

        <!-- Citation and Title -->
        <div class="sr-flex sr-items-start sr-justify-between sr-mb-4">
          <div class="sr-flex-1 sr-min-w-0">
            <h1 class="sr-text-2xl sr-font-bold sr-text-slate-900 sr-mb-2">
              {{ statute.citation }}
            </h1>
            
            <h2
              v-if="statute.name"
              class="sr-text-lg sr-font-medium sr-text-gray-700 sr-mb-3"
            >
              {{ statute.name }}
            </h2>

            <!-- Status and Metadata -->
            <div class="sr-flex sr-items-center sr-gap-3">
              <Badge
                v-if="statute.status !== 'active'"
                :value="statute.status"
                :severity="getStatusSeverity(statute.status)"
              />
              
              <span
                v-if="statute.effective_date"
                class="sr-text-sm sr-text-slate-500"
              >
                Effective: {{ formatDate(statute.effective_date) }}
              </span>
              
              <span
                v-if="statute.last_modified"
                class="sr-text-sm sr-text-slate-500"
              >
                Modified: {{ formatDate(statute.last_modified) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="sr-flex sr-items-center sr-gap-2 sr-ml-4">
            <Button
              @click="toggleBookmark"
              :severity="isBookmarked ? 'info' : 'secondary'"
              size="small"
              :title="isBookmarked ? 'Remove bookmark' : 'Add bookmark'"
            >
              <Icon :name="isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark'" />
            </Button>
            
            <Button
              @click="copyToClipboard(statute.citation)"
              severity="secondary"
              size="small"
              title="Copy citation"
            >
              <Icon name="pi-copy" />
            </Button>
            
            <Button
              @click="shareStatute"
              severity="secondary"
              size="small"
              title="Share"
            >
              <Icon name="pi-share-alt" />
            </Button>
            
            <Button
              @click="printStatute"
              severity="secondary"
              size="small"
              title="Print"
            >
              <Icon name="pi-print" />
            </Button>
          </div>
        </div>

        <!-- Tabs for Different Views -->
        <Tabs v-model:value="activeTab" class="statute-tabs">
          <TabList>
            <Tab value="0">
              <i class="pi pi-file-o sr-mr-2" />
              Content
            </Tab>
            <Tab v-if="statute.cross_references?.length" value="1">
              <i class="pi pi-link sr-mr-2" />
              References ({{ statute.cross_references.length }})
            </Tab>
            <Tab v-if="statute.history?.length" value="2">
              <i class="pi pi-history sr-mr-2" />
              History
            </Tab>
            <Tab v-if="statute.metadata?.length" value="3">
              <i class="pi pi-info-circle sr-mr-2" />
              Notes
            </Tab>
            <Tab v-if="statute.children?.length" value="4">
              <i class="pi pi-list sr-mr-2" />
              Subsections ({{ statute.children.length }})
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel value="0">
              <!-- Content will be shown below -->
            </TabPanel>
            <TabPanel v-if="statute.cross_references?.length" value="1">
              <!-- References content will be shown below -->
            </TabPanel>
            <TabPanel v-if="statute.history?.length" value="2">
              <!-- History content will be shown below -->
            </TabPanel>
            <TabPanel v-if="statute.metadata?.length" value="3">
              <!-- Notes content will be shown below -->
            </TabPanel>
            <TabPanel v-if="statute.children?.length" value="4">
              <!-- Subsections content will be shown below -->
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <!-- Tab Content -->
      <div class="statute-content sr-flex-1 sr-overflow-auto sr-p-6">
        <!-- Content Tab -->
        <div v-if="activeTab === '0'" class="sr-prose sr-prose-lg sr-max-w-none">
          <div
            v-if="statute.content_html"
            v-html="sanitizedContent"
            class="statute-text"
          />
          <div
            v-else-if="statute.content_text"
            class="sr-whitespace-pre-wrap"
          >
            {{ statute.content_text }}
          </div>
          <div v-else class="sr-text-slate-500 sr-italic">
            No content available for this statute.
          </div>
        </div>

        <!-- Cross References Tab -->
        <div v-else-if="activeTab === '1'" class="sr-space-y-4">
          <h3 class="sr-text-lg sr-font-semibold sr-mb-4">Cross References</h3>
          <div
            v-for="ref in statute.cross_references"
            :key="ref.id"
            class="sr-border sr-rounded-lg sr-p-4 sr-hover-bg-slate-100 sr-transition-colors"
          >
            <div class="sr-flex sr-items-start sr-justify-between">
              <div>
                <h4 class="sr-font-medium sr-text-blue-600 sr-cursor-pointer sr-hover-text-blue-800">
                  {{ ref.to_unit?.citation || ref.reference_text }}
                </h4>
                <p v-if="ref.to_unit?.name" class="sr-text-gray-700">
                  {{ ref.to_unit.name }}
                </p>
                <p v-if="ref.context" class="sr-text-sm sr-text-slate-600 sr-mt-1">
                  {{ ref.context }}
                </p>
              </div>
              <Button
                @click="navigateToReference(ref)"
                size="small"
                text
                severity="secondary"
                title="Go to reference"
              >
                <Icon name="pi-external-link" />
              </Button>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div v-else-if="activeTab === '2'" class="sr-space-y-4">
          <h3 class="sr-text-lg sr-font-semibold sr-mb-4">Amendment History</h3>
          <Timeline :value="historyEvents" align="left">
            <template #marker="{ item }">
              <div class="sr-bg-blue-500 sr-text-white sr-rounded-full sr-p-2">
                <Icon name="pi-pencil" />
              </div>
            </template>
            <template #content="{ item }">
              <Card>
                <template #title>
                  {{ item.amendment_type }} - {{ formatDate(item.effective_date) }}
                </template>
                <template #content>
                  <p v-if="item.description">{{ item.description }}</p>
                  <p v-if="item.source_citation" class="sr-text-sm sr-text-slate-600 sr-mt-2">
                    Source: {{ item.source_citation }}
                  </p>
                </template>
              </Card>
            </template>
          </Timeline>
        </div>

        <!-- Metadata/Notes Tab -->
        <div v-else-if="activeTab === '3'" class="sr-space-y-4">
          <h3 class="sr-text-lg sr-font-semibold sr-mb-4">Editorial Notes</h3>
          <div
            v-for="meta in statute.metadata"
            :key="meta.id"
            class="sr-border sr-rounded-lg sr-p-4"
          >
            <h4 class="sr-font-medium sr-text-slate-900 sr-mb-2">
              {{ formatMetadataType(meta.metadata_type) }}
            </h4>
            <div
              v-if="meta.content_html"
              v-html="meta.content_html"
              class="sr-prose sr-prose-sm"
            />
            <div v-else-if="meta.content_text" class="sr-text-gray-700">
              {{ meta.content_text }}
            </div>
          </div>
        </div>

        <!-- Subsections Tab -->
        <div v-else-if="activeTab === '4'" class="sr-space-y-4">
          <h3 class="sr-text-lg sr-font-semibold sr-mb-4">Subsections</h3>
          <div class="sr-space-y-2">
            <div
              v-for="child in statute.children"
              :key="child.id"
              class="sr-border sr-rounded-lg sr-p-4 sr-hover-bg-slate-100 sr-transition-colors sr-cursor-pointer"
              @click="onNavigate(child)"
            >
              <div class="sr-flex sr-items-center sr-justify-between">
                <div>
                  <h4 class="sr-font-medium sr-text-blue-600">
                    {{ child.citation }}
                  </h4>
                  <p v-if="child.name" class="sr-text-gray-700">
                    {{ child.name }}
                  </p>
                </div>
                <Icon name="pi-chevron-right" class="sr-text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="sr-flex sr-flex-col sr-items-center sr-justify-center sr-p-8 sr-text-slate-500"
    >
      <Icon name="pi-file-o" class="sr-text-4xl sr-mb-4" />
      <h3 class="sr-text-lg sr-font-medium sr-mb-2">No statute selected</h3>
      <p>Select a statute from the browser or search results to view its content.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LegalUnit, CrossReference } from '../types'

interface Props {
  citation?: string
  showNavigation?: boolean
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNavigation: true,
  autoLoad: true
})

const emit = defineEmits<{
  navigate: [unit: LegalUnit]
}>()

// Reactive state
const activeTab = ref('0')
const isLoading = ref(false)
const error = ref<string | null>(null)

// Load statute data
const { data: statuteData, pending, error: fetchError, refresh } = await useLazyAsyncData(
  `statute:${props.citation}`,
  () => props.citation ? $fetch(`/api/statutes/${encodeURIComponent(props.citation)}`, {
    query: {
      include_children: true,
      include_related: true,
      include_history: true,
      include_metadata: true
    }
  }) : null,
  {
    watch: [() => props.citation],
    default: () => null
  }
)

const statute = computed(() => statuteData.value?.data || null)

// Use bookmarks composable
const { isBookmarked: checkBookmarked, toggleBookmark: toggleBookmarkAction } = useStatuteBookmarks()

const isBookmarked = computed(() => 
  statute.value ? checkBookmarked(statute.value.citation) : false
)

// Computed properties
const sanitizedContent = computed(() => {
  if (!statute.value?.content_html) return ''
  
  // Basic HTML sanitization - in production, use a proper sanitization library
  return statute.value.content_html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
})

const historyEvents = computed(() => {
  if (!statute.value?.history) return []
  
  return statute.value.history.map(item => ({
    ...item,
    date: item.effective_date
  })).sort((a, b) => 
    new Date(b.effective_date || 0).getTime() - new Date(a.effective_date || 0).getTime()
  )
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
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Unknown'
  }
}

const formatMetadataType = (type: string): string => {
  const typeMap: Record<string, string> = {
    editor_note: "Editor's Note",
    source_note: 'Source Note',
    amendment_note: 'Amendment Note',
    cross_reference_note: 'Cross Reference Note'
  }
  return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Event handlers
const onNavigate = (unit: LegalUnit) => {
  emit('navigate', unit)
}

const toggleBookmark = () => {
  if (statute.value) {
    toggleBookmarkAction(statute.value)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show toast notification
    const { add } = useToast()
    add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Citation copied to clipboard',
      life: 2000
    })
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const shareStatute = async () => {
  if (!statute.value) return
  
  const url = `${window.location.origin}/statutes/${encodeURIComponent(statute.value.citation)}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${statute.value.citation} - ${statute.value.name || 'Colorado Statute'}`,
        text: statute.value.content_text?.substring(0, 200) + '...' || '',
        url
      })
    } catch (error) {
      await copyToClipboard(url)
    }
  } else {
    await copyToClipboard(url)
  }
}

const printStatute = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

const navigateToReference = (ref: CrossReference) => {
  if (ref.to_unit) {
    onNavigate(ref.to_unit)
  }
}

// Watch for loading and error states
watch(pending, (newPending) => {
  isLoading.value = newPending
})

watch(fetchError, (newError) => {
  error.value = newError?.message || null
})
</script>

<style scoped>
.statute-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.statute-header {
  flex-shrink: 0;
}

.statute-content {
  flex: 1 1 0%;
  overflow: auto;
}

:deep(.statute-tabs .p-tabview-nav) {
  border-width: 0px;
  background-color: transparent;
}

:deep(.statute-tabs .p-tabview-header) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

:deep(.statute-text) {
  line-height: 1.625;
}

:deep(.statute-text h1) {
  
}

:deep(.statute-text h2) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

:deep(.statute-text h3) {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: #1f2937;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.statute-text p) {
  margin-bottom: 0.75rem;
}

:deep(.statute-text ol),
:deep(.statute-text ul) {
  margin-bottom: 0.75rem;
  margin-left: 1rem;
}

:deep(.statute-text li) {
  margin-bottom: 0.25rem;
}

@media print {
  .statute-header {
    display: block !important;
  }
  
  .statute-content {
    display: block !important;
    overflow: visible !important;
  }
  
  :deep(.statute-tabs) {
    display: none !important;
  }
}
</style>