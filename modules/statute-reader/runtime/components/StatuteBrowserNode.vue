<template>
  <div class="statute-browser-node">
    <div
      :class="[
        'flex items-center py-2 px-3 rounded cursor-pointer transition-colors',
        'hover:bg-gray-50',
        isSelected && 'bg-blue-50 border-l-2 border-l-blue-500',
        `ml-${level * 4}`
      ]"
      @click="onSelect"
    >
      <!-- Expand/Collapse Button -->
      <Button
        v-if="hasChildren"
        @click.stop="onToggle"
        size="small"
        text
        class="p-1 mr-2"
      >
        <Icon
          :name="expanded ? 'pi-chevron-down' : 'pi-chevron-right'"
          class="text-xs text-gray-500"
        />
      </Button>
      
      <!-- Spacer for nodes without children -->
      <div v-else class="w-6 mr-2" />

      <!-- Unit Type Icon -->
      <Icon
        :name="getUnitTypeIcon(node.unit.unit_type)"
        :class="[
          'mr-2 text-sm',
          getUnitTypeColor(node.unit.unit_type)
        ]"
      />

      <!-- Unit Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-900 truncate">
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
          class="text-sm text-gray-600 truncate"
        >
          {{ node.unit.name }}
        </div>
        
        <!-- Child count indicator -->
        <div
          v-if="node.child_count > 0"
          class="text-xs text-gray-400 mt-1"
        >
          {{ node.child_count }} {{ node.child_count === 1 ? 'item' : 'items' }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          @click.stop="$emit('bookmark', node.unit)"
          size="small"
          text
          title="Bookmark"
        >
          <Icon name="pi-bookmark" class="text-xs" />
        </Button>
        
        <Button
          @click.stop="$emit('copy-citation', node.unit.citation)"
          size="small"
          text
          title="Copy citation"
        >
          <Icon name="pi-copy" class="text-xs" />
        </Button>
      </div>
    </div>

    <!-- Children -->
    <Transition name="expand">
      <div v-if="expanded && node.children.length > 0" class="children">
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
          class="ml-8 mt-2"
        >
          <Button
            @click="onLoadChildren"
            size="small"
            text
            severity="secondary"
          >
            <Icon name="pi-plus" class="mr-1 text-xs" />
            Load more
          </Button>
        </div>
        
        <!-- Loading indicator for children -->
        <div
          v-if="isLoadingChildren"
          class="flex items-center justify-center py-2 ml-8"
        >
          <ProgressSpinner size="1rem" />
          <span class="ml-2 text-sm text-gray-600">Loading...</span>
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
    paragraph: 'text-gray-600',
    chapter: 'text-indigo-600',
    part: 'text-pink-600'
  }
  return colorMap[unitType] || 'text-gray-600'
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
  @apply group;
}

.children {
  @apply border-l border-gray-200 ml-3;
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