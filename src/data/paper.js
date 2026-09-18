// All figures below are taken from the group's final paper.
// Single source of truth for the whole site — edit here, not in the views.

export const paper = {
  title: 'Comparison of Self-Learning Agents Using Reinforcement Learning and Imitation Learning in Unreal Engine 5',
  shortTitle: 'Self-Learning Agents in Unreal Engine 5',
  venue: 'Computer Science Department, School of Computer Science',
  institution: 'Bina Nusantara University · Jakarta, Indonesia',
  group: 'Group 8',
  repo: 'https://github.com/Elbrtt/Learning_Agent',
  pdf: 'paper/FinalPaper_Group8.pdf',
  keywords: [
    'reinforcement learning',
    'imitation learning',
    'behavior cloning',
    'PPO',
    'autonomous driving',
    'Unreal Engine 5',
    'Learning Agents'
  ],
  abstract:
    'A comparative study of two self-learning agent paradigms implemented inside Unreal Engine 5 with the Learning Agents plugin: Proximal Policy Optimization, a policy-gradient reinforcement learning algorithm, and Behavior Cloning, a supervised imitation method. Both agents are trained and evaluated on the same autonomous driving track so the comparison is fair. Behavior Cloning starts stronger thanks to expert demonstrations, but PPO wins on long-term performance and on generalization to track configurations it has not seen.'
}

export const authors = [
  { n: '1st', name: 'Aurelius Elbert', mail: 'aurelius.panatasetya@binus.ac.id', role: 'Conceptualization, Software, Investigation, Data Curation, Writing' },
  { n: '2nd', name: 'Davin Juandika', mail: 'davin.juandika@binus.ac.id', role: 'Conceptualization, Methodology, Writing' },
  { n: '3rd', name: 'Fransiskus Xaverius Kevin', mail: 'fransiskus.kevin002@binus.ac.id', role: 'Conceptualization, Formal Analysis, Visualization, Writing' },
  { n: '4th', name: 'Rhio Sutoyo', mail: 'rsutoyo@binus.edu', role: 'Supervision, Review & Editing' },
  { n: '5th', name: 'Gabriel Asael Tarigan', mail: 'gabriel.tarigan001@binus.ac.id', role: 'Supervision, Review & Editing' }
]

export const agents = {
  ppo: {
    key: 'ppo',
    name: 'PPO',
    full: 'Proximal Policy Optimization',
    family: 'Reinforcement Learning',
    line: 'Learns by driving badly, getting punished, and trying again.',
    color: 'var(--kerb)'
  },
  bc: {
    key: 'bc',
    name: 'BC',
    full: 'Behavior Cloning',
    family: 'Imitation Learning',
    line: 'Learns by watching a human drive ten clean laps.',
    color: 'var(--bc)'
  }
}

/* ---------- III. Methodology ---------- */

export const pipeline = [
  { step: 'Problem definition', detail: 'Ask how well agents from different learning paradigms can navigate a track safely.' },
  { step: 'Environment setup in UE5', detail: 'Unreal Engine 5.6.1, Learning Agents plugin, a closed-loop track defined by a Spline, Chaos Vehicle Physics for the car.' },
  { step: 'Observation & reward design', detail: 'Three shared observations for PPO; BC receives a fourth, the vehicle yaw angle.' },
  { step: 'Parallel training', detail: 'PPO runs eight agents at once. BC records ten human demonstration laps with the LearningAgentsRecorder.' },
  { step: 'Agent inference & evaluation', detail: '200 inference episodes per agent on the primary training track.' },
  { step: 'Metrics collection', detail: 'Cumulative reward (PPO only), lap completion rate, average lap time.' },
  { step: 'Conclusion & contributions', detail: 'Compare the two paradigms and mark out what to try next.' }
]

export const observations = [
  { i: 1, label: 'Location along spline', who: 'both', note: 'Vehicle position projected onto the reference path.' },
  { i: 2, label: 'Direction vs spline tangent', who: 'both', note: 'How far the car points away from the racing line.' },
  { i: 3, label: 'Current velocity', who: 'both', note: 'Vehicle speed vector.' },
  { i: 4, label: 'Vehicle yaw angle', who: 'bc', note: 'Extra orientation cue, added to compensate for single-agent training.' }
]

