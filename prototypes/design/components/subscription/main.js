import { createApp } from 'vue'
import Subscription from '../../../components/features/subscription/Subscription.vue'

const target = document.getElementById('subscription-cards-root')
if (target) createApp(Subscription).mount(target)
