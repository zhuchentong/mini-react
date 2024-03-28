Day-05: 03.解决edge case的方式
---

- 本节需要处理的问题是当节点为false时的处理如：`1 === 2 && <div>123</div>`, 在这种情况下该节点的值为`false`，也应在链式结构中被忽略，不进行创建，所以需要处理`newFiber`没有值时的情况，并对prevFiber跳过赋值。

- 节点为false的情况中存在三种类型：1.空节点在children开始，2.空节点在children中间，3.空节点在children结束。，需要依次进行处理。

