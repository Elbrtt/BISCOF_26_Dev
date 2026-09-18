<script setup>
import PageNav from '../components/PageNav.vue'
import SplitFrame from '../components/SplitFrame.vue'
import TrackLoop from '../components/TrackLoop.vue'
import HudStat from '../components/HudStat.vue'
</script>

<template>
  <article class="page">
    <header class="page__head">
      <p class="meta">Section 03 · Training</p>
      <h2 v-reveal>Eight cars learning at once, against one human doing ten clean laps.</h2>
      <p class="lede" v-reveal="90">
        The two paradigms need different things to train, so they were given different things. PPO
        spawns eight agents that explore the track in parallel and share what they learn. BC never
        explores at all — a person drives, the LearningAgentsRecorder saves the state–action
        trajectories, and the policy is fitted to them.
      </p>
    </header>

    <SplitFrame
      heading="Training"
      :left="{
        src: '/img/rl-training.jpg',
        alt: 'Eight orange agent cars spawned around the circular track for PPO training',
        tag: 'PPO · 8 parallel agents',
        tone: 'ppo',
        caption:
          'All eight start at zero and drive badly. The reward sorts them out over 1,000 iterations.'
      }"
      :right="{
        src: '/img/il-agent.jpg',
        alt: 'The yellow demonstration car being driven by a human operator',
        tag: 'BC · 10 demonstration laps',
        tone: 'bc',
        caption:
          'A human operator drives at least ten complete laps. Those laps are the entire training set.'
      }"
    />

    <section class="loops">
      <div class="loops__one" v-reveal>
        <TrackLoop :cars="8" :speed="1.1" />
        <HudStat :value="8" label="Agents exploring in parallel" tone="ppo" />
      </div>
      <div class="loops__one" v-reveal="120">
        <TrackLoop :cars="1" :speed="0.95" color="var(--bc)" :jitter="false" />
        <HudStat :value="10" label="Human demonstration laps" tone="bc" />
      </div>
      <p class="loops__note meta">
        Parallelism is PPO’s advantage and its cost: more exploration per wall-clock minute, but no
        expert to copy. BC gets a perfect teacher and one point of view.
      </p>
    </section>

    <section class="engine">
      <div class="engine__text">
        <h3 v-reveal>Inside the engine</h3>
        <p v-reveal="60">
          Everything runs in Blueprint. The imitation trainer is assembled from the Learning Agents
          manager, interactor, policy and communicator, then driven each tick while the recording
          is replayed. No external simulator, no Python glue — which is the practical argument for
          using UE5 for this kind of study at all.
        </p>
        <p v-reveal="90">
          The same setup logs lap seconds and episode counts straight to the output log, so the
          evaluation numbers come out of the engine rather than out of a separate harness.
        </p>
      </div>

      <div class="engine__figs">
        <figure v-reveal="60">
          <div class="frame">
            <img src="/img/il-trainer.jpg" alt="Blueprint graph constructing and running the Learning Agents imitation trainer" />
          </div>
          <figcaption>Make Imitation Trainer, wired to the manager, interactor, policy and communicator, then run every tick.</figcaption>
        </figure>
        <figure v-reveal="120">
          <div class="frame">
            <img src="/img/il-editor.jpg" alt="The Unreal Engine editor during an imitation learning session with lap times in the output log" />
          </div>
          <figcaption>A live session in the editor. Lap seconds and failed laps are printed to the output log as they happen.</figcaption>
        </figure>
      </div>
    </section>

    <PageNav />
  </article>
</template>

<style scoped>
.loops {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(24px, 4vw, 70px);
  align-items: start;
  margin: clamp(48px, 7vh, 90px) 0;
  max-width: 940px;
}

.loops__one { display: grid; gap: 22px; justify-items: center; text-align: center; }
.loops__one svg { max-width: 300px; }
.loops__note { grid-column: 1 / -1; max-width: 62ch; }

.engine {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(26px, 4vw, 60px);
  align-items: start;
}

.engine__figs { display: grid; gap: clamp(20px, 2.4vw, 32px); }
.engine__figs .frame { background: #0e0f11; }

@media (max-width: 1000px) {
  .loops,
  .engine { grid-template-columns: minmax(0, 1fr); }
}
</style>
