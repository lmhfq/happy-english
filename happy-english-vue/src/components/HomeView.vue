<script setup>
import { useProfile } from '../composables/useProfile.js'
const emit = defineEmits(['navigate'])
const { profile } = useProfile()
</script>

<template>
  <div class="view">
    <div class="hero">
      <div class="bubble" style="width:90px;height:90px;right:-20px;top:-20px;"></div>
      <div class="bubble" style="width:40px;height:40px;right:40px;bottom:-10px;"></div>
      <h1>Hello, {{ profile.name }}！</h1>
      <p>跟着教材趣味学单词，开口说日常英语～ 点一点就能听发音哦</p>
    </div>

    <div class="menu-grid">
      <button class="menu-card c1" @click="emit('navigate','words')">
        <span class="emoji">
          <svg width="44" height="44" viewBox="0 0 48 48"><rect x="9" y="10" width="30" height="28" rx="3" fill="#4DA8FF"/><rect x="23" y="10" width="3" height="28" fill="#fff"/><rect x="13" y="16" width="7" height="2.4" fill="#fff"/><rect x="13" y="21" width="7" height="2.4" fill="#fff"/></svg>
        </span>
        <h3>趣味学单词</h3>
        <p>看图听音，认识课本里的单词</p>
      </button>

      <button class="menu-card c2" @click="emit('navigate','talk')">
        <span class="emoji">
          <svg width="44" height="44" viewBox="0 0 48 48"><path d="M8 12h32v20H23l-8 8v-8H8z" fill="#FF8A7A"/><circle cx="16" cy="22" r="2.4" fill="#fff"/><circle cx="24" cy="22" r="2.4" fill="#fff"/><circle cx="32" cy="22" r="2.4" fill="#fff"/></svg>
        </span>
        <h3>日常口语对话</h3>
        <p>跟着读，学会日常交流</p>
      </button>

      <button class="menu-card c3" @click="emit('navigate','quiz')">
        <span class="emoji">
          <svg width="44" height="44" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="#5FD08A"/><circle cx="24" cy="24" r="11" fill="#fff"/><circle cx="24" cy="24" r="5" fill="#FF8A7A"/></svg>
        </span>
        <h3>听音闯关</h3>
        <p>听一听，选出对的图</p>
      </button>

      <button class="menu-card c6" @click="emit('navigate','wrong')">
        <span class="emoji">
          <svg width="44" height="44" viewBox="0 0 48 48"><rect x="9" y="9" width="26" height="30" rx="4" fill="#FF9E9E"/><rect x="14" y="16" width="16" height="2.6" rx="1.3" fill="#fff"/><rect x="14" y="22" width="11" height="2.6" rx="1.3" fill="#fff"/><rect x="14" y="28" width="14" height="2.6" rx="1.3" fill="#fff"/><circle cx="35" cy="34" r="9" fill="#FF6B6B"/><path d="M32 31l6 6M38 31l-6 6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>
        </span>
        <h3>错题本</h3>
        <p>复习没记住的单词</p>
      </button>

      <button class="menu-card c5" @click="emit('navigate','center')">
        <span class="emoji">
          <svg width="44" height="44" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="#FFCB3D" stroke="#E0A000" stroke-width="2.4"/><circle cx="24" cy="24" r="12.5" fill="none" stroke="#E0A000" stroke-width="1.8"/><path d="M24 15 V33 M17 20 H31 M18 24 H30 M21 28 L24 33 L27 28" fill="none" stroke="#B5780A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <h3>学习中心</h3>
        <p>用金币换小奖励</p>
      </button>

      <button class="menu-card c4" @click="emit('navigate','about')">
        <span class="emoji">
          <svg width="44" height="44" viewBox="0 0 48 48">
            <rect x="12" y="12" width="25" height="27" rx="3.5" fill="#D9C6FF"/>
            <rect x="10" y="9" width="25" height="27" rx="3.5" fill="#B58BFF"/>
            <rect x="10" y="9" width="6.5" height="27" rx="3.5" fill="#9B6BF0"/>
            <path d="M28 9h6.5v13l-3.25-3.4L28 22z" fill="#FF8A7A"/>
            <rect x="19" y="20" width="8.5" height="2.6" rx="1.3" fill="#fff"/>
            <rect x="19" y="25.5" width="5.5" height="2.6" rx="1.3" fill="#fff"/>
          </svg>
        </span>
        <h3>关于本课</h3>
        <p>教材对照与使用说明</p>
      </button>
    </div>
  </div>
</template>