export const trainingConfig = [
  { param: 'Learning rate — policy', ppo: '1 × 10⁻³', bc: '1 × 10⁻²' },
  { param: 'Learning rate — critic', ppo: '1 × 10⁻²', bc: 'N/A' },
  { param: 'Clip ratio (ε)', ppo: '0.2', bc: 'N/A' },
  { param: 'Discount factor (γ)', ppo: '0.99', bc: 'N/A' },
  { param: 'Training episodes', ppo: '1,000', bc: '1,000' },
  { param: 'Training iterations', ppo: '1,000', bc: '1,000' },
  { param: 'Demonstration laps', ppo: 'N/A', bc: '10' },
  { param: 'Observation dimension', ppo: '6', bc: '6' },
  { param: 'Action dimension', ppo: '3', bc: '3' },
  { param: 'Parallel agents', ppo: '8', bc: '1' }
]

/* ---------- IV. Results ---------- */

export const results = {
  episodes: 200,
  ppo: {
    completion: 99.0,
    completed: 198,
    failed: 2,
    mean: 9.99,
    sd: 1.08,
    min: 9.19,
    max: 18.33,
    reward: { mean: 0.464, sd: 0.045, inBand: 87.4 },
    early: { done: 20, of: 20, mean: 10.21 }
  },
  bc: {
    completion: 86.0,
    completed: 172,
    failed: 28,
    mean: 10.68,
    sd: 0.59,
    min: 9.38,
    max: 13.42,
    reward: null,
    early: { done: 15, of: 20, mean: 10.74 }
  },
  welch: { t: -7.66, df: 312.4, p: 'p ≪ 0.001', diff: 0.68 },
  peakBin: { range: '9.5 – 10.0 s', count: 142, share: 71.7 }
}

export const findings = [
  {
    head: 'Completion reliability is the decisive gap',
    body:
      'PPO finished 198 of 200 episodes against 172 for BC — thirteen percentage points apart. BC fails through distributional shift: once the car drifts into a state the expert never demonstrated, a supervised regression policy has nothing to recover with. PPO met far more states during reward-driven exploration, and the −10.0 track-deviation penalty taught it to steer back.'
  },
  {
    head: 'PPO is faster, BC is steadier',
    body:
      'PPO laps 0.68 s quicker on average, and Welch’s t-test puts that difference well past chance. But BC’s standard deviation is roughly half of PPO’s: the imitation policy replays one repeatable trajectory, while PPO optimises reward and so produces both the quickest laps and the occasional 18-second outlier.'
  },
  {
    head: 'The two agents were not trained under equal conditions',
    body:
      'PPO used eight parallel agents; BC used one agent and ten expert laps, plus an extra yaw observation. The asymmetry was deliberate — each paradigm was given what it needs — and the results should be read with that in mind.'
  }
]

export const literature = [
  { n: 1, author: 'Shi et al. (2024)', method: 'PPO + human intervention', domain: 'Driving sim', result: 'Human feedback speeds up convergence' },
  { n: 2, author: 'Huang (2022)', method: 'Parallel PPO & SAC', domain: 'CARLA', result: 'Parallelism cuts training time' },
  { n: 3, author: 'Chen et al. (2024)', method: 'Survey: IL vs RL', domain: 'AV survey', result: 'IL suits short-term, RL suits long-term tasks' },
  { n: 4, author: 'Bronstein et al. (2022)', method: 'Hierarchical model-based IL', domain: 'Urban driving', result: 'Hierarchical IL lowers failure rate' },
  { n: 5, author: 'Muzahid et al. (2021)', method: 'PPO vs SAC', domain: 'Multi-agent sim', result: 'PPO more stable, SAC higher peak' },
  { n: 6, author: 'Jorgensen (2023)', method: 'PPO in UE5', domain: 'Game environment', result: 'UE5 plugin is viable for RL research' },
  { n: 7, author: 'Shao et al. (2023)', method: 'PPO + reward shaping', domain: 'CARLA safety', result: 'Reward design drives generalization' },
  { n: 8, author: 'Siboo et al. (2024)', method: 'PPO vs DDPG', domain: 'Auto racing', result: 'PPO balances stability and speed' },
  { n: 9, author: 'Dang et al. (2024)', method: 'DDPG & MPC', domain: 'Path following', result: 'RL outperforms rule-based MPC' },
  { n: 10, author: 'Kargar & Kyrki (2023)', method: 'Policy efficiency via RL', domain: 'Auto driving', result: 'Skill reuse improves performance' }
]

