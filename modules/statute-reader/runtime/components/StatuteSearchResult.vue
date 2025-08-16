<template>
  <Card class="statute-search-result sr-hover-shadow-md sr-transition-shadow sr-cursor-pointer" @click="onSelect">
    <template #content>
      <div class="sr-space-y-3">
        <!-- Result Header -->
        <div class="sr-flex sr-items-start sr-justify-between">
          <div class="sr-flex-1 sr-min-w-0">
            <!-- Citation and Title -->
            <div class="sr-flex sr-items-center sr-gap-2 sr-mb-1">
              <Icon
                :name="getUnitTypeIcon(result.unit.unit_type)"
                :class="getUnitTypeColor(result.unit.unit_type)"
              />
              
              <h3 class="sr-text-lg sr-font-semibold sr-text-blue-600 sr-hover-text-blue-800 sr-transition-colors">
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
              class="sr-text-base sr-font-medium sr-text-slate-900 sr-mb-2"
              v-html="highlightMatches(result.unit.name)"
            />
          </div>

          <!-- Score and Actions -->
          <div class="sr-flex sr-items-center sr-gap-2 sr-ml-4">
            <!-- Relevance Score -->
            <div class="sr-text-xs sr-text-slate-500 sr-text-center">
              <div class="sr-text-sm sr-font-medium">{{ Math.round(result.score) }}%</div>
              <div>relevance</div>
            </div>

            <!-- Actions -->
            <div class="sr-flex sr-gap-1">
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
        <div v-if="snippet" class="sr-bg-slate-100 sr-p-3 sr-rounded sr-border-l-4 sr-border-l-blue-300">
          <p 
            class="sr-text-sm sr-text-gray-700 sr-leading-relaxed"
            v-html="highlightMatches(snippet)"
          />
        </div>

        <!-- Metadata -->
        <div class="sr-flex sr-items-center sr-justify-between sr-pt-2 sr-border-t sr-border-gray-100">
          <!-- Path/Breadcrumb -->
          <div class="sr-flex sr-items-center sr-text-xs sr-text-slate-500 sr-space-x-2">
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
          <div class="sr-flex sr-items-center sr-gap-2">
            <Badge
              :value="formatMatchType(result.match_type)"
              :severity="getMatchTypeSeverity(result.match_type)"
              size="small"
            />
            
            <!-- Last Modified -->
            <span
              v-if="result.unit.last_modified"
              class="sr-text-xs sr-text-gray-400"
              :title="`Last modified: ${formatDate(result.unit.last_modified)}`"
            >
              {{ formatRelativeDate(result.unit.last_modified) }}
            </span>
          </div>
        </div>

        <!-- Cross References Preview -->
        <div
          v-if="result.unit.cross_references?.length"
          class="sr-text-xs sr-text-slate-600"
        >
          <Icon name="pi-link" class="sr-mr-1" />
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
    paragraph: 'text-slate-600',
    chapter: 'text-indigo-600',
    part: 'text-pink-600'
  }
  return colorMap[unitType] || 'text-slate-600'
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
  transition: all 0.2s ease-in-out;
}

.statute-search-result:hover {
  transform: translateY(-0.25rem);
}

:deep(mark) {
  background-color: #fef08a;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-radius: 0.25rem;
}
</style>