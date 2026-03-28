# Nexa UI CI/CD 流水线说明

本文档详细说明了 Nexa UI 组件库的自动化 CI/CD 流水线配置。所有流水线均使用 GitHub Actions 实现。

## 目录

- [1. Main 分支 CI 流水线](#1-main-分支-ci-流水线)
- [2. Pull Request CI 流水线](#2-pull-request-ci-流水线)
- [3. Release 发布流水线](#3-release-发布流水线)
- [4. 前置条件与配置](#4-前置条件与配置)
- [5. 使用指南](#5-使用指南)

---

## 1. Main 分支 CI 流水线

**文件路径**: `.github/workflows/main-ci.yml`

### 触发条件
- 当代码推送到 `main` 分支时自动触发

### 执行步骤

| 步骤 | 描述 | 命令 |
|------|------|------|
| 检出代码 | 从仓库拉取最新代码 | - |
| 安装 Node.js | 配置 Node.js 20.x 环境 | - |
| 安装依赖 | 使用 `npm ci` 安装依赖 | `npm ci` |
| 类型检查 | 运行 TypeScript 类型检查 | `npx vue-tsc --noEmit` |
| 运行测试 | 执行所有测试用例 | `npm run test -- --run` |

### 目的
- 确保 main 分支代码始终保持可构建状态
- 防止有类型错误或测试失败的代码进入主分支
- 提供快速反馈

---

## 2. Pull Request CI 流水线

**文件路径**: `.github/workflows/pr-ci.yml`

### 触发条件
- 当提交 Pull Request 到 `main` 分支时自动触发

### 执行步骤

| 步骤 | 描述 | 命令 |
|------|------|------|
| 检出代码 | 从仓库拉取 PR 代码 | - |
| 安装 Node.js | 配置 Node.js 20.x 环境 | - |
| 安装依赖 | 使用 `npm ci` 安装依赖 | `npm ci` |
| 类型检查 | 运行 TypeScript 类型检查 | `npx vue-tsc --noEmit` |
| 运行测试 | 执行所有测试用例并生成覆盖率报告 | `npm run test:coverage -- --run` |
| 上传报告 | 将覆盖率报告作为构建产物上传 | - |

### 目的
- 在代码合并前进行质量检查
- 生成测试覆盖率报告，帮助团队了解测试覆盖情况
- 防止低质量代码合并到主分支

### 覆盖率报告
测试完成后，覆盖率报告会自动上传为构建产物，可以在 PR 的 Actions 详情页面下载查看。

---

## 3. Release 发布流水线

**文件路径**: `.github/workflows/release.yml`

### 触发条件
- 当推送符合 `v*.*.*` 格式的 tag 时自动触发（例如：`v1.0.0`, `v1.2.3`）

### 执行步骤

| 步骤 | 描述 | 命令 |
|------|------|------|
| 检出代码 | 从仓库拉取代码 | - |
| 安装 Node.js | 配置 Node.js 20.x 环境，配置 npm 源 | - |
| 安装依赖 | 使用 `npm ci` 安装依赖 | `npm ci` |
| 类型检查 | 运行 TypeScript 类型检查 | `npx vue-tsc --noEmit` |
| 运行测试 | 执行所有测试用例 | `npm run test -- --run` |
| 构建库 | 构建组件库生产版本 | `npm run build:lib` |
| 发布到 npm | 将组件库发布到 npm 官方仓库 | `npm publish` |
| 构建文档 | 构建 VitePress 文档站点 | `npm run docs:build` |
| 部署文档 | 将文档部署到 GitHub Pages | - |
| 创建 Release | 在 GitHub 上自动创建 Release 并生成发布说明 | - |

### 权限要求
该流水线需要以下权限：
- `contents: write` - 用于创建 GitHub Release
- `pages: write` - 用于部署 GitHub Pages
- `id-token: write` - 用于 GitHub Pages 部署验证

---

## 4. 前置条件与配置

### 4.1 必需的 Secrets

在使用发布流水线之前，需要在 GitHub 仓库的 Settings > Secrets 中配置以下 secrets：

| Secret 名称 | 描述 | 获取方式 |
|------------|------|----------|
| `NPM_TOKEN` | npm 访问令牌 | 1. 登录 [npmjs.com](https://npmjs.com)<br>2. 进入 Access Tokens 页面<br>3. 创建一个新的自动化 token<br>4. 确保 token 有 publish 权限 |

### 4.2 GitHub Pages 配置

在使用文档部署功能前，需要：

1. 进入仓库 Settings > Pages
2. 在 "Build and deployment" 部分：
   - Source: 选择 "GitHub Actions"
3. 保存配置

### 4.3 package.json 验证

确保 `package.json` 文件中包含以下脚本：
```json
{
  "scripts": {
    "build:lib": "vue-tsc -b && vite build --mode lib",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "docs:build": "vitepress build docs"
  }
}
```

---

## 5. 使用指南

### 5.1 日常开发
1. 创建 feature 分支进行开发
2. 提交代码到 feature 分支
3. 创建 PR 到 main 分支
4. 等待 PR CI 流水线完成
5. 审查代码，确认所有检查通过后合并

### 5.2 版本发布流程

**步骤 1: 更新版本号**
```bash
# 使用 npm version 更新版本号
npm version patch  # 补丁版本更新 (1.0.0 -> 1.0.1)
# 或
npm version minor  # 次版本更新 (1.0.0 -> 1.1.0)
# 或
npm version major  # 主版本更新 (1.0.0 -> 2.0.0)
```

**步骤 2: 推送 tag**
```bash
git push origin main --follow-tags
```

**步骤 3: 等待自动发布**
- 推送 tag 后，发布流水线会自动触发
- 等待流水线完成所有步骤
- 完成后：
  - npm 上会有新版本
  - GitHub Pages 文档会更新
  - GitHub 上会有新的 Release

### 5.3 手动触发流水线（可选）

如果需要手动运行流水线：

1. 进入仓库的 Actions 页面
2. 选择要运行的工作流
3. 点击 "Run workflow" 按钮（如果工作流配置了 `workflow_dispatch` 事件）

---

## 故障排查

### npm 发布失败
- 检查 `NPM_TOKEN` 是否正确配置
- 确认 npm 包名称是否可用
- 检查版本号是否已存在

### GitHub Pages 部署失败
- 检查 Pages 配置是否正确
- 确认 `docs:build` 命令在本地能正常运行
- 检查 Actions 日志中的错误信息

### 测试失败
- 查看 Actions 日志中的详细错误信息
- 在本地运行 `npm run test` 复现问题
- 修复测试后重新提交代码
