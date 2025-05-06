<template>
  <!-- Hero Section -->
  <ServicesHero
    title="Protect Your Firearms Legacy with a Gun Trust"
    subtitle="Legal protection for your firearms collection that ensures compliance and peace of mind"
    backgroundImage="/img/gun_safe.webp"
    buttonText="Schedule a Free Consultation"
    @buttonClick="openNewWindow('https://booking.ohlawcolorado.com/new-client')"
  />

  <!-- What is a Gun Trust? -->
  <ServicesIntro
    title="What Is A Gun Trust?"
    description="As a responsible firearm owner, you already have plans for safe storage, safe transport, safe carry, and safe use. Some day you are going to reach a day when you aren't in charge of your own destiny anymore. Life's journey has the same ending for all of us. You need a plan for your firearms for that day.<br><br>There are two types of firearm legacy plans: the legal way (a gun trust), and the other way (which doesn't necessarily mean illegal, but you fill in the blanks). We help folks design and implement plans the legal way."
    imageSource="/img/gun_trust.webp"
    imageProvider="cloudflare"
    imageTitle="Gun Trust"
    buttonText="Schedule a Confidential Conversation Today"
    @buttonClick="openNewWindow('https://booking.ohlawcolorado.com/new-client')"
  />

  <!-- Key Benefits of a Gun Trust -->
  <ServicesFeatures
    title="Key Benefits of a Gun Trust"
    background="light"
    :features="[
      {
        title: 'Legal Compliance',
        description: 'Ensure your firearms are managed in compliance with federal and state laws',
        icon: 'shield-check'
      },
      {
        title: 'Streamlined Process for NFA Items',
        description: 'Reduce redundant paperwork and legal requirements for items regulated by the National Firearms Act',
        icon: 'file-check'
      },
      {
        title: 'Privacy',
        description: 'Enhance privacy in firearm ownership',
        icon: 'eye-slash'
      }
    ]"
  />

  <!-- What a Gun Trust Can and Can't Do -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card class="h-full">
          <template #title>
            <h3 class="text-xl font-semibold mb-4 text-primary-700">What a Gun Trust <span class="underline">Can</span> Do</h3>
          </template>
          <template #content>
            <ul class="space-y-3">
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Legally own and manage NFA firearms (silencers, short-barreled rifles, etc.)</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Allow multiple trustees to possess and use trust-owned firearms</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Simplify the gift of firearms to beneficiaries</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Keep your firearms collection private (unlike probate)</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Potentially reduce liability for accidental misuse</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Provide clear instructions for handling your firearms after you're gone</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Make it easier to transport NFA items across state lines</span>
              </li>
              <li class="flex">
                <i class="pi pi-check-circle text-primary-500 mr-3 mt-1"></i>
                <span>Help prevent "accidental felonies"</span>
              </li>
            </ul>
          </template>
        </Card>
        
        <Card class="h-full">
          <template #title>
            <h3 class="text-xl font-semibold mb-4 text-primary-700">What a Gun Trust <span class="underline">Cannot</span> Do</h3>
          </template>
          <template #content>
            <ul class="space-y-3">
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Make illegal firearms suddenly legal (<i>I used to make a joke about California folks here... but I live in Colorado</i>)</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Bypass background checks or waiting periods</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Allow prohibited persons to possess firearms</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Guarantee you'll hit the side of a barn (that's still on you)</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Automatically register firearms across state lines (for folks who must do so)</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Replace proper firearms training and safety practices</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Make you immune to firearms laws and regulations</span>
              </li>
              <li class="flex">
                <i class="pi pi-times-circle text-red-500 mr-3 mt-1"></i>
                <span>Turn you into John Wick (but it might make you feel a bit cooler)</span>
              </li>
            </ul>
          </template>
        </Card>
      </div>
    </div>
  </section>

  <!-- Our Gun Trust Process -->
  <ServicesProcess
    id="gun-trust-process"
    title="Our Gun Trust Process"
    background="secondary"
    :processSteps="gunTrustTimeline"
  />

  <!-- FAQ Accordion -->
  <section class="py-5">
    <div class="container w-3xl mx-auto">
      <h2 class="text-center mb-5">Frequently Asked Questions</h2>
      <FaqAccordion :faqItems="gunTrustFaq" />
    </div>
  </section>

  <!-- CTA Section -->
  <ServicesCta
    title="Navigate the legal minefield with fellow enthusiasts who get it"
    description="Protect your collection and your rights - without the stuffy lawyer act."
    buttonText="Talk Guns & Law: Free Consultation"
    @buttonClick="openNewWindow('https://booking.ohlawcolorado.com/new-client')"
  />
