<template>
  <div class="w-full">
    <Accordion :multiple="false" value="0" class="faq-accordion">
      <AccordionPanel v-for="(item, index) in faqItems" :key="index" :value="index">
        <AccordionHeader><strong>{{ item.question }}</strong></AccordionHeader>
        <AccordionContent>
          <div class="prose prose-slate max-w-none" v-html="item.answer" />
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
  },
})
</script>

<style>
.faq-accordion .p-accordion-header-text {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
}

.faq-accordion .p-accordion-header-link {
  background-color: white;
  transition: background-color 0.15s ease-in-out;
}

.faq-accordion .p-accordion-header-link:hover {
  background-color: rgb(248 250 252);
}

.faq-accordion .p-accordion-header-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.faq-accordion .p-accordion-header-link.p-accordion-header-link-active {
  background-color: white;
}

.faq-accordion .p-accordion-content {
  padding: 1rem;
  background-color: white;
}
</style>
