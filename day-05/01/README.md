Day-05: 01.diff更新children
---

- 之前通过对比新旧节点，通过判断isSameType为false时创建新节点，但是存在的问题时，没有对旧节点进行删除，所有需要在判断isSameType为false后对旧节点进行收集，然后在commitRoot时进行统一删除即可。

