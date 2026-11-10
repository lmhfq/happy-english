// 校验「人教 PEP 新版三年级」教材数据完整性（词条结构 / 发音齐全 / 单元选项数够闯关）
// 用法（在 happy-english-vue 目录下运行）：
//   node scripts/validate_pep.mjs
import { DATA } from '../src/data.js'
import { AUDIO } from '../src/audio-map.js'

const grades = Object.keys(DATA)
console.log('年级栏顺序:', grades.join(' → '))

const g = '三年级新版'
if (!DATA[g]) { console.log('❌ 缺少年级', g); process.exit(1) }
console.log('册次:', Object.keys(DATA[g]).join(' / '))

let total = 0, dup = 0
const seen = new Set()
for (const term of Object.keys(DATA[g])) {
  console.log(`\n【${g} ${term}】`)
  for (const u of DATA[g][term]) {
    const bad = []
    for (const w of u.w) {
      total++
      if (!Array.isArray(w) || w.length !== 3) bad.push('结构异常:' + JSON.stringify(w))
      if (!AUDIO['w:' + w[0]]) bad.push('缺发音:' + w[0])
      if (!w[1]) bad.push('缺中文:' + w[0])
      if (!w[2]) bad.push('缺图标:' + w[0])
      if (seen.has(w[0])) dup++; else seen.add(w[0])
    }
    const flag = u.w.length < 4 ? ' ⚠️词数不足4' : ''
    console.log(`  ${u.t.padEnd(38)} ${String(u.w.length).padStart(2)} 词${flag}${bad.length ? '  ❌ ' + bad.join(', ') : '  ✅'}`)
  }
}
console.log(`\n合计词条 ${total} 个，去重后 ${seen.size} 个（跨单元重复 ${dup} 个）`)
console.log('音频总数:', Object.keys(AUDIO).filter(k => k.startsWith('w:')).length, '单词 +',
  Object.keys(AUDIO).filter(k => k.startsWith('d:')).length, '句子')
