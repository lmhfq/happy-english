<script setup>
import { useProgress } from '../composables/useProgress.js'

const { score, redemptions, redeem } = useProgress()

const GIFTS = [
  { name: '贴纸一张', cost: 100 },
  { name: '小零食一份', cost: 200 },
  { name: '其他奖励', cost: 300 },
]

function doRedeem(g) {
  if (redeem(g)) toast('兑换成功！记得找爸爸妈妈领取哦 🎁')
  else toast('金币不够，再接再厉～')
}

let toastTimer
function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return
  t.textContent = msg; t.classList.add('show')
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800)
}
</script>

<template>
  <div class="view center-view">
    <h2 class="center-title">学习中心</h2>

    <div class="score-card">
      <div class="score-num">
        <svg class="coin-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.3" fill="#FFCB3D" stroke="#E0A000" stroke-width="1.3"/><circle cx="12" cy="12" r="6.2" fill="none" stroke="#E0A000" stroke-width="1"/><path d="M12 8 V16 M8.8 10.6 H15.2 M9.3 12.4 H14.7 M10.6 14.3 L12 16 L13.4 14.3" fill="none" stroke="#B5780A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>{{ score }}</span>
      </div>
      <div class="score-label">学习金币</div>
    </div>

    <div class="block">
      <h3>金币兑换</h3>
      <p class="hint">每答对一题得 1 枚金币，攒够了就能换下面的奖励啦，换之前记得先和爸爸妈妈说一声。</p>
      <div class="gift-list">
        <div class="gift" v-for="g in GIFTS" :key="g.name">
          <span class="g-name">{{ g.name }}</span>
          <span class="g-cost">
            {{ g.cost }}
            <svg class="g-coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.3" fill="#FFCB3D" stroke="#E0A000" stroke-width="1.3"/><circle cx="12" cy="12" r="6.2" fill="none" stroke="#E0A000" stroke-width="1"/><path d="M12 8 V16 M8.8 10.6 H15.2 M9.3 12.4 H14.7 M10.6 14.3 L12 16 L13.4 14.3" fill="none" stroke="#B5780A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <button class="btn sm primary" :disabled="score < g.cost" @click="doRedeem(g)">兑换</button>
        </div>
      </div>
      <div v-if="redemptions.length" class="redeemed">
        已兑换：{{ redemptions.map(r => r.name).join('、') }}
      </div>
    </div>
  </div>
</template>
