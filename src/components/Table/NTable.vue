<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from 'vue'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
}

interface Props {
  data: T[]
  columns: Column<T>[]
  striped?: boolean
  compact?: boolean
  stickyHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  striped: false,
  compact: false,
  stickyHeader: false,
})

const emit = defineEmits<{
  rowClick: [row: T, index: number]
}>()

const sortKey = ref<keyof T | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value!] as string | number
    const bVal = b[sortKey.value!] as string | number
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder.value === 'asc' ? cmp : -cmp
  })
})

function toggleSort(key: keyof T) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
</script>

<template>
  <div class="overflow-auto rounded-xl bg-white ring-1 ring-surface-200/80">
    <table class="w-full text-sm">
      <thead :class="['text-surface-500 text-xs uppercase tracking-wider', stickyHeader && 'sticky top-0 bg-white']">
        <tr>
          <th
            v-for="col in columns"
            :key="String(col.key)"
            :class="[
              'text-left font-medium',
              compact ? 'px-3 py-2.5' : 'px-4 py-3',
              col.sortable && 'cursor-pointer hover:text-surface-700 nexa-transition select-none',
            ]"
            :style="{ width: col.width }"
            @click="col.sortable && toggleSort(col.key)"
          >
            <div class="flex items-center gap-1.5">
              {{ col.label }}
              <svg v-if="col.sortable && sortKey === col.key" class="w-3.5 h-3.5" :class="sortOrder === 'desc' && 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-100">
        <tr
          v-for="(row, index) in sortedData"
          :key="index"
          :class="[
            'hover:bg-surface-50/50 nexa-transition cursor-pointer',
            striped && index % 2 === 1 && 'bg-surface-50/30',
          ]"
          @click="emit('rowClick', row, index)"
        >
          <td v-for="col in columns" :key="String(col.key)" :class="[compact ? 'px-3 py-2.5' : 'px-4 py-3.5', 'text-surface-700']">
            <slot :name="`cell-${String(col.key)}`" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
