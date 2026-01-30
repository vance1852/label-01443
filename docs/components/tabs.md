# Tabs 标签页

标签页用于在不同内容区域之间切换。

## 功能

- 水平/垂直布局
- 带下划线指示器
- 可关闭标签
- 图标支持

## Props

| 属性       | 类型      | 默认值  | 说明               |
| ---------- | --------- | ------- | ------------------ |
| modelValue | `string`  | -       | 当前激活的标签 key |
| tabs       | `Tab[]`   | `[]`    | 标签配置数组       |
| vertical   | `boolean` | `false` | 垂直布局           |

## Tab 配置

```ts
interface Tab {
  key: string; // 唯一标识
  label: string; // 标签文本
  icon?: string; // 图标类名
  disabled?: boolean; // 禁用状态
}
```

## Events

| 事件              | 参数     | 说明         |
| ----------------- | -------- | ------------ |
| update:modelValue | `string` | 切换标签事件 |

## 无障碍

- 使用 `role="tablist"` 和 `role="tab"`
- 支持 `aria-selected` 和 `aria-disabled`
- 支持键盘导航
