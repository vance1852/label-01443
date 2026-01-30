<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Status, Position } from '@/types'

interface Props {
  message: string
  type?: Status
  position?: Position
  duration?: number
  closable?: boolean
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  position: 'top-right',
  duration: 3000,
  closable: true,
  showProgress: true,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)
const progress = ref(100)

const typeConfig: Record<Status, { icon: string; bg: string; iconBg: string }> = {
  success: { icon: '✓', bg: 'bg-success-500', iconBg: 'bg-success-100 text-success-600' },
  error: { icon: '✕', bg: 'bg-error-500', iconBg: 'bg-error-100 text-error-600' },
  warning: { icon: '⚠', bg: 'bg-warning-500', iconBg: 'bg-warning-100 text-warning-600' },
  info: { icon: 'ℹ', bg: 'bg-info-500', iconBg: 'bg-info-100 text-info-600' },
}

const positionClasses: Record<Position, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
}

const classes = computed(() => [
  'fixed z-toast min-w-80 max-w-md p-4 rounded-xl shadow-lg',
  'bg-white ring-1 ring-black/5',
  positionClasses[props.position],
])

function close() {
  visible.value = false
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) {
    const interval = setInterval(() => {
      progress.value -= 100 / (props.duration / 100)
      if (progress.value <= 0) {
        clearInterval(interval)
        close()
      }
    }, 100)
  }
})
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" :class="classes" role="alert">
      <div class="flex items-start gap-3">
        <span :class="['flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold', typeConfig[type].iconBg]">
          {{ typeConfig[type].icon }}
        </span>
        <p class="flex-1 text-sm text-surface-700 pt-0.5">{{ message }}</p>
        <button
          v-if="closable"
          class="text-surface-400 hover:text-surface-600 hover:bg-surface-100 nexa-transition p-1 rounded-md -mr-1"
          aria-label="Close"
          @click="close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div
        v-if="showProgress && duration > 0"
        class="absolute bottom-0 left-0 h-0.5 rounded-b-xl nexa-transition"
        :class="typeConfig[type].bg"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all var(--nexa-duration-normal) ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
