<script setup>
/**
 * Normal curves built from the reported mean and standard deviation of each
 * agent's successful laps. This is a model of the spread, not the raw
 * histogram — the paper publishes the summary statistics, not the per-episode
 * data, and the caption says so.
 */
import { computed } from 'vue'

const props = defineProps({
  ppo: { type: Object, required: true },
  bc: { type: Object, required: true }
})

const W = 960
const H = 300
const PAD_L = 54
const PAD_R = 34
const PAD_B = 48
const lo = 8.4
const hi = 13.4

const x = (v) => PAD_L + ((v - lo) / (hi - lo)) * (W - PAD_L - PAD_R)

function curve(mean, sd) {
  const pts = []
  const steps = 160
  for (let i = 0; i <= steps; i++) {
    const v = lo + ((hi - lo) * i) / steps
    const y = Math.exp(-0.5 * Math.pow((v - mean) / sd, 2)) / sd
    pts.push([v, y])
  }
  return pts
}

const peak = computed(() => 1 / Math.min(props.ppo.sd, props.bc.sd))

function path(mean, sd) {
  const pts = curve(mean, sd)
  const y = (v) => H - PAD_B - (v / peak.value) * (H - PAD_B - 34)
  let d = `M ${x(pts[0][0])} ${H - PAD_B}`
  pts.forEach(([v, p]) => {
    d += ` L ${x(v).toFixed(2)} ${y(p).toFixed(2)}`
  })
  d += ` L ${x(pts[pts.length - 1][0])} ${H - PAD_B} Z`
  return d
}

const ticks = [9, 10, 11, 12, 13]
</script>

<template>
  <figure class="dist">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Modelled lap time distribution for both agents">
      <line :x1="PAD_L" :y1="H - PAD_B" :x2="W - PAD_R" :y2="H - PAD_B" stroke="#3a3d42" />
      <g v-for="t in ticks" :key="t">
        <line :x1="x(t)" :y1="H - PAD_B" :x2="x(t)" :y2="H - PAD_B + 6" stroke="#3a3d42" />
        <text :x="x(t)" :y="H - PAD_B + 26" class="dist__tick" text-anchor="middle">{{ t }} s</text>
      </g>

      <path :d="path(bc.mean, bc.sd)" class="dist__bc" />
      <path :d="path(ppo.mean, ppo.sd)" class="dist__ppo" />

      <line :x1="x(ppo.mean)" y1="34" :x2="x(ppo.mean)" :y2="H - PAD_B" class="dist__mean dist__mean--ppo" />
      <line :x1="x(bc.mean)" y1="52" :x2="x(bc.mean)" :y2="H - PAD_B" class="dist__mean dist__mean--bc" />

      <text :x="x(ppo.mean) - 8" y="28" class="dist__key dist__key--ppo" text-anchor="end">PPO 9.99 s</text>
      <text :x="x(bc.mean) + 8" y="46" class="dist__key dist__key--bc">BC 10.68 s</text>
    </svg>
    <figcaption>
      Shape modelled from the reported means and standard deviations (PPO 9.99 ± 1.08 s, BC 10.68 ± 0.59 s).
      PPO’s real histogram is even more concentrated than this: 142 of its laps — 71.7% — land in the 9.5–10.0 s bin.
    </figcaption>
  </figure>
</template>

<style scoped>
.dist svg { width: 100%; height: auto; }

.dist__ppo { fill: rgba(255, 107, 26, 0.3); stroke: var(--kerb); stroke-width: 2; }
.dist__bc { fill: rgba(242, 194, 48, 0.13); stroke: var(--bc); stroke-width: 2; }

.dist__ppo,
.dist__bc {
  clip-path: inset(0 100% 0 0);
  animation: wipe 1.15s var(--ease) 0.15s forwards;
}

.dist__bc { animation-delay: 0.3s; }

@keyframes wipe {
  to { clip-path: inset(0 0 0 0); }
}

.dist__mean { stroke-dasharray: 4 5; stroke-width: 1.5; }
.dist__mean--ppo { stroke: var(--kerb); }
.dist__mean--bc { stroke: var(--bc); }

.dist__tick { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; fill: var(--dim); }

.dist__key { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; letter-spacing: 0.04em; }
.dist__key--ppo { fill: var(--kerb); }
.dist__key--bc { fill: var(--bc); }
</style>