export const futureWork = [
  { head: 'Swap BC for DAgger', body: 'Online imitation collects corrective expert feedback for the states the policy actually visits, which is the direct fix for covariate shift.' },
  { head: 'Test on unseen tracks', body: 'Everything here was measured on the training track. Transfer performance is still an open number.' },
  { head: 'Warm-start PPO with BC', body: 'Initialise the policy by imitation, then fine-tune with reinforcement learning — fast convergence plus long-term robustness.' },
  { head: 'Record more drivers', body: 'Demonstrations from several people, across varied conditions, would widen BC’s state coverage without any reward engineering.' },
  { head: 'Richer perception', body: 'LiDAR-style raycasts or camera input would move the simulation closer to real autonomous driving.' }
]

export const references = [
  'R. S. Sutton and A. G. Barto, Reinforcement Learning: An Introduction, 2nd ed. MIT Press, 2018.',
  'V. Mnih et al., “Human-level control through deep reinforcement learning,” Nature, vol. 518, no. 7540, 2015.',
  'L. Chen, P. Wu, K. Chitta, B. Jaeger, A. Geiger, and H. Li, “End-to-end autonomous driving: Challenges and frontiers,” IEEE TPAMI, vol. 46, no. 2, 2024.',
  'J. Schulman, F. Wolski, P. Dhariwal, A. Radford, and O. Klimov, “Proximal policy optimization algorithms,” 2017.',
  'S. Ross, G. J. Gordon, and J. A. Bagnell, “A reduction of imitation learning and structured prediction to no-regret online learning,” AISTATS, vol. 15, 2011.',
  'A. J. M. Muzahid, S. F. Kamarulzaman, and M. A. Rahman, “Comparison of PPO and SAC algorithms towards decision making strategies for collision avoidance,” ICSECS-ICOCSIM, 2021.',
  'S. Siboo et al., “An empirical study of DDPG and PPO-based reinforcement learning for autonomous racing,” MLRC, vol. 242, 2024.',
  'M. Bronstein et al., “Hierarchical model-based imitation learning for planning in autonomous driving,” IROS, 2022.',
  'B. Mulcahy, “Learning agents introduction (5.5),” Epic Games Developer Community, 2024.',
  'A. Dosovitskiy et al., “CARLA: An open urban driving simulator,” CoRL, vol. 78, 2017.',
  'Epic Games, “Learning agents plugin documentation (UE 5.5),” Unreal Engine Developer Community, 2024.',
  'G. Shi, Q. Zhao, J. Wang, and X. Dong, “Research on reinforcement learning based on PPO algorithm for human-machine intervention in autonomous driving,” Electronic Research Archive, vol. 32, no. 4, 2024.',
  'Z. Huang, “Distributed reinforcement learning for autonomous driving,” Master’s thesis, Carnegie Mellon University, 2022.',
  'J. Jorgensen, “Killers and explorers: Training RL agents in Unreal Engine,” Medium, 2023.',
  'H. Shao et al., “ReasonNet: End-to-end driving with temporal and global reasoning,” CVPR, 2023.',
  'D. Dang et al., “Event-triggered model predictive control with deep reinforcement learning for autonomous driving,” IEEE T-IV, 2024.',
  'E. Kargar and V. Kyrki, “Increasing the efficiency of policy learning for autonomous driving,” RSS, 2023.'
]

export const sections = [
  { id: 1, to: '/', label: 'Title', short: 'Title' },
  { id: 2, to: '/question', label: 'The question', short: 'Question' },
  { id: 3, to: '/method', label: 'Method', short: 'Method' },
  { id: 4, to: '/training', label: 'Training', short: 'Training' },
  { id: 5, to: '/results', label: 'Results', short: 'Results' },
  { id: 6, to: '/conclusion', label: 'Conclusion', short: 'End' }
]
