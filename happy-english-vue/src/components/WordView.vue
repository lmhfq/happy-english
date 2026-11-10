<script setup>
import { ref, computed, watch } from 'vue'
import { DATA } from '../data.js'
import { useSelection } from '../composables/useSelection.js'
import { useAudio } from '../composables/useAudio.js'

const { grade, term, unit, setGrade, setTerm, setUnit } = useSelection()
const { play } = useAudio()

const grades = Object.keys(DATA)
const terms = computed(() => Object.keys(DATA[grade.value]))
const units = computed(() => DATA[grade.value][term.value])

const idx = ref(0)
const known = ref(new Set())
const order = ref([])

function buildOrder() {
  order.value = units.value.map((_, i) => i)
  idx.value = 0
}
buildOrder()
watch(unit, () => buildOrder())

const words = computed(() => (unit.value ? unit.value.w : []))
const item = computed(() => words.value[order.value[idx.value] ?? 0])
const knownCount = computed(() => words.value.filter(w => known.value.has(w[0])).length)
const alt = computed(() => idx.value % 2 === 1)

function speakWord() { if (item.value) play(item.value[0], 'w') }
function next() { if (words.value.length) idx.value = (idx.value + 1) % words.value.length }
function prev() { if (words.value.length) idx.value = (idx.value - 1 + words.value.length) % words.value.length }
function markKnown() {
  const w = item.value[0]
  if (known.value.has(w)) { toast('已经会啦～'); return }
  const s = new Set(known.value); s.add(w); known.value = s
  toast('真棒！记住啦')
}
function shuffleOrder() {
  const a = units.value.map((_, i) => i)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
  }
  order.value = a; idx.value = 0; toast('顺序打乱啦！')
}

let toastTimer
function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return
  t.textContent = msg; t.classList.add('show')
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1600)
}
</script>

<template>
  <div class="view word-view">
    <div class="tabs">
      <button v-for="g in grades" :key="g" class="chip" :class="{ sel: g === grade }" @click="setGrade(g)">{{ g }}</button>
    </div>
    <div class="tabs">
      <button v-for="t in terms" :key="t" class="chip" :class="{ sel: t === term }" @click="setTerm(t)">{{ t }}</button>
    </div>
    <div class="tabs unit-row">
      <button v-for="u in units" :key="u.t" class="chip" :class="{ sel: u.t === unit.t }" @click="setUnit(u)">{{ u.t }}</button>
    </div>

    <div class="flash" v-if="item">
      <span class="prog-tag left">已认识 <b>{{ knownCount }}</b></span>
      <div class="prog-right">
        <button class="icon-btn" @click="shuffleOrder" aria-label="打乱顺序" title="打乱顺序">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>
          </svg>
        </button>
        <span class="prog-tag right">共 {{ words.length }} 个</span>
      </div>

      <div class="flash-main">
        <div class="pic" :class="{ alt }">{{ item[2] }}</div>
        <div class="word" @click="speakWord">{{ item[0] }}</div>
        <div class="zh">{{ item[1] }}</div>
        <button class="speak" @click="speakWord" aria-label="听发音">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10v4h4l5 5V5L7 10H3z"/><path d="M16 8a5 5 0 0 1 0 8"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
        </button>
      </div>

      <div class="word-actions">
        <button class="btn" @click="prev">上一个</button>
        <button class="btn green" @click="markKnown">我认识啦</button>
        <button class="btn" @click="next">下一个</button>
      </div>
    </div>
  </div>
</template>
