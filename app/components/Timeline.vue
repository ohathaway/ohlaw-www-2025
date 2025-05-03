<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-12">
      <div class="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-10 xl:col-span-10">
        <ul class="timeline">
          <li v-for="(item, index) in tlContent" :key="index" 
              :class="['timeline-item', { 'period': item.type === 'period' }]">
            <div class="timeline-info">
              <span v-if="item.type === 'content'">{{ item.info }}</span>
            </div>
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <template v-if="item.type === 'content'">
                <p v-for="(paragraph, pIndex) in item.content" :key="pIndex">{{ paragraph }}</p>
              </template>
              <h2 v-else>{{ item.content }}</h2>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tlContent: {
    type: Array,
    required: true
  }
});
</script>

<style lang="scss">
/* Base Timeline Styles with TailwindCSS utility classes where appropriate */
.timeline {
  @apply list-none p-0 m-0 w-full leading-relaxed;

  h1, h2, h3, h4, h5, h6 {
    @apply leading-inherit;
  }
}

/* Timeline Item */
.timeline-item {
  @apply pl-10 relative;
  
  &:last-child {
    @apply pb-0;
  }
}

/* Timeline Info */
.timeline-info {
  @apply text-xl font-bold tracking-wider mb-2 uppercase;
}

/* Timeline Marker */
.timeline-marker {
  @apply absolute top-0 bottom-0 left-0 w-4;

  &:before {
    @apply block h-4 w-4 absolute top-1 left-0 bg-transparent border-3 border-primary-600 rounded-full;
    content: "";
    transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
  }

  &:after {
    @apply block w-0.5 bg-slate-300 absolute top-6 bottom-0 left-[7px];
    content: "";
  }

  .timeline-item:last-child &:after {
    content: none;
  }
}

.timeline-item:not(.period):hover .timeline-marker:before {
  @apply bg-primary-600 border-transparent;
}

/* Timeline Content */
.timeline-content {
  @apply pb-10;

  p:last-child {
    @apply mb-0;
  }
}

/* Timeline Period */
.period {
  @apply p-0;

  .timeline-info {
    @apply hidden;
  }

  .timeline-marker {
    &:before {
      @apply bg-transparent w-4 h-auto border-none rounded-none top-0 bottom-[30px] absolute border-t-2 border-b-2 border-slate-300;
      content: "";
    }

    &:after {
      @apply h-8 top-auto;
      content: "";
    }
  }

  .timeline-content {
    @apply py-10 pb-[70px];
  }

  .timeline-title {
    @apply m-0;
  }
}

/* Media Queries for Timeline Split */
@media (min-width: 768px) {
  .timeline {
    @apply table;
  }

  .timeline-item {
    @apply table-row p-0;
  }

  .timeline-info,
  .timeline-marker,
  .timeline-content,
  .period .timeline-info {
    @apply table-cell align-top;
  }

  .timeline-marker {
    @apply relative;
  }

  .timeline-content {
    @apply pl-8;
  }

  .timeline-info {
    @apply pr-8;
  }

  .period .timeline-title {
    @apply relative -left-[45px];
  }
}

/* Media Queries for Large Screens */
@media (min-width: 992px) {
  /* Add additional styles for larger screens if needed */
}
</style>