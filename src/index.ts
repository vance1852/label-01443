import type { App } from "vue";

// Components
export { NButton } from "./components/Button";
export { NInput } from "./components/Input";
export { NCard } from "./components/Card";
export { NAvatar } from "./components/Avatar";
export { NTabs } from "./components/Tabs";
export { NBreadcrumb } from "./components/Breadcrumb";
export { NToast } from "./components/Toast";
export { NModal } from "./components/Modal";
export { NSkeleton } from "./components/Skeleton";
export { NTable } from "./components/Table";
export { NBadge } from "./components/Badge";

// Types
export * from "./types";

// Styles
import "./styles/index.css";

// Plugin
const components = {
  NButton: () => import("./components/Button"),
  NInput: () => import("./components/Input"),
  NCard: () => import("./components/Card"),
  NAvatar: () => import("./components/Avatar"),
  NTabs: () => import("./components/Tabs"),
  NBreadcrumb: () => import("./components/Breadcrumb"),
  NToast: () => import("./components/Toast"),
  NModal: () => import("./components/Modal"),
  NSkeleton: () => import("./components/Skeleton"),
  NTable: () => import("./components/Table"),
  NBadge: () => import("./components/Badge"),
};

export default {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
