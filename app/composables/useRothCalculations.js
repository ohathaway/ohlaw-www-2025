/**
 * Composable for Roth IRA conversion calculations and scenario generation
 * Handles all calculation logic for the SECURE 2.0 Impact Calculator
 */
import { formatCurrency, formatPercent } from '~/utils/numbers'

/**
 * Main composable for Roth conversion calculations
 * @param {Object} options - Configuration options
 * @returns {Object} Calculation methods and utilities
 */
export const useRothCalculations = (options = {}) => {
  
  /**
   * Generates smart scenarios based on account values and family size
   * @param {Object} inputs - Form input data
   * @param {number} inputs.totalPreTaxAccounts - Total pre-tax retirement accounts
   * @param {number} inputs.totalRothAccounts - Total Roth accounts  
   * @param {number} inputs.numberOfChildren - Number of children (1-4)
   * @returns {Array} Array of scenario objects
   */
  const generateScenarios = (inputs) => {
    if (!inputs || !inputs.totalPreTaxAccounts) return []
    
    return [
      {
        name: 'Conservative',
        conversionAmount: Math.round(inputs.totalPreTaxAccounts * 0.15), // 15%
        parentTaxRate: 20,
        childTaxRates: Array(inputs.numberOfChildren).fill(22), // Peak earning years
        colorTheme: 'success' // emerald
      },
      {
        name: 'Moderate', 
        conversionAmount: Math.round(inputs.totalPreTaxAccounts * 0.25), // 25%
        parentTaxRate: 21,
        childTaxRates: Array(inputs.numberOfChildren).fill(24), // Higher income
        colorTheme: 'info', // sky
        isSweetSpot: true
      },
      {
        name: 'Aggressive',
        conversionAmount: Math.round(inputs.totalPreTaxAccounts * 0.45), // 40%
        parentTaxRate: 21,
        childTaxRates: Array(inputs.numberOfChildren).fill(24), // High earners
        colorTheme: 'warning' // amber
      },
      {
        name: 'Danger Zone',
        conversionAmount: Math.round(inputs.totalPreTaxAccounts * 0.45), // 60%
        parentTaxRate: 22,
        childTaxRates: Array(inputs.numberOfChildren).fill(18), // Maximum rates
        colorTheme: 'danger', // rose
        isDangerous: true
      }
    ]
  }

  /**
   * Calculates detailed comparison for a specific scenario
   * @param {Object} inputs - Form input data
   * @param {Object} scenario - Scenario configuration
   * @returns {Object} Detailed calculation results
   */
  const calculateScenario = (inputs, scenario) => {
    if (!inputs || !scenario) return null

    const totalPreTax = inputs.totalPreTaxAccounts
    const totalRoth = inputs.totalRothAccounts
    const numChildren = inputs.numberOfChildren
    const conversionAmount = scenario.conversionAmount
    const currentTaxRate = scenario.parentTaxRate / 100

    // Do Nothing Scenario
    const preTaxPerChild = totalPreTax / numChildren
    const rothPerChild = totalRoth / numChildren
    const annualDistributionPerChild = preTaxPerChild / 10

    // Strategic Planning Scenario
    const newPreTaxPerChild = (totalPreTax - conversionAmount) / numChildren
    const newRothPerChild = (totalRoth + conversionAmount) / numChildren
    const newAnnualDistributionPerChild = newPreTaxPerChild / 10
    const newAnnualRothPerChild = newRothPerChild / 10

    // Tax calculations
    const parentConversionTax = conversionAmount * currentTaxRate

    const childrenDoNothing = []
    const childrenStrategic = []
    let totalDoNothingTax = 0
    let totalStrategicTax = 0

    for (let i = 0; i < numChildren; i++) {
      const childTaxRate = scenario.childTaxRates[i] / 100
      
      const doNothingAnnualTax = annualDistributionPerChild * childTaxRate
      const doNothing10YearTax = doNothingAnnualTax * 10
      
      const strategicAnnualTax = newAnnualDistributionPerChild * childTaxRate
      const strategic10YearTax = strategicAnnualTax * 10
      
      childrenDoNothing.push({
        annualDistribution: annualDistributionPerChild,
        annualTax: doNothingAnnualTax,
        totalTax: doNothing10YearTax,
        taxRate: childTaxRate
      })
      
      childrenStrategic.push({
        annualTaxableDistribution: newAnnualDistributionPerChild,
        annualTaxFreeDistribution: newAnnualRothPerChild,
        annualTax: strategicAnnualTax,
        totalTax: strategic10YearTax,
        taxRate: childTaxRate
      })
      
      totalDoNothingTax += doNothing10YearTax
      totalStrategicTax += strategic10YearTax
    }

    const totalFamilyTaxDoNothing = totalDoNothingTax
    const totalFamilyTaxStrategic = parentConversionTax + totalStrategicTax
    const netFamilySavings = totalFamilyTaxDoNothing - totalFamilyTaxStrategic

    return {
      doNothing: {
        preTaxPerChild,
        rothPerChild,
        annualDistributionPerChild,
        children: childrenDoNothing,
        totalFamilyTax: totalFamilyTaxDoNothing
      },
      strategic: {
        preTaxPerChild: newPreTaxPerChild,
        rothPerChild: newRothPerChild,
        annualDistributionPerChild: newAnnualDistributionPerChild,
        annualRothPerChild: newAnnualRothPerChild,
        children: childrenStrategic,
        parentConversionTax,
        totalChildrenTax: totalStrategicTax,
        totalFamilyTax: totalFamilyTaxStrategic
      },
      netFamilySavings,
      scenario
    }
  }

  /**
   * Calculates all scenarios for comparison
   * @param {Object} inputs - Form input data
   * @returns {Array} Array of calculation results for all scenarios
   */
  const calculateAllScenarios = (inputs) => {
    const scenarios = generateScenarios(inputs)
    return scenarios.map(scenario => calculateScenario(inputs, scenario))
  }

  /**
   * Formats table data for display components
   * @param {Object} calculation - Single scenario calculation result
   * @param {Object} inputs - Form input data
   * @returns {Object} Formatted table data
   */
  const formatTableData = (calculation, inputs) => {
    if (!calculation || !inputs) return {}

    return {
      basicInfoData: [
        {
          scenario: 'Current Pre-Tax Accounts',
          doNothing: formatCurrency(inputs.totalPreTaxAccounts),
          strategic: formatCurrency(inputs.totalPreTaxAccounts)
        },
        {
          scenario: 'Strategy',
          doNothing: 'Current beneficiary designations\n"Spouse, then kids"',
          strategic: `${calculation.scenario.name} Roth conversions\n+ Optimized beneficiaries`
        },
        {
          scenario: 'Tax Timing',
          doNothing: 'Children forced to withdraw\nover 10 years at peak earnings',
          strategic: 'Parents control timing\nat current tax rates'
        }
      ],
      
      inheritanceData: [
        {
          type: 'Traditional IRA',
          doNothing: formatCurrency(calculation.doNothing.preTaxPerChild),
          strategic: formatCurrency(calculation.strategic.preTaxPerChild)
        },
        {
          type: 'Roth IRA',
          doNothing: formatCurrency(calculation.doNothing.rothPerChild),
          strategic: formatCurrency(calculation.strategic.rothPerChild)
        },
        {
          type: 'Annual Required Distribution',
          doNothing: `${formatCurrency(calculation.doNothing.annualDistributionPerChild)} (taxable)`,
          strategic: `${formatCurrency(calculation.strategic.annualDistributionPerChild)} (taxable)\n${formatCurrency(calculation.strategic.annualRothPerChild)} (tax-free)`
        }
      ],

      taxImpactData: calculation.doNothing.children.map((child, index) => ({
        child: `Child ${index + 1}`,
        doNothing: `${formatCurrency(child.annualDistribution)} × ${formatPercent(child.taxRate)} = ${formatCurrency(child.annualTax)}/year\nTotal: ${formatCurrency(child.totalTax)}`,
        strategic: `${formatCurrency(calculation.strategic.children[index].annualTaxableDistribution)} × ${formatPercent(calculation.strategic.children[index].taxRate)} = ${formatCurrency(calculation.strategic.children[index].annualTax)}/year\nTotal: ${formatCurrency(calculation.strategic.children[index].totalTax)}`
      })),

      bottomLineData: [
        {
          impact: 'Parents Pay During Life',
          doNothing: formatCurrency(0),
          strategic: formatCurrency(calculation.strategic.parentConversionTax)
        },
        {
          impact: 'Children Pay Over 10 Years',
          doNothing: formatCurrency(calculation.doNothing.totalFamilyTax),
          strategic: formatCurrency(calculation.strategic.totalChildrenTax)
        },
        {
          impact: 'TOTAL FAMILY TAX BURDEN',
          doNothing: formatCurrency(calculation.doNothing.totalFamilyTax),
          strategic: formatCurrency(calculation.strategic.totalFamilyTax)
        },
        {
          impact: 'NET FAMILY SAVINGS',
          doNothing: '—',
          strategic: `+${formatCurrency(calculation.netFamilySavings)}`
        }
      ]
    }
  }

  /**
   * Gets CSS classes for scenario styling based on color theme
   * @param {Object} scenario - Scenario object with colorTheme property
   * @returns {Array} Array of CSS classes
   */
  const getScenarioClasses = (scenario) => {
    if (!scenario || !scenario.colorTheme) return []
    
    const theme = scenario.colorTheme
    return [
      `bg-${theme}-50`,
      `border-${theme}-200`,
      `text-${theme}-800`,
      'border'
    ]
  }

  /**
   * Gets icon class for scenario status
   * @param {Object} scenario - Scenario object
   * @returns {string} CSS class for icon
   */
  const getScenarioIcon = (scenario) => {
    if (!scenario) return 'pi pi-info-circle'
    
    if (scenario.isDangerous) return 'pi pi-exclamation-triangle text-danger-600'
    if (scenario.isSweetSpot) return 'pi pi-check text-success-600'
    if (scenario.colorTheme === 'warning') return 'pi pi-info-circle text-warning-600'
    
    return 'pi pi-check text-success-600'
  }

  /**
   * Generates Chart.js compatible data showing bracket cliff effect
   * @param {Array} scenarioCalculations - Array of calculated scenarios
   * @returns {Object} Chart.js data structure
   */
  const generateChartData = (scenarioCalculations) => {
    if (!scenarioCalculations || scenarioCalculations.length === 0) {
      return { labels: [], datasets: [] }
    }

    const labels = scenarioCalculations.map(calc => calc.scenario.name)
    const netSavingsData = scenarioCalculations.map(calc => calc.netFamilySavings)
    const conversionAmounts = scenarioCalculations.map(calc => calc.scenario.conversionAmount)

    // Define semantic colors for chart (using CSS custom property values)
    const backgroundColors = scenarioCalculations.map(calc => {
      switch (calc.scenario.colorTheme) {
        case 'success': return 'rgba(16, 185, 129, 0.2)' // emerald-500 with opacity
        case 'info': return 'rgba(14, 165, 233, 0.2)' // sky-500 with opacity  
        case 'warning': return 'rgba(245, 158, 11, 0.2)' // amber-500 with opacity
        case 'danger': return 'rgba(239, 68, 68, 0.2)' // rose-500 with opacity
        default: return 'rgba(156, 163, 175, 0.2)' // gray-400 with opacity
      }
    })

    const borderColors = scenarioCalculations.map(calc => {
      switch (calc.scenario.colorTheme) {
        case 'success': return 'rgb(16, 185, 129)' // emerald-500
        case 'info': return 'rgb(14, 165, 233)' // sky-500
        case 'warning': return 'rgb(245, 158, 11)' // amber-500
        case 'danger': return 'rgb(239, 68, 68)' // rose-500
        default: return 'rgb(156, 163, 175)' // gray-400
      }
    })

    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Net Family Savings',
          data: netSavingsData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          type: 'line',
          label: 'Bracket Cliff Trend',
          data: netSavingsData,
          borderColor: 'rgb(75, 85, 99)', // gray-600
          backgroundColor: 'rgba(75, 85, 99, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: borderColors,
          pointBorderColor: borderColors,
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    }
  }

  /**
   * Generates Chart.js options with semantic styling and cliff annotations
   * @param {Array} scenarioCalculations - Array of calculated scenarios
   * @returns {Object} Chart.js options
   */
  const generateChartOptions = (scenarioCalculations) => {
    const maxSavings = Math.max(...scenarioCalculations.map(calc => calc.netFamilySavings))
    const minSavings = Math.min(...scenarioCalculations.map(calc => calc.netFamilySavings))
    const range = maxSavings - minSavings
    const padding = range * 0.1

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: 'Tax Bracket Cliff Effect',
          font: {
            size: 16,
            weight: 'bold'
          },
          color: 'rgb(55, 65, 81)', // gray-700
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: 'rgb(75, 85, 99)', // gray-600
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const calc = scenarioCalculations[context.dataIndex]
              const savings = formatCurrency(context.parsed.y)
              const conversion = formatCurrency(calc.scenario.conversionAmount)
              
              if (context.datasetIndex === 0) {
                return `Net Savings: ${savings} (${conversion} conversion)`
              } else {
                return `Trend: ${savings}`
              }
            },
            afterBody: function(context) {
              const calc = scenarioCalculations[context[0].dataIndex]
              if (calc.scenario.isDangerous && calc.netFamilySavings < 0) {
                return ['⚠️ Family loses money with this scenario']
              }
              if (calc.scenario.isSweetSpot) {
                return ['🎯 Optimal balance of risk and reward']
              }
              return []
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgb(107, 114, 128)', // gray-500
            font: {
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: false,
          min: minSavings - padding,
          max: maxSavings + padding,
          grid: {
            color: 'rgba(229, 231, 235, 0.5)', // gray-200 with opacity
          },
          ticks: {
            color: 'rgb(107, 114, 128)', // gray-500
            callback: function(value) {
              return formatCurrency(value)
            }
          },
          title: {
            display: true,
            text: 'Net Family Tax Savings',
            color: 'rgb(75, 85, 99)', // gray-600
            font: {
              weight: 'bold'
            }
          }
        }
      },
      onClick: (event, elements) => {
        // Click handler will be attached in the component
        if (elements.length > 0) {
          const dataIndex = elements[0].index
          return dataIndex
        }
        return null
      }
    }
  }

  return {
    generateScenarios,
    calculateScenario,
    calculateAllScenarios,
    formatTableData,
    getScenarioClasses,
    getScenarioIcon,
    generateChartData,
    generateChartOptions
  }
}