import React from "./core/React.js";

let count = 10
let props = {
  id: '33333'
}

function HelloWorld({content}) {
  return (<div>hello: {content}</div>);
}


function HelloButton(){
  function onClick(){
    console.log('click')
    count++
    props={}
    React.update()
  }

  return (
    <button {...props} onClick={onClick}>button: {count}</button>
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
