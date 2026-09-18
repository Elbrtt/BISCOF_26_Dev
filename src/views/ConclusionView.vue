<script setup>
import { ref } from 'vue'
import PageNav from '../components/PageNav.vue'
import { paper, authors, futureWork, references, results } from '../data/paper'

const showRefs = ref(false)
</script>

<template>
  <article class="page">
    <header class="page__head">
      <p class="meta">Section 05 · Conclusions</p>
      <h2 v-reveal>Reward beats demonstration when the track surprises you.</h2>
      <p class="lede" v-reveal="90">
        Under identical conditions, PPO completed {{ results.ppo.completion }}% of episodes against
        BC’s {{ results.bc.completion }}%, and lapped 0.68 s faster on average. Behavior Cloning
        stays competitive where it was taught — steadier lap times, less variance — and falls over
        outside that distribution. The hypothesis held.
      </p>
    </header>

    <section class="verdicts">
      <div class="verdict verdict--ppo" v-reveal>
        <span class="tag tag--ppo">PPO takes the comparison</span>
        <p>
          Reward-driven exploration produced recovery behaviour that imitation could not copy,
          because the human never demonstrated failure. Three metrics in a row point the same way:
          completion rate, mean lap time, and stability from the very first inference episode.
        </p>
      </div>
      <div class="verdict verdict--bc" v-reveal="110">
        <span class="tag tag--bc">BC is not dismissed</span>
        <p>
          Within the demonstrated distribution the imitation policy is the more predictable driver,
          with roughly half the lap-time variance and no reward function to design. For stable,
          expert-like behaviour on a known route, it remains a reasonable choice.
        </p>
      </div>
      <div class="verdict verdict--ue" v-reveal="220">
        <span class="tag">UE5 held up as a research platform</span>
        <p>
          Both paradigms trained and evaluated inside one engine, in Blueprint, with no external
          simulator — extending Jorgensen’s observation about the plugin’s reinforcement side to
          its imitation side as well.
        </p>
      </div>
    </section>

    <section class="future">
      <h3 v-reveal>What comes next</h3>
      <ul class="future__list">
        <li v-for="(f, i) in futureWork" :key="f.head" v-reveal="i * 70">
          <h4>{{ f.head }}</h4>
          <p>{{ f.body }}</p>
        </li>
      </ul>
    </section>

    <section class="open" v-reveal>
      <div class="open__inner">
        <h3>Open data</h3>
        <p>
          The datasets, UE5 project configuration and model checkpoints behind these numbers are
          published so the comparison can be re-run.
        </p>
        <div class="open__actions">
          <a class="btn btn--go" :href="paper.repo" target="_blank" rel="noopener">Open the repository</a>
          <a class="btn" :href="paper.pdf" target="_blank" rel="noopener">Read the full paper</a>
        </div>
      </div>
    </section>

    <section class="people">
      <h3 v-reveal>Who did what</h3>
      <ul class="people__list">
        <li v-for="(a, i) in authors" :key="a.mail" v-reveal="i * 60">
          <span class="people__n">{{ a.n }}</span>
          <div>
            <strong>{{ a.name }}</strong>
            <a :href="`mailto:${a.mail}`" class="people__mail">{{ a.mail }}</a>
            <span class="people__role">{{ a.role }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="refs">
      <button class="refs__toggle" :aria-expanded="showRefs" @click="showRefs = !showRefs">
        {{ showRefs ? 'Hide references' : `Show all ${references.length} references` }}
      </button>
      <Transition name="fold">
        <ol v-if="showRefs" class="refs__list">
          <li v-for="(r, i) in references" :key="i">{{ r }}</li>
        </ol>
      </Transition>
    </section>

    <PageNav />
  </article>
</template>

<style scoped>
.verdicts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(18px, 2vw, 30px);
  margin-bottom: clamp(48px, 7vh, 88px);
}

.verdict {
  background: var(--asphalt);
  border-top: 3px solid var(--dim);
  padding: clamp(20px, 2vw, 28px);
  display: grid;
  gap: 12px;
  align-content: start;
}

.verdict--ppo { border-top-color: var(--kerb); }
.verdict--bc { border-top-color: var(--bc); }
.verdict p { margin: 0; font-size: 16px; }

.future { margin-bottom: clamp(48px, 7vh, 88px); }
.future h3 { margin-bottom: 20px; }

.future__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
  border-top: 1px solid var(--line);
}

.future__list li {
  display: grid;
  gap: 5px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.future__list h4 {
  font-family: 'Tinos', serif;
  font-weight: 400;
  font-size: 21px;
  color: var(--paper);
  margin: 0;
}

.future__list p { margin: 0; font-size: 16px; }

.open {
  border: 1px solid var(--line);
  border-left: 3px solid var(--kerb);
  background: var(--asphalt);
  padding: clamp(26px, 3.4vw, 48px);
  margin-bottom: clamp(48px, 7vh, 88px);
}

.open__inner { display: grid; gap: 14px; max-width: 60ch; }
.open__inner p { margin: 0; }
.open__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }

.btn {
  display: inline-block;
  padding: 11px 22px;
  border: 1px solid #4a4d52;
  color: var(--paper);
  text-decoration: none;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 17px;
  letter-spacing: 0.08em;
  transition: background 0.22s var(--ease), border-color 0.22s var(--ease);
}

.btn:hover { border-color: var(--paper); background: rgba(255, 255, 255, 0.07); }
.btn--go { background: var(--kerb); border-color: var(--kerb); color: #000; font-weight: 600; }
.btn--go:hover { background: var(--glow); border-color: var(--glow); }

.people { margin-bottom: clamp(40px, 6vh, 70px); }
.people h3 { margin-bottom: 18px; }

.people__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 18px clamp(20px, 3vw, 44px);
}

.people__list li { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 10px; }

.people__n {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  color: var(--kerb);
}

.people__list strong { display: block; color: var(--paper); font-weight: 500; font-size: 18px; }
.people__mail { display: block; font-size: 14.5px; color: var(--dim); text-decoration: none; }
.people__mail:hover { color: var(--glow); }
.people__role { display: block; font-size: 14.5px; color: var(--bone); margin-top: 3px; }

.refs__toggle {
  background: none;
  border: 1px solid var(--line);
  color: var(--bone);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  letter-spacing: 0.06em;
  padding: 10px 20px;
  cursor: pointer;
  transition: border-color 0.2s var(--ease), color 0.2s var(--ease);
}

.refs__toggle:hover { border-color: var(--paper); color: var(--paper); }

.refs__list {
  margin: 22px 0 0;
  padding-left: 22px;
  display: grid;
  gap: 8px;
  color: var(--dim);
  font-size: 15px;
  max-width: 96ch;
}

.fold-enter-active,
.fold-leave-active { transition: opacity 0.3s var(--ease), transform 0.3s var(--ease); }
.fold-enter-from,
.fold-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 1000px) {
  .verdicts { grid-template-columns: minmax(0, 1fr); }
}
</style>
