<template>
  <Card class="statute-search-result hover:shadow-md transition-shadow cursor-pointer" @click="onSelect">
    <template #content>
      <div class="space-y-3">
        <!-- Result Header -->
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <!-- Citation and Title -->
            <div class="flex items-center gap-2 mb-1">
              <Icon
                :name="getUnitTypeIcon(result.unit.unit_type)"
                :class="getUnitTypeColor(result.unit.unit_type)"
              />
              
              <h3 class="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                {{ result.unit.citation }}
              </h3>
              
              <Badge
                v-if="result.unit.status !== 'active'"
                :value="result.unit.status"
                :severity="getStatusSeverity(result.unit.status)"
                size="small"
              />
            </div>
            
            <!-- Unit Name -->
            <h4
              v-if="result.unit.name"
              class="text-base font-medium text-gray-900 mb-2"
              v-html="highlightMatches(result.unit.name)"
            />
          </div>

          <!-- Score and Actions -->
          <div class="flex items-center gap-2 ml-4">
            <!-- Relevance Score -->
            <div class="text-xs text-gray-500 text-center">
              <div class="text-sm font-medium">{{ Math.round(result.score) }}%</div>
              <div>relevance</div>
            </div>

            <!-- Actions -->
            <div class="flex gap-1">
              <Button
                @click.stop="$emit('bookmark', result.unit)"
                size="small"
                text
                severity="secondary"
                title="Bookmark"
              >
                <Icon name="pi-bookmark" />
              </Button>
              
              <Button
                @click.stop="copyToClipboard(result.unit.citation)"
                size="small"
                text
                severity="secondary"
                title="Copy citation"
              >
                <Icon name="pi-copy" />
              </Button>
              
              <Button
                @click.stop="shareResult"
                size="small"
                text
                severity="secondary"
                title="Share"
              >
                <Icon name="pi-share-alt" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Content Snippet -->
        <div v-if="snippet" class="bg-gray-50 p-3 rounded border-l-4 border-l-blue-300">
          <p 
            class="text-sm text-gray-700 leading-relaxed"
            v-html="highlightMatches(snippet)"
          />
        </div>

        <!-- Metadata -->
        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
          <!-- Path/Breadcrumb -->
          <div class="flex items-center text-xs text-gray-500 space-x-2">
            <span v-if="result.unit.publication?.jurisdiction?.name">
              {{ result.unit.publication.jurisdiction.name }}
            </span>
            <Icon v-if="result.unit.publication?.jurisdiction?.name" name="pi-angle-right" />
            <span v-if="result.unit.publication?.name">
              {{ result.unit.publication.name }}
            </span>
            <Icon v-if="result.unit.publication?.name" name="pi-angle-right" />
            <span>{{ formatUnitType(result.unit.unit_type) }}</span>
          </div>

          <!-- Match Type Indicator -->
          <div class="flex items-center gap-2">
            <Badge
              :value="formatMatchType(result.match_type)"
              :severity="getMatchTypeSeverity(result.match_type)"
              size="small"
            />
            
            <!-- Last Modified -->
            <span
              v-if="result.unit.last_modified"
              class="text-xs text-gray-400"
              :title="`Last modified: ${formatDate(result.unit.last_modified)}`"
            >
              {{ formatRelativeDate(result.unit.last_modified) }}
            </span>
          </div>
        </div>

        <!-- Cross References Preview -->
        <div
          v-if="result.unit.cross_references?.length"
          class="text-xs text-gray-600"
        >
          <Icon name="pi-link" class="mr-1" />
          {{ result.unit.cross_references.length }} cross-reference{{ result.unit.cross_references.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { SearchResult, LegalUnit } from '../types'

interface Props {
  result: SearchResult
  searchQuery: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [result: SearchResult]
  bookmark: [unit: LegalUnit]
}>()

// Computed properties
const snippet = computed(() => {
  return props.result.snippet || 
         props.result.unit.content_text?.substring(0, 200) + '...' ||
         'No content preview available'
})

// Utility functions
const getUnitTypeIcon = (unitType: string): string => {
  const iconMap: Record<string, string> = {
    title: 'pi-book',
    article: 'pi-list', 
    section: 'pi-file-o',
    subsection: 'pi-angle-right',
    paragraph: 'pi-minus',
    chapter: 'pi-folder',
    part: 'pi-folder-open'
  }
  return iconMap[unitType] || 'pi-file'
}

const getUnitTypeColor = (unitType: string): string => {
  const colorMap: Record<string, string> = {
    title: 'text-purple-600',
    article: 'text-blue-600',
    section: 'text-green-600',
    subsection: 'text-yellow-600',
    paragraph: 'text-gray-600',
    chapter: 'text-indigo-600',
    part: 'text-pink-600'
  }
  return colorMap[unitType] || 'text-gray-600'
}

const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    active: 'success',
    repealed: 'danger',
    superseded: 'warning'
  }
  return severityMap[status] || 'secondary'
}

const getMatchTypeSeverity = (matchType: string): string => {
  const severityMap: Record<string, string> = {
    exact: 'success',
    partial: 'info',
    fuzzy: 'warning',
    semantic: 'secondary'
  }
  return severityMap[matchType] || 'secondary'
}

const formatUnitType = (unitType: string): string => {
  return unitType.charAt(0).toUpperCase() + unitType.slice(1)
}

const formatMatchType = (matchType: string): string => {
  const typeMap: Record<string, string> = {
    exact: 'Exact',
    partial: 'Partial',
    fuzzy: 'Fuzzy',
    semantic: 'Semantic'
  }
  return typeMap[matchType] || matchType
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Unknown'
  }
}

const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months !== 1 ? 's' : ''} ago`
    }
    
    const years = Math.floor(diffDays / 365)
    return `${years} year${years !== 1 ? 's' : ''} ago`
  } catch {
    return 'Recently'
  }
}

const highlightMatches = (text: string): string => {
  if (!text || !props.searchQuery) return text
  
  // Simple highlighting - escape HTML and highlight search terms
  const escaped = text.replace(/[&<>"']/g, (match) => {
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return entityMap[match]
  })
  
  const regex = new RegExp(`(${escapeRegExp(props.searchQuery)})`, 'gi')
  return escaped.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Event handlers
const onSelect = () => {
  emit('select', props.result)
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

const shareResult = async () => {
  const url = `${window.location.origin}/statutes/${encodeURIComponent(props.result.unit.citation)}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${props.result.unit.citation} - ${props.result.unit.name || 'Colorado Statute'}`,
        text: snippet.value.replace(/<[^>]*>/g, ''),
        url
      })
    } catch (error) {
      // User cancelled or error occurred
      await copyToClipboard(url)
    }
  } else {
    await copyToClipboard(url)
  }
}
</script>

<style scoped>
.statute-search-result {
  @apply transition-all duration-200;
}

.statute-search-result:hover {
  @apply transform translate-y-[-1px];
}

:deep(mark) {
  @apply bg-yellow-200 px-1 rounded;
}
</style>