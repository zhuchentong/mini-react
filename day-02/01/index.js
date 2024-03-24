console.log("hello");

const root = document.querySelector("#root");
const element = document.createElement("div");
const text = document.createTextNode("hello world");
element.appendChild(text);
root.appendChild(element);

// let i = 0
// while(i<10000000000){
//   i++
// }

let taskId = 0;

function workLoop(deadline) {
  taskId += 1;

  let shouldYeld = false;

  while (!shouldYeld) {
    console.log(`TaskID: ${taskId} is running.`);

    if (deadline.timeRemaining() < 1) {
      shouldYeld = true;
    }
  }


  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);
