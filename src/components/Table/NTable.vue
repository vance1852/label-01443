<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, onMounted, onUnmounted } from 'vue'

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
  virtualScroll?: boolean
  rowHeight?: number
  visibleRows?: number
}

const props = withDefaults(defineProps<Props>(), {
  striped: false,
  compact: false,
  stickyHeader: false,
  virtualScroll: false,
  rowHeight: 52,
  visibleRows: 10,
})

const emit = defineEmits<{
  rowClick: [row: T, index: number]
}>()

const sortKey = ref<keyof T | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const scrollTop = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value!] as string | number
    const bVal = b[sortKey.value!] as string | number
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder.value === 'asc' ? cmp : -cmp
  })
})

// Virtual scroll calculations
const totalHeight = computed(() => sortedData.value.length * props.rowHeight)
const startIndex = computed(() => Math.floor(scrollTop.value / props.rowHeight))
const endIndex = computed(() => Math.min(startIndex.value + props.visibleRows + 2, sortedData.value.length))
const offsetY = computed(() => startIndex.value * props.rowHeight)

const visibleData = computed(() => {
  if (!props.virtualScroll) return sortedData.value
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

const actualIndices = computed(() => {
  if (!props.virtualScroll) return sortedData.value.map((_, i) => i)
  return Array.from({ length: endIndex.value - startIndex.value }, (_, i) => startIndex.value + i)
})

function toggleSort(key: keyof T) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
}

onMounted(() => {
  if (props.virtualScroll && containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div 
    ref="containerRef"
    class="rounded-xl bg-white ring-1 ring-surface-200/80"
    :class="virtualScroll ? 'overflow-auto' : 'overflow-auto'"
    :style="virtualScroll ? { maxHeight: `${visibleRows * rowHeight + 44}px` } : {}"
  >
    <table class="w-full text-sm" :style="virtualScroll ? { minWidth: '100%' } : {}">
      <thead :class="['text-surface-500 text-xs uppercase tracking-wider bg-white', stickyHeader && 'sticky top-0 z-10']">
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
        <!-- Virtual scroll spacer -->
        <tr v-if="virtualScroll && offsetY > 0" :style="{ height: `${offsetY}px` }">
          <td :colspan="columns.length"></td>
        </tr>
        <tr
          v-for="(row, idx) in visibleData"
          :key="actualIndices[idx]"
          :class="[
            'hover:bg-surface-50/50 nexa-transition cursor-pointer',
            striped && actualIndices[idx] % 2 === 1 && 'bg-surface-50/30',
          ]"
          :style="virtualScroll ? { height: `${rowHeight}px` } : {}"
          @click="emit('rowClick', row, actualIndices[idx])"
        >
          <td v-for="col in columns" :key="String(col.key)" :class="[compact ? 'px-3 py-2.5' : 'px-4 py-3.5', 'text-surface-700']">
            <slot :name="`cell-${String(col.key)}`" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <!-- Virtual scroll bottom spacer -->
        <tr v-if="virtualScroll" :style="{ height: `${totalHeight - offsetY - visibleData.length * rowHeight}px` }">
          <td :colspan="columns.length"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
