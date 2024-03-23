Day-01: 02.使用JSX
---

- 浏览器本身不可以直接识别 jsx，需要工具进行转译(babel, webpack, vite...)。

- vite在解析`jsx`语句时会默认将对应的`jsx`语句转译为`React.createElement`函数，所以在页面中需要默认引入`React`。

- 因为`createElement`返回值是对象，所以如果需要使用类似`<App/>`这样的方式将返回的对象或函数转换为组件，需要有函数式组件功能的支持。
