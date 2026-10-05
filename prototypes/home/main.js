import { createApp } from 'vue'
import HomePageInfoSection from '../components/sections/HomePageInfoSection.vue'

const target = document.getElementById('home-info-root')
if (target) createApp(HomePageInfoSection).mount(target)

import HomePageVideoSlider from '../components/sliders/home-page-video-slider/HomePageVideoSlider.vue'
const sliderTarget = document.getElementById('home-slider-root')
if (sliderTarget) createApp(HomePageVideoSlider).mount(sliderTarget)
