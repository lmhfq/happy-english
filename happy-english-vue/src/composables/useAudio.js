import { AUDIO } from '../audio-map.js'

const base = import.meta.env.BASE_URL || './'
let current = null

function resolve(text, kind) {
  return AUDIO[(kind || 'd') + ':' + text]
}

function makePlayer(url) {
  const a = new Audio(url)
  a.preload = 'auto'
  return a
}

export function useAudio() {
  // 播放单个词/句的预录发音；kind: 'd' 对话句, 'w' 单词
  function play(text, kind = 'd') {
    const rel = resolve(text, kind)
    if (!rel) { console.warn('[audio] 缺发音:', kind + ':' + text); return false }
    if (current) { try { current.pause() } catch (e) {} current = null }
    const a = makePlayer(base + rel)
    current = a
    a.play().catch(() => {})
    return true
  }

  // 口语对话「一句句读给我听」：按数组顺序连播
  function playSequence(texts, kind = 'd') {
    if (current) { try { current.pause() } catch (e) {} current = null }
    let i = 0
    function step() {
      if (i >= texts.length) { current = null; return }
      const rel = resolve(texts[i], kind)
      if (!rel) { i++; return step() }
      const a = makePlayer(base + rel)
      a.onended = () => { i++; setTimeout(step, 450) }
      current = a
      a.play().catch(() => { i++; step() })
    }
    step()
  }

  function stop() {
    if (current) { try { current.pause() } catch (e) {} current = null }
  }

  return { play, playSequence, stop }
}
