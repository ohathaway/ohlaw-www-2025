<script setup>
const { isAuthed, loading, signOut }
  = useAdminAuth()

const router = useRouter()

watch(
  [isAuthed, loading],
  ([authed, isLoading]) => {
    if (!isLoading && !authed) {
      router.push('/admin/login')
    }
  },
  { immediate: true },
)

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin/esign',
    icon: 'bi-grid',
  },
  {
    label: 'New Document',
    to: '/admin/esign/new',
    icon: 'bi-file-earmark-plus',
  },
  {
    label: 'Templates',
    to: '/admin/esign/templates',
    icon: 'bi-files',
  },
]

const handleSignOut = async () => {
  await signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div
    v-if="loading"
    class="min-h-screen flex items-center
      justify-center bg-slate-50"
  >
    <span class="text-slate-400">Loading...</span>
  </div>

  <div
    v-else-if="isAuthed"
    class="min-h-screen flex bg-slate-50"
  >
    <!-- Sidebar -->
    <aside
      class="w-60 bg-[#1E3A5F] text-white
        flex flex-col shrink-0"
    >
      <div class="p-5 border-b border-white/10">
        <h1 class="text-lg font-bold">
          OHLaw Admin
        </h1>
        <p class="text-xs text-white/60 mt-1">
          E-Sign Management
        </p>
      </div>

      <nav class="flex-1 p-3">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3
            py-2.5 rounded-lg mb-1
            text-sm font-medium
            transition-colors"
          active-class="bg-white/15 text-white"
          inactive-class="text-white/70
            hover:bg-white/10 hover:text-white"
        >
          <i :class="['bi', item.icon]" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-3 border-t border-white/10">
        <button
          class="w-full flex items-center gap-3
            px-3 py-2.5 rounded-lg text-sm
            text-white/70 hover:bg-white/10
            hover:text-white transition-colors"
          @click="handleSignOut"
        >
          <i class="bi bi-box-arrow-left" />
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  color: #1e293b;
}
</style>
