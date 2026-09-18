<script setup>
import PageNav from '../components/PageNav.vue'
import { pipeline, observations, trainingConfig } from '../data/paper'
</script>

<template>
  <article class="page">
    <header class="page__head">
      <p class="meta">Section 02 · Methodology</p>
      <h2 v-reveal>How the comparison was built.</h2>
      <p class="lede" v-reveal="90">
        Unreal Engine 5.6.1 with the Learning Agents plugin. A closed-loop track defined by a
        Spline component, which doubles as the reference path for every measurement. The car runs
        on Chaos Vehicle Physics, so acceleration, braking and steering behave like a car and not
        like a marker sliding along a line.
      </p>
    </header>

    <!-- genuinely a sequence, so it is numbered -->
    <section class="flow">
      <ol class="flow__list">
        <li v-for="(s, i) in pipeline" :key="s.step" class="flow__item" v-reveal="i * 70">
          <span class="flow__n">{{ String(i + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ s.step }}</h3>
            <p>{{ s.detail }}</p>
          </div>
        </li>
      </ol>
    </section>

    <div class="kerb kerb--thin split-rule"></div>

    <section class="obs">
      <div>
        <h3 v-reveal>What each agent can see</h3>
        <p v-reveal="60">
          Both policies read six observation dimensions and output three actions. Three of the
          observations are shared. The fourth entry below is BC’s compensation: PPO trains with
          eight agents exploring in parallel, so the single BC agent is given the vehicle’s yaw
          angle as extra orientation to keep the imitation faithful.
        </p>
        <ul class="obs__list">
          <li
            v-for="o in observations"
            :key="o.i"
            class="obs__row"
            :class="{ 'obs__row--bc': o.who === 'bc' }"
            v-reveal="o.i * 60"
          >
            <span class="obs__i">{{ o.i }}</span>
            <div>
              <strong>{{ o.label }}</strong>
              <span class="obs__note">{{ o.note }}</span>
            </div>
            <span class="obs__who">{{ o.who === 'bc' ? 'BC only' : 'Both' }}</span>
          </li>
        </ul>
      </div>

      <figure class="obs__fig" v-reveal="120">
        <div class="frame">
          <img src="/img/bp-observation.jpg" alt="Blueprint graph making the location and direction observations along the track spline" />
        </div>
        <figcaption>
          The observation graph in Blueprint: the car’s world location is projected onto the track
          spline, then turned into location and direction observations for the policy.
        </figcaption>
      </figure>
    </section>

    <section class="reward" v-reveal>
      <h3>The reward, in one line</h3>
      <div class="reward__box">
        <p class="reward__eq serif">
          R<sub>t</sub> = ( v̂ · d̂<sub>spline</sub> ) × ‖v‖ ⁄ 1000 + r<sub>track</sub>
        </p>
        <ul class="reward__legend">
          <li><b>v̂ · d̂<sub>spline</sub></b> — how well the car’s heading matches the racing line at the nearest point.</li>
          <li><b>‖v‖</b> — speed in cm/s. Going the right way fast pays more than going the right way slowly.</li>
          <li><b>r<sub>track</sub></b> — a flat −10.0 whenever lateral deviation from the centreline passes 800 cm.</li>
        </ul>
        <p class="reward__note">
          Behavior Cloning uses none of this. Its training signal is the recorded expert trajectory
          and nothing else.
        </p>
      </div>
    </section>

    <section class="cfg">
      <h3 v-reveal>Training configuration</h3>
      <div class="cfg__scroll" v-reveal="60">
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>PPO</th>
              <th>BC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in trainingConfig" :key="row.param">
              <td>{{ row.param }}</td>
              <td class="num col-ppo">{{ row.ppo }}</td>
              <td class="num col-bc">{{ row.bc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="cfg__note meta">
        An episode counts as complete when the car crosses the finish line, and failed when it sits
        still for more than 30 seconds.
      </p>
    </section>

    <PageNav />
  </article>
</template>

<style scoped>
.flow__list {
  list-style: none;
  margin: 0 0 clamp(40px, 6vh, 72px);
  padding: 0;
  display: grid;
  gap: 0;
  border-top: 1px solid var(--line);
}

.flow__item {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: clamp(14px, 2vw, 34px);
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
  align-items: start;
}

.flow__n {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 30px;
  color: var(--kerb);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  padding-top: 2px;
}

.flow__item h3 { font-size: 21px; margin-bottom: 4px; }
.flow__item p { margin: 0; font-size: 16px; max-width: 72ch; }

.split-rule { margin-bottom: clamp(40px, 6vh, 72px); opacity: 0.5; }

.obs {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(28px, 4vw, 58px);
  align-items: start;
  margin-bottom: clamp(44px, 6vh, 76px);
}

.obs__list { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 1px; }

.obs__row {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: baseline;
  padding: 14px 16px;
  background: var(--asphalt);
  border-left: 3px solid var(--kerb);
}

.obs__row--bc { border-left-color: var(--bc); }

.obs__i {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  color: var(--dim);
}

.obs__row strong { display: block; color: var(--paper); font-weight: 500; }
.obs__note { display: block; font-size: 15px; color: var(--bone); }

.obs__who {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  letter-spacing: 0.05em;
  color: var(--dim);
  white-space: nowrap;
}

.obs__fig .frame { background: #0e0f11; }

.reward { margin-bottom: clamp(44px, 6vh, 76px); }
.reward h3 { margin-bottom: 16px; }

.reward__box {
  border: 1px solid var(--line);
  border-left: 3px solid var(--glow);
  background: var(--asphalt);
  padding: clamp(20px, 2.4vw, 34px);
}

.reward__eq {
  font-size: clamp(21px, 2.2vw, 31px);
  color: var(--paper);
  margin: 0 0 20px;
  letter-spacing: 0.02em;
}

.reward__legend { list-style: none; margin: 0 0 16px; padding: 0; display: grid; gap: 9px; }
.reward__legend li { font-size: 16px; padding-left: 18px; position: relative; max-width: 74ch; }

.reward__legend li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: 8px;
  height: 2px;
  background: var(--kerb);
}

.reward__legend b { color: var(--paper); font-weight: 600; }
.reward__note { margin: 0; color: var(--dim); font-size: 15.5px; }

.cfg h3 { margin-bottom: 16px; }
.cfg__scroll { overflow-x: auto; }
.cfg table { min-width: 520px; }
.cfg__note { margin-top: 14px; }

@media (max-width: 1000px) {
  .obs { grid-template-columns: minmax(0, 1fr); }
  .flow__item { grid-template-columns: 54px minmax(0, 1fr); }
}
</style>
