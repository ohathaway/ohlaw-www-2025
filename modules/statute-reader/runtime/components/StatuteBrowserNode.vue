<template>
  <div class="statute-browser-node">
    <div
      :class="[
        'sr-flex sr-items-center sr-py-2 sr-px-3 sr-rounded sr-cursor-pointer sr-transition-colors',
        'sr-hover-bg-slate-100',
        isSelected && 'sr-bg-blue-50 sr-border-l-2 sr-border-l-blue-500',
        `sr-ml-${level * 4}`
      ]"
      @click="onSelect"
    >
      <!-- Expand/Collapse Button -->
      <Button
        v-if="hasChildren"
        @click.stop="onToggle"
        size="small"
        text
        class="sr-p-1 sr-mr-2"
      >
        <Icon
          :name="expanded ? 'pi-chevron-down' : 'pi-chevron-right'"
          class="sr-text-xs sr-text-slate-500"
        />
      </Button>
      
      <!-- Spacer for nodes without children -->
      <div v-else class="sr-w-6 sr-mr-2" />

      <!-- Unit Type Icon -->
      <Icon
        :name="getUnitTypeIcon(node.unit.unit_type)"
        :class="[
          'sr-mr-2 sr-text-sm',
          getUnitTypeColor(node.unit.unit_type)
        ]"
      />

      <!-- Unit Info -->
      <div class="sr-flex-1 sr-min-w-0">
        <div class="sr-flex sr-items-center sr-gap-2">
          <span class="sr-font-medium sr-text-slate-900 sr-truncate">
            {{ node.unit.citation }}
          </span>
          
          <Badge
            v-if="node.unit.status !== 'active'"
            :value="node.unit.status"
            :severity="getStatusSeverity(node.unit.status)"
            size="small"
          />
        </div>
        
        <div
          v-if="node.unit.name"
          class="sr-text-sm sr-text-slate-600 sr-truncate"
        >
          {{ node.unit.name }}
        </div>
        
        <!-- Child count indicator -->
        <div
          v-if="node.child_count > 0"
          class="sr-text-xs sr-text-gray-400 sr-mt-1"
        >
          {{ node.child_count }} {{ node.child_count === 1 ? 'item' : 'items' }}
        </div>
      </div>

      <!-- Actions -->
      <div class="sr-flex sr-items-center sr-gap-1 sr-opacity-0 sr-group-hover-opacity-100 sr-transition-opacity">
        <Button
          @click.stop="$emit('bookmark', node.unit)"
          size="small"
          text
          title="Bookmark"
        >
          <Icon name="pi-bookmark" class="sr-text-xs" />
        </Button>
        
        <Button
          @click.stop="$emit('copy-citation', node.unit.citation)"
          size="small"
          text
          title="Copy citation"
        >
          <Icon name="pi-copy" class="sr-text-xs" />
        </Button>
      </div>
    </div>

    <!-- Children -->
    <Transition name="expand">
      <div v-if="expanded && node.children.length > 0" class="sr-children">
        <StatuteBrowserNode
          v-for="child in node.children"
          :key="child.unit.id"
          :node="child"
          :level="level + 1"
          :selected-id="selectedId"
          @select="$emit('select', $event)"
          @toggle="$emit('toggle', $event)"
          @expand="$emit('expand', $event)"
          @load-children="$emit('load-children', $event)"
          @bookmark="$emit('bookmark', $event)"
          @copy-citation="$emit('copy-citation', $event)"
          :expanded="isChildExpanded(child.unit.id)"
        />
        
        <!-- Load More Button -->
        <div
          v-if="node.has_more_children && !isLoadingChildren"
          class="sr-ml-8 sr-mt-2"
        >
          <Button
            @click="onLoadChildren"
            size="small"
            text
            severity="secondary"
          >
            <Icon name="pi-plus" class="sr-mr-1 sr-text-xs" />
            Load more
          </Button>
        </div>
        
        <!-- Loading indicator for children -->
        <div
          v-if="isLoadingChildren"
          class="sr-flex sr-items-center sr-justify-center sr-py-2 sr-ml-8"
        >
          <ProgressSpinner size="1rem" />
          <span class="sr-ml-2 sr-text-sm sr-text-slate-600">Loading...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { BrowseNode, LegalUnit } from '../types'

interface Props {
  node: BrowseNode
  level: number
  selectedId?: number
  expanded?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [unit: LegalUnit]
  toggle: [nodeId: number]
  expand: [nodeId: number]
  'load-children': [nodeId: number]
  bookmark: [unit: LegalUnit]
  'copy-citation': [citation: string]
}>()

// Local state
const isLoadingChildren = ref(false)

// Computed properties
const isSelected = computed(() => 
  props.selectedId === props.node.unit.id
)

const hasChildren = computed(() => 
  props.node.child_count > 0 || props.node.children.length > 0
)

const expanded = computed(() => 
  props.expanded || false
)

// Get icon for unit type
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

// Get color for unit type
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

// Get severity for status badge
const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    active: 'success',
    repealed: 'danger',
    superseded: 'warning'
  }
  return severityMap[status] || 'secondary'
}

// Check if child is expanded (would come from parent context)
const isChildExpanded = (childId: number): boolean => {
  // This would typically be managed by the parent component
  return false
}

// Event handlers
const onSelect = () => {
  emit('select', props.node.unit)
}

const onToggle = () => {
  emit('toggle', props.node.unit.id)
}

const onLoadChildren = async () => {
  isLoadingChildren.value = true
  try {
    emit('load-children', props.node.unit.id)
  } finally {
    isLoadingChildren.value = false
  }
}
</script>

<style scoped>
.statute-browser-node {
  position: relative;
}

.sr-children {
  
}

/* Transition for expand/collapse */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>