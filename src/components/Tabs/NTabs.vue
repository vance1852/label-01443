<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'

interface Tab {
  key: string
  label: string
  icon?: string
  disabled?: boolean
}

interface Props {
  modelValue?: string
  tabs: Tab[]
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeKey = ref(props.modelValue || props.tabs[0]?.key)

watch(() => props.modelValue, (val) => {
  if (val) activeKey.value = val
})

function selectTab(key: string) {
  activeKey.value = key
  emit('update:modelValue', key)
}

provide('activeTab', activeKey)

const containerClasses = computed(() => [
  'flex',
  props.vertical ? 'flex-row gap-6' : 'flex-col',
])

const tabListClasses = computed(() => [
  'flex',
  props.vertical ? 'flex-col gap-1' : 'gap-1 p-1 bg-surface-100 rounded-lg',
])
</script>

<template>
  <div :class="containerClasses">
    <div :class="tabListClasses" role="tablist" :aria-orientation="vertical ? 'vertical' : 'horizontal'">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :aria-selected="activeKey === tab.key"
        :aria-disabled="tab.disabled"
        :tabindex="tab.disabled ? -1 : 0"
        :class="[
          'relative px-3 py-1.5 text-sm font-medium rounded-md nexa-transition nexa-focus-ring',
          activeKey === tab.key 
            ? 'bg-white text-surface-900 shadow-sm' 
            : 'text-surface-500 hover:text-surface-700',
          tab.disabled && 'opacity-50 cursor-not-allowed',
        ]"
        @click="!tab.disabled && selectTab(tab.key)"
      >
        <span v-if="tab.icon" :class="tab.icon" class="mr-1.5" />
        {{ tab.label }}
      </button>
    </div>
    <div class="flex-1 pt-4" role="tabpanel">
      <slot :active-key="activeKey" />
    </div>
  </div>
</template>
