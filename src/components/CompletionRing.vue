<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  percent: { type: Number, required: true },
  completed: { type: Number, required: true },
  failed: { type: Number, required: true },
  label: { type: String, required: true },
  sub: { type: String, default: '' },
  tone: { type: String, default: 'ppo' }
})

const R = 68
const C = 2 * Math.PI * R
const progress = ref(0)
const root = ref(null)
let raf = null

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const dash = computed(() => `${(progress.value / 100) * C} ${C}`)

function run() {
  if (reduced) {
    progress.value = props.percent
    return
  }
  const start = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - start) / 1400)
    progress.value = props.percent * (1 - Math.pow(1 - p, 3))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!root.value || typeof IntersectionObserver === 'undefined') return run()
  const io = new IntersectionObserver(
    (e) => {
      if (e[0].isIntersecting) {
        run()
        io.disconnect()
      }
    },
    { threshold: 0.35 }
  )
  io.observe(root.value)
  onUnmounted(() => io.disconnect())
})

onUnmounted(() => raf && cancelAnimationFrame(raf))
</script>

<template>
  <figure ref="root" class="ring" :class="`ring--${tone}`">
    <svg viewBox="0 0 160 160" role="img" :aria-label="`${label}: ${percent}% of episodes completed`">
      <circle cx="80" cy="80" :r="R" fill="none" stroke="#2b2d30" stroke-width="13" />
      <circle
        cx="80" cy="80" :r="R" fill="none"
        class="ring__arc"
        stroke-width="13"
        stroke-linecap="butt"
        :stroke-dasharray="dash"
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="76" class="ring__num" text-anchor="middle">{{ progress.toFixed(1) }}</text>
      <text x="80" y="97" class="ring__unit" text-anchor="middle">% laps completed</text>
    </svg>
    <figcaption>
      <span class="tag" :class="`tag--${tone}`">{{ label }}</span>
      <span class="ring__split">{{ completed }} finished · {{ failed }} failed</span>
      <span v-if="sub" class="ring__sub">{{ sub }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.ring { display: grid; gap: 14px; justify-items: center; }
.ring svg { width: min(100%, 260px); height: auto; }
.ring__arc { stroke: var(--kerb); }
.ring--bc .ring__arc { stroke: var(--bc); }

.ring__num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 40px;
  fill: #fff;
  font-variant-numeric: tabular-nums;
}

.ring__unit {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  fill: var(--dim);
}

figcaption { display: grid; gap: 6px; justify-items: center; padding: 0; text-align: center; }

.ring__split {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  color: var(--bone);
  letter-spacing: 0.03em;
}

.ring__sub { font-size: 14px; color: var(--dim); max-width: 34ch; }
</style>
