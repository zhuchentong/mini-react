let root = null;

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

  root = nextWorkUnit;
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
      children: children.map((node) => {
        switch (typeof node) {
          case "number":
          case "string":
            return createTextNode(node);
          default:
            return node
        }
      }),
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
  const isFunctionComponent = typeof fiber.type === "function";
  if (!fiber.dom && !isFunctionComponent) {
    // 1.create dom element
    const dom = createDOM(fiber);
    // 2.update props
    updateProps(dom, fiber.props);
  }

  const children = isFunctionComponent
    ? [fiber.type(fiber.props)]
    : fiber.props.children;

  // 3.init childrn
  initChildren(fiber, children);

  if (fiber.child) {
    return fiber.child;
  }

  // if (fiber.sibling) {
  //   return fiber.sibling;
  // }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

function createDOM(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  fiber.dom = dom;
  // 通过统一提交实现
  // node.parent.dom.append(dom);

  return dom;
}

function updateProps(dom, props) {
  for (let propKey in props) {
    if (propKey !== "children") {
      dom[propKey] = props[propKey];
    }
  }
}

function initChildren(fiber, children) {
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

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let fiberParent = fiber.parent;

  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
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

  // 当任务执行完时（nextWorkUnit为null时）以及 root节点不为空时进行提交渲染
  if (!nextWorkUnit && root) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
