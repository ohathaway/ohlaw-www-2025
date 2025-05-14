<template>
  <div class="p-4 space-y-4">
    <h2>Severity Test</h2>
    
    <h3>Messages</h3>
    <div class="space-y-2">
      <Message severity="success">Success Message</Message>
      <Message severity="info">Info Message</Message>
      <Message severity="warn">Warning Message</Message>
      <Message severity="error">Error Message</Message>
    </div>
    
    <h3>Tags</h3>
    <div class="space-x-2">
      <Tag severity="success">Success</Tag>
      <Tag severity="info">Info</Tag>
      <Tag severity="warning">Warning</Tag>
      <Tag severity="danger">Danger</Tag>
    </div>
    
    <Button @click="showToasts">Show Toasts</Button>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const showToasts = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Success message', life: 3000 });
  setTimeout(() => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Info message', life: 3000 });
  }, 300);
  setTimeout(() => {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Warning message', life: 3000 });
  }, 600);
  setTimeout(() => {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error message', life: 3000 });
  }, 900);
};
</script>