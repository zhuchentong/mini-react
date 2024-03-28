import React from "./core/React.js";

let count = 20
let props = {
  id: '33333'
}

function HelloWorld({content}) {
  return (<div>hello: {content}</div>);
}

function D1(){
  return <div>
    d1 for me
    <div>child1</div>
    <div>child2</div>
    <div>child3</div>
  </div>
}

const D2 = <div>d2 for you</div>

function HelloButton(){
  function onClick(){
    console.log('click')
    count++
    props={}
    React.update()
  }

  return (
    <div>
      <button {...props} onClick={onClick}>button: {count}</button>
      {count%2===1?<D1></D1>:D2}
    </div>
  )
}

function App() {
  return (
    <div id="parent">
      <div id="child">hello jsx</div>
      <HelloWorld content="react"></HelloWorld>
      <HelloWorld content={12345}></HelloWorld>
      <div id="child">hello world</div>
      <HelloButton></HelloButton>
    </div>
  );
}


export default App;
