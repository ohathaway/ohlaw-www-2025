<template>
  <footer class="bg-primary-800 py-6 text-slate-200">
    <div class="grid px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 md:py-10 grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
      <div class="">
        <h5 class="text-xl sm:text-2xl pb-3 sm:pb-5"><NuxtLink to="/contact-us">The Law Offices of Owen Hathaway</NuxtLink></h5>
        <div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0">
            <div class="mb-4 sm:mb-0">
              <h5 class="underline">Primary Office</h5>
              <ul class="ms-2 sm:ms-5 list-none pl-0">
                <li>2580 E Harmony Rd</li>
                <li>Suite 201</li>
                <li>Fort Collins, CO 80528</li>
              </ul>
            </div>
            <div class="mb-4 sm:mb-0">
              <h5 class="underline">Mailing Address</h5>
              <ul class="ms-2 sm:ms-5 list-none pl-0">
                <li>2601 S Lemay Ave</li>
                <li>Suite 7-232</li>
                <li>Fort Collins, CO 80525</li>
              </ul>
            </div>
            <div class="py-3 sm:py-5 col-span-1 sm:col-span-2">
              <NuxtLink to="/contact-us#visit-us">Click here to find our other locations and get directions</NuxtLink>
            </div>
            <div class="pb-3 sm:pb-5 col-span-1 sm:col-span-2">
              <p>We are only available at the office by appointment.</p>
              <p><a href="/contact-us/#schedule">Please click here to book a time to meet</a></p>
            </div>
          </div>
          <ClientOnly>
            <ul class="flex flex-col sm:flex-row sm:inline-flex list-none pl-0 gap-2 sm:gap-0">
              <li class="m-1 sm:m-2"> 
                <font-awesome-icon icon="fas fa-phone" fixed-width></font-awesome-icon>
                <a class="text-white ml-2" href="tel:+19708183052" title="call us">
                  970-818-3052
                </a>
              </li>
              <li class="m-1 sm:m-2">
                <font-awesome-icon icon="fas fa-comment-sms" fixed-width></font-awesome-icon>
                <a class="text-white ml-2" href="sms://+19708185558" title="text us">
                  970-818-5559
                </a>
              </li>
              <li class="m-1 sm:m-2">
                <font-awesome-icon icon="fas fa-fax" fixed-width></font-awesome-icon>
                <span class="ml-2" title="fax us">970-360-7028</span>
              </li>
              <!--
              <li class="my-2">
                <font-awesome-icon icon="far fa-calendar-days" fixed-width></font-awesome-icon>
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
              -->
            </ul>

          </ClientOnly>
        </div>
      </div>
      <div class="grid mt-6 lg:mt-0">
        <div>
          <!-- <NewsletterSignupForm /> -->
        </div>
        <div>
          <TestimonialCarousel />
        </div>
      </div>
    </div>
    <div class="container mx-auto px-4 sm:px-6 text-center sm:text-left">
      <p class="text-sm sm:text-base">
        © 2025 OHLaw Colorado <span class="hidden sm:inline">&nbsp;&nbsp;|&nbsp;&nbsp;</span><br class="sm:hidden">
        <NuxtLink to="/policies/privacy">Privacy Policy</NuxtLink> <span class="hidden sm:inline">&nbsp;&nbsp;|&nbsp;&nbsp;</span><br class="sm:hidden">
        <NuxtLink to="/policies/terms-of-use">Terms of Use</NuxtLink>
      </p>
    </div>
  </footer> 
</template>