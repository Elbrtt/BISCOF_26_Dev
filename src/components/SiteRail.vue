<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { sections } from '../data/paper'

const route = useRoute()
const active = computed(() => route.meta.index ?? 0)
</script>

<template>
  <nav class="rail" aria-label="Sections">
    <RouterLink to="/" class="rail__mark" aria-label="Back to title">
      <svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">
        <circle cx="17" cy="17" r="12" fill="none" stroke="var(--kerb)" stroke-width="6" />
        <circle cx="17" cy="5" r="2.6" fill="#fff" />
      </svg>
    </RouterLink>

    <ol class="rail__list">
      <li v-for="(s, i) in sections" :key="s.to">
        <RouterLink :to="s.to" class="rail__item" :class="{ 'is-active': i === active }">
          <span class="rail__tick" aria-hidden="true"></span>
          <span class="rail__text">{{ s.short }}</span>
        </RouterLink>
      </li>
    </ol>

    <span class="rail__lap">{{ String(active + 1).padStart(2, '0') }}<i>/06</i></span>
  </nav>
</template>

<style scoped>
.rail {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--rail-w);
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 26px 0 24px;
  background: #000;
  border-right: 1px solid var(--line);
}

.rail__mark { display: block; line-height: 0; }

.rail__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rail__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 10px 0;
  width: var(--rail-w);
  text-decoration: none;
  color: var(--dim);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  letter-spacing: 0.08em;
  transition: color 0.25s var(--ease);
}

.rail__tick {
  width: 3px;
  height: 20px;
  background: #3a3d42;
  transition: background 0.25s var(--ease), height 0.25s var(--ease);
}

.rail__item:hover { color: var(--paper); }
.rail__item:hover .rail__tick { background: var(--glow); }

.rail__item.is-active { color: var(--paper); }
.rail__item.is-active .rail__tick { background: var(--kerb); height: 30px; }

.rail__lap {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  color: var(--paper);
  font-variant-numeric: tabular-nums;
}

.rail__lap i { color: var(--dim); font-style: normal; font-size: 15px; }

@media (max-width: 900px) {
  .rail {
    inset: auto 0 0 0;
    width: 100%;
    height: 62px;
    flex-direction: row;
    padding: 0 12px;
    border-right: 0;
    border-top: 1px solid var(--line);
    overflow-x: auto;
  }
  .rail__mark,
  .rail__lap { display: none; }
  .rail__list { flex-direction: row; gap: 0; }
  .rail__item { width: auto; padding: 0 14px; height: 62px; justify-content: center; }
  .rail__tick { width: 22px; height: 3px; }
  .rail__item.is-active .rail__tick { height: 3px; width: 30px; }
}
</style>
