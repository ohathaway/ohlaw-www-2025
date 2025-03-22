<script setup lang="ts">
import TestimonialCarousel from '../TestimonialCarousel.vue'

</script>

<template>
  <footer class="bg-primary-800 py-6 text-slate-200">
    <div class="grid px-20 py-10 grid-cols-2 gap-4">
      <div class="">
        <h5 class="text-2xl pb-5"><NuxtLink to="/contact-us">Contact Us</NuxtLink></h5>
        <div>
          <div class="grid grid-cols-2">
            <div>
              <h5 class="underline">Primary Office</h5>
              <ul class="ms-5">
                <li>2580 E Harmony Rd</li>
                <li>Suite 201</li>
                <li>Fort Collins, CO 80528</li>
              </ul>
            </div>
            <div>
              <h5 class="underline">Mailing Address</h5>
              <ul class="ms-5">
                <li>2601 S Lemay Ave</li>
                <li>Suite 7-232</li>
                <li>Fort Collins, CO 80525</li>
              </ul>
            </div>
            <div class="p-5 col-span-2">
              <NuxtLink to="/contact-us#locations">Click here to find our other locations and get directions</NuxtLink>
            </div>
            <div class="pb-5 ps-5 col-span-2">
              <p>We are only available at the office by appointment.</p>
              <p><a href="#">Please click here to book a time to meet</a></p>
            </div>
          </div>
          <ClientOnly>
            <ul class="inline-flex">
              <li class="m-2"> 
                <font-awesome-icon icon="fas fa-phone" fixed-width></font-awesome-icon>
                <a class="text-white" href="tel:+19708183052">
                  970-818-3052
                </a>
              </li>
              <li class="m-2">
                <font-awesome-icon icon="fas fa-comment-sms" fixed-width></font-awesome-icon>
                <a class="text-white" href="sms://+19708185558">
                  970-818-5559
                </a>
              </li>
              <li class="m-2">
                <font-awesome-icon icon="fas fa-fax" fixed-width></font-awesome-icon>
                970-360-7028
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
      <div class="grid">
        <div>
          Subscribe
        </div>
        <div>
          <TestimonialCarousel />
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <p>
        © 2025 OH Law Colorado &nbsp;&nbsp;|&nbsp;&nbsp;
        <NuxtLink to="/policies/privacy">Privacy Policy</NuxtLink> &nbsp;&nbsp;|&nbsp;&nbsp;
        <NuxtLink to="/policies/terms-of-use">Terms of Use</NuxtLink>
      </p>
    </div>
  </footer> 
</template>