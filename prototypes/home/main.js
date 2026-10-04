import { createApp } from 'vue'
import HomePageInfoSection from '../components/sections/HomePageInfoSection.vue'

const target = document.getElementById('home-info-root')
if (target) createApp(HomePageInfoSection).mount(target)
