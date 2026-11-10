<script setup>
import { useProgress } from '../composables/useProgress.js'
import { useAudio } from '../composables/useAudio.js'

const { wrong, removeWrong } = useProgress()
const { play } = useAudio()
</script>

<template>
  <view class="view center-view">
    <text class="center-title">错题本</text>

    <view class="block">
      <text class="bl-h3">错词本 <text class="muted">（{{ wrong.length }} 个）</text></text>
      <text class="hint">闯关答错的单词会自动收进这里。点小喇叭听发音，记牢了就点 ✕ 删掉。</text>
      <view v-if="!wrong.length" class="empty"><text>太棒了，暂时没有错词！</text></view>
      <view v-else class="wrong-list">
        <view class="wrong-item" v-for="w in wrong" :key="w.en">
          <view class="mini-speak" hover-class="ms-hover" @click="play(w.en, 'w')">
            <image class="horn-ico" src="/static/icons/png/horn.png" mode="aspectFit"/>
          </view>
          <text class="w-en">{{ w.en }}</text>
          <text class="w-zh">{{ w.zh }}</text>
          <view class="w-del" hover-class="wd-hover" @click="removeWrong(w.en)">✕</view>
        </view>
      </view>
    </view>
  </view>
</template>
