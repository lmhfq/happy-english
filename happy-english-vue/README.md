# 快乐英语乐园

人教版小学英语趣味学习应用 —— 跟读单词、听音闯关、口语对话，全部发音本地预录，**离线可用**，可「添加到主屏幕」当作 App 使用。

## 特性

- 按人教版课本单元主题整理单词与对话，看图听音、听音选图、逐句跟读
- 发音为 `edge-tts` 预生成的标准美式英语音频（en-US-JennyNeural，正常语速），**断网也能学**
- PWA 应用，支持「添加到主屏幕」全屏使用，移动端 / 平板自适应（竖屏横屏）
- 学习激励：答对闯关得「星星 ⭐」，可兑换小奖励

## 功能模块

| 入口 | 说明 |
| --- | --- |
| 趣味学单词 | 选 年级 → 册数 → 单元，点喇叭听发音，可打乱顺序；「我认识啦」记录已学 |
| 听音闯关 | 听发音从四张图选正确项。**一轮题数 = 该单元词数**，一轮内不重复出题，答完自动开新一轮，每答对 1 题 +1 ⭐ |
| 日常口语对话 | 25 个生活场景，逐句点读，也可「一句句读给我听」连播跟读 |
| 错题本 | 闯关答错的单词自动归集，可复习发音或移除 |
| 学习中心 | 查看攒到的星星 ⭐，兑换小奖励（贴纸 100 / 小零食 200 / 其他奖励 300） |
| 关于本课 | 教材对照表、数据总览与使用说明（内容由数据源动态生成） |

## 教材覆盖

| 年级入口 | 教材版本 | 上册 | 下册 | 合计单词 |
| --- | --- | --- | --- | --- |
| 一年级 | 人教《新起点》英语（一年级起点） | 6 单元 · 40 词 | 6 单元 · 31 词 | 71 |
| 二年级 | 人教《新起点》英语（一年级起点） | 6 单元 · 36 词 | 6 单元 · 30 词 | 66 |
| 三年级 | 人教《新起点》英语（一年级起点） | 6 单元 · 51 词 | 6 单元 · 37 词 | 88 |
| 三年级新版 | 人教 PEP《英语》（三年级起点，2024 秋上 / 2025 春下） | 6 单元 · 110 词 | 6 单元 · 116 词 | 226 |

**总计**：4 个年级入口 / 48 个单元 / 451 条词条（去重后 **338** 个单词）/ 25 个口语场景 / 508 段发音音频。

> 「三年级新版」与人教《新起点》三年级内容完全不同，单独作为一个入口保留，两套都能学。封面写「PEP」选三年级新版，写「新起点」选三年级。

## 技术栈

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)（Service Worker 预缓存，实现离线可用）
- 纯前端、无后端依赖；学习进度 / 错题 / 星星存浏览器 `localStorage`
- 生成发音脚本：Python 3 + `edge-tts`

## 目录结构

```
happy-english-vue/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── audio/          # 全部预生成发音 mp3（真源，需随仓库提交）
│   └── icons/          # PWA 图标（icon-192 / icon-512 / maskable-512）
├── scripts/            # 维护脚本（生成/校验发音）
│   ├── gen_one.py      #   生成单条发音并登记到 audio-map.js
│   ├── gen_batch.py    #   批量生成 PEP 新版三年级缺失发音
│   └── validate_pep.mjs#   校验教材数据完整性
└── src/
    ├── App.vue                 # 顶层布局、路由（首页菜单与各页面切换）
    ├── main.js
    ├── data.js                 # 汇总各教材数据并统一导出（DATA / DIALOGUES）
    ├── words-data.js           # 人教《新起点》1-3 年级词库
    ├── words-pep-new.js        # 人教 PEP 新版三年级词库
    ├── dialogues.js            # 25 个口语对话场景
    ├── audio-map.js            # 单词/句子 → 音频文件路径映射
    ├── components/             # 各页面：HomeView / WordView / QuizView /
    │                           #   TalkView / AboutView / LearnCenterView / WrongBookView
    ├── composables/            # useAudio / useSelection / useProfile / useProgress
    └── styles.css
```

> 构建产物输出到工程外的 `../deploy/`（`vite.config.js` 的 `outDir`，见下）。`deploy/` 是发布包，**不进 git**。

## 环境要求

- 发布 / 预览：`Node.js ≥ 18` + `npm`
- 生成发音（可选，仅在新增单词 / 对话时需要）：`Python 3` + `pip install edge-tts`

## 快速开始（本地开发）

```bash
npm install        # 安装依赖（首次或改过 package.json 后）
npm run dev        # 本地开发，默认 http://localhost:5173
                    #   vite 已开 host 模式，同一局域网下手机/平板可访问
```

## 发布：生成 deploy/ 文件

`deploy/` 是给服务器用的完整静态包（HTML / CSS / JS + Service Worker + 全部发音 mp3）。**它由构建生成，不进 git**，每次发布都重新构建。

```bash
npm run build      # 构建，产物输出到 ../deploy/
```

要点：

1. `npm run build` 会**先清空 `deploy/` 再重建全部产物**，并把 `public/audio/` 下的全部 mp3 复制到 `deploy/audio/`。
2. 本地预览发布效果（可选）：

   ```bash
   npm run preview    # 默认 http://localhost:4173
   ```

3. 把 `deploy/` 整个目录上传到服务器即可（见「部署」）。

