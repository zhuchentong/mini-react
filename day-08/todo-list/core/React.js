let currentRoot = null;
let wipRoot = null;
let wipFiber = null;
let deletions = [];
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
  let currentFiber = wipFiber;

  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextWorkUnit = wipRoot;
  };
}
let stateHooks = [];
let stateHooksIndex;

function useState(initial) {
  const currentFiber = wipFiber;
  const stateHook = {
    state:
      currentFiber.alternate?.stateHooks[stateHooksIndex]?.state ?? initial,
    queue: currentFiber.alternate?.stateHooks[stateHooksIndex]?.queue ?? [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });

  stateHook.queue = [];

  stateHooksIndex++;
  stateHooks.push(stateHook);

  currentFiber.stateHooks = stateHooks;
  function setState(action) {
    const prevEagerState = stateHook.eagerState ?? stateHook.state;
    const nextEagerState =
      typeof action === "function" ? action(prevEagerState) : action;

    if (nextEagerState === prevEagerState) {
      return;
    } else {
      stateHook.eagerState = nextEagerState;
    }
    // const queueState = stateHook.queue.reduce((state,action)=>{
    //   return typeof action === 'function'? action(state): action
    // },stateHook.state)

    // const eagerState = typeof action === 'function'?action(queueState):action

    // if(eagerState === queueState){
    //   return
    // }

    stateHook.queue.push(typeof action === "function" ? action : () => action);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextWorkUnit = wipRoot;
  }

  return [stateHook.state, setState];
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
  stateHooks = [];
  stateHooksIndex = 0;
  wipFiber = fiber;
  wipFiber.effectHooks = [];
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
    const isSameType = !!(oldFiber && oldFiber.type === child.type);
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
      if (child) {
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

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    if (index === 0 || !prveChild) {
      fiber.child = newFiber;
    } else {
      prveChild.sibling = newFiber;
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (newFiber) {
      prveChild = newFiber;
    }
  });

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function commitDeletions(fiber) {
  let fiberParent = fiber.parent;

  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child);
  }
}

function commitRoot() {
  commitWork(wipRoot.child);
  commitEffectHooks();
  deletions.forEach(commitDeletions);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    clean: undefined,
  };

  wipFiber.effectHooks.push(effectHook);
}

function commitEffectHooks() {
  const runEffect = (fiber) => {
    if (!fiber) {
      return;
    }

    if (fiber.effectHooks?.length) {
      fiber.effectHooks.forEach((effectHook, hookIndex) => {
        if (!fiber.alternate) {
          effectHook.clean = effectHook.callback();
        } else {
          const prevEffectHook = fiber.alternate.effectHooks[hookIndex];

          const needUpdate = prevEffectHook.deps.some((dep, index) => {
            return dep !== effectHook.deps[index];
          });

          if (needUpdate) {
            effectHook.clean = effectHook.callback();
          }
        }
      });
    }

    runEffect(fiber.child);
    runEffect(fiber.sibling);
  };

  const runClean = (fiber) => {
    if (!fiber) {
      return;
    }

    fiber.alternate?.effectHooks?.forEach((effectHook) => {
      if (effectHook.clean && effectHook.deps.length) {
        effectHook.clean();
      }
    });

    runClean(fiber.child);
    runClean(fiber.sibling);
  };

  runEffect(wipRoot);
  runClean(wipRoot);
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

      if (wipRoot?.sibling?.type === nextWorkUnit?.type) {
        nextWorkUnit = undefined;
      }
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
  useState,
  useEffect,
  createElement,
};
