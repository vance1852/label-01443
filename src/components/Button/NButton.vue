<script setup lang="ts">
import { computed } from 'vue'
import type { Size, Variant } from '@/types'

interface Props {
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  disabled: false,
  loading: false,
  iconOnly: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  xl: 'h-11 px-6 text-base gap-2.5',
}

const iconOnlySizes: Record<Size, string> = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
  xl: 'h-11 w-11',
}

const variantClasses: Record<Variant, string> = {
  solid: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  outline: 'bg-white text-surface-600 ring-1 ring-surface-200 hover:bg-surface-50 hover:ring-surface-300 active:bg-surface-100',
  ghost: 'text-surface-600 hover:bg-surface-100 active:bg-surface-200',
  text: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg',
  'nexa-transition nexa-focus-ring select-none',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  props.iconOnly ? iconOnlySizes[props.size] : sizeClasses[props.size],
  variantClasses[props.variant],
])

function handleClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="animate-spin" aria-hidden="true">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot v-else name="icon-left" />
    <slot v-if="!iconOnly" />
    <slot name="icon-right" />
  </button>
</template>
