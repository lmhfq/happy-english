// 构建「微信小程序」前运行：把 static/audio 暂移出工程，
// 让小程序包不再包含约 5MB 发音文件（小程序主包硬限 2MB）。
// 用法：node scripts/pack-mp-weixin.js
// 注意：构建完成后务必运行 node scripts/restore-audio.js 恢复，否则 APK / H5 会缺音频。
const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')
const audio = path.join(root, 'static', 'audio')
const backup = path.join(root, '_audio_backup')

if (fs.existsSync(audio)) {
  if (fs.existsSync(backup)) fs.rmSync(backup, { recursive: true, force: true })
  fs.renameSync(audio, backup)
  console.log('✅ 已暂移 static/audio -> _audio_backup（小程序包释放约 5MB 音频）')
} else if (fs.existsSync(backup)) {
  console.log('ℹ️  static/audio 已暂移，无需重复操作')
} else {
  console.log('⚠️  未找到 static/audio，无需处理')
}
console.log('➡️  现在可在 HBuilderX 中：发行 -> 小程序-微信')
console.log('➡️  构建完成后请运行：node scripts/restore-audio.js')
