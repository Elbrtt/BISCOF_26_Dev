<script setup>
/**
 * PPO cumulative reward stability. The paper reports a mean, a standard
 * deviation and the share of episodes inside the ±1σ band, with no trend
 * across the 200 inference episodes — so this draws the band, not a fake
 * per-episode trace.
 */
defineProps({
  mean: { type: Number, required: true },
  sd: { type: Number, required: true },
  inBand: { type: Number, required: true },
  episodes: { type: Number, default: 200 }
})

const W = 960
const H = 210
const PAD_L = 66
const PAD_R = 40
const lo = 0.34
const hi = 0.6
const y = (v) => H - 44 - ((v - lo) / (hi - lo)) * (H - 44 - 26)
</script>

<template>
  <figure class="band">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="PPO cumulative reward stability band">
      <rect
        :x="PAD_L"
        :y="y(mean + sd)"
        :width="W - PAD_L - PAD_R"
        :height="y(mean - sd) - y(mean + sd)"
        class="band__fill"
      />
      <line :x1="PAD_L" :y1="y(mean)" :x2="W - PAD_R" :y2="y(mean)" class="band__mean" />

      <text :x="PAD_L - 12" :y="y(mean + sd) + 5" class="band__axis" text-anchor="end">{{ (mean + sd).toFixed(3) }}</text>
      <text :x="PAD_L - 12" :y="y(mean) + 5" class="band__axis band__axis--mid" text-anchor="end">{{ mean.toFixed(3) }}</text>
      <text :x="PAD_L - 12" :y="y(mean - sd) + 5" class="band__axis" text-anchor="end">{{ (mean - sd).toFixed(3) }}</text>

      <text :x="W - PAD_R" :y="y(mean) - 14" class="band__note" text-anchor="end">
        {{ inBand }}% of {{ episodes }} episodes sit inside this band
      </text>

      <line :x1="PAD_L" :y1="H - 30" :x2="W - PAD_R" :y2="H - 30" stroke="#3a3d42" />
      <text :x="PAD_L" :y="H - 10" class="band__axis">episode 0</text>
      <text :x="W - PAD_R" :y="H - 10" class="band__axis" text-anchor="end">episode {{ episodes }}</text>
    </svg>
    <figcaption>
      Cumulative reward per inference episode holds between roughly 0.44 and 0.52 with no trend in either
      direction, which is what a converged policy looks like: the agent had stopped improving before evaluation began.
    </figcaption>
  </figure>
</template>

<style scoped>
.band svg { width: 100%; height: auto; }

.band__fill {
  fill: rgba(255, 107, 26, 0.22);
  stroke: rgba(255, 107, 26, 0.5);
  stroke-width: 1;
  transform-box: fill-box;
  transform-origin: left center;
  animation: sweep 1.1s var(--ease) both;
}

@keyframes sweep {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.band__mean { stroke: var(--kerb); stroke-width: 2; }

.band__axis { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; fill: var(--dim); }
.band__axis--mid { fill: #fff; }
.band__note { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; fill: var(--bone); }

figcaption {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 17px;
  letter-spacing: 0.03em;
  color: var(--dim);
  padding: 10px 2px 0;
  max-width: 200ch;
}
</style>
