/**
 * 渲染虚拟Dom节点
 * @param {*} node  Node节点
 * @param {*} container  挂载容器
 */
export function render(node, container) {
  nextWorkUnit = {
    dom: container,
    props: {
      children: [node],
    },
  };
}

/**
 * 创建虚拟Dom节点
 * @param {*} type 类型
 * @param {*} props 属性
 * @param {*} children 子节点
 * @returns
 */
export function createElement(type, props, ...children) {
  console.log("current exec createElement.");
  return {
    type,
    props: {
      ...props,
      children: children.map((node) =>
        typeof node === "string" ? createTextNode(node) : createElement(node)
      ),
    },
  };
}

/**
 * 创建文字节点
 * @param {*} text 文字内容
 * @returns
 */
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

let nextWorkUnit = null;

function performWorkUnit(fiber) {
  // 1.create dom element
  const dom = fiber.dom ?? createDOM(fiber);
  // 2.update props
  updateProps(dom, fiber.props);
  // 3.init childrn
  initChildren(fiber);

  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  return fiber.parent.sibling;
}

function createDOM(node) {
  const dom =
    node.type === "TEXT_ELEMENT"
      ? document.createTextNode(node.props.nodeValue)
      : document.createElement(node.type);

  node.dom = dom;
  node.parent.dom.append(dom);

  return dom;
}

function updateProps(dom, props) {
  for (let propKey in props) {
    if (propKey !== "children") {
      dom[propKey] = props[propKey];
    }
  }
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prveChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: fiber,
      sibling: null,
      child: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newWork;
    } else {
      prveChild.sibling = newWork;
    }

    prveChild = newWork;
  });
}

function workLoop(deadline) {
  let shouldYeld = false;
  while (!shouldYeld && nextWorkUnit) {
    if (deadline.timeRemaining() < 1) {
      shouldYeld = true;
    } else {
      nextWorkUnit = performWorkUnit(nextWorkUnit);
    }
  }

  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
