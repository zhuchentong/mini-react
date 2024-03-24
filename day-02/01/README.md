Day-02: 01.实现任务调度器
---

- 了解`requestIdleCallback`函数，它会在浏览器空闲时调用指定的回调函数，也可以指定timeout来控制回调函数的调用时间。

- `requestIdleCallback`相比较与`requestAnimationFrame`的区别是`requestIdleCallback`适合执行优先级别低的任务，在其执行时浏览器会尽量减少任务执行时间，而`requestAnimationFrame`则不会。所以`requestAnimationFrame`相比则更适合执行优先级别搞得任务。

- `requestIdleCallback`不适合执行操作DOM的任务，因为它发生在一帧的最后，此时页面布局已经完成，因此会导致重新计算布局和视图的绘制，所以这类操作不具备可预测性。

- `Promise` 也不建议在`requestIdleCallback`中进行，因为 Promise 的回调属性 Event loop 中优先级较高的一种微任务，会在 `requestIdleCallback` 结束时立即执行，不管此时是否还有富余的时间，这样有很大可能会让一帧超过 16 ms。

