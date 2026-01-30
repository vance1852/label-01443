<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

interface Props {
  items: BreadcrumbItem[]
  separator?: string
  maxItems?: number
}

withDefaults(defineProps<Props>(), {
  separator: '/',
  maxItems: 0,
})

const emit = defineEmits<{
  click: [item: BreadcrumbItem, index: number]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm">
      <template v-for="(item, index) in items" :key="index">
        <li class="flex items-center gap-2">
          <component
            :is="item.href ? 'a' : 'span'"
            :href="item.href"
            :class="[
              'flex items-center gap-1 nexa-transition',
              index === items.length - 1
                ? 'text-surface-900 font-medium'
                : 'text-surface-500 hover:text-primary-500 cursor-pointer',
            ]"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
            @click="emit('click', item, index)"
          >
            <span v-if="item.icon" :class="item.icon" />
            {{ item.label }}
          </component>
        </li>
        <li v-if="index < items.length - 1" aria-hidden="true" class="text-surface-300">
          <slot name="separator">{{ separator }}</slot>
        </li>
      </template>
    </ol>
  </nav>
</template>
