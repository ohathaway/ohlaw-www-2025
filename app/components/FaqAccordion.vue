<template>
  <div class="w-full">
    <Accordion :multiple="false" value="0" class="faq-accordion">
      <AccordionPanel v-for="(item, index) in faqItems" :key="index" :value="index">
        <AccordionHeader><strong>{{ item.question }}</strong></AccordionHeader>
        <AccordionContent>
          <div class="prose prose-slate max-w-none" v-html="item.answer"></div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
/**
 * FAQ Accordion component using PrimeVue Accordion
 * 
 * Uses PrimeVue's Accordion component with custom styling via TailwindCSS
 * First item is expanded by default with :activeIndex="0"
 */
defineProps({
  faqItems: {
    type: Array,
    required: true,
    // Expected format: [{ question: string, answer: string }, ...]
  }
});
</script>

<style lang="scss">
.faq-accordion {
  .p-accordion-header-text {
    @apply text-base font-medium;
  }
  
  .p-accordion-header-link {
    @apply bg-white hover:bg-slate-50 transition-colors;
    
    &:focus {
      @apply ring-2 ring-primary-300 ring-offset-2 outline-none;
    }
    
    &.p-accordion-header-link-active {
      @apply bg-white;
    }
  }
  
  .p-accordion-content {
    @apply p-4 bg-white;
  }
}
</style>