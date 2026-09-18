import { createRouter, createWebHashHistory } from 'vue-router'

import TitleView from '../views/TitleView.vue'
import QuestionView from '../views/QuestionView.vue'
import MethodView from '../views/MethodView.vue'
import TrainingView from '../views/TrainingView.vue'
import ResultsView from '../views/ResultsView.vue'
import ConclusionView from '../views/ConclusionView.vue'

const routes = [
  { path: '/', name: 'title', component: TitleView, meta: { index: 0 } },
  { path: '/question', name: 'question', component: QuestionView, meta: { index: 1 } },
  { path: '/method', name: 'method', component: MethodView, meta: { index: 2 } },
  { path: '/training', name: 'training', component: TrainingView, meta: { index: 3 } },
  { path: '/results', name: 'results', component: ResultsView, meta: { index: 4 } },
  { path: '/conclusion', name: 'conclusion', component: ConclusionView, meta: { index: 5 } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  // hash history keeps the build runnable from any static host or a USB stick at the booth
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
