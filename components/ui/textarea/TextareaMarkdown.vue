<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Bold, Italic, Link, List, ListOrdered, Heading1, Heading2, Code, Quote } from 'lucide-vue-next'

interface Props {
  id?: string
  name?: string
  placeholder?: string
  defaultValue?: string
  className?: string
  modelValue?: string
  onChange?: (value: string) => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// État local
const content = ref(props.modelValue ?? props.defaultValue ?? '')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const activeTab = ref<'write' | 'preview'>('write')

// Synchronise la prop modelValue si elle change depuis le parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== content.value) {
      content.value = newVal
    }
  }
)

const updateContent = (value: string) => {
  content.value = value
  emit('update:modelValue', value)
  props.onChange?.(value)
}

const insertText = (before: string, after = '') => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.slice(start, end)
  
  const newText =
    content.value.slice(0, start) +
    before + selectedText + after +
    content.value.slice(end)
  
  updateContent(newText)
  
  setTimeout(() => {
    textarea.focus()
    const newCursorPos = start + before.length + selectedText.length + after.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
}

const formatActions = [
  { icon: Bold, title: 'Gras', action: () => insertText('**', '**') },
  { icon: Italic, title: 'Italique', action: () => insertText('*', '*') },
  { icon: Code, title: 'Code', action: () => insertText('`', '`') },
  {
    icon: Link,
    title: 'Lien',
    action: () => {
      if (!textareaRef.value) return
      const sel = textareaRef.value.value.slice(textareaRef.value.selectionStart, textareaRef.value.selectionEnd)
      if (sel && sel.length > 0) insertText('[', '](url)')
      else insertText('[texte](url)')
    },
  },
  { icon: Heading1, title: 'Titre 1', action: () => insertText('# ') },
  { icon: Heading2, title: 'Titre 2', action: () => insertText('## ') },
  { icon: List, title: 'Liste à puces', action: () => insertText('- ') },
  { icon: ListOrdered, title: 'Liste numérotée', action: () => insertText('1. ') },
  { icon: Quote, title: 'Citation', action: () => insertText('> ') },
]

// Fonction simple pour convertir le Markdown en HTML
const parseMarkdown = (text: string): string => {
  return text
    // Titres
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
    // Gras et italique
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Code inline
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Liens
    .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:no-underline">$1</a>')
    // Citations
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>')
    // Listes à puces
    .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
    // Listes numérotées
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Sauts de ligne
    .replace(/\n/g, '<br>')
}

const htmlContent = computed(() => {
  if (!content.value) return ''
  return parseMarkdown(content.value)
})
</script>

<template>
  <div :class="props.className" class="w-full max-w-4xl mx-auto">
    <!-- Onglets -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          @click="activeTab = 'write'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'write'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Écrire
        </button>
        <button
          @click="activeTab = 'preview'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'preview'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Aperçu
        </button>
      </nav>
    </div>

    <!-- Contenu des onglets -->
    <div class="mt-4">
      <!-- Onglet édition -->
      <div v-show="activeTab === 'write'" class="space-y-3">
        <!-- Barre d'outils -->
        <div class="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <button
            v-for="(action, i) in formatActions"
            :key="i"
            type="button"
            :title="action.title"
            class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="action.action"
          >
            <component :is="action.icon" size="16" class="text-gray-600 dark:text-gray-400" />
            <span class="sr-only">{{ action.title }}</span>
          </button>
        </div>

        <!-- Zone de texte -->
        <textarea
          ref="textareaRef"
          :id="props.id"
          :name="props.name"
          :placeholder="props.placeholder || 'Écrivez votre contenu ici...'"
          v-model="content"
          @input="updateContent(($event.target as HTMLTextAreaElement).value)"
          class="w-full min-h-[300px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />

        <!-- Aide -->
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Prend en charge le formatage Markdown. Utilisez **gras**, *italique*, # pour les titres, - pour les listes, etc.
        </p>
      </div>

      <!-- Onglet aperçu -->
      <div v-show="activeTab === 'preview'" class="min-h-[300px]">
        <div class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
          <div
            v-if="content"
            class="prose prose-sm max-w-none text-gray-900 dark:text-gray-100"
            v-html="htmlContent"
          />
          <p v-else class="text-gray-500 dark:text-gray-400 text-sm italic">
            L'aperçu apparaîtra ici…
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles pour la prose dans l'aperçu */
.prose h1, .prose h2, .prose h3 {
  color: inherit;
}

.prose strong {
  color: inherit;
}

.prose code {
  color: inherit;
}

.prose blockquote {
  margin: 1rem 0;
}

.prose li {
  margin: 0.25rem 0;
}
</style>