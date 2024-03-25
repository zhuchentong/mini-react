Day-03: 02.实现function component
---

- 在之前的章节中，`<App/>`无法被正常渲染的原因是因为当使用`<App/>`的写法时，jsx将`props.type`字段解析为了一个函数，所以我们需要处理`props.type`为函数的情况，即可使用`typeof props.type === 'function'`来判断当前节点是否为函数节点。

- 注意的是在函数式组件在虚拟节点树中是以一个节点的形式存在，但是并没有相应的`dom`对象，所以需要访问`dom`对象进行`append`的时候，应该访问`parent`来跳过当前函数式节点，对其`parent.dom`进行`append`操作。

- 还需要注意的是，因为会存在多个函数式组件嵌套的情况，所以需要通过`while`找到`parent`不是函数式组件（存在dom对象）的节点来进行操作即可。

- 函数时组件的输出传递使用`type(props)`即可。
