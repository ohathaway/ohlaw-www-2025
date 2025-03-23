<template>
  <FormKit
    type="form"
    :actions="false"
    wrapper-class="subscribe-form"
    #default="{ state: { valid } }"
    @submit="handleSubscribe"
  >
    <FormKit
      type="text"
      id="first_name"
      name="first_name"
      label="First Name"
      validation="required|alpha_spaces"
      validation-visibility="dirty"
    />
    <FormKit
      type="text"
      id="last_name"
      name="last_name"
      label="Last Name"
      validation="required|alpha_spaces"
      validation-visibility="dirty"
    />
    <FormKit
      type="email"
      id="email"
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
</template>

<script setup>
const handleSubscribe = () => true
</script>