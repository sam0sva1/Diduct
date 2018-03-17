let rootInstance = null;

function render(element, container) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

function reconcile(parentDom, instance, element) {
  if (instance == null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    // Remove instance
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === 'string') {
    // Update dom instance
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  }
  
  //Update composite instance
  instance.publicInstance.props = element.props;
  const childElement = instance.publicInstance.render();
  const oldChildInstance = instance.childInstance;
  const childInstance = reconcile(parentDom, oldChildInstance, childElement);
  instance.dom = childInstance.dom;
  instance.childInstance = childInstance;
  instance.element = element;
  return instance;
}

function reconcileChildren(instance, element) {
  const { dom, childInstances } = instance;

  const nextChildElements = element.props.children || [];
  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i += 1) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter(inst => inst != null);
}

const TEXT_ELEMENT = 'TEXT ELEMENT';

function instantiate(element) {
  const { type, props } = element;
  const isDomElement = typeof type === 'string';

  if (isDomElement) {
    // Instantiate DOM element
    const isTextElement = type === TEXT_ELEMENT;
    const dom = isTextElement
      ? document.createTextNode('')
      : document.createElement(type);

    updateDomProperties(dom, [], props);

    // Instantiate and append children
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(instance => instance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    const instance = { dom, element, childInstances };
    return instance;
  }

  // Instantiate component element
  const instance = {};
  const publicInstance = createPublicInstance(element, instance);
  const childElement = publicInstance.render();
  const childInstance = instantiate(childElement);
  const dom = childInstance.dom;

  Object.assign(instance, {
    dom, element, childInstance, publicInstance,
  });
  return instance;
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isListener = name => name.startsWith('on');
  const isAttribute = name => !isListener(name) && name !== 'children';
  const getEventType = name => name.toLowerCase().substring(2);

  // Remove event listeners
  Object.keys(prevProps).filter(isListener).forEach((name) => {
    dom.removeEventListener(getEventType(name), prevProps[name]);
  });

  // Remove event listeners
  Object.keys(prevProps).filter(isAttribute).forEach((name) => {
    dom[name] = null;
  });

  // Set new attributes
  Object.keys(nextProps).filter(isAttribute).forEach((name) => {
    dom[name] = nextProps[name];
  });

  // Set new event listeners
  Object.keys(nextProps).filter(isListener).forEach((name) => {
    dom.addEventListener(getEventType(name), nextProps[name]);
  });
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

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}


class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }
}

function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode;
  const { element } = internalInstance;
  reconcile(parentDom, internalInstance, element);
}

function createPublicInstance(element, internalInstance) {
  const { type, props } = element;
  const publicInstance = new type(props);
  publicInstance.__internalInstance = internalInstance;
  return publicInstance;
}

module.exports = { render, createElement, Component };
