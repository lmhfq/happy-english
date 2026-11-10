<script setup>
import { inject } from 'vue'
import { useProgress } from '../composables/useProgress.js'

const toast = inject('toast', () => {})
const { score, redemptions, redeem } = useProgress()

const GIFTS = [
  { name: '贴纸一张', cost: 100 },
  { name: '小零食一份', cost: 200 },
  { name: '其他奖励', cost: 300 },
]

function doRedeem(g) {
  if (redeem(g)) toast('兑换成功！记得找爸爸妈妈领取哦')
  else toast('金币不够，再接再厉～')
}
</script>

<template>
  <view class="view center-view">
    <text class="center-title">学习中心</text>

    <view class="score-card">
      <view class="score-num">
        <image class="coin-ico" src="/static/icons/png/coin.png" mode="aspectFit"/>
        <text>{{ score }}</text>
      </view>
      <text class="score-label">学习金币</text>
    </view>

    <view class="block">
      <text class="bl-h3">金币兑换</text>
      <text class="hint">每答对一题得 1 枚金币，攒够了就能换下面的奖励啦，换之前记得先和爸爸妈妈说一声。</text>
      <view class="gift-list">
        <view class="gift" v-for="g in GIFTS" :key="g.name">
          <text class="g-name">{{ g.name }}</text>
          <view class="g-cost">
            <text>{{ g.cost }}</text>
            <image class="g-coin" src="/static/icons/png/coin.png" mode="aspectFit"/>
          </view>
          <view class="btn sm primary" :class="{ disabled: score < g.cost }" hover-class="btn-hover" @click="doRedeem(g)">兑换</view>
        </view>
      </view>
      <view v-if="redemptions.length" class="redeemed">
        <text>已兑换：{{ redemptions.map(r => r.name).join('、') }}</text>
      </view>
    </view>
  </view>
</template>
