<template>
  <div class="statute-viewer">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <ProgressSpinner size="2rem" />
      <span class="ml-2 text-gray-600">Loading statute...</span>
    </div>

    <!-- Error State -->
    <Message
      v-else-if="error"
      severity="error"
      :closable="false"
      class="m-4"
    >
      {{ error }}
    </Message>

    <!-- Statute Content -->
    <div v-else-if="statute" class="h-full flex flex-col">
      <!-- Statute Header -->
      <div class="statute-header bg-white border-b border-gray-200 p-6 flex-shrink-0">
        <!-- Breadcrumbs and Navigation -->
        <StatuteNavigation
          v-if="showNavigation"
          :statute="statute"
          @navigate="onNavigate"
          class="mb-4"
        />

        <!-- Citation and Title -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ statute.citation }}
            </h1>
            
            <h2
              v-if="statute.name"
              class="text-lg font-medium text-gray-700 mb-3"
            >
              {{ statute.name }}
            </h2>

            <!-- Status and Metadata -->
            <div class="flex items-center gap-3">
              <Badge
                v-if="statute.status !== 'active'"
                :value="statute.status"
                :severity="getStatusSeverity(statute.status)"
              />
              
              <span
                v-if="statute.effective_date"
                class="text-sm text-gray-500"
              >
                Effective: {{ formatDate(statute.effective_date) }}
              </span>
              
              <span
                v-if="statute.last_modified"
                class="text-sm text-gray-500"
              >
                Modified: {{ formatDate(statute.last_modified) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 ml-4">
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
        <TabView v-model:activeIndex="activeTab" class="statute-tabs">
          <TabPanel header="Content">
            <template #header>
              <Icon name="pi-file-o" class="mr-2" />
              Content
            </template>
          </TabPanel>
          
          <TabPanel v-if="statute.cross_references?.length" header="References">
            <template #header>
              <Icon name="pi-link" class="mr-2" />
              References ({{ statute.cross_references.length }})
            </template>
          </TabPanel>
          
          <TabPanel v-if="statute.history?.length" header="History">
            <template #header>
              <Icon name="pi-history" class="mr-2" />
              History
            </template>
          </TabPanel>
          
          <TabPanel v-if="statute.metadata?.length" header="Notes">
            <template #header>
              <Icon name="pi-info-circle" class="mr-2" />
              Notes
            </template>
          </TabPanel>
          
          <TabPanel v-if="statute.children?.length" header="Subsections">
            <template #header>
              <Icon name="pi-list" class="mr-2" />
              Subsections ({{ statute.children.length }})
            </template>
          </TabPanel>
        </TabView>
      </div>

      <!-- Tab Content -->
      <div class="statute-content flex-1 overflow-auto p-6">
        <!-- Content Tab -->
        <div v-if="activeTab === 0" class="prose prose-lg max-w-none">
          <div
            v-if="statute.content_html"
            v-html="sanitizedContent"
            class="statute-text"
          />
          <div
            v-else-if="statute.content_text"
            class="whitespace-pre-wrap"
          >
            {{ statute.content_text }}
          </div>
          <div v-else class="text-gray-500 italic">
            No content available for this statute.
          </div>
        </div>

        <!-- Cross References Tab -->
        <div v-else-if="activeTab === 1" class="space-y-4">
          <h3 class="text-lg font-semibold mb-4">Cross References</h3>
          <div
            v-for="ref in statute.cross_references"
            :key="ref.id"
            class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                  {{ ref.to_unit?.citation || ref.reference_text }}
                </h4>
                <p v-if="ref.to_unit?.name" class="text-gray-700">
                  {{ ref.to_unit.name }}
                </p>
                <p v-if="ref.context" class="text-sm text-gray-600 mt-1">
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
        <div v-else-if="activeTab === 2" class="space-y-4">
          <h3 class="text-lg font-semibold mb-4">Amendment History</h3>
          <Timeline :value="historyEvents" align="left">
            <template #marker="{ item }">
              <div class="bg-blue-500 text-white rounded-full p-2">
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
                  <p v-if="item.source_citation" class="text-sm text-gray-600 mt-2">
                    Source: {{ item.source_citation }}
                  </p>
                </template>
              </Card>
            </template>
          </Timeline>
        </div>

        <!-- Metadata/Notes Tab -->
        <div v-else-if="activeTab === 3" class="space-y-4">
          <h3 class="text-lg font-semibold mb-4">Editorial Notes</h3>
          <div
            v-for="meta in statute.metadata"
            :key="meta.id"
            class="border rounded-lg p-4"
          >
            <h4 class="font-medium text-gray-900 mb-2">
              {{ formatMetadataType(meta.metadata_type) }}
            </h4>
            <div
              v-if="meta.content_html"
              v-html="meta.content_html"
              class="prose prose-sm"
            />
            <div v-else-if="meta.content_text" class="text-gray-700">
              {{ meta.content_text }}
            </div>
          </div>
        </div>

        <!-- Subsections Tab -->
        <div v-else-if="activeTab === 4" class="space-y-4">
          <h3 class="text-lg font-semibold mb-4">Subsections</h3>
          <div class="space-y-2">
            <div
              v-for="child in statute.children"
              :key="child.id"
              class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="onNavigate(child)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-blue-600">
                    {{ child.citation }}
                  </h4>
                  <p v-if="child.name" class="text-gray-700">
                    {{ child.name }}
                  </p>
                </div>
                <Icon name="pi-chevron-right" class="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center p-8 text-gray-500"
    >
      <Icon name="pi-file-o" class="text-4xl mb-4" />
      <h3 class="text-lg font-medium mb-2">No statute selected</h3>
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
const activeTab = ref(0)
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
const { isBookmarked, toggleBookmark: toggleBookmarkAction } = useStatuteBookmarks()

const isBookmarked = computed(() => 
  statute.value ? isBookmarked(statute.value.citation) : false
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
  @apply h-full flex flex-col bg-white;
}

.statute-header {
  @apply flex-shrink-0;
}

.statute-content {
  @apply flex-1 overflow-auto;
}

:deep(.statute-tabs .p-tabview-nav) {
  @apply border-0 bg-transparent;
}

:deep(.statute-tabs .p-tabview-header) {
  @apply text-sm;
}

:deep(.statute-text) {
  @apply leading-relaxed;
}

:deep(.statute-text h1) {
  @apply text-xl font-bold text-gray-900 mt-6 mb-3;
}

:deep(.statute-text h2) {
  @apply text-lg font-semibold text-gray-800 mt-5 mb-2;
}

:deep(.statute-text h3) {
  @apply text-base font-medium text-gray-800 mt-4 mb-2;
}

:deep(.statute-text p) {
  @apply mb-3;
}

:deep(.statute-text ol),
:deep(.statute-text ul) {
  @apply mb-3 ml-4;
}

:deep(.statute-text li) {
  @apply mb-1;
}

@media print {
  .statute-header {
    @apply print:block;
  }
  
  .statute-content {
    @apply print:block print:overflow-visible;
  }
  
  :deep(.statute-tabs) {
    @apply print:hidden;
  }
}
</style>