</template>

<script setup>
import { onMounted } from 'vue';
import { useHead } from '#imports';

useHead({
  title: 'Gun Trust Services - Protect Your Firearms Legacy',
  meta: [
    {
      name: 'description',
      content: 'Protect your firearms legacy with a legally sound gun trust. Learn what a gun trust is, why you need one, and why you should choose our expert services.'
    }
  ]
});

// Method to open new window
const openNewWindow = (url) => {
  window.open(url, '_blank');
};

const gunTrustTimeline = [
  {
    title: 'Homework',
    description: `Before we meet for the first time, we need you to do a little homework assignment. This is a short, very general, survey about your needs, worries, and classes of firearms.`,
    content: `Before we meet for the first time, we need you to do a little homework assignment. This is a short, very general, survey about your needs, worries, and classes of firearms.`
  },
  {
    title: 'Initial Consultation',
    description: `We start with a free, confidential, no-obligation conversation. This is a chance for you to educate yourself on your options and ask lots of questions.`,
    content: `We start with a free, confidential, no-obligation conversation. This is a chance for you to educate yourself on your options and ask lots of questions.`
  },
  {
    title: 'Inventory and Fact Check',
    description: 'To make sure we can help you do all the transfers necessary to manage your trust correctly, we need an inventory of your firearms, complete with serial numbers. We also will confirm all the key details of your specific trust.',
    content: `To make sure we can help you do all the transfers necessary to manage your trust correctly, we need an inventory of your firearms, complete with serial numbers. We like to have pics too. We also will confirm all the key details of your specific trust in a confirmation document.`
  },
  {
    title: 'Document Delivery',
    description: `After drafting the documents for your trust, we'll get together to sign everything and train you on how to use your gun trust.`,
    content: `After drafting the documents for your trust, we'll get together to sign everything and train you on how to use your gun trust.`
  },
  {
    title: 'Transfers',
    description: `We'll initially fund your trust with $10 to make it a legally binding trust. The next step is to actually transfer your firearms into the trust's ownership.`,
    content: `We'll initially fund your trust with $10 to make it a legally binding trust. The next step is the one where we see the most mistakes. You need to actually transfer your firearms into the trusts ownership. If you're a gun owner, you know what a transfer is. If you're new to this stuff, we'll explain it to you.`
  },
  {
    title: 'Compliance',
    description: `Your gun trust is a tool for you to use while you are alive. We'll check in annually to keep you up to date with changing laws.`,
    content: `While it is a part of a comprehensive estate plan, your gun trust is a tool for you to use while you are alive. Gun laws change, seemingly every other week these days. That seems a little often to talk with your attorney, so we make sure to do a check-in annually to keep you up to date and strategize on any changes you need to make.`
  },
  {
    title: 'Succession',
    description: `Your gun trust will include instructions on what to do with your firearms when your day comes.`,
    content: `Everyone's gotta go some day. Your gun trust will include instructions on what to do with your firearms when your day comes. If you have children or grandchildren, your family may not have to do anything. If you want the firearms to be turned into cash, someone will have to do that work.`
  }
];

