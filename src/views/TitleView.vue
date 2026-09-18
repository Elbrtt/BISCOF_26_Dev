<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { paper, authors } from '../data/paper'

// A lap clock, the way the sim shows it in the corner of every capture.
const clock = ref(0)
let id = null
onMounted(() => {
  id = setInterval(() => {
    clock.value = (clock.value + 0.07) % 10.12
  }, 70)
})
onUnmounted(() => clearInterval(id))

// Hero background: a looping clip if one exists at /video/hero-loop.mp4,
// the still frame otherwise. No file shipped by default — see README.
// Built as a plain string (not a literal template attribute) so Vite's
// asset resolver never tries to import it at build time — otherwise a
// missing file here would fail `npm run build` entirely.
const heroVideoSrc = `${import.meta.env.BASE_URL}video/hero-loop.mp4`.replace(/\/+/g, '/')
const videoFailed = ref(false)
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
</script>

<template>
  <div class="title">
    <div class="title__media">
      <video
        v-if="!reducedMotion && !videoFailed"
        class="title__bg"
        autoplay
        muted
        loop
        playsinline
        poster="/img/il-agent.jpg"
        @error="videoFailed = true"
      >
        <source :src="heroVideoSrc" type="video/mp4" />
      </video>
      <img
        v-else
        class="title__bg"
        src="/img/il-agent.jpg"
        alt="The demonstration car on the closed-loop track in Unreal Engine 5"
      />
      <div class="title__hud">
        <span class="hud-value">{{ clock.toFixed(2) }}</span>
        <span class="hud-label">Lap seconds</span>
      </div>
      <div class="title__scrim"></div>
    </div>

    <div class="title__card">
      <p class="title__eyebrow meta">{{ paper.group }} · {{ paper.institution }}</p>

      <h1 class="title-card title__main">
        <span class="fade" style="--d: 120ms">Comparative study</span>
        <span class="fade title__of" style="--d: 260ms">of</span>
        <span class="fade" style="--d: 380ms">Self-learning agents</span>
      </h1>

      <div class="title__rule fade" style="--d: 560ms"></div>

      <p class="title__sub title-card fade" style="--d: 680ms">
        Reinforcement &amp; Imitation Learning
      </p>

      <p class="title__where fade" style="--d: 820ms">
        Proximal Policy Optimization against Behavior Cloning, trained and measured on the
        same track inside Unreal Engine 5.
      </p>

      <ul class="title__authors fade" style="--d: 940ms">
        <li v-for="a in authors" :key="a.mail">{{ a.name }}</li>
      </ul>

      <div class="title__actions fade" style="--d: 1060ms">
        <RouterLink to="/question" class="btn btn--go">Start reading</RouterLink>
        <a class="btn" :href="paper.pdf" target="_blank" rel="noopener">Open the paper (PDF)</a>
      </div>
    </div>

    <div class="kerb title__kerb"></div>
  </div>
</template>

<style scoped>
.title {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  position: relative;
}

.title__media { position: relative; overflow: hidden; background: #000; }

.title__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* the still image gets the slow drift; a real video is already moving,
   so it plays at rest with no added transform */
img.title__bg {
  animation: drift 22s ease-in-out infinite alternate;
}

video.title__bg {
  --hero-zoom: 1.35;
  --hero-pan-x: 12%;
  --hero-pan-y: 0%;
  transform: scale(var(--hero-zoom)) translate(var(--hero-pan-x), var(--hero-pan-y));
  transform-origin: center;
}

@keyframes drift {
  from { transform: scale(1.04) translate3d(0, 0, 0); }
  to { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
}

.title__scrim {
  position: absolute;
  inset: 0;
  /* the reference title card cuts hard from image to black; the only shading
     here is what the lap clock needs to stay legible */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 34%);
}

.title__hud {
  position: absolute;
  left: 26px;
  bottom: 24px;
  display: grid;
  gap: 4px;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.75);
}

.title__hud .hud-value { font-size: clamp(34px, 3.4vw, 50px); }
.title__hud .hud-label { color: #d9d5cd; }

.title__card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: clamp(40px, 6vw, 96px) clamp(28px, 5vw, 86px);
  background: #000;
}

.title__eyebrow { margin: 0 0 6px; }

.title__main {
  display: grid;
  gap: 6px;
  font-size: clamp(27px, 2.9vw, 44px);
  letter-spacing: 0.2em;
}

.title__of {
  font-size: 0.58em;
  letter-spacing: 0.3em;
  text-transform: lowercase;
  font-style: italic;
  color: var(--bone);
}

.title__rule { height: 1px; background: #fff; opacity: 0.85; max-width: 560px; }

.title__sub {
  font-size: clamp(16px, 1.4vw, 21px);
  letter-spacing: 0.22em;
  color: var(--kerb);
  margin: 0;
}

.title__where { color: var(--bone); max-width: 52ch; margin: 10px 0 0; }

.title__authors {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 22px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16.5px;
  letter-spacing: 0.04em;
  color: var(--dim);
}

.title__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }

.btn {
  display: inline-block;
  padding: 12px 24px;
  border: 1px solid #4a4d52;
  color: var(--paper);
  text-decoration: none;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 17px;
  letter-spacing: 0.08em;
  transition: background 0.22s var(--ease), border-color 0.22s var(--ease), color 0.22s var(--ease);
}

.btn:hover { border-color: var(--paper); background: rgba(255, 255, 255, 0.07); }

.btn--go { background: var(--kerb); border-color: var(--kerb); color: #000; font-weight: 600; }
.btn--go:hover { background: var(--glow); border-color: var(--glow); color: #000; }

.title__kerb { position: absolute; left: 0; right: 0; bottom: 0; }

.fade {
  opacity: 0;
  transform: translateY(10px);
  animation: rise 0.75s var(--ease) var(--d, 0ms) forwards;
}

@keyframes rise {
  to { opacity: 1; transform: none; }
}

@media (max-width: 900px) {
  .title { grid-template-columns: minmax(0, 1fr); min-height: auto; }
  .title__media { height: 46vh; }
  .title__scrim { background: linear-gradient(180deg, transparent 38%, rgba(0, 0, 0, 0.95) 100%); }
  .title__card { padding-bottom: 96px; }
}

@media (prefers-reduced-motion: reduce) {
  .fade { opacity: 1; transform: none; animation: none; }
  img.title__bg { animation: none; }
}
</style>