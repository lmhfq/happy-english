#!/usr/bin/env python
# 用当前脚本里的 VOICE / RATE，把 audio-map.js 里全部发音重新合成（原位覆盖）。
# 用于「更换发音声线 / 语速」后全量刷新 public/audio/（发音真源）。
# 用法（在 happy-english-vue 目录下运行）：
#   python scripts/regen_all.py            # 全量重生成
#   python scripts/regen_all.py --dry      # 只统计，不生成
#   python scripts/regen_all.py --only w   # 只重生成单词（w: 开头）
#   python scripts/regen_all.py --only d   # 只重生成对话句（d: 开头）
import sys, os, re, asyncio

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)                       # happy-english-vue/
AUDIO_DIR = os.path.join(REPO, 'public/audio')     # 发音真源
AUDIO_MAP = os.path.join(REPO, 'src/audio-map.js')

# ↓↓↓ 与 gen_one.py / gen_batch.py 保持一致，改声线只改这两处 ↓↓↓
VOICE = 'en-US-JennyNeural'
RATE = '+0%'
CONCURRENCY = 4


def parse_map():
    entries = []
    pat = re.compile(r'"((?:w|d):[^"]+)":\s*"audio/([^"]+)"')
    for ln in open(AUDIO_MAP, encoding='utf-8'):
        m = pat.search(ln)
        if m:
            entries.append((m.group(1), m.group(2)))
    return entries


def fname_for(key):
    base = re.sub(r'[^A-Za-z0-9]', '_', key)
    f = base + '.mp3'
    i = 1
    while os.path.exists(os.path.join(AUDIO_DIR, f)):
        i += 1
        f = '%s_%d.mp3' % (base, i)
    return f


async def regen(sem, key, fn, results):
    text = key.split(':', 1)[1]
    path = os.path.join(AUDIO_DIR, fn)
    async with sem:
        import edge_tts
        for attempt in range(3):
            try:
                # 先写临时文件，成功再替换，避免半截文件
                tmp = path + '.tmp'
                if os.path.exists(tmp):
                    os.remove(tmp)
                await edge_tts.Communicate(text, VOICE, rate=RATE).save(tmp)
                size = os.path.getsize(tmp)
                if size < 800:
                    raise RuntimeError('文件过小 %d bytes' % size)
                os.replace(tmp, path)
                results.append((key, True, size))
                print('OK   %-26s -> %s (%d B)' % (key, fn, size), flush=True)
                return
            except Exception as e:
                if attempt == 2:
                    results.append((key, False, 0))
                    print('FAIL %-26s %s' % (key, e), flush=True)
                else:
                    await asyncio.sleep(1.2 * (attempt + 1))


async def main():
    dry = '--dry' in sys.argv
    only = None
    if '--only' in sys.argv:
        only = sys.argv[sys.argv.index('--only') + 1]
    entries = parse_map()
    if only:
        entries = [e for e in entries if e[0].startswith(only + ':')]
    print('audio-map 共 %d 条，本次处理 %d 条' % (len(parse_map()), len(entries)))
    print('VOICE=%s  RATE=%s' % (VOICE, RATE))
    if dry:
        print('（--dry，未生成）')
        return
    sem = asyncio.Semaphore(CONCURRENCY)
    results = []
    await asyncio.gather(*[regen(sem, k, f, results) for k, f in entries])
    ok = sum(1 for _, s, _ in results if s)
    bad = [k for k, s, _ in results if not s]
    print('\n完成：成功 %d / 失败 %d' % (ok, len(bad)))
    if bad:
        print('失败列表：\n' + '\n'.join(bad))


if __name__ == '__main__':
    asyncio.run(main())
