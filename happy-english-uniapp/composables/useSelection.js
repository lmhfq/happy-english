import { ref } from 'vue'
import { DATA } from '../data/data.js'

// 模块级共享：当前选中的 年级 / 册数 / 单元，供「学单词」与「闯关」两个页面共用
// 注意：unit 存的是「单元对象」。ref() 会把对象包成响应式代理（Proxy），
// 而 v-for 遍历出的元素是原始对象，二者用 === 比较恒为 false（高亮会失效）。
// 所以判断当前单元一律用 u.t === unit.t（按单元标题比较），不要用对象引用比较。
const grade = ref(Object.keys(DATA)[0])
const term = ref(Object.keys(DATA[grade.value])[0])
const unit = ref(DATA[grade.value][term.value][0])

export function useSelection() {
  function setGrade(g) {
    grade.value = g
    term.value = Object.keys(DATA[g])[0]
    unit.value = DATA[g][term.value][0]
  }
  function setTerm(t) {
    term.value = t
    unit.value = DATA[grade.value][t][0]
  }
  function setUnit(u) {
    unit.value = u
  }
  return { grade, term, unit, setGrade, setTerm, setUnit }
}
