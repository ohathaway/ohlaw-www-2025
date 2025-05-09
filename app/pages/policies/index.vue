// app/pages/policies/index.vue
<template>
  <div>
    <h1 class="text-3xl text-center font-semibold text-primary-800 mb-6">Policies</h1>
    
    <div class="prose prose-slate max-w-none">
      <p class="mb-4">
        To paraphrase the butler in
        <a href="https://www.youtube.com/watch?v=WiZ8D9akdV4" target="_blank" class="text-primary-600 hover:text-primary-800 transition-colors">Indiana Jones and the Last Crusade</a>, 
        this is a law firm, and we have many rules. Fortunately they make a lot of sense, and you
        probably already intuitively know how a law firm, attorneys, and attorneys' staff members
        should act. Basically, it's "Do the right thing."
      </p>
      
      <p class="text-slate-700 mb-6">
        To learn specifics of what that means in different situations, you can read our policies here.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <NuxtLink to="/policies/fees" class="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 transition-colors rounded-md text-primary-700 font-medium">
          Fees and Other Policies
        </NuxtLink>
        <NuxtLink to="/policies/unbundled" class="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 transition-colors rounded-md text-primary-700 font-medium">
          Unbundled Services
        </NuxtLink>
        <NuxtLink to="/policies/privacy" class="flex items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 transition-colors rounded-md text-primary-700 font-medium">
          Privacy Policy
        </NuxtLink>
      </div>
      
      <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md">
        <p class="text-slate-800">
          Oh, the one real important thing that may not be real intuitive: reading something on this
          web site does not mean that you have an attorney representing you and giving you legal
          advice. We will always send an engagement letter to a new client. This letter is the only
          way we agree to be your attorney. Ever.
        </p>
      </div>
    </div>
  </div>
</template>