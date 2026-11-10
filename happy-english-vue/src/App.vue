<script setup>
import { ref, computed } from 'vue'
import HomeView from './components/HomeView.vue'
import WordView from './components/WordView.vue'
import QuizView from './components/QuizView.vue'
import TalkView from './components/TalkView.vue'
import AboutView from './components/AboutView.vue'
import LearnCenterView from './components/LearnCenterView.vue'
import WrongBookView from './components/WrongBookView.vue'
import { useProfile } from './composables/useProfile.js'

const { profile, AVATARS, setName, setAvatar } = useProfile()

const view = ref('home')
const talkRef = ref(null)
const views = { home: HomeView, words: WordView, quiz: QuizView, talk: TalkView, about: AboutView, center: LearnCenterView, wrong: WrongBookView }
const current = computed(() => views[view.value])

function go(v) { view.value = v; window.scrollTo(0, 0) }
function onBack() {
  if (view.value === 'talk' && talkRef.value && talkRef.value.back && talkRef.value.back()) return
  view.value = 'home'; window.scrollTo(0, 0)
}

// 头像设置弹窗
const showProfile = ref(false)
const nameInput = ref(profile.value.name)
const avatarSel = ref(profile.value.avatar)
function openProfile() {
  nameInput.value = profile.value.name
  avatarSel.value = profile.value.avatar
  showProfile.value = true
}
function saveProfile() {
  setName(nameInput.value)
  setAvatar(avatarSel.value)
  showProfile.value = false
  toast('已保存 ✓')
}

let toastTimer
function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return
  t.textContent = msg; t.classList.add('show')
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1600)
}
</script>

<template>
  <div class="app-wrap">
    <header class="topbar">
      <button class="icon-btn" :style="{ visibility: view === 'home' ? 'hidden' : 'visible' }" @click="onBack" aria-label="返回">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="logo clickable" @click="openProfile" :aria-label="'设置头像与昵称'">
        <span class="ava-emoji">{{ profile.avatar }}</span>
      </button>
      <div class="title">快乐英语乐园<small>人教版 · 1-3年级 + PEP新版三年级</small></div>
    </header>

    <main>
      <component :is="current" ref="talkRef" @navigate="go" />
    </main>

    <div class="toast" id="toast"></div>

    <!-- 头像 / 昵称设置 -->
    <div class="pf-mask" v-if="showProfile" @click.self="showProfile = false">
      <div class="pf-card">
        <h3>我的头像</h3>
        <div class="pf-avas">
          <button v-for="a in AVATARS" :key="a" class="pf-ava" :class="{ sel: a === avatarSel }" @click="avatarSel = a">{{ a }}</button>
        </div>
        <h3 style="margin-top:14px;">昵称</h3>
        <input class="pf-name" v-model="nameInput" maxlength="12" placeholder="小朋友" />
        <div class="pf-actions">
          <button class="btn" @click="showProfile = false">取消</button>
          <button class="btn primary" @click="saveProfile">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
