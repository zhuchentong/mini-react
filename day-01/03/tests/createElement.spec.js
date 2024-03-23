import { it, describe, expect } from "vitest";
import { createElement } from "../core/React";

describe("createEelement", () => {
  it("should return vdom for element, props is null", () => {
    const element = createElement("div", null, "text1");
    // 使用toEqual检查生成是否正确
    // expect(element).toEqual({
    //   type: "div",
    //   props: { 
    //     children: [{
    //       type: "TEXT_ELEMENT",
    //       props:{
    //         nodeValue: "text1",
    //         children: []
    //       }
    //     }] 
    //   },
    // });
    // 使用toMatchInlineSnapshot快速生成快照
    expect(element).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "text1",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
  });

  it("should return vdom for element, props is not null", () => {
    const element = createElement("div", {id: "app"}, "text1");
    // 使用toEqual检查生成是否正确
    // expect(element).toEqual({
    //   type: "div",
    //   props: { 
    //     children: [{
    //       type: "TEXT_ELEMENT",
    //       props:{
    //         nodeValue: "text1",
    //         children: []
    //       }
    //     }] 
    //   },
    // });
    // 使用toMatchInlineSnapshot快速生成快照
    expect(element).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "text1",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `)
  });
});
