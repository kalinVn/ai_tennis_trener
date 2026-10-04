<script setup>
defineProps({
  idPrefix: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  cardholderDisplay: { type: String, required: true },
  cardNumberDisplay: { type: String, required: true },
  expiryDisplay: { type: String, required: true },
  securityCodeDisplay: { type: String, required: true },
})
</script>

<template>
  <section class="panel" :aria-labelledby="`${idPrefix}-heading`">
    <h2 :id="`${idPrefix}-heading`">{{ title }}</h2>
    <p :id="`${idPrefix}-help`">{{ description }}</p>
    <div class="form-grid" :aria-describedby="`${idPrefix}-help`">
      <div class="field wide"><label :for="`${idPrefix}-cardholder`">Cardholder name</label><input :id="`${idPrefix}-cardholder`" :value="cardholderDisplay" disabled></div>
      <div class="field wide"><label :for="`${idPrefix}-card-number`">Card number</label><input :id="`${idPrefix}-card-number`" :value="cardNumberDisplay" disabled></div>
      <div class="field"><label :for="`${idPrefix}-expiry`">Expiry date</label><input :id="`${idPrefix}-expiry`" :value="expiryDisplay" disabled></div>
      <div class="field"><label :for="`${idPrefix}-cvc`">Security code</label><input :id="`${idPrefix}-cvc`" :value="securityCodeDisplay" disabled></div>
    </div>
  </section>
</template>
