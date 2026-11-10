<script setup>
import { ref, provide, onMounted } from 'vue'
import HomeView from '../../components/HomeView.vue'
import WordView from '../../components/WordView.vue'
import QuizView from '../../components/QuizView.vue'
import TalkView from '../../components/TalkView.vue'
import AboutView from '../../components/AboutView.vue'
import LearnCenterView from '../../components/LearnCenterView.vue'
import WrongBookView from '../../components/WrongBookView.vue'
import { useProfile } from '../../composables/useProfile.js'

const { profile, AVATARS, setName, setAvatar } = useProfile()

const view = ref('home')
const talkRef = ref(null)

function go(v) { view.value = v }
function onBack() {
  if (view.value === 'talk' && talkRef.value && talkRef.value.back && talkRef.value.back()) return
  view.value = 'home'
}

/* 全局 toast */
const toastMsg = ref('')
let toastTimer = null
function showToast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 1600)
}
provide('toast', showToast)

/* 头像 / 昵称设置弹窗 */
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
  showToast('已保存 ✓')
}

/* 顶栏避开状态栏 */
const statusBar = ref(20)
onMounted(() => {
  try {
    const info = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync()
    if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
  } catch (e) {}
})
</script>

<template>
  <view class="app-wrap">
    <view class="topbar" :style="{ paddingTop: (statusBar + 12) + 'px' }">
      <view class="icon-btn" :style="{ visibility: view === 'home' ? 'hidden' : 'visible' }" hover-class="ib-hover" @click="onBack">
        <image class="ico" src="/static/icons/png/back.png" mode="aspectFit"/>
      </view>
      <view class="logo" hover-class="logo-hover" @click="openProfile">
        <text class="ava-emoji">{{ profile.avatar }}</text>
      </view>
      <view class="title">快乐英语乐园<text class="title-sub">人教版 · 1-3年级 + PEP新版三年级</text></view>
    </view>

    <!-- 小程序为静态编译，不支持 <component :is>，故用 v-if 分支（三端统一） -->
    <view class="main">
      <HomeView v-if="view === 'home'" @navigate="go" />
      <WordView v-else-if="view === 'words'" @navigate="go" />
      <QuizView v-else-if="view === 'quiz'" @navigate="go" />
      <TalkView v-else-if="view === 'talk'" ref="talkRef" @navigate="go" />
      <AboutView v-else-if="view === 'about'" @navigate="go" />
      <LearnCenterView v-else-if="view === 'center'" @navigate="go" />
      <WrongBookView v-else-if="view === 'wrong'" @navigate="go" />
    </view>

    <view class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</view>

    <view class="pf-mask" v-if="showProfile" @click="showProfile = false">
      <view class="pf-card" @click.stop>
        <text class="pf-h3">我的头像</text>
        <view class="pf-avas">
          <view v-for="a in AVATARS" :key="a" class="pf-ava" :class="{ sel: a === avatarSel }" hover-class="pf-hover" @click="avatarSel = a"><text>{{ a }}</text></view>
        </view>
        <text class="pf-h3" style="margin-top:14px;">昵称</text>
        <input class="pf-name" v-model="nameInput" maxlength="12" placeholder="小朋友" />
        <view class="pf-actions">
          <view class="btn" hover-class="btn-hover" @click="showProfile = false">取消</view>
          <view class="btn primary" hover-class="btn-hover" @click="saveProfile">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>
