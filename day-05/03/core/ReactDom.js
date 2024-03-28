import React from "./React.js";

/**
 * 创建根节点
 * @param {*} root
 * @returns
 */
function createRoot(root) {
  return {
    render: (node) => React.render(node, root),
  };
}

export default {
  createRoot,
};
