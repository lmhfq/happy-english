<script setup>
import { ref, computed, watch, inject } from 'vue'
import { DATA } from '../data/data.js'
import { useSelection } from '../composables/useSelection.js'
import { useAudio } from '../composables/useAudio.js'

const toast = inject('toast', () => {})
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
</script>

<template>
  <view class="view word-view">
    <view class="tabs">
      <view v-for="g in grades" :key="g" class="chip" :class="{ sel: g === grade }" hover-class="chip-hover" @click="setGrade(g)">{{ g }}</view>
    </view>
    <view class="tabs">
      <view v-for="t in terms" :key="t" class="chip" :class="{ sel: t === term }" hover-class="chip-hover" @click="setTerm(t)">{{ t }}</view>
    </view>
    <view class="tabs unit-row">
      <view v-for="u in units" :key="u.t" class="chip" :class="{ sel: u.t === unit.t }" hover-class="chip-hover" @click="setUnit(u)">{{ u.t }}</view>
    </view>

    <view class="flash" v-if="item">
      <view class="prog-tag left">已认识 <text class="b">{{ knownCount }}</text></view>
      <view class="prog-right">
        <view class="icon-btn" hover-class="ib-hover" @click="shuffleOrder">
          <image class="ico" src="/static/icons/png/shuffle.png" mode="aspectFit"/>
        </view>
        <view class="prog-tag right">共 {{ words.length }} 个</view>
      </view>

      <view class="flash-main">
        <text class="pic" :class="{ alt }">{{ item[2] }}</text>
        <text class="word" @click="speakWord">{{ item[0] }}</text>
        <text class="zh">{{ item[1] }}</text>
        <view class="speak" hover-class="speak-hover" @click="speakWord">
          <image class="horn-ico" src="/static/icons/png/horn.png" mode="aspectFit"/>
        </view>
      </view>

      <view class="word-actions">
        <view class="btn" hover-class="btn-hover" @click="prev">上一个</view>
        <view class="btn green" hover-class="btn-hover" @click="markKnown">我认识啦</view>
        <view class="btn" hover-class="btn-hover" @click="next">下一个</view>
      </view>
    </view>
  </view>
</template>
