<script setup>
import { ref, computed } from 'vue'
import { DIALOGUES } from '../data.js'
import { useAudio } from '../composables/useAudio.js'

const { play, playSequence } = useAudio()
const showId = ref(null)
const current = computed(() => DIALOGUES.find(d => d.id === showId.value) || null)

function open(id) { showId.value = id }
function back() {
  if (showId.value) { showId.value = null; return true }
  return false
}
function playAll(lines) {
  playSequence(lines.map(l => l.en), 'd')
}
defineExpose({ back })
</script>

<template>
  <div class="view">
    <template v-if="!current">
      <div class="section-label">选择一个场景，点句子就能听</div>
      <div class="scene-grid">
        <button v-for="d in DIALOGUES" :key="d.id" class="scene" @click="open(d.id)">
          <span class="s-emoji">{{ d.icon }}</span>
          <span><h4>{{ d.title }}</h4><p>{{ d.sub }}</p></span>
        </button>
      </div>
    </template>

    <template v-else>
      <div class="section-label">{{ current.icon }} {{ current.title }} · 点句子听发音</div>
      <div class="dialogue">
        <div class="line" v-for="(l, i) in current.lines" :key="i">
          <div class="who" :class="{ b: i % 2 }">{{ l.who }}</div>
          <div class="bubble-text" @click="play(l.en, 'd')">
            <div class="en">{{ l.en }}</div>
            <div class="zh">{{ l.zh }}</div>
            <span class="play">点我听一听</span>
          </div>
        </div>
      </div>
      <div class="controls" style="justify-content:center;">
        <button class="btn primary" @click="playAll(current.lines)">一句句读给我听</button>
      </div>
    </template>
  </div>
</template>
