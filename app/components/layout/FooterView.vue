<template>
  <footer class="bg-primary-800 py-6 text-slate-200">
    <div class="grid px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 md:py-10 grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
      <div class="">
        <h1 class="text-xl sm:text-2xl pb-3 sm:pb-5">
          <NuxtLink to="/contact-us">The Law Offices of Owen Hathaway</NuxtLink>
        </h1>
        <div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0">
            <div class="mb-4 sm:mb-0">
              <h5 class="underline">
                Primary Office
              </h5>
              <ul class="ms-2 sm:ms-5 list-none pl-0">
                <li>2580 E Harmony Rd</li>
                <li>Suite 201</li>
                <li>Fort Collins, CO 80528</li>
              </ul>
            </div>
            <div class="mb-4 sm:mb-0">
              <h5 class="underline">
                Mailing Address
              </h5>
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
                <font-awesome-icon icon="fas fa-phone" fixed-width />
                <a class="text-white ml-2" href="tel:+19708183052" title="call us">
                  970-818-3052
                </a>
              </li>
              <li class="m-1 sm:m-2">
                <font-awesome-icon icon="fas fa-comment-sms" fixed-width />
                <a class="text-white ml-2" href="sms://+19708185558" title="text us">
                  970-818-5559
                </a>
              </li>
              <li class="m-1 sm:m-2">
                <font-awesome-icon icon="fas fa-fax" fixed-width />
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
      <div class="grid mt-6 lg:mt-0 gap-6">
        <div>
          <!-- <NewsletterSignupForm /> -->
        </div>
        <div>
          <TestimonialCarousel />
        </div>
        <div>
          <h5 class="text-xl pb-3 underline">
            Helpful Resources
          </h5>
          <ul class="list-none pl-0 space-y-2">
            <li class="flex items-start">
              <i class="pi pi-file-edit text-slate-300 mt-1 mr-3" />
              <NuxtLink to="/policies" class="text-slate-200 hover:text-white">
                Our Terms and Conditions
              </NuxtLink>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://www.coloradojudicial.gov/self-help-forms"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                Colorado Courts Self-Help Forms
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://www.211colorado.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
                title="211 Colorado streamlines services and provides one central location where people can get connected to the resources they need."
              >
                211 Colorado - Database of Resources
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://www.healthfirstcolorado.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                Health First Colorado (Medicaid)
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://www.medicaidplanningassistance.org"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                American Council on Aging - Medicaid Planning
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://www.sciencecare.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                Science Care - Donate Your Body
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://ohlawco.kidsprotectionplan.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                Kids Protection Plan
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://moneysharp.org"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                Money Sharp - Bankruptcy Courses
              </a>
            </li>
            <li class="flex items-start">
              <i class="pi pi-external-link text-slate-300 mt-1 mr-3" />
              <a
                href="https://ndc.org"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-200 hover:text-white"
              >
                National Bankruptcy Data
              </a>
            </li>
          </ul>
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
