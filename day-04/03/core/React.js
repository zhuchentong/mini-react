let currentRoot = null;
let wipRoot = null;
/**
 * 渲染虚拟Dom节点
 * @param {*} node  Node节点
 * @param {*} container  挂载容器
 */
export function render(node, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [node],
    },
  };

  nextWorkUnit = wipRoot;
}

function update() {
  wipRoot = {
    dom: currentRoot,
    props: currentRoot.props,
    alternate: currentRoot,
  };

  nextWorkUnit = wipRoot;
}

/**
 * 创建虚拟Dom节点
 * @param {*} type 类型
 * @param {*} props 属性
 * @param {*} children 子节点
 * @returns
 */
export function createElement(type, props, ...children) {
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
            return node;
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

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];

  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1.create dom element
    const dom = createDOM(fiber);
    // 2.update props
    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function performWorkUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

function createDOM(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  fiber.dom = dom;
  // 通过统一提交实现
  // node.parent.dom.append(dom);

  return dom;
}

function updateProps(dom, nextProps, prevProps) {
  for (let propKey in prevProps) {
    if (propKey !== "children") {
      if (!(propKey in nextProps)) {
        dom.removeAttribute(propKey);
      }
    }
  }

  for (let propKey in nextProps) {
    if (propKey !== "children") {
      if (nextProps[propKey] !== prevProps[propKey]) {
        if (propKey.startsWith("on")) {
          const eventType = propKey.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[propKey]);
          dom.addEventListener(eventType, nextProps[propKey]);
        } else {
          dom[propKey] = nextProps[propKey];
        }
      }
    }
  }
}

function reconcileChildren(fiber, children) {
  let prveChild = null;
  let oldFiber = fiber.alternate?.child;

  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber = null;

    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        sibling: null,
        child: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "update",
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        sibling: null,
        child: null,
        dom: null,
        effectTag: "placement",
      };
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prveChild.sibling = newFiber;
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    prveChild = newFiber;
  });
}

function commitRoot() {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let fiberParent = fiber.parent;

  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
    //
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
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
  if (!nextWorkUnit && wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

export default {
  render,
  update,
  createElement,
};