> ⚠️ **发音真源在 `public/audio/`，不在 `deploy/audio/`**
> `deploy/audio/` 每次构建都会从 `public/audio/` 重新生成并覆盖。因此：
> - 新增单词 / 对话句的发音一定要先落到 `public/audio/`（用下面的脚本），否则下次构建后线上会缺音；
> - **不要**手动把 mp3 只丢进 `deploy/audio/`，构建会清空它。

> 📌 关于「批量删除保护」：在部分带删除保护的云端环境里，`npm run build` 清空 `deploy/` 删除大量 mp3 可能被拦截导致失败。此时先移出再构建：
> ```bash
> mv deploy/audio deploy_audio_tmp
> npm run build
> rm -rf deploy_audio_tmp     # 构建后 deploy/audio 已自动重建，临时目录可删
> ```
> 普通本机直接 `npm run build` 即可，无需此步。

## 部署

1. 运行 `npm run build`，产物在 `../deploy/`。
2. 将 `deploy/` 整体拷到任意静态服务器目录。由于 `vite.config.js` 中设置了 `base: './'`，**可放在任意子路径**（例如 `/english/`）而无需改配置。
3. 静态服务器需配置 SPA 回退：所有未命中路径回退到 `index.html`（保证刷新不 404）。示例 nginx：

```nginx
server {
  listen 8085;
  root /data/webroot/test;
  index index.html;
  location /english/ {
    try_files $uri $uri/ /english/index.html;
  }
}
```

4. 首屏联网加载后会自动缓存资源与音频，之后断网可正常学习；如需更新线上版本，把新的 `deploy/` 覆盖上传并让用户**硬刷新**（清缓存）一次即可。

> 若外网访问需放行端口（如上面的 8085），请在服务器安全组 / 防火墙放行对应 TCP 端口。

## 发音音频

`public/audio/` 下共 508 段 mp3 为预生成文件（`d_` 开头为对话句、`w_` 开头为单词），是整个应用的发音真源，**须随仓库一起提交**。生成规范：

- 合成工具：`edge-tts`（非录音），参数 **`VOICE=en-US-JennyNeural`、`RATE=+0%`**（美式清晰女声，正常语速；早期版本曾用 `en-US-AriaNeural` + `-10%` 降速，因口音/降速问题已更换）
- 命名：`w_<单词>` / `d_<句子>`（非字母数字转义为 `_`），并自动登记到 `src/audio-map.js`（`"w:book": "audio/w_book.mp3"` 形式）

仓库自带维护脚本（在 `scripts/` 目录）：

| 脚本 | 用途 |
| --- | --- |
| `python scripts/gen_one.py "<英文>" d\|w` | 生成单条发音并自动登记到 `audio-map.js`（对话句用 `d`，单词用 `w`） |
| `python scripts/gen_batch.py [--dry]` | 批量生成「PEP 新版三年级」缺失的发音并登记（跳过已有、并发 4、自动重试；`--dry` 仅预览不生成） |
| `python scripts/regen_all.py [--dry] [--only w\|d]` | **更换声线/语速后全量重生成**：用脚本内的 `VOICE`/`RATE` 把 `audio-map.js` 全部发音重新合成并原位覆盖（`--only w` 只重生成单词、`--only d` 只重生成对话句） |
| `node scripts/validate_pep.mjs` | 校验 PEP 新教材数据：年级顺序、每词是否都有发音+中文+图标、每单元词数是否 ≥ 4（闯关需 4 选项） |

> 生成发音前请先 `pip install edge-tts`。脚本已自带路径定位，在任意目录运行都能正确找到 `public/audio` 与 `audio-map.js`。`regen_all.py` 采用「先写临时文件、成功再替换」策略，单条失败不会留下半截文件。

## 日常维护清单

| 你要做的事 | 怎么做 |
| --- | --- |
| 改页面文案 / 样式 | 改 `src/` 下对应文件 → `npm run build` → 上传 `deploy/` |
| 新增一个单词 | 编辑 `src/words-data.js` 或 `src/words-pep-new.js` 对应单元 → `python scripts/gen_one.py "单词" w` 生成发音并登记 → `npm run build` |
| 新增一个口语对话句 | 编辑 `src/dialogues.js` → `python scripts/gen_one.py "英文句子" d` 生成发音并登记 → 构建 |
| 批量补齐 PEP 新版三年级缺失发音 | `python scripts/gen_batch.py --dry` 先预览 → 确认后去掉 `--dry` 执行 → 构建 |
| 改完数据后自检 | `node scripts/validate_pep.mjs`（应全部 ✅，无 ❌ / ⚠️） |
| 新增整套年级 / 教材 | 见「扩展数据」 |
| 换 PWA 图标 | 替换 `public/icons/` 下三张图 → 构建 |

## 扩展数据

- **新增单词**：编辑对应 `src/words-*.js`（`DATA[年级][册][单元].w`，每条为 `[英文, 中文, 图标]` 三元组），再用上面的脚本补发音、登记 `audio-map.js`。
- **新增年级入口**：在 `src/words-*.js` 加一个键，并在 `src/components/AboutView.vue` 的 `META` 表登记教材版本名与配色（未登记会回退默认样式）。「关于本课」页的教材对照表会自动同步。
- **新增口语场景**：编辑 `src/dialogues.js`。

## 许可

个人 / 家庭学习用途。教材内容依人教版小学英语课本单元主题整理，仅供学习参考。
