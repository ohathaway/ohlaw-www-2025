<template>
  <div class="statute-navigation">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center justify-between mb-4">
      <Breadcrumb :model="breadcrumbItems" class="flex-1">
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              :href="href"
              v-bind="props.action"
              @click="navigate"
              class="text-blue-600 hover:text-blue-800"
            >
              <Icon v-if="item.icon" :name="item.icon" class="mr-1" />
              {{ item.label }}
            </a>
          </router-link>
          <span v-else v-bind="props.action" class="text-gray-600">
            <Icon v-if="item.icon" :name="item.icon" class="mr-1" />
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>
      
      <!-- Quick Actions -->
      <div class="flex items-center gap-2">
        <Button
          @click="goToParent"
          :disabled="!hasParent"
          size="small"
          text
          severity="secondary"
          title="Go to parent"
        >
          <Icon name="pi-arrow-up" />
        </Button>
        
        <Button
          @click="goToRoot"
          size="small"
          text
          severity="secondary"
          title="Go to root"
        >
          <Icon name="pi-home" />
        </Button>
      </div>
    </div>

    <!-- Sibling Navigation -->
    <div v-if="siblings.length > 1" class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
      <!-- Previous Sibling -->
      <Button
        v-if="previousSibling"
        @click="navigateToSibling(previousSibling)"
        size="small"
        severity="secondary"
        class="flex-shrink-0"
      >
        <Icon name="pi-chevron-left" class="mr-1" />
        Previous
      </Button>
      <div v-else class="flex-shrink-0 w-20" />

      <!-- Current Position -->
      <div class="flex-1 text-center">
        <div class="text-sm text-gray-600">
          {{ currentSiblingIndex + 1 }} of {{ siblings.length }}
        </div>
        <div class="text-xs text-gray-500">
          {{ formatUnitType(statute.unit_type) }}
        </div>
      </div>

      <!-- Next Sibling -->
      <Button
        v-if="nextSibling"
        @click="navigateToSibling(nextSibling)"
        size="small"
        severity="secondary"
        class="flex-shrink-0"
      >
        Next
        <Icon name="pi-chevron-right" class="ml-1" />
      </Button>
      <div v-else class="flex-shrink-0 w-20" />
    </div>

    <!-- Children Quick Links -->
    <div v-if="statute.children?.length" class="mt-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">
        {{ formatUnitType(getChildUnitType()) }}s in this {{ formatUnitType(statute.unit_type) }}:
      </h4>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <Button
          v-for="child in statute.children.slice(0, maxChildrenShown)"
          :key="child.id"
          @click="navigateToChild(child)"
          size="small"
          text
          severity="secondary"
          class="justify-start text-left"
          :title="child.name"
        >
          <div class="truncate">
            <div class="font-medium">{{ child.citation }}</div>
            <div v-if="child.name" class="text-xs text-gray-500 truncate">
              {{ child.name }}
            </div>
          </div>
        </Button>
      </div>
      
      <!-- Show More/Less Toggle -->
      <div v-if="statute.children.length > 8" class="mt-2 text-center">
        <Button
          @click="toggleShowAllChildren"
          size="small"
          text
          severity="secondary"
        >
          {{ showAllChildren ? 'Show Less' : `Show All (${statute.children.length})` }}
          <Icon :name="showAllChildren ? 'pi-chevron-up' : 'pi-chevron-down'" class="ml-1" />
        </Button>
      </div>
    </div>

    <!-- Table of Contents (for complex statutes) -->
    <div v-if="showTableOfContents && tableOfContents.length > 0" class="mt-4">
      <Collapsible>
        <template #trigger="{ expanded, toggle }">
          <Button
            @click="toggle"
            text
            size="small"
            class="mb-2"
          >
            <Icon :name="expanded ? 'pi-chevron-down' : 'pi-chevron-right'" class="mr-1" />
            Table of Contents
          </Button>
        </template>
        
        <div class="bg-gray-50 rounded p-3">
          <div
            v-for="item in tableOfContents"
            :key="item.id"
            :class="[
              'py-1 cursor-pointer hover:text-blue-600 transition-colors',
              `ml-${item.level * 3}`,
              item.id === statute.id && 'font-medium text-blue-600'
            ]"
            @click="navigateToTocItem(item)"
          >
            {{ item.citation }} {{ item.name ? `- ${item.name}` : '' }}
          </div>
        </div>
      </Collapsible>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LegalUnit } from '../types'

interface Props {
  statute: LegalUnit
  showSiblings?: boolean
  showChildren?: boolean
  showTableOfContents?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSiblings: true,
  showChildren: true,
  showTableOfContents: true
})

const emit = defineEmits<{
  navigate: [unit: LegalUnit]
}>()

// Reactive state
const showAllChildren = ref(false)
const siblings = ref<LegalUnit[]>([])
const tableOfContents = ref<LegalUnit[]>([])
const isLoadingSiblings = ref(false)
const isLoadingToc = ref(false)

// Computed properties
const hasParent = computed(() => !!props.statute.parent_id)

