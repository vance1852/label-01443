<script setup lang="ts">
import { computed, ref } from 'vue'
import { useId } from '@/composables/useId'
import type { Status } from '@/types'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  helpText?: string
  status?: Status
  disabled?: boolean
  type?: 'text' | 'password' | 'email' | 'search' | 'number'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = useId('input')
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const statusClasses: Record<Status, string> = {
  success: '!ring-success-500 !ring-2',
  warning: '!ring-warning-500 !ring-2',
  error: '!ring-error-500 !ring-2',
  info: '!ring-info-500 !ring-2',
}

const helpTextColors: Record<Status, string> = {
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  info: 'text-info-600',
}

const inputClasses = computed(() => [
  'w-full h-9 px-3 rounded-lg bg-white',
  'nexa-transition text-sm',
  'placeholder:text-surface-400',
  'ring-1 ring-surface-200',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-50',
  props.status && statusClasses[props.status],
])

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-surface-700">
      {{ label }}
    </label>
    <div class="relative">
      <slot name="prefix" />
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        :aria-describedby="helpText ? `${id}-help` : undefined"
        :aria-invalid="status === 'error'"
        @input="onInput"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <slot name="suffix" />
    </div>
    <p v-if="helpText" :id="`${id}-help`" :class="['text-xs', status ? helpTextColors[status] : 'text-surface-500']">
      {{ helpText }}
    </p>
  </div>
</template>
