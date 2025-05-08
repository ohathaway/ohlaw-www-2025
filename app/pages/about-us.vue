<template>
  <div class="about-us-container">
    <!-- Hero Section -->
    <section class="relative py-4 text-white">
      <div class="absolute inset-0" 
           :style="backgroundStyleHero">
      </div>
      <div class="container mx-auto px-4 py-[5rem] relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">About Us: A Family Serving Families</h1>
          <div class="mt-4 text-xl">
            <p>Every law firm claims to be "different." Every law firm claims to care about their clients' needs above all else. Every law firm claims to have "the world's greatest attorneys."</p>
            <div class="mt-6 p-4 bg-white/20 rounded-md">
              <p>We stake a more modest claim:</p>
              <p class="font-bold italic mt-2">
                We are a family that operates a small business helping other families and small businesses establish and maintain rock-solid legal foundations that support the lives and dreams they're building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Family First Section -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="order-2 md:order-1">
            <div class="p-4">
              <h2 class="text-3xl font-semibold text-center mb-6 relative">
                Family First
                <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
              </h2>
              <p class="mb-4">Like most families, it has been a long and winding road to where we are today. We were married in 2000, just after the <a href="https://en.wikipedia.org/wiki/Year_2000_problem" title="Y2k Problem" target="_blank" class="text-primary-600 hover:text-primary-800 underline">Y2k bug</a> blew up (or maybe it didn't) all the world's computers. I was running IT departments for hospitals, and Michelle had just finished college.</p>
              <p>Not long after, with a baby on the way, we both decided that it was important for us that someone, in our case Michelle, be a full-time parent for our kids. That decision and the values we hold that led to it have been central to every decision we've made together ever since.</p>
            </div>
          </div>
          <div class="order-1 md:order-2">
            <div class="rounded-lg overflow-hidden shadow-lg">
              <NuxtImg
                src="/img/IMG_5943.webp"
                alt="Family photo"
                class="w-full h-auto"
                provider="cloudflare"
              />
              <div class="p-3 bg-slate-100 text-sm italic text-slate-600">
                Strangely this is the closest thing we have to a photo of our family at the moment. This is Owen and all his brothers and sisters at our oldest daughter's wedding.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Callout -->
    <section class="py-12 bg-primary-800 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div class="p-6 border-l-4 border-r-4 border-white/30">
            <i class="pi pi-quote-right text-5xl mb-4 opacity-50"></i>
            <p class="text-2xl md:text-3xl italic">"Make money by doing good things and build cool stuff.</p>
            <p class="text-2xl md:text-3xl italic">Let's do some good together and build a cool life for you while we're at it."</p>
            <div class="mt-4 text-lg">— Owen</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lawyer Second Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div class="rounded-lg overflow-hidden shadow-lg">
              <NuxtImg
                src="/img/it2lawyer2.webp"
                alt="Lawyer Second"
                class="w-full h-auto"
                provider="cloudflare"
              />
            </div>
          </div>
          <div>
            <div class="p-4">
              <h2 class="text-3xl font-semibold text-center mb-6 relative">
                Lawyer Second
                <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
              </h2>
              <p class="mb-4">Then my work told me I had to implement this new law called HIPAA. Believe it or not, this led to a new love affair... the law.</p>
              <p class="mb-4">You see, I had always been fascinated with The Way Things Work (not just the book, but for real too). It turns out that one way of being a lawyer is to know how things work and use that knowledge to serve your community.</p>
              <p>So off to law school in Denver while starting our first business selling Jeep accessories online, working as a full-time tech consultant helping spend $16 million in federal grant money, and still driving the kids (three now) to school every morning.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Building Businesses Section (with sidebar) -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-4 gap-8">
          <div class="col-span-4 md:col-span-3">
            <div class="p-4">
              <h2 class="text-3xl font-semibold text-center mb-6 relative">
                Building Businesses
                <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
              </h2>
              <p class="mb-4">Shortly after I passed the bar, one of my clients asked me to join their small, family-owned private equity firm. They bought and operated technology-forward healthcare service companies, and it seemed like a natural fit.</p>
              <p class="mb-4">Together, we bought and built companies until I realized that the private equity game isn't in my blood the way building around passion is. It was also time to stop driving 90 miles to work every day.</p>
              <p>Meanwhile, Michelle had started a part-time job, mostly as something to do, and it wasn't working out very well. So we decided to start a business where the two of us could build something together.</p>
            </div>
          </div>
          <div class="col-span-4 md:col-span-1 md:me-8">
            <div class="bg-stone-700 text-white p-4 rounded-lg h-full shadow-lg">
              <h4 class="text-xl font-semibold mb-3">We Know Because We've Been There</h4>
              <p class="mb-4">We've owned multiple businesses and understand the challenges entrepreneurs face because we've lived them.</p>
              <hr class="my-3 border-white/30">
              <p class="italic mb-0">Our experience building businesses gives us a unique perspective on the practical legal needs of small business owners.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Putting it All Together Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="order-2 md:order-1">
            <div class="p-4">
              <h2 class="text-3xl font-semibold text-center mb-6 relative">
                Putting it All Together
                <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
              </h2>
              <p class="mb-4">When it comes to family-owned businesses, it's super important not to forget the "family" part. That means our business needed to be able to serve families as well as businesses.</p>
              <p class="mb-4">Families come in all sorts of configurations, colors, backgrounds, and economic conditions. As people who value serving others, Michelle and I wanted to be able to provide a high-value experience to any family, not just upper-middle-class or wealthy families. And we didn't want to help take them apart as a so-called "family lawyer."</p>
              <p class="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-md">
                <strong>We aim to be able to meaningfully serve any family. I like to say, "we can get you from the outhouse to the penthouse."<a href="#sayings" class="text-primary-600 hover:underline">*</a></strong>
              </p>
            </div>
          </div>
          <div class="order-1 md:order-2">
            <div class="rounded-lg overflow-hidden shadow-lg">
              <NuxtImg
                src="/img/business1_1024.webp"
                alt="All Together"
                class="w-full h-auto"
                provider="cloudflare"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Personal Family Lawyer Section -->
    <section id="pfl" class="py-16 bg-slate-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-5">
            <NuxtImg
              src="/img/PFL_StackedLogo_FullColor.png"
              alt="Personal Family Lawyer Logo"
              class="max-w-full h-auto mx-auto"
              provider="cloudflare"
            />
          </div>
          <div class="md:col-span-7">
            <div class="p-4">
              <h2 class="text-3xl font-semibold text-center mb-6 relative">
                The Perfect Partnership
                <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
              </h2>
              <p class="mb-4">I'm excited to announce that I've joined the Personal Family Lawyer® network, which perfectly aligns with the approach to legal services we've always believed in.</p>
              <p class="mb-4">This partnership strengthens our commitment to serving families at every stage of life. The PFL philosophy mirrors our own: transparent fixed fees, personalized service, and going beyond document preparation to create meaningful legal solutions that truly protect what matters most.</p>
              <div class="bg-primary-700 text-white p-4 rounded-lg shadow-md">
                <p class="font-semibold mb-2">The PFL Promise:</p>
                <p class="italic pl-4">Planning that works to keep your family out of court and out of conflict while protecting everything you care about from predators and the government - keeping it all in your chosen family's hands.</p>
              </div>
              <p class="mt-4">While we've always aimed to make legal services affordable and accessible to everyone—from <span class="italic">the outhouse to the penthouse</span>—the PFL system has equipped us with additional systems and processes to deliver even more value to the families we serve.</p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <h5 class="text-xl italic font-semibold mb-8">The Personal Family Lawyer approach reinforces our existing commitments while adding these valuable dimensions:</h5>
        
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md h-full text-center">
              <i class="pi pi-calendar text-5xl text-primary-500 mb-4"></i>
              <h4 class="text-xl font-semibold mb-3">3-Meeting Process</h4>
              <p>A structured approach that ensures your planning gets done right and nothing falls through the cracks—complementing our commitment to thoroughness and personalized service.</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md h-full text-center">
              <i class="pi pi-shield text-5xl text-primary-500 mb-4"></i>
              <h4 class="text-xl font-semibold mb-3">Proven Systems</h4>
              <p>Access to battle-tested estate planning systems that enhance our ability to serve you—aligning perfectly with our goal of delivering high-value experiences to all families.</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md h-full text-center">
              <i class="pi pi-sync text-5xl text-primary-500 mb-4"></i>
              <h4 class="text-xl font-semibold mb-3">3-Year Review Process</h4>
              <p>Regular plan reviews ensure your plan stays up-to-date as your life changes—because we believe legal planning should evolve with your family's journey.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Unique Approach Section (with cards) -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-12">
          <h2 class="text-3xl font-semibold mb-6 relative inline-block">
            Our Unique Approach
            <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
          </h2>
          <p class="text-xl">That's why we chose to build the array of services we offer:</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <div class="p-6 h-[360px]">
              <div class="text-center mb-4">
                <i class="pi pi-arrow-circle-up text-5xl text-stone-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-center">Heart-centered Bankruptcy</h3>
              <p>Helping folks in debt crisis find the right solution. We understand that financial challenges can happen to anyone, and we approach each case with compassion.</p>
            </div>
            <div class="bg-primary-700 text-white text-center py-3">
              <NuxtLink to="/services/bankruptcy" class="text-white hover:text-white/90 no-underline">
                Learn More <i class="pi pi-arrow-right ml-2" style="font-size: 1rem;"></i>
              </NuxtLink>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <div class="p-6 h-[360px]">
              <div class="text-center mb-4">
                <i class="pi pi-home text-5xl text-stone-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-center">Special Flavor of Estate Planning</h3>
              <p>Building solid foundations for families' futures. Our estate planning goes beyond just document preparation to help you protect what matters most.</p>
            </div>
            <div class="bg-primary-700 text-white text-center py-3">
              <NuxtLink to="/services/estate-planning" class="text-white hover:text-white/90 no-underline">
                Learn More <i class="pi pi-arrow-right ml-2" style="font-size: 1rem;"></i>
              </NuxtLink>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <div class="p-6 h-[360px]">
              <div class="text-center mb-4">
                <i class="pi pi-briefcase text-5xl text-stone-500"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-center">Unique Small Business Program</h3>
              <p>Helping entrepreneurs build on strong legal ground. We understand small businesses because we've built them ourselves.</p>
            </div>
            <div class="bg-primary-700 text-white text-center py-3">
              <NuxtLink to="/services/small-business" class="text-white hover:text-white/90 no-underline">
                Learn More <i class="pi pi-arrow-right ml-2" style="font-size: 1rem;"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Accessibility & Transparency Section -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center">
            <h2 class="text-3xl font-semibold mb-6 relative inline-block">
              Accessibility & Transparency
              <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div class="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:bg-slate-50">
                <i class="pi pi-wallet text-stone-500 mb-4"></i>
                <h4 class="text-xl font-semibold mb-3">Fixed Fees</h4>
                <p>Almost everything we do for our clients, we offer at a fixed fee. If we can't offer you a fixed price, we will always commit to a budget set by you.</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:bg-slate-50">
                <i class="pi pi-home text-5xl text-stone-500 mb-4"></i>
                <h4 class="text-xl font-semibold mb-3">We Come To You</h4>
                <p>We keep our costs down by not maintaining a permanent office. We will even come to your home to meet with you.</p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:bg-slate-50">
                <i class="pi pi-users text-5xl text-stone-500 mb-4"></i>
                <h4 class="text-xl font-semibold mb-3">For Everyone</h4>
                <p>We think this transparency, affordability, and accessibility make our services available to people who may not think they can actually hire a lawyer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-semibold mb-6 relative inline-block">
              What Our Clients Say
              <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
            </h2>
          </div>
          
          <TestimonialCarousel />
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold mb-6">Ready to Build Something Together?</h2>
          <p class="text-xl mb-8">Whether you're facing financial challenges, planning for your family's future, or building a business, we're here to help you create a solid foundation.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <NuxtLink to="/contact" class="bg-white text-primary-700 hover:bg-slate-100 px-8 py-3 rounded-md uppercase text-sm font-medium tracking-wider transition-all duration-300">
              Get in Touch
            </NuxtLink>
            <NuxtLink to="/services" class="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md uppercase text-sm font-medium tracking-wider transition-all duration-300">
              Explore Our Services
            </NuxtLink>
          </div>
          <p id="sayings" class="mt-6 italic text-sm text-white/80">* Actually, I have dozens of sayings I try to live by, but this is the one that applies here. As we work together, you can find out about The Belly Button Principle, and how "good enough ain't," and all the others.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead(useSeo({
  title: 'About The Law Offices of Owen Hathaway | A Family Serving Families',
  description: 'Learn about our family-run law firm helping other families and small businesses establish solid legal foundations that support their lives and dreams.'
}))

const backgroundStyleHero = useBackgroundStyle({ image: '/img/3genfamily1.webp' })
</script>

<style scoped>
.pi { font-size: 3rem; }
</style>