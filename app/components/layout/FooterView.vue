<template>
  <footer class="bg-primary-800 py-6 text-slate-200">
    <div class="grid grid-cols-3 gap-4">
      <div>
        <h5>Contact Us</h5>
        <ClientOnly>
          <ul class="list-none">
            <li class="my-2">
              <font-awesome-icon icon="fas fa-phone"></font-awesome-icon>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a class="text-white" href="tel:+19708183052">
                970-818-3052
              </a>
            </li>
            <li class="my-2">
              <font-awesome-icon icon="fas fa-fax"></font-awesome-icon>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;970-360-7028
            </li>
            <li class="my-2">
              <font-awesome-icon icon="fas fa-comment-sms"></font-awesome-icon>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a class="text-white" href="sms://+19708185558">
                970-818-5559
              </a>
            </li>
            <li class="my-2">
              <font-awesome-icon icon="far fa-calendar-days"></font-awesome-icon>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a
                class="text-white"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#bookingModal"
              >
                In Person
              </a>
            </li>
          </ul>
        </ClientOnly>
      </div>
    </div>
    <div class="container mx-auto">
      <p>
        © 2025 OH Law Colorado &nbsp;&nbsp;|&nbsp;&nbsp;
        <NuxtLink to="/policies/privacy">Privacy Policy</NuxtLink> &nbsp;&nbsp;|&nbsp;&nbsp;
        <NuxtLink to="/policies/terms-of-use">Terms of Use</NuxtLink>
      </p>
    </div>
    <div>
      <div class="bg-primary-800 p-4 text-white">
        This should use your chambray-based primary color
      </div>
      <div class="p-4">
        <Button label="Primary Button" />
        <Button label="Secondary Button" severity="secondary" />
      </div>
    </div>
  </footer> 
</template>

<script setup>
onMounted(() => {
  // Check primary variables (which work)
  console.log('--primary-500:', getComputedStyle(document.documentElement).getPropertyValue('--primary-500'));
  console.log('--primary-600:', getComputedStyle(document.documentElement).getPropertyValue('--primary-600'));
  
  // Check secondary variables (which don't work)
  console.log('--secondary-500:', getComputedStyle(document.documentElement).getPropertyValue('--secondary-500'));
  console.log('--secondary-600:', getComputedStyle(document.documentElement).getPropertyValue('--secondary-600'));
  
  // Check slate primitive (which might be missing)
  console.log('--slate-500:', getComputedStyle(document.documentElement).getPropertyValue('--slate-500'));
})
</script>