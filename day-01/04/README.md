Day-01: 04.自定义React的名字
---

- 通过在注释使用`@jsx`注解 可以指定将jsx转换成对应的代码段, 但是只在当前文件生效

- 使用vite也可以通过指定"esbuild.jsxFactory"来实现对转换的全局修改。

```javascript
esbuild: {
  jsxFactory: 'createElement',
}
```