import { ref } from 'vue'

// 学习积分 + 错词本 + 兑换记录，存本机 localStorage
const KEY = 'happy_progress'

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY))
    if (d && typeof d.score === 'number') return d
  } catch (e) {}
  return { score: 0, wrong: [], redemptions: [] }
}

const data = load()
const score = ref(data.score)
const wrong = ref(data.wrong || [])          // [{ en, zh }]
const redemptions = ref(data.redemptions || []) // [{ name, cost, time }]

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      score: score.value, wrong: wrong.value, redemptions: redemptions.value
    }))
  } catch (e) {}
}

export function useProgress() {
  function addScore(n) { score.value += (n || 0); persist() }
  function addWrong(en, zh) {
    if (!wrong.value.find(w => w.en === en)) {
      wrong.value = [...wrong.value, { en, zh }]
      persist()
    }
  }
  function removeWrong(en) {
    wrong.value = wrong.value.filter(w => w.en !== en)
    persist()
  }
  function redeem(item) {
    if (score.value >= item.cost) {
      score.value -= item.cost
      redemptions.value = [...redemptions.value, { ...item, time: Date.now() }]
      persist()
      return true
    }
    return false
  }
  return { score, wrong, redemptions, addScore, addWrong, removeWrong, redeem }
}
