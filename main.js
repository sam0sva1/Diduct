function render(element, parentDom) {
  const { type, props } = element;

  // Create dom-element
  const dom = type === 'TEXT ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);

  // Add event listeners
  const isListened = name => name.startsWith('on');
  Object.keys(props).filter(isListened).forEach((name) => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  });

  // Set properties
  const isAttribute = name => !isListened(name) && name !== 'children';
  Object.keys(props).filter(isAttribute).forEach((name) => {
    dom[name] = props[name];
  });

  // Render children
  const childElements = props.children || [];
  childElements.forEach(child => render(child, dom));

  parentDom.appendChild(dom);
}

const TEXT_ELEMENT = 'TEXT ELEMENT';

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;

  const rawChildren = hasChildren ? [].concat(...args) : [];

  props.children = rawChildren
    .filter(child => child != null && child !== false)
    .map(child => (child instanceof Object ? child : createTextElement(child)));
  return { type, props };
}

module.exports = { render, createElement };
