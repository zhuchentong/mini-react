Day-01: 01.实现最简 mini-react
---

- React的重点是虚拟DOM（VDom），将对Dom的操作转换为对VDom的操作，然后通过VDom和真实Dom进行同步。

- 实现的CreateElement函数的目的是将需要生成的Dom结构使用函数的方式描述出来。

- 实现Render函数的目的是将描述的Render函数中的VDom结构转换为真实Dom结构，然后插入到页面中。

- 每次`el.appendChild`函数执行，页面都会产生重绘操作，过于频繁的重绘会导致页面卡顿，可以考虑将多次的页面重绘到最后合并执行(最后再挂载到ROOT节点)。