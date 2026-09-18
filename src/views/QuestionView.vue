<script setup>
import PageNav from '../components/PageNav.vue'
import TrackLoop from '../components/TrackLoop.vue'
import { agents, literature, paper } from '../data/paper'
</script>

<template>
  <article class="page">
    <header class="page__head">
      <p class="meta">Section 01 · Introduction and related work</p>
      <h2 v-reveal>Same track, same car, two ways of learning to drive it.</h2>
      <p class="lede" v-reveal="90">
        Autonomous driving research leans on two paradigms that rarely meet under identical
        conditions. Reinforcement learning explores and is corrected by a reward. Imitation
        learning copies a human and skips the reward entirely. Put them on one track and the
        trade-off stops being theoretical.
      </p>
    </header>

    <section class="pair">
      <div v-for="(a, k) in agents" :key="k" class="paradigm panel" v-reveal="k === 'bc' ? 120 : 0">
        <span class="tag" :class="`tag--${a.key}`">{{ a.name }} · {{ a.family }}</span>
        <h3>{{ a.full }}</h3>
        <p class="paradigm__line">{{ a.line }}</p>
        <p class="paradigm__body">
          <template v-if="a.key === 'ppo'">
            PPO optimises a stochastic policy directly against cumulative reward, clipping each
            update so a single bad batch cannot wreck the policy. Exploration is the whole point:
            the agent visits states no human would drive into, and learns its way out of them.
          </template>
          <template v-else>
            Behavior Cloning turns driving into supervised regression over recorded expert
            state–action pairs. It converges fast and needs no reward engineering, but it only
            knows the states the expert visited — and errors compound once the car leaves them.
          </template>
        </p>
      </div>
    </section>

    <section class="gap">
      <div class="gap__text">
        <h3 v-reveal>The gap this study fills</h3>
        <p v-reveal="60">
          Earlier work compares one RL algorithm against another, or blends RL and IL into hybrid
          planners. A clean head-to-head between PPO and Behavior Cloning, under the same physics
          and the same track, has not been reported. Most of it also runs on external simulators
          that take serious engineering to stand up.
        </p>
        <p v-reveal="90">
          Unreal Engine 5’s Learning Agents plugin supports both algorithms natively inside
          Blueprint, so the comparison can be built and repeated without leaving the engine.
          Jorgensen showed the plugin works for reinforcement learning and noted its imitation side
          was barely touched. That is the opening.
        </p>
        <p class="gap__q serif" v-reveal="120">
          Under identical simulation conditions, does a PPO-trained agent or a BC-trained agent
          drive better?
        </p>
        <p class="gap__hyp" v-reveal="150">
          The hypothesis going in: BC learns faster at the start because it is handed expert laps,
          while PPO ends up with the higher ceiling and the better behaviour in situations it was
          never shown.
        </p>
      </div>
      <div class="gap__loop" v-reveal="100">
        <TrackLoop :cars="8" :speed="1.05" />
        <p class="meta gap__loopcap">The closed-loop circuit, bounded by torus obstacles, built on a Spline in UE5.</p>
      </div>
    </section>

    <section class="lit">
      <h3 v-reveal>Ten studies this one is measured against</h3>
      <div class="lit__scroll" v-reveal="60">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Author</th>
              <th>Method</th>
              <th>Domain</th>
              <th>Key result</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in literature" :key="row.n">
              <td class="num">{{ row.n }}</td>
              <td>{{ row.author }}</td>
              <td>{{ row.method }}</td>
              <td>{{ row.domain }}</td>
              <td>{{ row.result }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="keys" v-reveal>
      <span v-for="k in paper.keywords" :key="k" class="keys__chip">{{ k }}</span>
    </section>

    <PageNav />
  </article>
</template>

<style scoped>
.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 2vw, 28px);
  margin-bottom: clamp(48px, 7vh, 88px);
}

.paradigm { display: grid; gap: 12px; align-content: start; }
.paradigm h3 { margin-top: 2px; }

.paradigm__line {
  font-family: 'Tinos', serif;
  font-style: italic;
  font-size: 20px;
  color: var(--paper);
  margin: 0;
}

.paradigm__body { margin: 0; font-size: 16.5px; }

.gap {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
  margin-bottom: clamp(48px, 7vh, 88px);
}

.gap__q {
  font-size: clamp(22px, 2vw, 30px);
  line-height: 1.34;
  color: var(--paper);
  border-left: 3px solid var(--kerb);
  padding-left: 20px;
  margin: 26px 0 18px;
  max-width: 34ch;
}

.gap__hyp { color: var(--bone); }

.gap__loop { display: grid; gap: 14px; justify-items: center; }
.gap__loopcap { text-align: center; max-width: 36ch; }

.lit { margin-bottom: 44px; }
.lit h3 { margin-bottom: 18px; }
.lit__scroll { overflow-x: auto; border-top: 1px solid #4a4d52; }
.lit table { min-width: 720px; }
.lit td { font-size: 15.5px; }

.keys { display: flex; flex-wrap: wrap; gap: 8px; }

.keys__chip {
  border: 1px solid var(--line);
  padding: 5px 13px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 15px;
  letter-spacing: 0.05em;
  color: var(--bone);
}

@media (max-width: 1000px) {
  .pair,
  .gap { grid-template-columns: minmax(0, 1fr); }
  .gap__loop { max-width: 380px; margin: 0 auto; }
}
</style>
