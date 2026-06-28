<script setup>
import { storeToRefs } from 'pinia'
import { useRegexStore } from './stores/regex.js'

const store = useRegexStore()
const { pattern, flags, sample, parsed, matches, segments, hints, presets } = storeToRefs(store)

const flagOptions = [
  { id: 'g', label: 'global', title: 'Find all matches' },
  { id: 'i', label: 'ignore case', title: 'Case insensitive' },
  { id: 'm', label: 'multiline', title: '^ and $ match line boundaries' },
  { id: 's', label: 'dotall', title: '. matches newlines' },
]
</script>

<template>
  <div class="app-bg min-h-screen">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Vue 3 · Pinia · VueUse</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Regex Lab</h1>
          <p class="mt-2 max-w-xl text-sm text-muted sm:text-base">
            Type a pattern, watch matches highlight live, inspect capture groups, and learn what each token means.
          </p>
        </div>
        <p class="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
          {{ matches.length }} match{{ matches.length === 1 ? '' : 'es' }}
        </p>
      </header>

      <!-- Presets -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="p in presets"
          :key="p.id"
          type="button"
          class="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent"
          @click="store.applyPreset(p.id)"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Pattern row -->
      <div class="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <label class="text-xs font-semibold uppercase tracking-widest text-muted">Pattern</label>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span class="font-mono text-lg text-accent">/</span>
          <input
            v-model="pattern"
            type="text"
            spellcheck="false"
            class="min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <span class="font-mono text-lg text-accent">/</span>
          <input
            v-model="flags"
            type="text"
            maxlength="4"
            spellcheck="false"
            class="w-16 rounded-lg border border-border bg-surface-2 px-2 py-2 text-center font-mono text-sm outline-none focus:border-accent"
          />
        </div>
        <p v-if="parsed.error" class="mt-2 text-sm text-error">{{ parsed.error }}</p>

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="f in flagOptions"
            :key="f.id"
            type="button"
            :title="f.title"
            class="rounded-md border px-2.5 py-1 text-xs font-medium transition"
            :class="flags.includes(f.id) ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted hover:text-text'"
            @click="store.toggleFlag(f.id)"
          >
            {{ f.id }} · {{ f.label }}
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-5">
        <!-- Sample + highlight -->
        <section class="lg:col-span-3">
          <label class="text-xs font-semibold uppercase tracking-widest text-muted">Sample text</label>
          <textarea
            v-model="sample"
            rows="8"
            spellcheck="false"
            class="mt-2 w-full resize-y rounded-2xl border border-border bg-surface p-4 font-mono text-sm leading-relaxed outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <div class="mt-3 rounded-2xl border border-border bg-surface-2 p-4 font-mono text-sm leading-relaxed">
            <span
              v-for="(seg, i) in segments"
              :key="i"
              :class="seg.match ? 'rounded px-0.5 text-text ring-1 ring-accent/50' : 'text-muted'"
              :style="seg.match ? { backgroundColor: 'var(--match)' } : {}"
            >{{ seg.text }}</span>
          </div>
        </section>

        <!-- Side panel -->
        <aside class="flex flex-col gap-4 lg:col-span-2">
          <section class="rounded-2xl border border-border bg-surface p-4">
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted">Hints</h2>
            <ul class="mt-3 space-y-2 text-sm text-muted">
              <li v-for="(hint, i) in hints" :key="i" class="flex gap-2">
                <span class="text-accent">→</span>
                <span>{{ hint }}</span>
              </li>
            </ul>
          </section>

          <section class="rounded-2xl border border-border bg-surface p-4">
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted">Matches</h2>
            <ul v-if="matches.length" class="mt-3 max-h-64 space-y-2 overflow-y-auto">
              <li
                v-for="(m, i) in matches"
                :key="i"
                class="rounded-xl border border-border bg-surface-2 p-3 text-sm"
              >
                <p class="font-mono font-medium text-accent">{{ m.text }}</p>
                <p class="mt-1 text-xs text-muted">index {{ m.index }}</p>
                <p v-if="m.groups.length" class="mt-2 text-xs text-muted">
                  Groups: {{ m.groups.map((g) => g ?? '∅').join(' · ') }}
                </p>
                <p v-if="Object.keys(m.named).length" class="mt-1 text-xs text-muted">
                  Named: {{ Object.entries(m.named).map(([k,v]) => `${k}=${v}`).join(', ') }}
                </p>
              </li>
            </ul>
            <p v-else class="mt-3 text-sm text-muted">No matches yet.</p>
          </section>
        </aside>
      </div>

      <footer class="mt-10 text-center text-xs text-muted">
        Built with Vue 3 · Pinia · VueUse · Tailwind
      </footer>
    </div>
  </div>
</template>
