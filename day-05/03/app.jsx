import React from "./core/React.js";

let count = 20
let props = {
  id: '33333'
}

function HelloWorld({content}) {
  return (<div>hello: {content}</div>);
}

const D1 = (
<div>
  d1 for me
</div>
)
  

const D2 =(
  <div>d2 for you</div>
)

const D3 =(
  <div>d3 for us</div>
)

const D4 =(
  <div>d4 for who</div>
)
function HelloButton(){
  function onClick(){
    console.log('click')
    count++
    props={}
    React.update()
  }

  return (
    <div>
      {(count%2!==1)&&D4}
      <button {...props} onClick={onClick}>button: {count}</button>
      {count%2===1?D1:D2}
      {(count%2===1)&&D3}
    </div>
  )
}

function App() {
  return (
    <HelloButton></HelloButton>
  );
}


export default App;
