<script setup>
import { ref, computed, watch, inject } from 'vue'
import { DATA } from '../data/data.js'
import { useSelection } from '../composables/useSelection.js'
import { useAudio } from '../composables/useAudio.js'
import { useProgress } from '../composables/useProgress.js'

const toast = inject('toast', () => {})
const emit = defineEmits(['navigate'])
const { grade, term, unit, setGrade, setTerm, setUnit } = useSelection()
const { play } = useAudio()
const { score, addScore, addWrong } = useProgress()

const grades = Object.keys(DATA)
const terms = computed(() => Object.keys(DATA[grade.value]))
const units = computed(() => DATA[grade.value][term.value])

const cur = ref(null)
const opts = ref([])
const qnum = ref(1)
const total = ref(0)
const roundDone = ref(0)
const answered = ref(false)
const picked = ref(-1)
const roundTotal = computed(() => (unit.value.w || []).length)
let pool = []

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
  if (!pool.length) pool = shuffle(words.slice())
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
</script>

<template>
  <view class="view quiz-view">
    <view class="tabs">
      <view v-for="g in grades" :key="g" class="chip" :class="{ sel: g === grade }" hover-class="chip-hover" @click="setGrade(g)">{{ g }}</view>
    </view>
    <view class="tabs">
      <view v-for="t in terms" :key="t" class="chip" :class="{ sel: t === term }" hover-class="chip-hover" @click="setTerm(t)">{{ t }}</view>
    </view>
    <view class="tabs unit-row">
      <view v-for="u in units" :key="u.t" class="chip" :class="{ sel: u.t === unit.t }" hover-class="chip-hover" @click="setUnit(u)">{{ u.t }}</view>
    </view>

    <view class="quiz-card" v-if="cur">
      <view class="quiz-q">听一听，选出正确的图（第 {{ qnum }} / {{ roundTotal }} 题）</view>
      <view class="big-speak" hover-class="bs-hover" @click="play(cur[0], 'w')">
        <image class="horn-ico" src="/static/icons/png/horn.png" mode="aspectFit"/>
      </view>
      <view class="options">
        <view v-for="(o, i) in opts" :key="i" class="opt" :class="optClass(i)" hover-class="opt-hover" @click="choose(i)">
          <text class="o-pic">{{ o[2] }}</text>
          <text class="o-word">{{ o[1] }}</text>
        </view>
      </view>
      <view class="quiz-bar">
        <view class="qb-stats">
          <view class="qb-item">已收集 <text class="b">{{ score }}</text>
            <image class="qb-coin" src="/static/icons/png/coin.png" mode="aspectFit"/>
          </view>
          <text class="qb-dot">·</text>
          <view class="qb-item">已答 <text class="b">{{ total }}</text> 题</view>
        </view>
        <view class="qb-skip" hover-class="btn-hover" @click="skip">换一题</view>
      </view>
    </view>
  </view>
</template>
