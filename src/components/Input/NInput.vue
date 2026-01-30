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
        <i v-if="showPassword" class="i-mdi-eye-off w-5 h-5" />
        <i v-else class="i-mdi-eye w-5 h-5" />
      </button>
      <slot name="suffix" />
    </div>
    <p v-if="helpText" :id="`${id}-help`" :class="['text-xs', status ? helpTextColors[status] : 'text-surface-500']">
      {{ helpText }}
    </p>
  </div>
</template>
