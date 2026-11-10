<script setup>
import { ref, computed } from 'vue'
import { DIALOGUES } from '../data/data.js'
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
  <view class="view">
    <template v-if="!current">
      <view class="section-label">选择一个场景，点句子就能听</view>
      <view class="scene-grid">
        <view v-for="d in DIALOGUES" :key="d.id" class="scene" hover-class="scene-hover" @click="open(d.id)">
          <text class="s-emoji">{{ d.icon }}</text>
          <view class="scene-txt">
            <text class="s-h4">{{ d.title }}</text>
            <text class="s-p">{{ d.sub }}</text>
          </view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="section-label"><text>{{ current.icon }} {{ current.title }} · 点句子听发音</text></view>
      <view class="dialogue">
        <view class="line" v-for="(l, i) in current.lines" :key="i">
          <text class="who" :class="{ b: i % 2 }">{{ l.who }}</text>
          <view class="bubble-text" hover-class="bt-hover" @click="play(l.en, 'd')">
            <text class="en">{{ l.en }}</text>
            <text class="zh">{{ l.zh }}</text>
            <text class="play">点我听一听</text>
          </view>
        </view>
      </view>
      <view class="controls" style="justify-content:center;">
        <view class="btn primary" hover-class="btn-hover" @click="playAll(current.lines)">一句句读给我听</view>
      </view>
    </template>
  </view>
</template>
