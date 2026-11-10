// 小程序构建完成后运行：把 _audio_backup 恢复为 static/audio，
// 让后续的 APK / H5 构建能包含本地发音文件。
// 用法：node scripts/restore-audio.js
const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')
const audio = path.join(root, 'static', 'audio')
const backup = path.join(root, '_audio_backup')

if (fs.existsSync(backup) && !fs.existsSync(audio)) {
  fs.renameSync(backup, audio)
  console.log('✅ 已恢复 static/audio（APK / H5 构建需要本地音频）')
} else if (fs.existsSync(audio)) {
  console.log('ℹ️  static/audio 已存在，无需恢复')
} else {
  console.log('⚠️  未找到 _audio_backup，无法恢复（音频可能仍在 static/audio）')
}
