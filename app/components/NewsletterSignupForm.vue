<template>
  <ClientOnly>
    <FormKit
      v-slot="{ state: { valid } }"
      type="form"
      :actions="false"
      wrapper-class="subscribe-form"
      @submit="handleSubscribe"
    >
      <FormKit
        id="first_name"
        type="text"
        name="first_name"
        label="First Name"
        validation="required|alpha_spaces"
        validation-visibility="dirty"
      />
      <FormKit
        id="last_name"
        type="text"
        name="last_name"
        label="Last Name"
        validation="required|alpha_spaces"
        validation-visibility="dirty"
      />
      <FormKit
        id="email"
        type="email"
        name="email"
        label="Email"
        validation="required|email"
      />
      <!--
      <FormKit
        type="tel"
        id="phone"
        name="phone"
        label="Phone"
        :delay="1500"
        validation="required|matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
        :validation-messages="{
          matches: 'Phone number must be in the format xxx-xxx-xxxx',
        }"
      />
      -->
      <FormKit type="submit" :disabled="!valid" />
    </FormKit>
  </ClientOnly>
</template>

<script setup>
const handleSubscribe = () => true
</script>
