import { ref } from 'vue'

// 顶栏头像 + 昵称，仅存本机 localStorage（不上传）
export const AVATARS = ['🦁', '🐻', '🐰', '🦊', '🐼', '🐸', '🐯', '🐵']
const KEY = 'happy_profile'

function load() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY))
    if (p && typeof p.name === 'string') return p
  } catch (e) {}
  return { name: '小朋友', avatar: AVATARS[0] }
}

const profile = ref(load())

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(profile.value)) } catch (e) {}
}

export function useProfile() {
  function setName(n) {
    profile.value.name = (n && n.trim()) || '小朋友'
    save()
  }
  function setAvatar(a) {
    profile.value.avatar = a
    save()
  }
  return { profile, AVATARS, setName, setAvatar }
}
