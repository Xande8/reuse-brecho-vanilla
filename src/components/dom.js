// Componentes DOM manuais (sem JSX, React, Vue ou Angular).
export function element(tag, { className, text, attrs = {}, on = {} } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  Object.entries(attrs).forEach(([key, val]) => { if (val !== null && val !== undefined) node.setAttribute(key, val); });
  Object.entries(on).forEach(([event, callback]) => node.addEventListener(event, callback));
  children.forEach(child => node.appendChild(child));
  return node;
}

export function button(text, callback, className = 'pill-btn', attrs = {}) {
  return element('button', { text, className, attrs: { type: 'button', ...attrs }, on: { click: callback } });
}

export function emptyMessage(text, actionText, onAction) {
  const content = [element('p', { text })];
  if (actionText && onAction) content.push(button(actionText, onAction, 'pill-btn outline'));
  return element('div', { className: 'empty-box' }, content);
}
