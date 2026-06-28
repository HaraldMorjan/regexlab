import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { PRESETS } from '../lib/presets.js'
import { explainPattern } from '../lib/explain.js'

export const useRegexStore = defineStore('regex', () => {
  const pattern = useLocalStorage('rl-pattern', String.raw`\b\w+@\w+\.\w+\b`)
  const flags = useLocalStorage('rl-flags', 'g')
  const sample = useLocalStorage('rl-sample', 'Email me at dev@example.com or visit https://vuejs.org')

  const parsed = computed(() => {
    try {
      const re = new RegExp(pattern.value, flags.value)
      return { re, error: null }
    } catch (e) {
      return { re: null, error: e.message }
    }
  })

  const matches = computed(() => {
    const { re, error } = parsed.value
    if (error || !re || !sample.value) return []
    const list = []
    if (flags.value.includes('g')) {
      for (const m of sample.value.matchAll(re)) {
        list.push({
          text: m[0],
          index: m.index,
          groups: m.slice(1),
          named: m.groups || {},
        })
      }
    } else {
      const m = re.exec(sample.value)
      if (m) {
        list.push({
          text: m[0],
          index: m.index,
          groups: m.slice(1),
          named: m.groups || {},
        })
      }
    }
    return list
  })

  const segments = computed(() => {
    const text = sample.value || ''
    const ms = matches.value
    if (!ms.length) return [{ text, match: false }]
    const out = []
    let cursor = 0
    for (const m of ms) {
      if (m.index > cursor) out.push({ text: text.slice(cursor, m.index), match: false })
      out.push({ text: m.text, match: true })
      cursor = m.index + m.text.length
    }
    if (cursor < text.length) out.push({ text: text.slice(cursor), match: false })
    return out
  })

  const hints = computed(() => explainPattern(pattern.value))

  function applyPreset(id) {
    const p = PRESETS.find((x) => x.id === id)
    if (!p) return
    pattern.value = p.pattern
    flags.value = p.flags
    sample.value = p.sample
  }

  function toggleFlag(flag) {
    flags.value = flags.value.includes(flag)
      ? flags.value.replace(flag, '')
      : flags.value + flag
  }

  return {
    pattern,
    flags,
    sample,
    parsed,
    matches,
    segments,
    hints,
    presets: PRESETS,
    applyPreset,
    toggleFlag,
  }
})
