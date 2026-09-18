<script setup>
import SiteRail from './components/SiteRail.vue'
</script>

<template>
  <SiteRail />
  <main class="stage">
    <RouterView v-slot="{ Component }">
      <Transition name="swap" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style>
.stage { position: relative; min-height: 100vh; }

.stage::before {
  content: '';
  position: fixed;
  inset: 0 0 0 var(--rail-w);
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at 70% 0%, #000 0%, transparent 72%);
}

.stage > * { position: relative; z-index: 1; }
</style>
