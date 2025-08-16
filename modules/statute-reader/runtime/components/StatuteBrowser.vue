<template>
  <div class="statute-browser">
    <!-- Browser Header -->
    <div class="sr-border-b sr-border-slate-200 sr-bg-white sr-p-4">
      <div class="sr-flex sr-items-center sr-justify-between sr-mb-4">
        <h2 class="sr-text-lg sr-font-semibold sr-text-slate-900">
          Statute Browser
        </h2>
        
        <!-- Browser Controls -->
        <div class="sr-flex sr-items-center sr-gap-2">
          <Button
            :disabled="!canGoBack"
            @click="goBack"
            size="small"
            text
            severity="secondary"
          >
            <i class="pi pi-arrow-left sr-text-sm" />
          </Button>
          
          <Button
            :disabled="!canGoForward"
            @click="goForward"
            size="small"
            text
            severity="secondary"
          >
            <i class="pi pi-arrow-right sr-text-sm" />
          </Button>
          
          <Button
            @click="navigateToRoot"
            size="small"
            text
            severity="secondary"
            title="Go to root"
          >
            <i class="pi pi-home sr-text-sm" />
          </Button>
          
          <Button
            @click="collapseAll"
            size="small"
            text
            severity="secondary"
            title="Collapse all"
          >
            <i class="pi pi-minus sr-text-sm" />
          </Button>
          
          <Button
            @click="expandAll"
            size="small"
            text
            severity="secondary"
            title="Expand all"
          >
            <i class="pi pi-plus sr-text-sm" />
          </Button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="sr-grid sr-grid-cols-1 md:sr-grid-cols-3 sr-gap-4 sr-mb-4">
        <Select
          v-model="selectedJurisdiction"
          :options="jurisdictions"
          option-label="name"
          option-value="id"
          placeholder="Select Jurisdiction"
          class="sr-w-full"
        />
        
        <Select
          v-model="selectedPublication"
          :options="filteredPublications"
          option-label="name"
          option-value="id"
          placeholder="Select Publication"
          class="sr-w-full"
          :disabled="!selectedJurisdiction"
        />
        
        <InputText
          v-model="treeFilter"
          placeholder="Filter statutes..."
          class="sr-w-full"
        >
          <template #prefix>
            <i class="pi pi-search sr-text-gray-400" />
          </template>
        </InputText>
      </div>

      <!-- Breadcrumbs -->
      <Breadcrumb
        v-if="breadcrumbs.length > 0"
        :model="breadcrumbItems"
        class="sr-p-0"
      />
    </div>

    <!-- Browser Content -->
    <div class="sr-flex-1 sr-overflow-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="sr-flex sr-items-center sr-justify-center sr-p-8">
        <ProgressSpinner size="2rem" />
        <span class="sr-ml-2 sr-text-slate-600">Loading statutes...</span>
      </div>

      <!-- Error State -->
      <Message
        v-else-if="browserError"
        severity="error"
        :closable="false"
        class="sr-mt-4 sr-mb-4 sr-ml-4 sr-mr-4"
      >
        {{ browserError }}
      </Message>

      <!-- Empty State -->
      <div
        v-else-if="browseTree.length === 0"
        class="sr-flex sr-flex-col sr-items-center sr-justify-center sr-p-8 sr-text-slate-500"
      >
        <i class="pi pi-book sr-text-4xl sr-mb-2" />
        <p class="sr-text-lg sr-font-medium">No statutes found</p>
        <p class="sr-text-sm">Try selecting a different jurisdiction or publication.</p>
      </div>

      <!-- Tree View -->
      <div v-else class="sr-p-4">
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

// Load initial data
const { data: jurisdictionsData } = await useAsyncData('jurisdictions', () => 
  $fetch('/api/statutes/jurisdictions')
)

const { data: publicationsData } = await useAsyncData('publications', () =>
  $fetch('/api/statutes/publications')  
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
  
  height: v-bind(maxHeight);
}
</style>