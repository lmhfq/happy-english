#!/usr/bin/env python
# 批量为「人教 PEP 新版三年级」单词生成发音 mp3（edge-tts，参数与现有发音一致），
# 并自动登记到 src/audio-map.js。音频写入 public/audio（真源），构建时由 Vite 拷到 deploy/audio。
# 用法（在 happy-english-vue 目录下运行）：
#   python scripts/gen_batch.py            # 生成缺失的发音并登记
#   python scripts/gen_batch.py --dry      # 只统计，不生成
import sys, os, re, asyncio, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)                       # happy-english-vue/
SRC_DIR = os.path.join(REPO, 'src')
AUDIO_DIR = os.path.join(REPO, 'public/audio')
AUDIO_MAP = os.path.join(SRC_DIR, 'audio-map.js')
WORDS_FILE = os.path.join(SRC_DIR, 'words-pep-new.js')
VOICE = 'en-US-JennyNeural'
RATE = '+0%'
CONCURRENCY = 4


def load_words():
    src = open(WORDS_FILE, encoding='utf-8').read()
    seen, out = set(), []
    for en in re.findall(r'\[\s*"([^"]+)",\s*"[^"]*",\s*"[^"]*"\s*\]', src):
        k = 'w:' + en
        if k not in seen:
            seen.add(k)
            out.append(en)
    return out


def load_map():
    txt = open(AUDIO_MAP, encoding='utf-8').read()
    keys = set(re.findall(r'"((?:w|d):[^"]+)"\s*:', txt))
    return txt, keys


def fname_for(en):
    """与 gen_one.py 同一命名规则：音频文件名 base = w_<英文_过滤>；
    若 base.mp3 已存在（多为不同英文 normalize 后同名，避免误覆盖），自动加 _2/_3 后缀。"""
    base = 'w_' + re.sub(r'[^A-Za-z0-9]', '_', en)
    f = base + '.mp3'
    i = 1
    while os.path.exists(os.path.join(AUDIO_DIR, f)):
        i += 1
        f = '%s_%d.mp3' % (base, i)
    return f


async def gen_one(edge_tts, sem, en, results):
    fn = fname_for(en)
    path = os.path.join(AUDIO_DIR, fn)
    async with sem:
        for attempt in range(3):
            try:
                if os.path.exists(path):
                    os.remove(path)
                await edge_tts.Communicate(en, VOICE, rate=RATE).save(path)
                size = os.path.getsize(path)
                if size < 800:
                    raise RuntimeError('文件过小 %d bytes' % size)
                results.append((en, fn))
                print('OK   %-14s -> %s (%d B)' % (en, fn, size), flush=True)
                return
            except Exception as e:
                if attempt == 2:
                    results.append((en, None))
                    print('FAIL %-14s %s' % (en, e), flush=True)
                else:
                    await asyncio.sleep(1.2 * (attempt + 1))


async def main():
    dry = '--dry' in sys.argv
    words = load_words()
    txt, keys = load_map()
    todo = [w for w in words if 'w:' + w not in keys]
    print('总词数 %d，audio-map 已有 %d，需生成 %d' % (len(words), len(words) - len(todo), len(todo)))
    if dry or not todo:
        print('（--dry 或无需生成）')
        return
    import edge_tts
    sem = asyncio.Semaphore(CONCURRENCY)
    results = []
    await asyncio.gather(*[gen_one(edge_tts, sem, w, results) for w in todo])

    ok = [(en, fn) for en, fn in results if fn]
    bad = [en for en, fn in results if not fn]
    if ok:
        new_lines = ''.join('  "w:%s": "audio/%s",\n' % (en, fn) for en, fn in ok if en not in keys)
        idx = txt.rindex('};')
        head = txt[:idx].rstrip()
        # 原文件最后一条可能没有尾随逗号，插入前补上，避免语法错误
        if head and not head.endswith(','):
            head += ','
        txt = head + '\n' + new_lines + txt[idx:]
        open(AUDIO_MAP, 'w', encoding='utf-8').write(txt)
        print('\n已登记 %d 条到 audio-map.js' % len(ok))
    if bad:
        print('失败 %d 条：%s' % (len(bad), ', '.join(bad)))
    print('音频目录现有 %d 个 mp3' % len(os.listdir(AUDIO_DIR)))


if __name__ == '__main__':
    asyncio.run(main())
