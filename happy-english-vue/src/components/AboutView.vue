<script setup>
// 教材对照信息全部由数据源算出，以后增删单词/单元会自动同步，不会写死过期
import { DATA, DIALOGUES } from '../data.js'
import { AUDIO } from '../audio-map.js'

// 各年级入口对应的教材版本与配色
const META = {
  '一年级':    { tag: '人教《新起点》英语（一年级起点）',        color: '#4DA8FF' },
  '二年级':    { tag: '人教《新起点》英语（一年级起点）',        color: '#5FD08A' },
  '三年级':    { tag: '人教《新起点》英语（一年级起点）',        color: '#B58BFF' },
  '三年级新版': { tag: '人教 PEP《英语》（三年级起点）2024 新教材', color: '#FF8A7A' },
}
// 新版三年级上下册对应的实际使用时间
const VOL_NOTE = { '三年级新版': { '上册': '2024 秋', '下册': '2025 春' } }

const grades = Object.keys(DATA).map(name => {
  const vols = Object.entries(DATA[name]).map(([v, units]) => ({
    v,
    note: (VOL_NOTE[name] || {})[v] || '',
    words: units.reduce((a, u) => a + u.w.length, 0),
    units: units.map(u => u.t.replace(/^Unit\s*\d+\s*/, '')),
  }))
  return { name, tag: (META[name] || {}).tag || '', color: (META[name] || {}).color || '#4DA8FF', vols }
})

let unitCount = 0
const wordSet = new Set()
for (const g of Object.keys(DATA)) {
  for (const v of Object.keys(DATA[g])) {
    unitCount += DATA[g][v].length
    for (const u of DATA[g][v]) for (const w of u.w) wordSet.add(w[0].toLowerCase())
  }
}

const STATS = [
  { n: grades.length, label: '个年级入口' },
  { n: unitCount, label: '个学习单元' },
  { n: wordSet.size, label: '个单词' },
  { n: DIALOGUES.length, label: '个口语场景' },
  { n: Object.keys(AUDIO).length, label: '段发音音频' },
]
</script>

<template>
  <div class="view">
    <div class="about-box">
      <h3>关于本课</h3>
      <p>「快乐英语乐园」按<b>人教版小学英语</b>课本的单元主题整理单词与对话，看图听音、听音闯关、跟读对话，全部发音为本地预录，<b>不联网也能用</b>。目前收录：</p>
      <div class="stat-grid">
        <div class="stat" v-for="s in STATS" :key="s.label">
          <b>{{ s.n }}</b><span>{{ s.label }}</span>
        </div>
      </div>
    </div>

    <div class="about-box">
      <h3>教材对照</h3>
      <p>年级入口与课本的对应关系如下，单元名称与课本目录<b>逐单元一致</b>，可在课本上对照着学：</p>

      <div class="grade-block" v-for="g in grades" :key="g.name" :style="{ '--gc': g.color }">
        <div class="gb-head">
          <b>{{ g.name }}</b><em>{{ g.tag }}</em>
        </div>
        <div class="vol-row" v-for="v in g.vols" :key="v.v">
          <span class="vol-tag">{{ v.v }}<i v-if="v.note">{{ v.note }}</i></span>
          <span class="vol-meta">{{ v.units.length }} 单元 · {{ v.words }} 词</span>
          <div class="unit-pills">
            <span class="pill" v-for="u in v.units" :key="u">{{ u }}</span>
          </div>
        </div>
      </div>

      <p class="hint">
        说明：<b>三年级新版</b>是人教 PEP 2024 年秋季起启用的新教材（三年级起点），单元与旧版《新起点》三年级<b>完全不同</b>，所以单独作为一个入口保留，两套都可以学。若课本封面写「PEP」选三年级新版，写「新起点」选三年级。
      </p>
    </div>

    <div class="about-box">
      <h3>怎么用</h3>
      <p>
        1. <b>趣味学单词</b>：选年级 → 册数 → 单元，点大喇叭听发音，认识就点「我认识啦」；右上角小图标可打乱顺序。<br>
        2. <b>日常口语对话</b>：选场景，点每一句话听真人朗读，也可「一句句读给我听」连着播，跟着念。<br>
        3. <b>听音闯关</b>：听单词发音，从四张图里选出正确的。一轮的题数 = 该单元单词数，一轮内不重复出题，答完自动开新一轮，每答对 1 题得 1 枚金币。<br>
        4. <b>错题本</b>：闯关答错的单词自动收进这里，点小喇叭复习，记住了可点 ✕ 删掉。<br>
        5. <b>学习中心</b>：查看攒到的金币，金币可兑换小小奖励。<br>
        6. <b>关于本课</b>：就是这一页，教材对照与使用说明。
      </p>
    </div>

    <div class="about-box">
      <h3>发音与离线</h3>
      <p>全部发音使用预录的标准英语音频（语速已放慢），点完即响、无需联网，在没信号的路上也能用。首次打开联网加载后会自动缓存，之后<b>断网也能正常学习</b>。</p>
      <p>建议在安静环境跟读，效果更好。本应用已适配手机与平板，竖屏横屏都舒适；在手机浏览器里「添加到主屏幕」，就能像 App 一样全屏使用。</p>
    </div>
  </div>
</template>
