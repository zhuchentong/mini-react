import React from "./core/React.js";

let count = 20;
let props = {
  id: "33333",
};

function HelloWorld({ content }) {
  return <div>hello: {content}</div>;
}

const D1 = <div>d1 for me</div>;

const D2 = <div>d2 for you</div>;

const D3 = <div>d3 for us</div>;

const D4 = <div>d4 for who</div>;

function HelloButton1() {
  const [value1, updateValue1] = React.useState(100);
  const [value2, updateValue2] = React.useState(100);

  React.useEffect(()=>{
    console.log('init')
  },[])

  React.useEffect(()=>{
    console.log('update value1')
  },[value1])

  React.useEffect(()=>{
    console.log('update value2')
  },[value2])

  function onClick() {
    count++;
    props = {};
    updateValue1(v=>v+1);
    updateValue2(v=>v+2)
  }

  return (
    <div>
      <button {...props} onClick={onClick}>
        button 1:{value1} -
        button 2:{value2}
      </button>
    </div>
  );
}

function HelloButton2() {
  const [value, updateValue] = React.useState("Hello");
  console.log("current component: button 2");
  function onClick() {
    count++;
    props = {};
    updateValue((x) => x + "!");
  }

  return (
    <div>
      <button {...props} onClick={onClick}>
        button 2: {value}
      </button>
    </div>
  );
}

function App() {
  const update = React.update();
  console.log("current component: button app");
  function onClick() {
    count++;
    update();
  }

  return (
    <div>
      <button onClick={onClick}>button app: {count}</button>
      <HelloButton1></HelloButton1>
      <HelloButton2></HelloButton2>
    </div>
  );
}

export default App;
