<template>
  <div class="statute-bookmarks-panel">
    <!-- Header -->
    <div class="sr-flex sr-items-center sr-justify-between sr-mb-4">
      <h3 class="sr-text-lg sr-font-semibold">Bookmarked Statutes</h3>
      <Badge v-if="bookmarks.length" :value="bookmarks.length" />
    </div>

    <!-- Empty State -->
    <div 
      v-if="bookmarks.length === 0"
      class="sr-flex sr-flex-col sr-items-center sr-justify-center sr-p-8 sr-text-slate-500"
    >
      <i class="pi pi-bookmark sr-text-4xl sr-mb-2" />
      <p class="sr-text-lg sr-font-medium">No bookmarks yet</p>
      <p class="sr-text-sm sr-text-center">
        Bookmark statutes while browsing to save them for quick access later.
      </p>
    </div>

    <!-- Bookmarks List -->
    <div v-else class="sr-space-y-3">
      <!-- Folder Filter -->
      <div v-if="folders.length > 1" class="sr-mb-4">
        <Select
          v-model="selectedFolder"
          :options="folderOptions"
          option-label="label"
          option-value="value"
          placeholder="All Folders"
          class="sr-w-full"
        />
      </div>

      <!-- Bookmark Items -->
      <div 
        v-for="bookmark in filteredBookmarks" 
        :key="bookmark.id"
        class="sr-border sr-border-slate-200 sr-rounded-lg sr-p-4 sr-hover:bg-slate-50 sr-cursor-pointer sr-transition-colors"
        @click="navigateToBookmark(bookmark)"
      >
        <div class="sr-flex sr-items-start sr-justify-between">
          <div class="sr-flex-1">
            <div class="sr-flex sr-items-center sr-gap-2 sr-mb-1">
              <span class="sr-font-mono sr-text-sm sr-bg-slate-100 sr-px-2 sr-py-1 sr-rounded">
                {{ bookmark.citation }}
              </span>
              <Tag v-if="bookmark.unit_type" severity="secondary" :value="bookmark.unit_type" />
            </div>
            
            <h4 class="sr-font-medium sr-text-slate-900 sr-mb-1">
              {{ bookmark.name || bookmark.citation }}
            </h4>
            
            <div class="sr-text-sm sr-text-slate-600 sr-space-y-1">
              <p v-if="bookmark.jurisdiction_name && bookmark.publication_name">
                {{ bookmark.jurisdiction_name }} - {{ bookmark.publication_name }}
              </p>
              <p v-if="bookmark.notes" class="sr-italic">
                {{ bookmark.notes }}
              </p>
              <p class="sr-text-xs sr-text-slate-500">
                Bookmarked {{ formatDate(bookmark.bookmarked_at) }}
              </p>
            </div>

            <!-- Tags -->
            <div v-if="bookmark.tags?.length" class="sr-flex sr-gap-1 sr-mt-2">
              <Tag 
                v-for="tag in bookmark.tags" 
                :key="tag"
                severity="info" 
                :value="tag"
                class="sr-text-xs"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="sr-flex sr-gap-1">
            <Button
              icon="pi pi-external-link"
              size="small"
              text
              rounded
              @click.stop="navigateToBookmark(bookmark)"
              class="sr-text-slate-500"
            />
            <Button
              icon="pi pi-times"
              size="small"
              text
              rounded
              severity="danger"
              @click.stop="removeBookmark(bookmark.citation)"
              class="sr-text-slate-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="bookmarks.length > 0" class="sr-mt-6 sr-pt-4 sr-border-t sr-border-slate-200">
      <div class="sr-flex sr-gap-2">
        <Button
          label="Export Bookmarks"
          icon="pi pi-download"
          size="small"
          outlined
          @click="exportBookmarks"
        />
        <Button
          label="Clear All"
          icon="pi pi-trash"
          size="small"
          outlined
          severity="danger"
          @click="confirmClearAll"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatuteBookmark } from '../composables/useStatuteBookmarks'

interface Props {
  maxHeight?: string
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [bookmark: StatuteBookmark]
}>()

// Use bookmarks composable
const {
  bookmarks,
  folders,
  removeBookmark: removeBookmarkFn,
  clearAllBookmarks,
  exportBookmarks: exportBookmarksFn
} = useStatuteBookmarks()

// Local state
const selectedFolder = ref<string | null>(null)

// Computed
const folderOptions = computed(() => [
  { label: 'All Folders', value: null },
  ...folders.value.map(folder => ({ label: folder, value: folder }))
])

const filteredBookmarks = computed(() => {
  if (!selectedFolder.value) {
    return bookmarks.value
  }
  return bookmarks.value.filter(bookmark => bookmark.folder === selectedFolder.value)
})

// Methods
const navigateToBookmark = (bookmark: StatuteBookmark) => {
  emit('navigate', bookmark)
}

const removeBookmark = (citation: string) => {
  removeBookmarkFn(citation)
}

const exportBookmarks = () => {
  exportBookmarksFn()
}

const confirmClearAll = () => {
  if (confirm('Are you sure you want to remove all bookmarks? This action cannot be undone.')) {
    clearAllBookmarks()
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return 'Unknown'
  }
}
</script>

<style scoped>
.statute-bookmarks-panel {
  @apply h-full overflow-auto;
}
</style>