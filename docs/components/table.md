# Table 表格

表格用于展示结构化数据。

## 功能

- 固定表头
- 列宽调整（待实现）
- 排序、筛选（待实现）、分页（待实现）
- 斑马纹
- 紧凑模式
- 虚拟滚动（待实现）

## Props

| 属性         | 类型       | 默认值  | 说明     |
| ------------ | ---------- | ------- | -------- |
| data         | `T[]`      | `[]`    | 表格数据 |
| columns      | `Column[]` | `[]`    | 列配置   |
| striped      | `boolean`  | `false` | 斑马纹   |
| compact      | `boolean`  | `false` | 紧凑模式 |
| stickyHeader | `boolean`  | `false` | 固定表头 |

## Column 配置

```ts
interface Column<T> {
  key: keyof T; // 数据字段
  label: string; // 列标题
  sortable?: boolean; // 可排序
  width?: string; // 列宽
}
```

## Slots

| 插槽       | 参数             | 说明             |
| ---------- | ---------------- | ---------------- |
| cell-[key] | `{ value, row }` | 自定义单元格内容 |

## Events

| 事件     | 参数         | 说明       |
| -------- | ------------ | ---------- |
| rowClick | `row, index` | 行点击事件 |
