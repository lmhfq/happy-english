<script setup>
import { useProfile } from '../composables/useProfile.js'
const emit = defineEmits(['navigate'])
const { profile } = useProfile()
</script>

<template>
  <view class="view">
    <view class="hero">
      <view class="bubble" style="width:90px;height:90px;right:-20px;top:-20px;"></view>
      <view class="bubble" style="width:40px;height:40px;right:40px;bottom:-10px;"></view>
      <text class="hero-h1">Hello, {{ profile.name }}！</text>
      <text class="hero-p">跟着教材趣味学单词，开口说日常英语～ 点一点就能听发音哦</text>
    </view>

    <view class="menu-grid">
      <view class="menu-card c1" hover-class="mc-hover" @click="emit('navigate','words')">
        <image class="m-ico" src="/static/icons/png/m-book.png" mode="aspectFit"/>
        <text class="m-h3">趣味学单词</text>
        <text class="m-p">看图听音，认识课本里的单词</text>
      </view>

      <view class="menu-card c2" hover-class="mc-hover" @click="emit('navigate','talk')">
        <image class="m-ico" src="/static/icons/png/m-talk.png" mode="aspectFit"/>
        <text class="m-h3">日常口语对话</text>
        <text class="m-p">跟着读，学会日常交流</text>
      </view>

      <view class="menu-card c3" hover-class="mc-hover" @click="emit('navigate','quiz')">
        <image class="m-ico" src="/static/icons/png/m-quiz.png" mode="aspectFit"/>
        <text class="m-h3">听音闯关</text>
        <text class="m-p">听一听，选出对的图</text>
      </view>

      <view class="menu-card c6" hover-class="mc-hover" @click="emit('navigate','wrong')">
        <image class="m-ico" src="/static/icons/png/m-wrong.png" mode="aspectFit"/>
        <text class="m-h3">错题本</text>
        <text class="m-p">复习没记住的单词</text>
      </view>

      <view class="menu-card c5" hover-class="mc-hover" @click="emit('navigate','center')">
        <image class="m-ico" src="/static/icons/png/m-center.png" mode="aspectFit"/>
        <text class="m-h3">学习中心</text>
        <text class="m-p">用金币换小奖励</text>
      </view>

      <view class="menu-card c4" hover-class="mc-hover" @click="emit('navigate','about')">
        <image class="m-ico" src="/static/icons/png/m-about.png" mode="aspectFit"/>
        <text class="m-h3">关于本课</text>
        <text class="m-p">教材对照与使用说明</text>
      </view>
    </view>
  </view>
</template>
