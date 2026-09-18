<script setup>
/** A readout styled after the in-sim speed/gear overlay: big number, small unit. */
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  value: { type: [Number, String], required: true },
  label: { type: String, required: true },
  decimals: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
  tone: { type: String, default: '' }, // 'ppo' | 'bc' | ''
  animate: { type: Boolean, default: true }
})

const shown = ref(props.animate && typeof props.value === 'number' ? 0 : props.value)
const root = ref(null)
let raf = null

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function run() {
  if (typeof props.value !== 'number' || !props.animate || reduced) {
    shown.value = props.value
    return
  }
  const dur = 1100
  const start = performance.now()
  const from = 0
  const to = props.value
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur)
    const e = 1 - Math.pow(1 - p, 3)
    shown.value = from + (to - from) * e
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!root.value || typeof IntersectionObserver === 'undefined') return run()
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        run()
        io.disconnect()
      }
    },
    { threshold: 0.4 }
  )
  io.observe(root.value)
  onUnmounted(() => io.disconnect())
})

watch(() => props.value, run)
onUnmounted(() => raf && cancelAnimationFrame(raf))

function format(v) {
  return typeof v === 'number' ? v.toFixed(props.decimals) : v
}
</script>

<template>
  <div ref="root" class="hud" :class="tone ? `hud--${tone}` : ''">
    <span class="hud-value">{{ format(shown) }}<i v-if="suffix">{{ suffix }}</i></span>
    <span class="hud-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.hud { display: grid; gap: 7px; }
.hud-value i { font-style: normal; font-size: 0.42em; margin-left: 4px; color: var(--dim); }
.hud--ppo .hud-value { color: var(--kerb); }
.hud--bc .hud-value { color: var(--bc); }
</style>
