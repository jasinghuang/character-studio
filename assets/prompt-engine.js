// 提示词运行时：只负责注册、组装与光标插入；具体工作流的语义在同目录各文件维护。
(function () {
  'use strict';
  const g = typeof window !== 'undefined' ? window : globalThis;
  const registry = Object.create(null);
  const text = (value) => String(value == null ? '' : value).trim();
  const omitted = (value) => !text(value) || text(value) === '不限' || text(value) === '不用' || text(value) === '__custom';

  function register(workflowId, definition) {
    if (!workflowId || !definition || typeof definition.build !== 'function') throw new Error('提示词定义无效');
    registry[workflowId] = definition;
  }

  function build(workflowId, values, context) {
    const definition = registry[workflowId];
    if (!definition) return '';
    return text(definition.build(values || {}, context || {}));
  }

  function insertAtCursor(field, insertion) {
    // 光标插入必须保留用户已经输入的首尾空格，不能复用用于组装的 trim 逻辑。
    const value = String(field && field.value != null ? field.value : '');
    const start = field && Number.isInteger(field.selectionStart) && field.selectionStart >= 0 && field.selectionStart <= value.length
      ? field.selectionStart : value.length;
    const next = value.slice(0, start) + insertion + value.slice(start);
    return { value: next, caret: start + insertion.length };
  }

  g.PromptEngine = Object.freeze({ register, build, insertAtCursor, text, omitted, registry });
})();
