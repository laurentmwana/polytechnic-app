<script setup lang="ts">
import { ref, watch } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Link, List, ListOrdered, Heading1, Heading2 } from 'lucide-vue-next'
import { marked } from 'marked'

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

// Utilise modelValue si fourni, sinon defaultValue
const content = ref(props.modelValue ?? props.defaultValue ?? '')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

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
    // Place le curseur après le texte inséré
    const newCursorPos = start + before.length + selectedText.length + after.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
}

const formatActions = [
  { icon: Bold, title: 'Gras', action: () => insertText('**', '**') },
  { icon: Italic, title: 'Italique', action: () => insertText('*', '*') },
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
]
</script>

<template>
  <div :class="props.className">
    <Tabs defaultValue="write" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="write">Écrire</TabsTrigger>
        <TabsTrigger value="preview">Aperçu</TabsTrigger>
      </TabsList>

      <!-- Onglet édition -->
      <TabsContent value="write" class="mt-2">
        <div class="flex flex-wrap gap-1 mb-2 p-1 border rounded-md bg-muted/50">
          <Button
            v-for="(action, i) in formatActions"
            :key="i"
            type="button"
            variant="ghost"
            size="sm"
            :title="action.title"
            class="h-8 w-8 p-0"
            @click="action.action"
          >
            <component :is="action.icon" size="18" />
            <span class="sr-only">{{ action.title }}</span>
          </Button>
        </div>

        <Textarea
          ref="textareaRef"
          :id="props.id"
          :name="props.name"
          :placeholder="props.placeholder || 'Écrivez votre contenu ici...'"
          v-model="content"
          class="min-h-[200px] font-mono text-sm"
          @input="updateContent($event.target.value)"
        />

        <p class="mt-2 text-xs text-muted-foreground">
          Prend en charge le formatage Markdown. Utilisez **gras**, *italique*, # pour les titres, - pour les listes, etc.
        </p>
      </TabsContent>

      <!-- Onglet aperçu -->
      <TabsContent value="preview" class="mt-2">
        <div class="rounded-md border border-input bg-background p-4 min-h-[200px]">
          <div
            v-if="content"
            class="prose dark:prose-invert max-w-none"
            v-html="marked(content)"
          />
          <p v-else class="text-muted-foreground text-sm">L'aperçu apparaîtra ici…</p>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
