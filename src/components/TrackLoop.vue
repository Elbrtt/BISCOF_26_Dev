<script setup>
/**
 * Top-down view of the closed-loop track, drawn from the same geometry the
 * simulation uses: an outer barrier, a kerb ring, the asphalt band and the
 * spline that defines the racing line. Cars run on the spline.
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  cars: { type: Number, default: 8 },
  color: { type: String, default: 'var(--kerb)' },
  speed: { type: Number, default: 1 },
  jitter: { type: Boolean, default: true }
})

const t = ref(0)
let raf = null
let last = 0
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const R = 122
const CX = 160
const CY = 160

// a fixed per-car offset so the pack never looks metronomic
const offsets = computed(() =>
  Array.from({ length: props.cars }, (_, i) => ({
    phase: i / props.cars,
    wobble: props.jitter ? 0.12 + ((i * 37) % 11) / 90 : 0
  }))
)

function tick(now) {
  if (!last) last = now
  const dt = (now - last) / 1000
  last = now
  t.value = (t.value + dt * 0.14 * props.speed) % 1
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (reduced) return
  raf = requestAnimationFrame(tick)
})
onUnmounted(() => raf && cancelAnimationFrame(raf))

function pos(o) {
  const a = (t.value * props.speed * (1 + o.wobble * 0.08) + o.phase) * Math.PI * 2
  return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R, a: (a * 180) / Math.PI }
}
</script>

<template>
  <svg class="loop" viewBox="0 0 320 320" role="img" :aria-label="`${cars} agent(s) on the closed-loop track`">
    <!-- barrier wall -->
    <circle :cx="CX" :cy="CY" r="152" fill="none" stroke="var(--barrier)" stroke-width="4" opacity="0.45" />
    <!-- kerb, outer edge -->
    <circle
      :cx="CX" :cy="CY" r="140" fill="none" stroke="var(--kerb)" stroke-width="8"
      stroke-dasharray="12 12" opacity="0.75"
    />
    <!-- asphalt band -->
    <circle :cx="CX" :cy="CY" :r="R" fill="none" stroke="#212327" stroke-width="36" />
    <!-- inner edge -->
    <circle :cx="CX" :cy="CY" r="103" fill="none" stroke="var(--glow)" stroke-width="3" opacity="0.4" />
    <!-- spline / racing line -->
    <circle :cx="CX" :cy="CY" :r="R" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.4" />
    <!-- start-finish -->
    <rect :x="CX - 2" :y="CY - R - 19" width="4" height="38" fill="#fff" opacity="0.85" />

    <g v-for="(o, i) in offsets" :key="i">
      <rect
        :x="pos(o).x - 8"
        :y="pos(o).y - 4.5"
        width="16"
        height="9"
        rx="2"
        :fill="color"
        stroke="#ffffff"
        stroke-width="1.2"
        :transform="`rotate(${pos(o).a + 90} ${pos(o).x} ${pos(o).y})`"
      />
    </g>
  </svg>
</template>

<style scoped>
.loop {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 0 26px rgba(255, 107, 26, 0.16));
}
</style>
