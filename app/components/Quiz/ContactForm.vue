<template>
  <div class="quiz-contact-form max-w-3xl mx-auto">
    <!-- Form container -->
    <Card class="p-4 shadow-sm">
      <!-- Form header -->
      <template #title>
        <div class="text-center mb-4">
          <h3 class="text-xl font-semibold text-primary-800 mb-2">Get Your Personalized Recommendations</h3>
          <p class="text-slate-600 px-5 text-sm">
            Enter your contact information below to receive personalized advice 
            based on your quiz results.
          </p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="submitForm(formData)">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- First Name -->
            <div class="field">
              <label for="firstName" class="block text-sm font-medium mb-1">
                First Name
              </label>
              <InputText 
                id="firstName" 
                v-model="formData.firstName" 
                tabindex="1"
                class="w-full" 
                :class="{'p-invalid': v$.firstName.$invalid && v$.firstName.$dirty}"
                aria-describedby="firstName-error"
              />
              <small 
                id="firstName-error" 
                class="p-error block mt-1" 
                v-if="v$.firstName.$invalid && v$.firstName.$dirty"
              >
                {{ v$.firstName.$errors[0].$message }}
              </small>
            </div>
            
            <!-- Last Name (conditional) -->
            <div class="field" v-if="showEnhancedFields">
              <label for="lastName" class="block text-sm font-medium mb-1">
                Last Name
              </label>
              <InputText 
                id="lastName" 
                v-model="formData.lastName" 
                tabindex="3"
                class="w-full" 
                :class="{'p-invalid': v$.lastName.$invalid && v$.lastName.$dirty}"
                aria-describedby="lastName-error"
              />
              <small 
                id="lastName-error" 
                class="p-error block mt-1" 
                v-if="v$.lastName.$invalid && v$.lastName.$dirty"
              >
                {{ v$.lastName.$errors[0].$message }}
              </small>
            </div>
            
            <!-- Email -->
            <div class="field">
              <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
              <InputText 
                id="email" 
                v-model="formData.email" 
                tabindex="2"
                class="w-full" 
                :class="{'p-invalid': v$.email.$invalid && v$.email.$dirty}"
                aria-describedby="email-error"
              />
              <small 
                id="email-error" 
                class="p-error block mt-1" 
                v-if="v$.email.$invalid && v$.email.$dirty"
              >
                {{ v$.email.$errors[0].$message }}
              </small>
            </div>
            
            <!-- Phone (conditional) -->
            <div class="field" v-if="showEnhancedFields">
              <label for="phone" class="block text-sm font-medium mb-1">Phone Number</label>
              <InputMask 
                id="phone" 
                v-model="formData.phone" 
                mask="999-999-9999" 
                placeholder="xxx-xxx-xxxx"
                tabindex="4"
                class="w-full" 
                :class="{'p-invalid': v$.phone.$invalid && v$.phone.$dirty}"
                aria-describedby="phone-error"
              />
              <small 
                id="phone-error" 
                class="p-error block mt-1" 
                v-if="v$.phone.$invalid && v$.phone.$dirty"
              >
                {{ v$.phone.$errors[0].$message }}
              </small>
            </div>
          </div>
          
          <!-- Marketing Consent Checkbox -->
          <div class="field-checkbox mb-3">
            <Checkbox 
              id="marketingConsent" 
              v-model="formData.marketingConsent" 
              tabindex="5"
              :binary="true" 
              :class="{'p-invalid': v$.marketingConsent.$invalid && v$.marketingConsent.$dirty}"
            />
            <label 
              for="marketingConsent" 
              class="ml-2 text-sm"
              :class="{'text-red-500': v$.marketingConsent.$invalid && v$.marketingConsent.$dirty}"
            >
              {{ marketingConsentText }}
            </label>
            <small 
              class="p-error block mt-1" 
              v-if="v$.marketingConsent.$invalid && v$.marketingConsent.$dirty"
            >
              Sorry, we need your consent to give you your results.
            </small>
          </div>
          
          <!-- Enhanced Consent Checkbox -->
          <div class="field-checkbox mb-4">
            <Checkbox 
              id="enhancedMarketingConsent" 
              v-model="formData.enhancedMarketingConsent" 
              tabindex="6"
              :binary="true"
              @change="updateEnhancedConsent"
            />
            <label for="enhancedMarketingConsent" class="ml-2 text-sm" v-html="enhancedConsentText"></label>
          </div>
          
          <!-- Privacy notice -->
          <div class="privacy-notice mt-4 mb-4 pt-4 border-t border-slate-200">
            <p class="text-xs text-slate-500">
              Your information is kept private and will only be used to provide you with the information you've requested. 
              See our <NuxtLink to="/policies/Privacy" target="_blank" class="text-primary-700 hover:underline">Privacy Policy</NuxtLink> for details.
            </p>
          </div>
          
          <!-- Submit Button -->
          <div class="text-center">
            <Button 
              type="submit" 
              label="Get My Results" 
              :loading="isSubmitting" 
              :disabled="v$.$invalid" 
              class="px-6 py-2"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const quizStore = useQuizStore()

const { isSubmitting } = storeToRefs(useQuizStore())
const emit = defineEmits(['submit', 'skip'])
const showEnhancedFields = ref(false)

// Form data model
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  marketingConsent: false,
  enhancedMarketingConsent: false
})

// Content text
const marketingConsentText = `I agree to receive follow-up communications about my quiz results and related legal services.`
const enhancedConsentText = `<strong>Get Enhanced Report:</strong> I want to receive the full report on my quiz results and speak to a <em>Life & Legacy</em> professional about them.`

// Custom phone validator
const phonePattern = helpers.regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)

// Validation rules
const rules = computed(() => {
  const baseRules = {
    firstName: { required: helpers.withMessage('First name is required', required) },
    email: { 
      required: helpers.withMessage('Email address is required', required),
      email: helpers.withMessage('Please enter a valid email address', email)
    },
    marketingConsent: { 
      required: helpers.withMessage('Consent is required', (val) => val === true) 
    }
  }
  
  // Add conditional validation rules for enhanced fields
  if (showEnhancedFields.value) {
    baseRules.lastName = { required: helpers.withMessage('Last name is required', required) }
    baseRules.phone = {
      required: helpers.withMessage('Phone number is required', required),
      phonePattern: helpers.withMessage('Phone number must be in the format xxx-xxx-xxxx', phonePattern)
    }
  }
  
  return baseRules
})

// Initialize vuelidate
const v$ = useVuelidate(rules, formData)

// Update enhanced fields visibility
const updateEnhancedConsent = (value) => {
  showEnhancedFields.value = value
  
  // Trigger validation recalculation after changing field requirements
  v$.value.$reset()
}

// Form submission
const submitForm = async () => {
  const isValid = await v$.value.$validate()
  
  console.info('full quiz store:', quizStore)
  if (isValid) {
    try {
      // Emit the form data to parent component
      emit('submit', { ...toRaw(formData) })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
}
</script>