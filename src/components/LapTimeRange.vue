<script setup>
/**
 * Lap time spread for both agents on one shared axis.
 * Drawn only from figures reported in the paper: min, max, mean, and the ±1σ
 * band around the mean. No per-episode data is invented.
 */
import { computed } from 'vue'

const props = defineProps({
  ppo: { type: Object, required: true },
  bc: { type: Object, required: true }
})

const W = 960
const PAD_L = 92
const PAD_R = 54
const lo = 9
const hi = 19.4

const x = (v) => PAD_L + ((v - lo) / (hi - lo)) * (W - PAD_L - PAD_R)

const rows = computed(() => [
  { key: 'ppo', name: 'PPO', d: props.ppo, y: 66 },
  { key: 'bc', name: 'BC', d: props.bc, y: 146 }
])

const ticks = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
</script>

<template>
  <figure class="range">
    <svg :viewBox="`0 0 ${W} 236`" role="img" aria-label="Lap time range for both agents">
      <!-- axis -->
      <line :x1="PAD_L" y1="196" :x2="W - PAD_R" y2="196" stroke="#3a3d42" stroke-width="1" />
      <g v-for="t in ticks" :key="t">
        <line :x1="x(t)" y1="196" :x2="x(t)" y2="203" stroke="#3a3d42" stroke-width="1" />
        <text :x="x(t)" y="222" class="range__tick" text-anchor="middle">{{ t }}</text>
      </g>
      <text :x="PAD_L" y="222" class="range__unit" text-anchor="end" dx="-14">Lap time, s</text>

      <g v-for="r in rows" :key="r.key" :class="`row row--${r.key}`">
        <text :x="PAD_L - 16" :y="r.y + 6" class="range__name" text-anchor="end">{{ r.name }}</text>

        <!-- min to max -->
        <line :x1="x(r.d.min)" :y1="r.y" :x2="x(r.d.max)" :y2="r.y" class="row__span" stroke-width="2" />
        <line :x1="x(r.d.min)" :y1="r.y - 9" :x2="x(r.d.min)" :y2="r.y + 9" class="row__cap" stroke-width="2" />
        <line :x1="x(r.d.max)" :y1="r.y - 9" :x2="x(r.d.max)" :y2="r.y + 9" class="row__cap" stroke-width="2" />

        <!-- ±1σ band -->
        <rect
          :x="x(r.d.mean - r.d.sd)"
          :y="r.y - 17"
          :width="x(r.d.mean + r.d.sd) - x(r.d.mean - r.d.sd)"
          height="34"
          class="row__band"
        />
        <!-- mean -->
        <line :x1="x(r.d.mean)" :y1="r.y - 24" :x2="x(r.d.mean)" :y2="r.y + 24" class="row__mean" stroke-width="3" />
        <text :x="x(r.d.mean)" :y="r.y - 32" class="range__mean-label" text-anchor="middle">
          x̄ {{ r.d.mean.toFixed(2) }} s
        </text>
        <text :x="x(r.d.max) + 10" :y="r.y + 5" class="range__edge">max {{ r.d.max.toFixed(2) }}</text>
      </g>
    </svg>
    <figcaption>
      Bar = slowest to fastest recorded lap. Block = one standard deviation either side of the mean.
      PPO is quicker on average but has the wider envelope; BC is slower and tighter.
    </figcaption>
  </figure>
</template>

<style scoped>
.range svg { width: 100%; height: auto; }

.range__tick,
.range__unit,
.range__edge {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 15px;
  fill: var(--dim);
}

.range__name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  fill: #fff;
  letter-spacing: 0.04em;
}

.range__mean-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  fill: #fff;
}

.row--ppo .row__span,
.row--ppo .row__cap { stroke: var(--kerb); opacity: 0.6; }
.row--ppo .row__band { fill: var(--kerb); opacity: 0.22; }
.row--ppo .row__mean { stroke: var(--kerb); }

.row--bc .row__span,
.row--bc .row__cap { stroke: var(--bc); opacity: 0.6; }
.row--bc .row__band { fill: var(--bc); opacity: 0.22; }
.row--bc .row__mean { stroke: var(--bc); }

.row__band {
  transform-box: fill-box;
  transform-origin: center;
  animation: grow 0.9s var(--ease) both;
}

@keyframes grow {
  from { transform: scaleX(0.02); opacity: 0; }
  to { transform: scaleX(1); }
}
</style>
