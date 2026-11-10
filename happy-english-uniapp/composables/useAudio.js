import { AUDIO } from '../data/audio-map.js'

// 发音策略：
//  - 微信小程序（mp-weixin）：不打包任何 mp3，运行时调用「微信同声传译」插件实时合成英文语音
//  - H5 / App（安卓 APK）：沿用本地预录 mp3（打进包内，离线可用，无体积限制）
//
// 调用方始终传入英文字符串本身（如 "apple" / "How are you?"），无需改动。

// 微信同声传译插件（腾讯官方，免费，支持 en_US 合成）
// 后台添加：微信公众平台 → 设置 → 第三方服务 → 插件管理 → 添加插件，AppID: wx069ba97219f66d99
let WechatSI = null
let useTTS = false
// #ifdef MP-WEIXIN
try {
  WechatSI = requirePlugin('WechatSI')
  useTTS = !!(WechatSI && WechatSI.textToSpeech)
} catch (e) {
  useTTS = false
}
// #endif

let current = null
let seq = 0 // 代际令牌：每次 play / stop 都会自增，用来丢弃过期的异步回调

function stopCurrent() {
  if (current) { try { current.stop() } catch (e) {} }
  current = null
}

// 播放单个词/句。gen 为发起时的代际；onEnded 仅在仍属当前代际时才回调（用于连播）
function playOne(text, kind, gen, onEnded) {
  if (useTTS) {
    if (!WechatSI) { if (onEnded) onEnded(); return }
    WechatSI.textToSpeech({
      lang: 'en_US',
      tts: true,
      content: text,
      success: (res) => {
        if (gen !== seq) return // 已被新的播放请求取代
        if (!res || !res.filename) { if (onEnded) onEnded(); return }
        stopCurrent()
        const ctx = uni.createInnerAudioContext()
        ctx.src = res.filename
        ctx.onError(() => {})
        if (onEnded) ctx.onEnded(onEnded)
        current = ctx
        ctx.play()
      },
      fail: (res) => {
        console.warn('[tts] 合成失败:', text, res)
        if (onEnded) onEnded()
      }
    })
    return
  }
  // H5 / App：本地预录 mp3
  const rel = AUDIO[(kind || 'd') + ':' + text]
  if (!rel) { console.warn('[audio] 缺发音:', kind + ':' + text); if (onEnded) onEnded(); return }
  stopCurrent()
  const ctx = uni.createInnerAudioContext()
  ctx.src = rel
  ctx.onError(() => {})
  if (onEnded) ctx.onEnded(onEnded)
  current = ctx
  ctx.play()
}

export function useAudio() {
  // 播放单个词/句的发音；kind: 'd' 对话句, 'w' 单词
  function play(text, kind = 'd') {
    const gen = ++seq
    playOne(text, kind, gen, null)
    return true
  }

  // 口语对话「一句句读给我听」：按数组顺序连播
  function playSequence(texts, kind = 'd') {
    const gen = ++seq
    let i = 0
    function step() {
      if (gen !== seq) return // 被新的播放/停止取代
      if (i >= texts.length) { current = null; return }
      const t = texts[i]
      playOne(t, kind, gen, () => { i++; setTimeout(step, 450) })
    }
    step()
  }

  function stop() {
    ++seq
    stopCurrent()
  }

  return { play, playSequence, stop }
}
