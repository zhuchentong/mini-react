/**
 * 渲染虚拟Dom节点
 * @param {*} node  Node节点
 * @param {*} container  挂载容器
 */
export function render(node, container) {
  let element;
  switch (node.type) {
    case "TEXT_ELEMENT":
      {
        element = document.createTextNode(node.props.nodeValue);
      }
      break;
    default: {
      element = document.createElement(node.type);
      for (let propKey in node.props) {
        if (propKey !== "children") {
          element.setAttribute(propKey, node.props[propKey]);
        }
      }
    }
  }

  if (node.props.children && node.props.children.length > 0) {
    node.props.children.forEach((child) => render(child, element));
  }

  if (element) {
    container.appendChild(element);
  }
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

export default {
  render,
  createElement,
};
