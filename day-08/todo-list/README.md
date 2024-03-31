Day-07: 02.实现cleanUp
---

- `cleanUp`的目的是清除副作用,在执行第二次`useEffect`之前清除上一次`useEffect`的副作用,所以应在`runEffect`之前执行

- 通过采集`useEffect`的返回值保存为`cleanUp`,在下一次开始执行`runEffect`之前判断否是存在`cleanUp`来决定是否进行执行`cleanUp`
