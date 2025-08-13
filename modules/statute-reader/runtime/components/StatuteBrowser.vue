<template>
  <div class="statute-browser">
    <!-- Browser Header -->
    <div class="border-b border-gray-200 bg-white p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">
          Statute Browser
        </h2>
        
        <!-- Browser Controls -->
        <div class="flex items-center gap-2">
          <Button
            :disabled="!canGoBack"
            @click="goBack"
            size="small"
            text
            severity="secondary"
          >
            <Icon name="pi-arrow-left" class="text-sm" />
          </Button>
          
          <Button
            :disabled="!canGoForward"
            @click="goForward"
            size="small"
            text
            severity="secondary"
          >
            <Icon name="pi-arrow-right" class="text-sm" />
          </Button>
          
          <Button
            @click="navigateToRoot"
            size="small"
            text
            severity="secondary"
            title="Go to root"
          >
            <Icon name="pi-home" class="text-sm" />
          </Button>
          
          <Button
            @click="collapseAll"
            size="small"
            text
            severity="secondary"
            title="Collapse all"
          >
            <Icon name="pi-minus" class="text-sm" />
          </Button>
          
          <Button
            @click="expandAll"
            size="small"
            text
            severity="secondary"
            title="Expand all"
          >
            <Icon name="pi-plus" class="text-sm" />
          </Button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          v-model="selectedJurisdiction"
          :options="jurisdictions"
          option-label="name"
          option-value="id"
          placeholder="Select Jurisdiction"
          class="w-full"
        />
        
        <Select
          v-model="selectedPublication"
          :options="filteredPublications"
          option-label="name"
          option-value="id"
          placeholder="Select Publication"
          class="w-full"
          :disabled="!selectedJurisdiction"
        />
        
        <InputText
          v-model="treeFilter"
          placeholder="Filter statutes..."
          class="w-full"
        >
          <template #prefix>
            <Icon name="pi-search" class="text-gray-400" />
          </template>
        </InputText>
      </div>

      <!-- Breadcrumbs -->
      <Breadcrumb
        v-if="breadcrumbs.length > 0"
        :model="breadcrumbItems"
        class="p-0"
      />
    </div>

    <!-- Browser Content -->
    <div class="flex-1 overflow-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <ProgressSpinner size="2rem" />
        <span class="ml-2 text-gray-600">Loading statutes...</span>
      </div>

      <!-- Error State -->
      <Message
        v-else-if="browserError"
        severity="error"
        :closable="false"
        class="m-4"
      >
        {{ browserError }}
      </Message>

      <!-- Empty State -->
      <div
        v-else-if="browseTree.length === 0"
        class="flex flex-col items-center justify-center p-8 text-gray-500"
      >
        <Icon name="pi-book" class="text-4xl mb-2" />
        <p class="text-lg font-medium">No statutes found</p>
        <p class="text-sm">Try selecting a different jurisdiction or publication.</p>
      </div>

      <!-- Tree View -->
      <div v-else class="p-4">
        <StatuteBrowserNode
          v-for="node in browseTree"
          :key="node.unit.id"
          :node="node"
          :level="0"
          @select="onNodeSelect"
          @toggle="toggleNode"
          @expand="expandNode"
          @load-children="loadNodeChildren"
          :expanded="isNodeExpanded(node.unit.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BrowseNode, LegalUnit, Jurisdiction, Publication } from '../types'

interface Props {
  autoLoad?: boolean
  showFilters?: boolean
  showBreadcrumbs?: boolean
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
  showFilters: true,
  showBreadcrumbs: true,
  maxHeight: '600px'
})

const emit = defineEmits<{
  select: [unit: LegalUnit]
  navigate: [unit: LegalUnit]
}>()

// Use composables
const {
  browseTree,
  breadcrumbs,
  isLoading,
  browserError,
  selectedJurisdiction,
  selectedPublication,
  treeFilter,
  canGoBack,
  canGoForward,
  browseHierarchy,
  navigateToUnit,
  navigateToRoot,
  goBack,
  goForward,
  toggleNode,
  isNodeExpanded,
  expandNode,
  collapseNode,
  collapseAll,
  expandAll,
  loadNodeChildren
} = useStatuteBrowser()

const { jurisdictions, publications } = useStatuteData()

// Load initial data
const { data: jurisdictionsData } = await useAsyncData('jurisdictions', () => 
  $fetch('/api/jurisdictions')
)

const { data: publicationsData } = await useAsyncData('publications', () =>
  $fetch('/api/publications')  
)

const jurisdictions = computed(() => jurisdictionsData.value?.data || [])
const allPublications = computed(() => publicationsData.value?.data || [])

// Filter publications by selected jurisdiction
const filteredPublications = computed(() => {
  if (!selectedJurisdiction.value) return []
  return allPublications.value.filter(p => p.jurisdiction_id === selectedJurisdiction.value)
})

// Build breadcrumb items for PrimeVue
const breadcrumbItems = computed(() => {
  const items = breadcrumbs.value.map((unit, index) => ({
    label: unit.name || unit.citation,
    command: () => navigateToUnit(unit)
  }))
  
  // Add home item
  items.unshift({
    label: 'Root',
    icon: 'pi pi-home',
    command: () => navigateToRoot()
  })
  
  return items
})

// Event handlers
const onNodeSelect = (unit: LegalUnit) => {
  emit('select', unit)
  emit('navigate', unit)
}

// Auto-load on mount if enabled
onMounted(() => {
  if (props.autoLoad) {
    browseHierarchy()
  }
})

// Watch for jurisdiction/publication changes
watch([selectedJurisdiction, selectedPublication], () => {
  browseHierarchy()
})
</script>

<style scoped>
.statute-browser {
  @apply flex flex-col bg-white border border-gray-200 rounded-lg;
  height: v-bind(maxHeight);
}
</style>