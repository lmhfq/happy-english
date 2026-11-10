#!/usr/bin/env python
# 生成单条发音 mp3（edge-tts 合成，与现有发音同参数），并自动登记到 src/audio-map.js
# 用法（在 happy-english-vue 目录下运行）：
#   python scripts/gen_one.py "Come in, please." d      # 对话句 -> d_*.mp3 并登记
#   python scripts/gen_one.py "watermelon" w            # 单词   -> w_*.mp3 并登记
import sys, os, re, asyncio
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)                       # happy-english-vue/
AUDIO_DIR = os.path.join(REPO, 'public/audio')     # 音频真源，构建时由 Vite 拷到 deploy/audio
AUDIO_MAP = os.path.join(REPO, 'src/audio-map.js')
VOICE = 'en-US-JennyNeural'
RATE = '+0%'


def fname_for(key):
    base = re.sub(r'[^A-Za-z0-9]', '_', key)
    f = base + '.mp3'
    i = 1
    while os.path.exists(os.path.join(AUDIO_DIR, f)):
        i += 1
        f = '%s_%d.mp3' % (base, i)
    return f


def register_in_map(key, fn):
    with open(AUDIO_MAP, 'r', encoding='utf-8') as fh:
        lines = fh.readlines()
    if any('"%s"' % key in ln for ln in lines):
        print('audio-map.js 中已存在 %s，跳过登记' % key)
        return
    new_line = '  "%s": "audio/%s",\n' % (key, fn)
    # 插入到结尾 AUDIO 对象的关闭 } 之前
    for idx in range(len(lines) - 1, -1, -1):
        if lines[idx].rstrip() == '};':
            # 原文件最后一条可能没有尾随逗号，先补上，避免语法错误
            j = idx - 1
            while j >= 0 and not lines[j].strip():
                j -= 1
            if j >= 0 and not lines[j].rstrip().endswith(','):
                lines[j] = lines[j].rstrip() + ',\n'
            lines.insert(idx, new_line)
            break
    else:
        lines.append(new_line)
    with open(AUDIO_MAP, 'w', encoding='utf-8') as fh:
        fh.writelines(lines)
    print('已登记到 %s：%s' % (os.path.relpath(AUDIO_MAP, REPO), new_line.strip()))


async def main():
    if len(sys.argv) < 3:
        print('用法: python scripts/gen_one.py "<英文句子或单词>" <d|w>')
        print('  d = 对话句 -> 生成 d_xxx.mp3 并登记')
        print('  w = 单词   -> 生成 w_xxx.mp3 并登记')
        return
    text = sys.argv[1].strip()
    kind = sys.argv[2]
    if kind not in ('d', 'w'):
        print('第二个参数只能是 d 或 w')
        return
    key = kind + ':' + text
    fn = fname_for(key)
    out = os.path.join(AUDIO_DIR, fn)
    await edge_tts.Communicate(text, VOICE, rate=RATE).save(out)
    size = os.path.getsize(out)
    print('已生成:', out, '(%d bytes)' % size)
    register_in_map(key, fn)


if __name__ == '__main__':
    asyncio.run(main())
