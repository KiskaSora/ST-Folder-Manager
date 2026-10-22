// 界面语言功能文件：用于管理插件内部简体中文、繁體中文与俄语等语言配置、文本切换、语言状态读取与保存，以及在界面重渲染时同步应用当前语言。

import { cfmTranslateAnyCore } from "./translate.js";

export function cfmTCore(text, deps = {}) {
  return cfmTranslateAnyCore(text, deps);
}
