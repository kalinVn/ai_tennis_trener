import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Checkout from '../../../components/features/checkout/Checkout.vue'

const target = document.getElementById('checkout-cards-root')
if (target) createApp(Checkout).use(createPinia()).mount(target)