const breadcrumbItems = computed(() => {
  const items = []
  
  // Build breadcrumbs from statute hierarchy
  // This would typically come from the parent chain or breadcrumb API
  if (props.statute.parent) {
    items.push(...buildParentBreadcrumbs(props.statute.parent))
  }
  
  // Add current statute
  items.push({
    label: props.statute.citation,
    icon: getUnitTypeIcon(props.statute.unit_type)
  })
  
  return items
})

const currentSiblingIndex = computed(() => {
  return siblings.value.findIndex(s => s.id === props.statute.id)
})

const previousSibling = computed(() => {
  const index = currentSiblingIndex.value
  return index > 0 ? siblings.value[index - 1] : null
})

const nextSibling = computed(() => {
  const index = currentSiblingIndex.value
  return index >= 0 && index < siblings.value.length - 1 ? siblings.value[index + 1] : null
})

const maxChildrenShown = computed(() => {
  return showAllChildren.value ? props.statute.children?.length || 0 : 8
})

// Load related data on mount
onMounted(async () => {
  await Promise.all([
    loadSiblings(),
    loadTableOfContents()
  ])
})

// Load siblings
const loadSiblings = async () => {
  if (!props.showSiblings || !props.statute.parent_id) return
  
  isLoadingSiblings.value = true
  try {
    const response = await $fetch('/api/statutes/browse', {
      query: {
        parent_id: props.statute.parent_id,
        include_children: false
      }
    })
    
    if (response.success && response.data) {
      siblings.value = response.data.nodes.map((node: any) => node.unit)
    }
  } catch (error) {
    console.error('Failed to load siblings:', error)
  } finally {
    isLoadingSiblings.value = false
  }
}

// Load table of contents
const loadTableOfContents = async () => {
  if (!props.showTableOfContents) return
  
  isLoadingToc.value = true
  try {
    // Get the root parent for this statute's hierarchy
    const rootId = await findRootParent(props.statute)
    if (rootId) {
      const response = await $fetch('/api/statutes/browse', {
        query: {
          parent_id: rootId,
          include_children: true,
          max_depth: 3
        }
      })
      
      if (response.success && response.data) {
        tableOfContents.value = flattenTocNodes(response.data.nodes)
      }
    }
  } catch (error) {
    console.error('Failed to load table of contents:', error)
  } finally {
    isLoadingToc.value = false
  }
}

// Helper functions
const buildParentBreadcrumbs = (parent: LegalUnit): any[] => {
  const items = []
  
  if (parent.parent) {
    items.push(...buildParentBreadcrumbs(parent.parent))
  }
  
  items.push({
    label: parent.citation,
    icon: getUnitTypeIcon(parent.unit_type),
    route: `/statutes/${encodeURIComponent(parent.citation)}`
  })
  
  return items
}

const getUnitTypeIcon = (unitType: string): string => {
  const iconMap: Record<string, string> = {
    title: 'pi-book',
    article: 'pi-list',
    section: 'pi-file-o',
    subsection: 'pi-angle-right',
    paragraph: 'pi-minus'
  }
  return iconMap[unitType] || 'pi-file'
}

const formatUnitType = (unitType: string): string => {
  return unitType.charAt(0).toUpperCase() + unitType.slice(1)
}

const getChildUnitType = (): string => {
  const firstChild = props.statute.children?.[0]
  return firstChild?.unit_type || 'subsection'
}

const findRootParent = async (unit: LegalUnit): Promise<number | null> => {
  // This would traverse up the hierarchy to find the root
  // For now, return the publication root
  if (!unit.parent_id) return unit.id
  
  // Would make API call to get parent chain
  return null
}

const flattenTocNodes = (nodes: any[]): LegalUnit[] => {
  const flattened: LegalUnit[] = []
  
  const traverse = (nodeList: any[], level: number) => {
    for (const node of nodeList) {
      const unit = { ...node.unit, level }
      flattened.push(unit)
      
      if (node.children?.length) {
        traverse(node.children, level + 1)
      }
    }
  }
  
  traverse(nodes, 0)
  return flattened
}

// Event handlers
const goToParent = () => {
  if (props.statute.parent) {
    emit('navigate', props.statute.parent)
  }
}

const goToRoot = () => {
  // Navigate to the publication root
  navigateToRouter('/statutes')
}

const navigateToSibling = (sibling: LegalUnit) => {
  emit('navigate', sibling)
}

const navigateToChild = (child: LegalUnit) => {
  emit('navigate', child)
}

const navigateToTocItem = (item: LegalUnit) => {
  emit('navigate', item)
}

const toggleShowAllChildren = () => {
  showAllChildren.value = !showAllChildren.value
}

// Use router for navigation
const { $router } = useNuxtApp()

const navigateToRouter = (path: string) => {
  $router.push(path)
}
</script>

<style scoped>
.statute-navigation {
  @apply space-y-4;
}

:deep(.p-breadcrumb) {
  @apply bg-transparent p-0;
}

:deep(.p-breadcrumb-list) {
  @apply flex-wrap;
}
</style>