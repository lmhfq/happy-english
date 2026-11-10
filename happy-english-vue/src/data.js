// 数据统一从提取模块导出，保持原 import 路径不变
import { DATA as DATA_BASE } from './words-data.js'
import { DATA_PEP_NEW } from './words-pep-new.js'

// 合并：人教新起点 1-3 年级（原有）+ 人教 PEP 新版三年级上/下册（"三年级新版" 排在年级栏最后）
export const DATA = { ...DATA_BASE, ...DATA_PEP_NEW }
export { DIALOGUES } from './dialogues.js'
