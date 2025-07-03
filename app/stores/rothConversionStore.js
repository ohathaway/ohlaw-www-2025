import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRothCalculations } from '~/composables/useRothCalculations'

export const useRothConversionStore = defineStore('rothConversion', () => {
  // Get calculation functions from composable
  const { 
    calculateAllScenarios, 
    calculateScenario,
    formatTableData
  } = useRothCalculations()

  // ==========================================
  // CORE APPLICATION STATE
  // ==========================================
  
  // Form inputs from InputForm component
  const inputs = ref(null)
  
  // Whether to show scenarios vs input form
  const showResults = ref(false)
  
  // Currently selected scenario for details view
  const selectedScenario = ref(null)
  
  // Full calculation results for selected scenario
  const selectedCalculation = ref(null)

  // ==========================================
  // UI NAVIGATION STATE
  // ==========================================
  
  // Current view: 'input' | 'scenarios' | 'details'
  const currentView = ref('input')
  
  // Whether detailed tables are visible
  const showingTables = ref(false)

  // ==========================================
  // PERSONALIZATION STATE
  // ==========================================
  
  // Whether personalization mode is active
  const personalizationMode = ref(false)
  
  // Baseline scenario for customization
  const selectedBaseline = ref(null)
  
  // Array of user-created custom scenarios
  const customScenarios = ref([])
  
  // Modal visibility
  const showPersonalizationModal = ref(false)
  
  // Scenario being edited (null for new)
  const editingCustomScenario = ref(null)

  // ==========================================
  // COMPUTED PROPERTIES
  // ==========================================
  
  // Calculate all scenarios from inputs
  const allScenarios = computed(() => {
    if (!inputs.value) {
      return []
    }
    return calculateAllScenarios(inputs.value)
  })
  
  // Filtered scenarios for current mode (standard vs personalization)
  const filteredScenarios = computed(() => {
    if (!allScenarios.value || allScenarios.value.length === 0) {
      return []
    }
    
    if (!personalizationMode.value || !selectedBaseline.value) {
      // Standard mode - show all 4 presets
      return allScenarios.value
    } else {
      // Personalization mode - show baseline + custom scenarios
      const scenarios = [selectedBaseline.value]
      if (customScenarios.value.length > 0) {
        scenarios.push(...customScenarios.value)
      }
      return scenarios
    }
  })
  
  // Table data for detailed analysis
  const tableData = computed(() => {
    if (!selectedScenario.value || !inputs.value) {
      return {}
    }
    return formatTableData(selectedScenario.value, inputs.value)
  })
  
  const basicInfoData = computed(() => tableData.value.basicInfoData || [])
  const inheritanceData = computed(() => tableData.value.inheritanceData || [])
  const taxImpactData = computed(() => tableData.value.taxImpactData || [])
  const bottomLineData = computed(() => tableData.value.bottomLineData || [])
  
  // Values for modal pre-population
  const modalPersonalizationValues = computed(() => {
    // If editing a custom scenario, use its values
    if (editingCustomScenario.value) {
      return editingCustomScenario.value.personalizedValues
    }
    
    // Otherwise use baseline values for new custom scenario
    if (!selectedBaseline.value) {
      return null
    }
    
    const scenario = selectedBaseline.value.scenario
    return {
      conversionAmount: scenario.conversionAmount,
      conversionYears: 3, // Default
      parentTaxRate: scenario.parentTaxRate,
      childrenTaxRates: [...scenario.childTaxRates], // Clone array
      returnRate: 6.0, // Default
      yearsUntilInheritance: 15 // Default
    }
  })

  // ==========================================
  // FORM SUBMISSION AND INITIALIZATION
  // ==========================================
  
  const generateAnalysis = (formInputs) => {
    inputs.value = formInputs
    showResults.value = true
    currentView.value = 'scenarios'
    
    // Reset any previous state
    selectedScenario.value = null
    selectedCalculation.value = null
    showingTables.value = false
  }
  
  const resetTool = () => {
    inputs.value = null
    showResults.value = false
    currentView.value = 'input'
    selectedScenario.value = null
    selectedCalculation.value = null
    showingTables.value = false
    
    // Reset personalization state
    disablePersonalizationMode()
  }

  // ==========================================
  // NAVIGATION ACTIONS
  // ==========================================
  
  const selectScenario = (scenarioCalculation) => {
    selectedScenario.value = scenarioCalculation
    selectedCalculation.value = scenarioCalculation
    showingTables.value = true
    currentView.value = 'details'
  }
  
  const backToScenarios = () => {
    selectedScenario.value = null
    selectedCalculation.value = null
    showingTables.value = false
    currentView.value = 'scenarios'
  }

  // ==========================================
  // PERSONALIZATION ACTIONS
  // ==========================================
  
  const enablePersonalizationMode = () => {
    personalizationMode.value = true
  }
  
  const disablePersonalizationMode = () => {
    personalizationMode.value = false
    selectedBaseline.value = null
    customScenarios.value = []
    editingCustomScenario.value = null
    showPersonalizationModal.value = false
  }
  
  const selectBaseline = (scenario) => {
    selectedBaseline.value = scenario
  }
  
  const changeBaseline = () => {
    selectedBaseline.value = null
    customScenarios.value = []
  }

  // ==========================================
  // CUSTOM SCENARIO CRUD
  // ==========================================
  
  const addCustomScenario = (personalizedValues) => {
    if (!selectedBaseline.value || !inputs.value) {
      return
    }
    
    // Determine scenario name and index
    const isEditing = editingCustomScenario.value !== null
    
    let scenarioNumber
    if (isEditing) {
      // For editing, try to extract number from existing scenario name
      const existingName = editingCustomScenario.value?.scenario?.name
      if (existingName) {
        const match = existingName.match(/\d+/)
        scenarioNumber = match ? parseInt(match[0]) : customScenarios.value.length + 1
      } else {
        scenarioNumber = customScenarios.value.length + 1
      }
    } else {
      scenarioNumber = customScenarios.value.length + 1
    }
    
    // Create custom scenario template
    const customScenarioTemplate = {
      name: `Custom ${scenarioNumber}`,
      id: isEditing ? editingCustomScenario.value.id : `custom-${Date.now()}`,
      conversionAmount: personalizedValues.conversionAmount,
      parentTaxRate: personalizedValues.parentTaxRate,
      childTaxRates: personalizedValues.childrenTaxRates,
      conversionYears: personalizedValues.conversionYears || 3,
      returnRate: personalizedValues.returnRate || 6.0,
      yearsUntilInheritance: personalizedValues.yearsUntilInheritance || 15,
      colorTheme: 'success', // Green theme for custom scenarios
      isSweetSpot: false,
      isDangerous: false,
      isCustom: true
    }
    
    // Calculate the custom scenario
    const customScenarioCalculation = calculateScenario(inputs.value, customScenarioTemplate)
    
    // Create the full custom scenario object
    const newCustomScenario = {
      id: isEditing ? editingCustomScenario.value.id : `custom-${Date.now()}`,
      ...customScenarioCalculation,
      personalizedValues: { ...personalizedValues },
      isCustom: true
    }
    
    if (isEditing) {
      // Update existing scenario
      const index = customScenarios.value.findIndex(s => s.id === editingCustomScenario.value.id)
      if (index !== -1) {
        customScenarios.value[index] = newCustomScenario
      }
    } else {
      // Add new scenario
      customScenarios.value.push(newCustomScenario)
    }
    
    // Clean up editing state
    editingCustomScenario.value = null
    showPersonalizationModal.value = false
  }
  
  const editCustomScenario = (scenarioId) => {
    const scenario = customScenarios.value.find(s => s.id === scenarioId)
    if (scenario) {
      editingCustomScenario.value = scenario
      showPersonalizationModal.value = true
    }
  }
  
  const deleteCustomScenario = (scenarioId) => {
    const index = customScenarios.value.findIndex(s => s.id === scenarioId)
    if (index !== -1) {
      customScenarios.value.splice(index, 1)
    }
  }

  // ==========================================
  // MODAL MANAGEMENT
  // ==========================================
  
  const openPersonalizationModal = (scenarioToEdit = null) => {
    if (!selectedBaseline.value && !scenarioToEdit) {
      return
    }
    
    if (scenarioToEdit) {
      editingCustomScenario.value = scenarioToEdit
    } else {
      editingCustomScenario.value = null
    }
    showPersonalizationModal.value = true
  }
  
  const closePersonalizationModal = () => {
    showPersonalizationModal.value = false
    editingCustomScenario.value = null
  }

  // ==========================================
  // RETURN STORE INTERFACE
  // ==========================================
  
  return {
    // Core Application State
    inputs,
    showResults,
    selectedScenario,
    selectedCalculation,
    
    // UI Navigation State
    currentView,
    showingTables,
    
    // Personalization State
    personalizationMode,
    selectedBaseline,
    customScenarios,
    showPersonalizationModal,
    editingCustomScenario,
    
    // Computed Properties
    allScenarios,
    filteredScenarios,
    tableData,
    basicInfoData,
    inheritanceData,
    taxImpactData,
    bottomLineData,
    modalPersonalizationValues,
    
    // Form Submission and Initialization
    generateAnalysis,
    resetTool,
    
    // Navigation Actions
    selectScenario,
    backToScenarios,
    
    // Personalization Actions
    enablePersonalizationMode,
    disablePersonalizationMode,
    selectBaseline,
    changeBaseline,
    
    // Custom Scenario CRUD
    addCustomScenario,
    editCustomScenario,
    deleteCustomScenario,
    
    // Modal Management
    openPersonalizationModal,
    closePersonalizationModal
  }
})