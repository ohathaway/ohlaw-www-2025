<template>
  <div class="quiz-contact-form">
    <!-- Form header -->
    
    <FormKit
      type="form"
      :actions="false"
      name="quizContactForm"
      ref="formData"
      id="quizContactForm"
      #default="{ node }"
      @submit.prevent

      :classes="{
        form: {
          $reset: true,
          'p-4': true,
          border: true,
          rounded: true,
          'bg-light': true
        }
      }"
    >
      <div class="form-header text-center mb-4">
        <h3>Get Your Personalized Recommendations</h3>
        <p class="text-muted px-5">
          Enter your contact information below to receive personalized advice 
          based on your quiz results.
        </p>
      </div>
      <div class="grid">
        <FormKit
          type="text"
          name="firstName"
          label="First Name"
          validation="required"
          :classes="{
            outer: {
              'g-col-6': true
            },
            input: {
              $reset: true,
              'form-control': true
            }
          }"
        />
        <FormKit
          v-if="showEnhancedFields"
          type="text"
          name="lastName"
          label="Last Name"
          validation="required"
          :classes="{
            outer: {
              'g-col-6': true
            },
            input: {
              $reset: true,
              'form-control': true
            }
          }"
        />
        <FormKit
          type="text"
          name="email"
          label="Email Address"
          validation="required|email"
          :classes="{
            outer: {
              'g-col-6': true
            },
            input: {
              $reset: true,
              'form-control': true
            }
          }"
        />
        <FormKit
          v-if="showEnhancedFields"
          type="tel"
          name="phone"
          label="Phone Number"
          validation="required|matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
          :validation-messages="{
            required: 'Yeah. We need your phone number to give you the enhanced results',
            matches: 'Phone number must be in the format xxx-xxx-xxxx',
          }"
          :classes="{
            outer: {
              'g-col-6': true
            },
            input: {
              $reset: true,
              'form-control': true
            }
          }"
        />
      </div>
      <FormKit
        type="checkbox"
        :label="marketingConsentText"
        name="marketingConsent"
        validation="isTrue"
        :validation-messages="{ isTrue: 'Sorry, we need your consent to give you your results.'}"
      />
      <FormKit
        type="checkbox"
        name="enhancedMarketingConsent"
        @input="updateEnhancedConsent"
      >
        <template #label>
          <span v-html="enhancedConsentText" />
        </template>
      </FormKit>
      <!-- Privacy notice -->
      <div class="privacy-notice mt-4 mb-4">
        <p class="small text-muted">
          Your information is kept private and will only be used to provide you with the information you've requested. 
          See our <a href="/policies/Privacy" target="_blank">Privacy Policy</a> for details.
        </p>
      </div>

      <FormKit
        type="button"
        :disabled="!node.context.state.valid"
        @click="submitForm(node.value)"
        :classes="{
          outer: {
            'mx-auto': true
          },
          input: {
            $reset: true,
            btn: true,
            'btn-primary': true
          },
          label: {
            'text-dark': true
          }
        }"
      >
        {{ isSubmitting ? 'Submitting...' : 'Get My Results' }}
      </FormKit>
    </FormKit>
  </div>
</template>

<script setup>
const { isSubmitting }  = storeToRefs(useQuizStore())

const emit = defineEmits(['submit', 'skip'])
const showEnhancedFields = ref(false)

// Form data
const formData = ref(null)

const marketingConsentText = `I agree to receive follow-up communications about my quiz results and related legal services.`
const enhancedConsentText = `<strong>Get Enhanced Report:</strong>I want to receive the full report on my quiz results and speak to a <em>Life & Legacy</em> professional about them.`

// Form submission
const submitForm = async formValues => {
  try {
    // Emit the form data to parent component
    emit('submit', { ...formValues })
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
  }
}

const updateEnhancedConsent = value => {
  showEnhancedFields.value = value
}
</script>

<style scoped>
.quiz-contact-form {
  max-width: 700px;
  margin: 0 auto;
}

.form-header h3 {
  color: #003399;
  margin-bottom: 1rem;
}

.privacy-notice {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

.privacy-notice a {
  color: #003399;
  text-decoration: none;
}

.privacy-notice a:hover {
  text-decoration: underline;
}
</style>