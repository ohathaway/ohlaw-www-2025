<template>
  <div class="relative w-full">
    <!-- SVG Journey Path with Interactive Points -->
    <div class="journey-map relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      <!-- Background SVG Path -->
      <svg class="w-full h-full" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
        <!-- Winding Path Base -->
        <path 
          d="M100,350 C200,330 250,250 350,250 S500,300 650,250 S800,150 900,100" 
          fill="none" 
          stroke="#d1d5db" 
          stroke-width="15" 
          stroke-linecap="round"
        />
        
        <!-- Active Path Segment -->
        <path 
          :d="activePath"
          fill="none" 
          stroke="#f59e0b" 
          stroke-width="15" 
          stroke-linecap="round"
          class="transition-all duration-700"
        />
        
        <!-- Milestone Icons -->
        <g class="milestone-icons">
          <!-- Fresh Start / New Beginning -->
          <circle cx="100" cy="350" r="8" fill="#e5e7eb" />
          
          <!-- Building Business -->
          <circle cx="350" cy="250" r="8" fill="#e5e7eb" />
          
          <!-- Community Impact -->
          <circle cx="650" cy="250" r="8" fill="#e5e7eb" />
          
          <!-- Legacy -->
          <circle cx="900" cy="100" r="8" fill="#e5e7eb" />
        </g>
      </svg>
      
      <!-- Service Stop Points -->
      <button 
        class="absolute bottom-[50px] left-[100px] service-stop transition-all duration-300"
        :class="{'active': activeService === 'rebuilding'}"
        @click="setActiveService('rebuilding')"
      >
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg transition-all duration-300">
          <div class="w-10 h-10">
            <img src="/icons/bankruptcy-icon.svg" alt="Bankruptcy" class="w-full h-full" />
          </div>
        </div>
        <span class="absolute top-full mt-2 whitespace-nowrap text-sm font-semibold">Fresh Start</span>
      </button>
      
      <button 
        class="absolute bottom-[150px] left-[350px] service-stop transition-all duration-300"
        :class="{'active': activeService === 'building'}"
        @click="setActiveService('building')"
      >
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg transition-all duration-300">
          <div class="w-10 h-10">
            <img src="/icons/business-icon.svg" alt="Small Business" class="w-full h-full" />
          </div>
        </div>
        <span class="absolute top-full mt-2 whitespace-nowrap text-sm font-semibold">Building</span>
      </button>
      
      <button 
        class="absolute top-[150px] left-[650px] service-stop transition-all duration-300"
        :class="{'active': activeService === 'growing'}"
        @click="setActiveService('growing')"
      >
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg transition-all duration-300">
          <div class="w-10 h-10">
            <img src="/icons/nonprofit-icon.svg" alt="Nonprofits" class="w-full h-full" />
          </div>
        </div>
        <span class="absolute top-full mt-2 whitespace-nowrap text-sm font-semibold">Growing Impact</span>
      </button>
      
      <button 
        class="absolute top-[100px] left-[900px] service-stop transition-all duration-300"
        :class="{'active': activeService === 'protecting'}"
        @click="setActiveService('protecting')"
      >
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg transition-all duration-300">
          <div class="w-10 h-10">
            <img src="/icons/estate-planning-icon.svg" alt="Estate Planning" class="w-full h-full" />
          </div>
        </div>
        <span class="absolute top-full mt-2 whitespace-nowrap text-sm font-semibold">Legacy Protection</span>
      </button>
    </div>
    
    <!-- Content Panel for Active Service -->
    <div class="service-content bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 mt-8 shadow-lg transition-all duration-500">
      <TransitionGroup name="fade" mode="out-in">
        <!-- Bankruptcy Content -->
        <div v-if="activeService === 'rebuilding'" key="rebuilding" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-amber-300 text-3xl font-semibold mb-4">Starting Fresh</h3>
            <p class="text-white text-lg mb-6">Overcome financial challenges and build a strong foundation for your future.</p>
            <div class="mb-6">
              <h4 class="text-white font-medium mb-2">How we can help:</h4>
              <ul class="text-slate-200">
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Bankruptcy Relief
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Debt Negotiation
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Financial Fresh Start Planning
                </li>
              </ul>
            </div>
            <Button label="Explore Bankruptcy Services" severity="warning" />
          </div>
          <div class="hidden md:block">
            <div class="relative h-60 rounded-lg overflow-hidden">
              <img src="/img/helpinghand_1024.webp" alt="Fresh Start" class="absolute inset-0 object-cover w-full h-full" />
              <div class="absolute inset-0 bg-primary-900 opacity-40"></div>
            </div>
          </div>
        </div>
        
        <!-- Small Business Content -->
        <div v-if="activeService === 'building'" key="building" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-amber-300 text-3xl font-semibold mb-4">Building Your Vision</h3>
            <p class="text-white text-lg mb-6">Create the right legal structure for your business idea to thrive and grow.</p>
            <div class="mb-6">
              <h4 class="text-white font-medium mb-2">How we can help:</h4>
              <ul class="text-slate-200">
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Business Formation
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Contracts & Agreements
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Legal Compliance
                </li>
              </ul>
            </div>
            <Button label="Explore Small Business Services" severity="warning" />
          </div>
          <div class="hidden md:block">
            <div class="relative h-60 rounded-lg overflow-hidden">
              <img src="/img/business1_1024.webp" alt="Building Your Business" class="absolute inset-0 object-cover w-full h-full" />
              <div class="absolute inset-0 bg-primary-900 opacity-40"></div>
            </div>
          </div>
        </div>
        
        <!-- Nonprofit Content -->
        <div v-if="activeService === 'growing'" key="growing" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-amber-300 text-3xl font-semibold mb-4">Expanding Your Impact</h3>
            <p class="text-white text-lg mb-6">Establish an organization that makes a lasting difference in your community.</p>
            <div class="mb-6">
              <h4 class="text-white font-medium mb-2">How we can help:</h4>
              <ul class="text-slate-200">
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Nonprofit Formation
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> 501(c)(3) Applications
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Board Governance
                </li>
              </ul>
            </div>
            <Button label="Explore Nonprofit Services" severity="warning" />
          </div>
          <div class="hidden md:block">
            <div class="relative h-60 rounded-lg overflow-hidden">
              <img src="/img/dotorgtablet_1024.webp" alt="Nonprofit Impact" class="absolute inset-0 object-cover w-full h-full" />
              <div class="absolute inset-0 bg-primary-900 opacity-40"></div>
            </div>
          </div>
        </div>
        
        <!-- Estate Planning Content -->
        <div v-if="activeService === 'protecting'" key="protecting" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-amber-300 text-3xl font-semibold mb-4">Preserving Your Legacy</h3>
            <p class="text-slate-900 text-lg mb-6">Ensure your family and assets are protected for generations to come.</p>
            <div class="mb-6">
              <h4 class="text-white font-medium mb-2">How we can help:</h4>
              <ul class="text-slate-500">
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Estate Planning
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Trusts & Wills
                </li>
                <li class="flex items-center mb-2">
                  <span class="mr-2 text-amber-400">✓</span> Legacy Protection
                </li>
              </ul>
            </div>
            <Button label="Explore Estate Planning Services" severity="warning" />
          </div>
          <div class="hidden md:block">
            <div class="relative h-60 rounded-lg overflow-hidden">
              <img src="/img/estatenotebook_1024.webp" alt="Estate Planning" class="absolute inset-0 object-cover w-full h-full" />
              <div class="absolute inset-0 bg-primary-900 opacity-40"></div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
// Active service state
const activeService = ref('rebuilding');

// Set active service
const setActiveService = (service) => {
  activeService.value = service;
};

// Calculate active path segment based on current service
const activePath = computed(() => {
  switch(activeService.value) {
    case 'rebuilding':
      return 'M100,350 C130,345 150,330 150,330';
    case 'building':
      return 'M100,350 C200,330 250,250 350,250';
    case 'growing':
      return 'M100,350 C200,330 250,250 350,250 S500,300 650,250';
    case 'protecting':
      return 'M100,350 C200,330 250,250 350,250 S500,300 650,250 S800,150 900,100';
    default:
      return '';
  }
});

// Mobile positioning adjustments
const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };
  
  window.addEventListener('resize', checkMobile);
  checkMobile(); // Check initially
  
  return () => {
    window.removeEventListener('resize', checkMobile);
  };
});
</script>

<style scoped>
.service-stop.active .w-16 {
  background-color: #f59e0b;
  transform: scale(1.1);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3);
}

.service-stop:not(.active) {
  opacity: 0.7;
}

.service-stop:hover:not(.active) {
  opacity: 1;
  transform: scale(1.05);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .journey-map {
    transform: scale(0.8);
    transform-origin: left center;
  }
}
</style>