const gunTrustFaq = [
  {
    question: 'Why is a gun trust Different from a standard trust?',
    answer:
      `A gun trust:
      <ul class="list-disc pl-5 space-y-2">
        <li>Is specifically designed to comply with federal and state firearm laws</li>
        <li>Includes provisions for handling NFA items in compliance with federal law</li>
        <li>Provides for measures to avoid allowing prohibited persons to possess your firearms</li>
        <li>Addresses issues unique to firearm ownership, such as prohibited persons</li>
        <li>Can include instructions for safe handling and storage of firearms</li>
        <li>May require regular review and updates to stay current with changing firearm laws</li>
      </ul>
      `
  },
  {
    question: 'Why does a gun trust need to handle prohibited persons?',
    answer:
      `Both federal and state statutes define a variety of classes of person who is not allowed to possess firearms. Examples include:
      <ul class="list-disc pl-5 space-y-2">
        <li>Convicted felons</li>
        <li>Persons with certain mental health conditions</li>
        <li>Drug addicts, including (maybe) marijuana</li>
        <li>Domestic violence offenders</li>
        <li>Dishonorably discharged veterans</li>
        <li>Illegal aliens</li>
      </ul>
      `
  },
  {
    question: 'Are marijuana users prohibited persons?',
    answer:
      `<p>Ready for a lawyer answer? &hellip;</p>
      <p>It depends</p>
      <p>While some states have legalized marijuana use, it remains illegal under federal law. The Bureau of Alcohol, Tobacco, Firearms and Explosives (ATF) considers any marijuana user, including those in states where it's legal, to <a href="https://www.atf.gov/news/press-releases/atf-provides-clarification-related-new-minnesota-marijuana-law" title="ATF Provides Clarification Related to New Minnesota Marijuana Law" target="_blank" class="text-primary-600 hover:underline">be a prohibited person</a>. We help you make rules in your gun trust on how to handle prohibited persons, including marijuana users, who might be co-trustees on your trust.</p>
      `
  },
  {
    question: 'What is an accidental felony?',
    answer:
    `<p>We use the term <i>accidental felonies</i> to describe unintentional violations of firearm laws that can result in felony charges. Even honest mistakes can lead to serious legal consequences.</p>
    <p>Common scenarios include:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Improper handling of NFA items</li>
      <li>Unknowingly allowing a prohibited person to access firearms</li>
      <li>Unknowingly becoming a prohibited person while possessing a firearm</li>
      <li>Misunderstanding state lines and travel restrictions</li>
      <li>Incorrectly filling out firearms-related forms</li>
    </ul>
    <p>A gun trust can provide insurance against some of these felonies, even if it's only to make sure you don't have to surrender your firearms permanently to the government.</p>
    `
  },
  {
    question: 'Who needs a gun trust?',
    answer:
      `<p>We can make an argument that you need a gun trust if you own more than one firearm. But the folks who really need one are:</p>
      <ul class="pl-5 space-y-2">
        <li>Collectors with extensive firearm collections</li>
        <li>Owners of NFA items</li>
        <li>Those who want to create a legacy plan for their firearms collection</li>
        <li>Folks concerned about privacy in firearm ownership</li>
        <li>Gun owners who want to allow family members to use their firearms legally</li>
        <li>Those concerned about potential future changes in the status of family members or other trustees</li>
        <li>Individuals in states with legalized marijuana who want to ensure compliance with both state and federal laws</li>
        <li>Any firearm owner concerned about accidentally violating complex gun laws</li>
      </ul>
      `
  },
  {
    question: 'What are NFA items?',
    answer:
      `<p>The following weapons are regulated under the <a href="https://www.atf.gov/node/29381" title="Firearms - Guides - Importation & Verification of Firearms, Ammunition and Implements of War - ATF Form 4590 - Factoring Criteria for Weapons" target="_blank" class="text-primary-600 hover:underline">National Firearms Act (NFA)</a>:</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>A shotgun having a barrel or barrels of less than 18 inches in length;</li>
        <li>A weapon made from a shotgun if such weapon as modified has an overall length of less than 26 inches or a barrel or barrels of less than 18 inches in length;</li>
        <li>A rifle having a barrel or barrels of less than 16 inches in length;</li>
        <li>A weapon made from a rifle if such weapon as modified has an overall length of less than 26 inches or a barrel or barrels of less than 16 inches in length;</li>
        <li>Any other weapon, as defined in subsection (e);</li>
        <li>A machinegun;</li>
        <li>Any silencer (as defined in section 921 of title 18, United States Code); and</li>
        <li>A destructive device.</li>
      </ol>
      `
  }
];
</script>