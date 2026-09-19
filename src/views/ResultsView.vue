<script setup>
import PageNav from '../components/PageNav.vue'
import HudStat from '../components/HudStat.vue'
import CompletionRing from '../components/CompletionRing.vue'
import LapTimeRange from '../components/LapTimeRange.vue'
import DistributionCurve from '../components/DistributionCurve.vue'
import RewardBand from '../components/RewardBand.vue'
import SplitFrame from '../components/SplitFrame.vue'
import { results, findings } from '../data/paper'
</script>

<template>
  <article class="page">
    <header class="page__head">
      <p class="meta">Section 04 · Results over {{ results.episodes }} inference episodes</p>
      <h2 v-reveal>PPO finishes more laps. BC drives more predictably.</h2>
      <p class="lede" v-reveal="90">
        Both agents were released onto the primary training track for 200 episodes under identical
        conditions. An episode ends at the finish line, or fails if the car stands still for
        30 seconds.
      </p>
    </header>

    <section class="readout" v-reveal>
      <HudStat :value="results.ppo.completion" :decimals="1" suffix="%" label="PPO laps completed" tone="ppo" />
      <HudStat :value="results.bc.completion" :decimals="1" suffix="%" label="BC laps completed" tone="bc" />
      <HudStat :value="results.welch.diff" :decimals="2" suffix="s" label="Mean lap time in PPO's favour" />
      <HudStat :value="results.bc.failed" label="BC failed episodes" tone="bc" />
    </section>

    <div class="kerb kerb--thin rule"></div>

    <SplitFrame
      heading="Evaluation"
      :left="{
        src: '/img/rl-evaluation.jpg',
        alt: 'Top-down view of the PPO agent lapping the track during evaluation',
        tag: 'PPO · lap in 9.64 s',
        tone: 'ppo',
        caption: 'The reinforcement agent holds a tight line and recovers when it drifts wide.'
      }"
      :right="{
        src: '/img/il-evaluation.jpg',
        alt: 'Top-down view of the Behavior Cloning agent during evaluation',
        tag: 'BC · replaying the demonstration',
        tone: 'bc',
        caption: 'The imitation agent reproduces the human line faithfully — until it leaves it.'
      }"
    />

    <section class="rings">
      <h3 v-reveal>Completion reliability</h3>
      <div class="rings__body">
        <div class="rings__pair">
          <CompletionRing
            v-reveal
            :percent="results.ppo.completion"
            :completed="results.ppo.completed"
            :failed="results.ppo.failed"
            label="PPO"
            tone="ppo"
            sub="Twenty of the first twenty episodes finished, with no failures at all."
          />
          <CompletionRing
            v-reveal="140"
            :percent="results.bc.completion"
            :completed="results.bc.completed"
            :failed="results.bc.failed"
            label="BC"
            tone="bc"
            sub="Failures cluster in the first eighty episodes, then taper off."
          />
        </div>
        <p class="rings__note" v-reveal="200">
          Thirteen percentage points separate them. BC’s failures are covariate shift in plain
          sight: when the car reaches a state the ten demonstration laps never covered, the policy
          has no recovery behaviour to fall back on. PPO met those states during training and was
          paid to get out of them.
        </p>
      </div>
    </section>

    <section class="chart" v-reveal>
      <h3>Lap time, slowest to fastest</h3>
      <LapTimeRange :ppo="results.ppo" :bc="results.bc" />
    </section>

    <section class="chart" v-reveal>
      <h3>Where the laps land</h3>
      <DistributionCurve :ppo="results.ppo" :bc="results.bc" />
    </section>

    <section class="ttest" v-reveal>
      <div class="ttest__figures">
        <HudStat :value="results.welch.t" :decimals="2" label="Welch's t" />
        <HudStat :value="results.welch.df" :decimals="1" label="Degrees of freedom" />
        <HudStat :value="results.welch.p" label="Significance" :animate="false" />
      </div>
      <p class="ttest__body">
        An independent-samples Welch’s t-test on the successful laps confirms the 0.68 s gap is not
        noise: PPO 9.99 ± 1.08 s across 198 laps against BC 10.68 ± 0.59 s across 172. The
        difference is statistically robust.
      </p>
    </section>

    <section class="chart" v-reveal>
      <h3>PPO reward held steady all the way through</h3>
      <RewardBand
        :mean="results.ppo.reward.mean"
        :sd="results.ppo.reward.sd"
        :in-band="results.ppo.reward.inBand"
        :episodes="results.episodes"
      />
    </section>

    <section class="findings">
      <h3 v-reveal>Reading the numbers</h3>
      <div class="findings__grid">
        <div v-for="(f, i) in findings" :key="f.head" class="findings__item" v-reveal="i * 90">
          <h4>{{ f.head }}</h4>
          <p>{{ f.body }}</p>
        </div>
      </div>
    </section>

    <PageNav />
  </article>
</template>

<style scoped>
.readout {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 44px);
  padding: 8px 0 34px;
}

.rule { margin-bottom: clamp(38px, 6vh, 66px); opacity: 0.5; }

.rings { margin: clamp(48px, 7vh, 88px) 0; }
.rings h3 { margin-bottom: 26px; }

.rings__body {
  display: grid;
  grid-template-columns: minmax(0, 480px) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}

.rings__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(20px, 2.4vw, 40px);
}

.rings__note { margin: 0; max-width: 72ch; font-size: 1.25rem}

.chart { margin: clamp(44px, 6vh, 78px) 0; }
.chart h3 { margin-bottom: 20px; }

.ttest {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: clamp(26px, 3vw, 42px) 0;
  margin: clamp(44px, 6vh, 78px) 0;
}

.ttest__figures {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, auto));
  justify-content: start;
  gap: clamp(18px, 2.6vw, 40px);
}
.ttest__figures :deep(.hud-value) { font-size: clamp(34px, 3.2vw, 46px); }
.ttest__body { margin: 0; }

.findings__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(20px, 2.4vw, 36px);
  margin-top: 22px;
}

.findings__item { border-top: 2px solid var(--kerb); padding-top: 16px; }
.findings__item:nth-child(2) { border-top-color: var(--bc); }
.findings__item:nth-child(3) { border-top-color: var(--dim); }

.findings__item h4 {
  font-family: 'Tinos', serif;
  font-weight: 400;
  font-size: 21px;
  color: var(--paper);
  margin: 0 0 8px;
  line-height: 1.24;
}

.findings__item p { font-size: 16px; margin: 0; }

@media (max-width: 1000px) {
  .readout { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rings__body { grid-template-columns: minmax(0, 1fr); }
  .rings__note { max-width: none; }
  .ttest,
  .findings__grid { grid-template-columns: minmax(0, 1fr); }
}

@media (max-width: 560px) {
  .rings__pair { grid-template-columns: minmax(0, 1fr); max-width: 260px; margin-inline: auto; }
}
</style>
