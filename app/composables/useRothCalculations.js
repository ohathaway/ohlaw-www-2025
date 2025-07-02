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
  // Get app configuration for growth modeling
  const appConfig = useAppConfig()
  const annualReturn = appConfig.tools?.rothConversion?.defaultAnnualReturn || 0.06
  const distributionYears = appConfig.tools?.rothConversion?.distributionYears || 10

  /**
   * Models year-by-year distribution with growth for a single child
   * @param {number} initialBalance - Starting account balance
   * @param {number} taxRate - Child's tax rate (as decimal)
   * @param {number} years - Number of distribution years
   * @returns {Object} Distribution analysis with growth breakdown
   */
  const modelDistributionWithGrowth = (initialBalance, taxRate, years = distributionYears) => {
    let remainingBalance = initialBalance
    let totalDistributed = 0
    let totalTaxesPaid = 0
    let totalGrowthGenerated = 0
    let totalTaxOnGrowth = 0
    let totalTaxOnPrincipal = 0
    const yearlyDetails = []

    for (let year = 1; year <= years; year++) {
      // Apply growth at beginning of year
      const growthThisYear = remainingBalance * annualReturn
      remainingBalance += growthThisYear
      totalGrowthGenerated += growthThisYear

      // Calculate required distribution (1/remaining years of the original balance)
      const requiredDistribution = remainingBalance / (years - year + 1)
      
      // Calculate taxes on the full distribution
      const taxesThisYear = requiredDistribution * taxRate
      
      // Track proportion of distribution that was growth vs principal
      const growthPortion = Math.min(growthThisYear, requiredDistribution)
      const principalPortion = requiredDistribution - growthPortion
      
      const taxOnGrowthThisYear = growthPortion * taxRate
      const taxOnPrincipalThisYear = principalPortion * taxRate

      totalDistributed += requiredDistribution
      totalTaxesPaid += taxesThisYear
      totalTaxOnGrowth += taxOnGrowthThisYear
      totalTaxOnPrincipal += taxOnPrincipalThisYear
      
      // Reduce balance by distribution
      remainingBalance -= requiredDistribution

      yearlyDetails.push({
        year,
        startingBalance: remainingBalance + requiredDistribution - growthThisYear,
        growth: growthThisYear,
        distribution: requiredDistribution,
        taxes: taxesThisYear,
        endingBalance: remainingBalance,
        taxOnGrowth: taxOnGrowthThisYear,
        taxOnPrincipal: taxOnPrincipalThisYear
      })
    }

    return {
      totalDistributed,
      totalTaxesPaid,
      totalGrowthGenerated,
      totalTaxOnGrowth,
      totalTaxOnPrincipal,
      yearlyDetails,
      effectiveTaxRate: totalTaxesPaid / totalDistributed
    }
  }

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
   * Calculates detailed comparison for a specific scenario with growth modeling
   * @param {Object} inputs - Form input data
   * @param {Object} scenario - Scenario configuration
   * @returns {Object} Detailed calculation results with growth breakdown
   */
  const calculateScenario = (inputs, scenario) => {
    if (!inputs || !scenario) return null

    const totalPreTax = inputs.totalPreTaxAccounts
    const totalRoth = inputs.totalRothAccounts
    const numChildren = inputs.numberOfChildren
    const conversionAmount = scenario.conversionAmount
    const currentTaxRate = scenario.parentTaxRate / 100

    // Do Nothing Scenario - Traditional accounts only
    const preTaxPerChild = totalPreTax / numChildren
    const rothPerChild = totalRoth / numChildren

    // Strategic Planning Scenario - Converted amounts go to Roth
    const newPreTaxPerChild = (totalPreTax - conversionAmount) / numChildren
    const newRothPerChild = (totalRoth + conversionAmount) / numChildren

    // Parent tax on conversion
    const parentConversionTax = conversionAmount * currentTaxRate

    const childrenDoNothing = []
    const childrenStrategic = []
    let totalDoNothingTax = 0
    let totalStrategicTax = 0
    let totalDoNothingGrowthTax = 0
    let totalStrategicGrowthTax = 0
    let totalGrowthGenerated = 0
    let totalStrategicGrowthGenerated = 0

    for (let i = 0; i < numChildren; i++) {
      const childTaxRate = scenario.childTaxRates[i] / 100
      
      // Do Nothing: Child inherits full traditional IRA balance
      const doNothingAnalysis = modelDistributionWithGrowth(preTaxPerChild, childTaxRate)
      
      // Strategic: Child inherits smaller traditional IRA + larger Roth IRA (tax-free)
      const strategicAnalysis = modelDistributionWithGrowth(newPreTaxPerChild, childTaxRate)
      
      totalDoNothingTax += doNothingAnalysis.totalTaxesPaid
      totalStrategicTax += strategicAnalysis.totalTaxesPaid
      totalDoNothingGrowthTax += doNothingAnalysis.totalTaxOnGrowth
      totalStrategicGrowthTax += strategicAnalysis.totalTaxOnGrowth
      totalGrowthGenerated += doNothingAnalysis.totalGrowthGenerated
      totalStrategicGrowthGenerated += strategicAnalysis.totalGrowthGenerated
      
      childrenDoNothing.push({
        initialBalance: preTaxPerChild,
        totalDistributed: doNothingAnalysis.totalDistributed,
        totalTax: doNothingAnalysis.totalTaxesPaid,
        totalGrowthGenerated: doNothingAnalysis.totalGrowthGenerated,
        totalTaxOnGrowth: doNothingAnalysis.totalTaxOnGrowth,
        totalTaxOnPrincipal: doNothingAnalysis.totalTaxOnPrincipal,
        taxRate: childTaxRate,
        yearlyDetails: doNothingAnalysis.yearlyDetails
      })
      
      childrenStrategic.push({
        initialTraditionalBalance: newPreTaxPerChild,
        initialRothBalance: newRothPerChild,
        totalDistributed: strategicAnalysis.totalDistributed,
        totalTax: strategicAnalysis.totalTaxesPaid,
        totalGrowthGenerated: strategicAnalysis.totalGrowthGenerated,
        totalTaxOnGrowth: strategicAnalysis.totalTaxOnGrowth,
        totalTaxOnPrincipal: strategicAnalysis.totalTaxOnPrincipal,
        taxRate: childTaxRate,
        yearlyDetails: strategicAnalysis.yearlyDetails,
        // Roth grows tax-free for 10 years
        rothGrowthTaxFree: newRothPerChild * ((1 + annualReturn) ** distributionYears - 1)
      })
    }

    const totalFamilyTaxDoNothing = totalDoNothingTax
    const totalFamilyTaxStrategic = parentConversionTax + totalStrategicTax
    const netFamilySavings = totalFamilyTaxDoNothing - totalFamilyTaxStrategic

    // Calculate tax savings specifically on growth
    const growthTaxSavings = totalDoNothingGrowthTax - totalStrategicGrowthTax

    return {
      doNothing: {
        preTaxPerChild,
        rothPerChild,
        children: childrenDoNothing,
        totalFamilyTax: totalFamilyTaxDoNothing,
        totalGrowthGenerated,
        totalGrowthTax: totalDoNothingGrowthTax
      },
      strategic: {
        preTaxPerChild: newPreTaxPerChild,
        rothPerChild: newRothPerChild,
        children: childrenStrategic,
        parentConversionTax,
        totalChildrenTax: totalStrategicTax,
        totalFamilyTax: totalFamilyTaxStrategic,
        totalGrowthGenerated: totalStrategicGrowthGenerated,
        totalGrowthTax: totalStrategicGrowthTax
      },
      netFamilySavings,
      growthTaxSavings,
      totalGrowthAtStake: totalGrowthGenerated,
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
          type: 'Traditional IRA (per child)',
          doNothing: formatCurrency(calculation.doNothing.preTaxPerChild),
          strategic: formatCurrency(calculation.strategic.preTaxPerChild)
        },
        {
          type: 'Roth IRA (per child)',
          doNothing: formatCurrency(calculation.doNothing.rothPerChild),
          strategic: formatCurrency(calculation.strategic.rothPerChild)
        },
        {
          type: 'Total Growth Generated (10 years)',
          doNothing: formatCurrency(calculation.doNothing.totalGrowthGenerated),
          strategic: formatCurrency(calculation.strategic.totalGrowthGenerated + (calculation.strategic.children[0]?.rothGrowthTaxFree * inputs.numberOfChildren || 0))
        },
        {
          type: 'Investment Growth Tax-Free',
          doNothing: formatCurrency(0),
          strategic: formatCurrency(calculation.strategic.children[0]?.rothGrowthTaxFree * inputs.numberOfChildren || 0)
        }
      ],

      taxImpactData: calculation.doNothing.children.map((child, index) => ({
        child: `Child ${index + 1}`,
        doNothing: `Total Tax: ${formatCurrency(child.totalTax)}\nOn Principal: ${formatCurrency(child.totalTaxOnPrincipal)}\nOn Growth: ${formatCurrency(child.totalTaxOnGrowth)}`,
        strategic: `Total Tax: ${formatCurrency(calculation.strategic.children[index].totalTax)}\nOn Principal: ${formatCurrency(calculation.strategic.children[index].totalTaxOnPrincipal)}\nOn Growth: ${formatCurrency(calculation.strategic.children[index].totalTaxOnGrowth)}`
      })),

      bottomLineData: [
        {
          impact: 'Parents Pay During Life',
          doNothing: formatCurrency(0),
          strategic: formatCurrency(calculation.strategic.parentConversionTax),
          rowType: 'standard'
        },
        {
          impact: 'Children Pay Over 10 Years',
          doNothing: formatCurrency(calculation.doNothing.totalFamilyTax),
          strategic: formatCurrency(calculation.strategic.totalChildrenTax),
          rowType: 'standard'
        },
        {
          impact: 'Tax Saved on Investment Growth',
          doNothing: '—',
          strategic: `💰 ${formatCurrency(calculation.growthTaxSavings)}`,
          rowType: 'success'
        },
        {
          impact: 'Total Investment Growth at Stake',
          doNothing: formatCurrency(calculation.totalGrowthAtStake),
          strategic: formatCurrency(calculation.totalGrowthAtStake),
          rowType: 'neutral'
        },
        {
          impact: 'TOTAL FAMILY TAX BURDEN',
          doNothing: formatCurrency(calculation.doNothing.totalFamilyTax),
          strategic: formatCurrency(calculation.strategic.totalFamilyTax),
          rowType: 'subtotal'
        },
        {
          impact: 'NET FAMILY SAVINGS',
          doNothing: '—',
          strategic: calculation.netFamilySavings > 0 
            ? `✅ +${formatCurrency(calculation.netFamilySavings)}`
            : calculation.netFamilySavings < 0 
              ? `⚠️ -${formatCurrency(Math.abs(calculation.netFamilySavings))}`
              : '—',
          rowType: calculation.netFamilySavings > 0 ? 'success' : calculation.netFamilySavings < 0 ? 'danger' : 'neutral',
          statusIndicator: calculation.netFamilySavings > 0 ? 'positive' : calculation.netFamilySavings < 0 ? 'negative' : 'neutral'
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
   * Gets CSS classes for table row styling based on rowType
   * @param {string} rowType - Type of table row (standard, subtotal, success, danger, neutral)
   * @returns {Array} Array of CSS classes
   */
  const getTableRowClasses = (rowType) => {
    if (!rowType) return []
    
    switch (rowType) {
      case 'success':
        return ['bg-success-50', 'border-success-200', 'text-success-800', 'font-semibold']
      case 'danger':
        return ['bg-danger-50', 'border-danger-200', 'text-danger-800', 'font-semibold']
      case 'warning':
        return ['bg-warning-50', 'border-warning-200', 'text-warning-800', 'font-semibold']
      case 'subtotal':
        return ['bg-slate-100', 'border-slate-300', 'font-bold', 'border-t-2']
      case 'neutral':
        return ['bg-slate-50', 'border-slate-200', 'font-medium']
      case 'standard':
      default:
        return []
    }
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
    const savingsValues = scenarioCalculations.map(calc => calc.netFamilySavings)
    const maxSavings = Math.max(...savingsValues)
    const minSavings = Math.min(...savingsValues)
    const range = maxSavings - minSavings
    
    // Handle single scenario case where range = 0
    let padding
    if (range === 0) {
      // For single scenario, create reasonable padding around the value
      const absValue = Math.abs(maxSavings)
      padding = Math.max(absValue * 0.2, 50000) // At least $50K padding
    } else {
      padding = range * 0.1
    }

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
            size: 18,
            weight: 'bold',
            family: 'system-ui, -apple-system, sans-serif'
          },
          color: 'rgb(55, 65, 81)', // gray-700
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: 'rgb(75, 85, 99)', // gray-600
            font: {
              size: 14,
              weight: '500',
              family: 'system-ui, -apple-system, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          titleFont: {
            size: 16,
            weight: 'bold',
            family: 'system-ui, -apple-system, sans-serif'
          },
          bodyFont: {
            size: 14,
            weight: '500',
            family: 'system-ui, -apple-system, sans-serif'
          },
          cornerRadius: 8,
          padding: 12,
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
              const messages = []
              
              if (calc.scenario.isDangerous && calc.netFamilySavings < 0) {
                messages.push('⚠️ Family loses money with this scenario')
              }
              if (calc.scenario.isSweetSpot) {
                messages.push('🎯 Optimal balance of risk and reward')
              }
              
              // Add growth tax savings message
              if (calc.growthTaxSavings > 0) {
                messages.push(`💰 Saves ${formatCurrency(calc.growthTaxSavings)} in taxes on growth`)
              }
              
              return messages
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
              size: 14,
              weight: 'bold',
              family: 'system-ui, -apple-system, sans-serif'
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
            font: {
              size: 14,
              weight: '500',
              family: 'system-ui, -apple-system, sans-serif'
            },
            callback: function(value) {
              return formatCurrency(value)
            }
          },
          title: {
            display: true,
            text: 'Net Family Tax Savings',
            color: 'rgb(75, 85, 99)', // gray-600
            font: {
              size: 16,
              weight: 'bold',
              family: 'system-ui, -apple-system, sans-serif'
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
    getTableRowClasses,
    generateChartData,
    generateChartOptions
  }
}