<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Size } from '@/types'

interface Props {
  modelValue: boolean
  title?: string
  size?: Size
  closable?: boolean
  closeOnOverlay?: boolean
  animation?: 'fade' | 'slide' | 'scale'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  animation: 'scale',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses: Record<Size, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

const modalClasses = computed(() => [
  'relative w-full bg-white rounded-2xl shadow-2xl ring-1 ring-black/5',
  sizeClasses[props.size],
])

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick() {
  if (props.closeOnOverlay) close()
}

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="onOverlayClick"
      >
        <Transition :name="`modal-${animation}`">
          <div v-if="modelValue" :class="modalClasses" role="dialog" aria-modal="true">
            <div v-if="title || closable" class="flex items-center justify-between px-6 py-5">
              <h2 class="text-lg font-semibold text-surface-900">{{ title }}</h2>
              <button
                v-if="closable"
                class="text-surface-400 hover:text-surface-600 hover:bg-surface-100 nexa-transition nexa-focus-ring rounded-full p-1.5 -mr-1.5"
                aria-label="Close modal"
                @click="close"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="px-6 pb-6" :class="{ 'pt-6': !title && !closable }">
              <slot />
            </div>
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 px-6 py-4 bg-surface-50/80 rounded-b-2xl">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity var(--nexa-duration-normal) ease;
}
.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all var(--nexa-duration-normal) ease;
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--nexa-duration-normal) ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all var(--nexa-duration-normal) ease;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
