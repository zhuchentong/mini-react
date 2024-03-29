Day-06: 02.批量执行action
---

- 在上一章节中，每次在执行setState时，就会执行action并且更新状态，单实际获取action返回结果的时机是在执行useState时，所以,这一章节的优化主要是将之前执行action的操作通过数组进行收集，并且执行完之后再统一执行action，这样，在获取action返回结果的时候，就可以直接使用useState的返回值。
