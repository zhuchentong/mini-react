Day-01: 03.使用vitest做单元测试
---

- 使用单元测试可以避免添加打印日志代码，提高测试效率

- 执行vitest会自动执行根目录下tests目录下的测试用例代码(*.spac.(js|jsx|ts))

- `toEqual`来判断与否与预期值一直，在vitest命令运行时执行`toMatchInlineSnapshot`可以自动生成快照结果便于测试。