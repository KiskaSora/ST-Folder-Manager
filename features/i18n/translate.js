// 通用翻译调度模块：根据当前语言设置（zh-CN / zh-TW / ru）选择合适的文本转换方式。
// zh-TW 走简繁字符映射（s2t.js），ru 走俄语短语词典（ru-dict.js）的子串替换。

import { CFM_RU_DICT } from "./ru-dict.js";

let ruRegex = null;
let ruRegexKeyCount = 0;

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRuRegex() {
  const keys = Object.keys(CFM_RU_DICT);
  if (ruRegex && ruRegexKeyCount === keys.length) return ruRegex;
  keys.sort((a, b) => b.length - a.length);
  ruRegex = keys.length
    ? new RegExp(keys.map(escapeRegExp).join("|"), "g")
    : null;
  ruRegexKeyCount = keys.length;
  return ruRegex;
}

export function cfmGetLanguageCore(deps = {}) {
  const extensionSettings =
    typeof deps.getExtensionSettings === "function"
      ? deps.getExtensionSettings()
      : deps.extensionSettings;
  const ext = extensionSettings?.[deps.extensionName];
  return ext?.language || "zh-CN";
}

export function cfmIsConvertEnabledCore(deps = {}) {
  const lang = cfmGetLanguageCore(deps);
  return lang === "zh-TW" || lang === "ru";
}

// text: 原始（简体中文）文本；deps: { s2t, extensionSettings/getExtensionSettings, extensionName }
export function cfmTranslateAnyCore(text, deps = {}) {
  if (!text) return text;
  const lang = cfmGetLanguageCore(deps);
  if (lang === "zh-TW") {
    return deps.s2t?.toTraditional?.(text) ?? text;
  }
  if (lang === "ru") {
    const re = getRuRegex();
    if (!re) return text;
    re.lastIndex = 0;
    return text.replace(re, (m) => CFM_RU_DICT[m] ?? m);
  }
  return text;
}
