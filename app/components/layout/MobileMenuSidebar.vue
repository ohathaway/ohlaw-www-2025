<template>
  <Drawer 
    :visible="visibleModel" 
    :position="position" 
    :class="sidebarClass"
    @update:visible="updateVisible"
  >
    <div class="p-3">
      <img 
        :src="logoSrc" 
        :alt="logoAlt" 
        :class="logoClass" 
      />
    </div>
    <Divider />
    <PanelMenu :model="navigationMenuItems" class="w-full" />
  </Drawer>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  position: {
    type: String,
    default: 'left'
  },
  sidebarClass: {
    type: String,
    default: ''
  },
  logoSrc: {
    type: String,
    required: true
  },
  logoAlt: {
    type: String,
    default: 'Logo'
  },
  logoClass: {
    type: String,
    default: 'w-[60px] h-[60px] mx-auto block'
  },
  menuItems: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:visible']);

// Computed property to handle two-way binding for visible prop
const visibleModel = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Convert route-based menu items to command-based for PanelMenu
const navigationMenuItems = computed(() => convertRoutesToCommands(props.menuItems))

// Method to handle updating the visible state
const updateVisible = (value) => {
  emit('update:visible', value)
}
</script>