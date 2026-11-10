<script setup>
import { useProgress } from '../composables/useProgress.js'
import { useAudio } from '../composables/useAudio.js'

const { wrong, removeWrong } = useProgress()
const { play } = useAudio()
</script>

<template>
  <div class="view center-view">
    <h2 class="center-title">错题本</h2>

    <div class="block">
      <h3>错词本 <span class="muted">（{{ wrong.length }} 个）</span></h3>
      <p class="hint">闯关答错的单词会自动收进这里。点小喇叭听发音，记牢了就点 ✕ 删掉。</p>
      <div v-if="!wrong.length" class="empty">太棒了，暂时没有错词！</div>
      <div v-else class="wrong-list">
        <div class="wrong-item" v-for="w in wrong" :key="w.en">
          <button class="mini-speak" @click="play(w.en, 'w')" aria-label="听发音">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10v4h4l5 5V5L7 10H3z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>
          </button>
          <span class="w-en">{{ w.en }}</span>
          <span class="w-zh">{{ w.zh }}</span>
          <button class="w-del" @click="removeWrong(w.en)" aria-label="删除">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>
