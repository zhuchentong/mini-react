Day-07: 01.实现useEffect
---

- useEffect是用在`state`数据是否发生改变时执行,当`deps`为空时, 应在组件初始化时执行.

- commitEffect在应在构建完dom树结构之后进行执行,即在`commitRoot`之后执行

- 执行useEffect逻辑与useState类型,进行数据的采集,并将相应的数据保存在`fiber`上,在`commitEffect`时,与之前历史fiber上保存的`effectHook`进行对比,如果存在差异,则执行对应的`effectHook`.
