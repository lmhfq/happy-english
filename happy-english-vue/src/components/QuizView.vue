<script setup>
import { ref, computed, watch } from 'vue'
import { DATA } from '../data.js'
import { useSelection } from '../composables/useSelection.js'
import { useAudio } from '../composables/useAudio.js'
import { useProgress } from '../composables/useProgress.js'

const emit = defineEmits(['navigate'])
const { grade, term, unit, setGrade, setTerm, setUnit } = useSelection()
const { play } = useAudio()
const { score, addScore, addWrong } = useProgress()

const grades = Object.keys(DATA)
const terms = computed(() => Object.keys(DATA[grade.value]))
const units = computed(() => DATA[grade.value][term.value])

const cur = ref(null)
const opts = ref([])
const qnum = ref(1)             // 本轮第几题
const total = ref(0)            // 已答总题数
const roundDone = ref(0)        // 本轮已答完的题数
const answered = ref(false)
const picked = ref(-1)
const roundTotal = computed(() => (unit.value.w || []).length)   // 本轮总题数 = 当前单元词数
let pool = []                   // 本轮未出过的词

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function correctIdx() { return opts.value.findIndex(o => o[0] === cur.value[0]) }

function buildOpts(word, words) {
  const rest = words.filter(w => w[0] !== word[0])
  shuffle(rest)
  opts.value = shuffle([word, ...rest.slice(0, 3)])
  answered.value = false
  picked.value = -1
}

function nextQ() {
  const words = unit.value.w
  if (!pool.length) pool = shuffle(words.slice())   // 一轮取完 → 重新开池
  cur.value = pool.shift()
  buildOpts(cur.value, words)
  qnum.value = roundDone.value + 1
  setTimeout(() => play(cur.value[0], 'w'), 350)
}
nextQ()
watch(unit, () => { roundDone.value = 0; pool = []; nextQ() })

function choose(i) {
  if (answered.value) return
  answered.value = true
  picked.value = i
  if (opts.value[i][0] === cur.value[0]) {
    addScore(1)
    toast('答对啦！太棒了 +1')
  } else {
    addWrong(cur.value[0], cur.value[1])
    toast('再试试，正确答案是「' + cur.value[1] + '」')
  }
  setTimeout(() => {
    total.value++
    roundDone.value++
    if (roundDone.value >= roundTotal.value) {
      roundDone.value = 0
      toast('一轮完成！接着来一轮')
    }
    nextQ()
  }, 1300)
}
// 换一题：换个词但不动题号（本轮没答完，仍算同一题）
function skip() {
  const words = unit.value.w
  const others = words.filter(w => w[0] !== (cur.value ? cur.value[0] : ''))
  if (!others.length) return
  cur.value = others[Math.floor(Math.random() * others.length)]
  buildOpts(cur.value, words)
  setTimeout(() => play(cur.value[0], 'w'), 350)
}

function optClass(i) {
  if (!answered.value) return {}
  if (i === correctIdx()) return { correct: true, locked: true }
  if (i === picked.value) return { wrong: true, locked: true }
  return { locked: true }
}

let toastTimer
function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return
  t.textContent = msg; t.classList.add('show')
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1600)
}
</script>

<template>
  <div class="view quiz-view">
    <div class="tabs">
      <button v-for="g in grades" :key="g" class="chip" :class="{ sel: g === grade }" @click="setGrade(g)">{{ g }}</button>
    </div>
    <div class="tabs">
      <button v-for="t in terms" :key="t" class="chip" :class="{ sel: t === term }" @click="setTerm(t)">{{ t }}</button>
    </div>
    <div class="tabs unit-row">
      <button v-for="u in units" :key="u.t" class="chip" :class="{ sel: u.t === unit.t }" @click="setUnit(u)">{{ u.t }}</button>
    </div>

    <div class="quiz-card" v-if="cur">
      <div class="quiz-q">听一听，选出正确的图（第 {{ qnum }} / {{ roundTotal }} 题）</div>
      <button class="big-speak" @click="play(cur[0], 'w')" aria-label="再听一次">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10v4h4l5 5V5L7 10H3z"/><path d="M16 8a5 5 0 0 1 0 8"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
      </button>
      <div class="options">
        <button v-for="(o, i) in opts" :key="i" class="opt" :class="optClass(i)" @click="choose(i)">
          <span class="o-pic">{{ o[2] }}</span>
          <span class="o-word">{{ o[1] }}</span>
        </button>
      </div>
      <div class="quiz-bar">
        <div class="qb-stats">
          <span class="qb-item">已收集 <b>{{ score }}</b>
            <svg class="qb-coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.3" fill="#FFCB3D" stroke="#E0A000" stroke-width="1.3"/><circle cx="12" cy="12" r="6.2" fill="none" stroke="#E0A000" stroke-width="1"/><path d="M12 8 V16 M8.8 10.6 H15.2 M9.3 12.4 H14.7 M10.6 14.3 L12 16 L13.4 14.3" fill="none" stroke="#B5780A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="qb-dot">·</span>
          <span class="qb-item">已答 <b>{{ total }}</b> 题</span>
        </div>
        <button class="qb-skip" @click="skip">换一题</button>
      </div>
    </div>
  </div>
</template>
