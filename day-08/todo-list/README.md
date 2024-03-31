Day-08: todo-list
---
使用之前创建的mini-react实现以下功能

- 列表展示
- 添加todo
  - 点击添加按钮
  - 回车
- 删除todo
- 完成todo
- 本地存储
  - 点击save按钮存储当前todos的数据
  - 刷新页面时，读取本地存储的数据，并渲染到页面上
- filter
  - 显示所有的todos
  - 显示已完成的todos
  - 显示未完成的todos


本章结合之前知识创建todo-list示例，在完成过程中解决遇到的问题：

1. updateProps时如果当前节点为`functionComponent`（不存在dom）则不应该更新，应跳过。

2. 当初始时执行`useEffect`时，因为`useEffect`更新了`state`，导致`render`重新执行，这时在执行完第一次`commitRoot`后需要判断否是依然存在`nextWorkUnit`,如果存在则继续将`currentRoot`赋值给`wipRoot`以继续执行。