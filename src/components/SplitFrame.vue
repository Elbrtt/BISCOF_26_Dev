<script setup>
/** The trailer's split-screen: two runs side by side, divided by a hairline. */
defineProps({
  left: { type: Object, required: true },   // { src, alt, tag, tone, caption }
  right: { type: Object, required: true },
  heading: { type: String, default: '' }
})
</script>

<template>
  <section class="split">
    <h3 v-if="heading" class="split__heading title-card">{{ heading }}</h3>
    <div class="split__pair">
      <figure v-for="side in [left, right]" :key="side.src" class="split__side">
        <div class="frame" :class="`frame--${side.tone}`">
          <img :src="side.src" :alt="side.alt" loading="lazy" />
        </div>
        <figcaption>
          <span class="tag" :class="`tag--${side.tone}`">{{ side.tag }}</span>
          <span class="split__cap">{{ side.caption }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.split__heading {
  font-size: 19px;
  margin: 0 0 22px;
  color: var(--bone);
}

.split__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  align-items: start;
}

.split__side { padding-right: clamp(16px, 2.4vw, 40px); }

.split__side + .split__side {
  padding-right: 0;
  padding-left: clamp(16px, 2.4vw, 40px);
  border-left: 1px solid var(--line);
}

.frame { aspect-ratio: 16 / 10; }

.frame--ppo { border-color: rgba(255, 107, 26, 0.55); }
.frame--bc { border-color: rgba(242, 194, 48, 0.55); }

figcaption { display: grid; gap: 7px; }

.split__cap { font-size: 15.5px; color: var(--bone); line-height: 1.5; max-width: 46ch; }

@media (max-width: 900px) {
  .split__pair { grid-template-columns: minmax(0, 1fr); gap: 34px; }
  .split__side,
  .split__side + .split__side { padding: 0; border-left: 0; }
}
</style>
