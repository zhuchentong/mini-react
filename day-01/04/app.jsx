// 通过在注释使用@jsx注解 可以指定将jsx转换成对应的代码
// jsx pragma
// @jsx createElement
import { createElement } from "./core/React.js";

const App = <div id="app">hello-mini-react</div>;

/**
 * JSX语法会被转换为React.createElement()函数调用
 * React.createElement("div", { id: "app" }, "hello-mini-react");
 */
function renderApp() {
  return (
    <div id="parent">
      <div id="child">hello jsx</div>
    </div>
  );
}

console.log(renderApp);

export default App;
