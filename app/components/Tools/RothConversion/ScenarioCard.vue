<template>
  <Card
    class="scenario-card cursor-pointer transition-all duration-200 hover:shadow-md"
    :class="[
      cardClasses,
      isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : '',
    ]"
    role="button"
    :aria-label="ariaLabel"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">
            {{ scenarioData.scenario.name }}
          </h3>
          <Tag
            v-if="cardType === 'custom'"
            value="Custom"
            severity="success"
            class="text-xs"
          />
          <Tag
            v-if="isBaseline"
            value="Your Baseline"
            severity="info"
            class="text-xs"
          />
        </div>
        <i :class="getScenarioIcon(scenarioData.scenario)" class="text-xl" />
      </div>
    </template>

    <template #content>
      <div class="space-y-3">
        <!-- Based on Baseline (custom scenarios only) -->
        <div v-if="cardType === 'custom' && scenarioData.baselineSource" class="text-xs text-success-600 bg-success-100 px-2 py-1 rounded">
          Based on {{ scenarioData.baselineSource }}
        </div>

        <!-- Conversion Amount -->
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-slate-600">Conversion Amount:</span>
          <span class="font-semibold">{{ formatCurrency(scenarioData.scenario.conversionAmount) }}</span>
        </div>

        <!-- Parent Tax Rate -->
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-slate-600">Parent Tax Rate:</span>
          <span class="font-semibold">{{ scenarioData.scenario.parentTaxRate }}%</span>
        </div>

        <!-- Net Family Savings -->
        <div class="flex justify-between items-center pt-2 border-t border-slate-200">
          <span class="text-sm font-medium text-slate-600">More for Your Kids</span>
          <span
            class="font-bold text-lg"
            :class="scenarioData.netFamilySavings > 0 ? 'text-success-700' : 'text-danger-700'"
          >
            {{ scenarioData.netFamilySavings > 0 ? '+' : '' }}{{ formatCurrency(scenarioData.netFamilySavings) }}
          </span>
        </div>

        <!-- Warning for Danger Zone -->
        <div
          v-if="scenarioData.scenario.isDangerous && scenarioData.netFamilySavings < 0"
          class="flex items-center gap-2 p-3 bg-danger-100 border border-danger-300 rounded-md mt-3"
        >
          <i class="pi pi-exclamation-triangle text-danger-600" />
          <span class="text-sm font-semibold text-danger-700">
            ⚠️ Family loses money with this strategy
          </span>
        </div>

        <!-- Success indicator for positive savings -->
        <div
          v-else-if="scenarioData.netFamilySavings > 0"
          class="flex items-center gap-2 p-2 bg-success-50 border border-success-200 rounded-md mt-3"
        >
          <i class="pi pi-check text-success-600" />
          <span class="text-sm font-medium text-success-700">
            {{ cardType === 'custom' ? 'Personalized analysis' : 'Tax savings for your family' }}
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="space-y-2">
        <!-- Standard Mode: Main Selection Button -->
        <div v-if="showStandardActions" class="text-center">
          <Button
            :severity="getButtonSeverity(scenarioData.scenario)"
            size="small"
            :label="`Show ${scenarioData.scenario.name} Details`"
            class="w-full"
            @click.stop="$emit('card-clicked', scenarioData)"
          />
        </div>

        <!-- Personalization Mode: Baseline Selection -->
        <div v-if="showBaselineActions" class="text-center">
          <!-- Show baseline button if not selected or different baseline -->
          <Button
            v-if="!isBaseline"
            severity="secondary"
            size="small"
            icon="pi pi-bookmark"
            label="Select as Baseline"
            class="w-full"
            @click.stop="$emit('baseline-selected', scenarioData)"
          />

          <!-- Show baseline indicator if this is the selected baseline -->
          <Tag
            v-else
            value="Selected as Baseline"
            severity="info"
            icon="pi pi-bookmark-fill"
            class="w-full justify-center text-sm font-semibold px-3 py-2"
          />
        </div>

        <!-- Custom Scenario Actions -->
        <div v-if="cardType === 'custom'" class="space-y-2">
          <!-- Show Details Button -->
          <div class="text-center">
            <Button
              :severity="getButtonSeverity(scenarioData.scenario)"
              size="small"
              icon="pi pi-chart-line"
              :label="`Show ${scenarioData.scenario.name} Details`"
              class="w-full"
              @click.stop="$emit('card-clicked', scenarioData)"
            />
          </div>

          <!-- Edit Button -->
          <div class="text-center">
            <Button
              severity="success"
              size="small"
              icon="pi pi-pencil"
              label="Edit Custom Strategy"
              class="w-full"
              @click.stop="$emit('edit-clicked', scenarioData)"
            />
          </div>

          <!-- Delete Button -->
          <div class="text-center">
            <Button
              severity="secondary"
              size="small"
              icon="pi pi-trash"
              label="Delete"
              class="w-full text-sm"
              @click.stop="$emit('delete-clicked', scenarioData)"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useRothCalculations } from '~/composables/useRothCalculations'
import { formatCurrency } from '~/utils/numbers'

const props = defineProps({
  scenarioData: {
    type: Object,
    required: true,
  },
  cardType: {
    type: String,
    default: 'preset', // 'preset', 'custom', 'baseline'
    validator: value => ['preset', 'custom', 'baseline'].includes(value),
  },
  isBaseline: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  personalizationMode: {
    type: Boolean,
    default: false,
  },
  totalPreTaxAccounts: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits([
  'card-clicked',
  'baseline-selected',
  'edit-clicked',
  'delete-clicked',
])

// Use the Roth calculations composable
const {
  getScenarioClasses,
  getScenarioIcon,
} = useRothCalculations()

// Computed properties
const cardClasses = computed(() => {
  if (props.cardType === 'baseline') {
    return [
      'border-2 border-info-300',
      ...getScenarioClasses(props.scenarioData.scenario, props.scenarioData.netFamilySavings, props.totalPreTaxAccounts),
    ]
  }

  return getScenarioClasses(props.scenarioData.scenario, props.scenarioData.netFamilySavings, props.totalPreTaxAccounts)
})

const ariaLabel = computed(() => {
  if (props.cardType === 'custom') {
    return `Edit ${props.scenarioData.scenario.name}`
  }
  return `Select ${props.scenarioData.scenario.name} conversion strategy`
})

const showStandardActions = computed(() => {
  return !props.personalizationMode && props.cardType !== 'custom'
})

const showBaselineActions = computed(() => {
  return props.personalizationMode && props.cardType !== 'custom'
})

// Methods
const handleCardClick = () => {
  // For custom scenarios, clicking the card itself should not trigger any action
  // since we now have explicit "Show Details" and "Edit" buttons
  if (props.cardType === 'custom') {
    return
  }

  // If in baseline selection mode (personalization mode active but no baseline selected),
  // card clicks should trigger baseline selection, not details view
  if (showBaselineActions.value && !props.isBaseline) {
    emit('baseline-selected', props.scenarioData)
    return
  }

  // Otherwise, show details view (standard mode or already have a baseline)
  if (showStandardActions.value || props.isBaseline) {
    emit('card-clicked', props.scenarioData)
  }
}

const getButtonSeverity = (scenario) => {
  if (!scenario || !scenario.colorTheme) return 'secondary'

  const severityMap = {
    success: 'success',
    info: 'info',
    warning: 'warn',
    danger: 'danger',
  }

  return severityMap[scenario.colorTheme] || 'secondary'
}
</script>

<style scoped>
.scenario-card {
  transition: all 0.2s ease;
}

.scenario-card:hover {
  transform: translateY(-1px);
}

.scenario-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
