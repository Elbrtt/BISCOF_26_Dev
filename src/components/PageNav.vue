<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sections } from '../data/paper'

const route = useRoute()
const router = useRouter()

const i = computed(() => route.meta.index ?? 0)
const prev = computed(() => (i.value > 0 ? sections[i.value - 1] : null))
const next = computed(() => (i.value < sections.length - 1 ? sections[i.value + 1] : null))

function onKey(e) {
  if (e.target.closest('input, textarea')) return
  if (e.key === 'ArrowRight' && next.value) router.push(next.value.to)
  if (e.key === 'ArrowLeft' && prev.value) router.push(prev.value.to)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="pagenav">
    <div class="kerb kerb--thin"></div>
    <div class="pagenav__row">
      <RouterLink v-if="prev" :to="prev.to" class="pagenav__link pagenav__link--back">
        <span class="hud-label">Previous</span>
        <span class="pagenav__title serif">{{ prev.label }}</span>
      </RouterLink>
      <span v-else class="pagenav__link" aria-hidden="true"></span>

      <span class="pagenav__hint meta">Use ← → to move between sections</span>

      <RouterLink v-if="next" :to="next.to" class="pagenav__link pagenav__link--fwd">
        <span class="hud-label">Next</span>
        <span class="pagenav__title serif">{{ next.label }}</span>
      </RouterLink>
      <!-- last page loops back, so the next visitor at the booth starts clean -->
      <RouterLink v-else to="/" class="pagenav__link pagenav__link--fwd">
        <span class="hud-label">Start over</span>
        <span class="pagenav__title serif">Back to the title</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.pagenav {
  margin-top: 84px;
  border-top: 1px solid var(--line);
}

.kerb--thin { opacity: 0.55; }

.pagenav__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 0 8px;
}

.pagenav__link {
  display: grid;
  gap: 2px;
  text-decoration: none;
  min-width: 120px;
  padding: 6px 2px;
}

.pagenav__link--fwd { text-align: right; }

.pagenav__title {
  font-size: 26px;
  color: var(--paper);
  transition: color 0.2s var(--ease);
}

a.pagenav__link:hover .pagenav__title { color: var(--kerb); }

.pagenav__hint { text-align: center; }

@media (max-width: 700px) {
  .pagenav__hint { display: none; }
  .pagenav__title { font-size: 20px; }
}
</style>
