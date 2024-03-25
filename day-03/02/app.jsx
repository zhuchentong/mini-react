import React from "./core/React.js";


function HelloWorld({content}) {
  return (<div>hello: {content}</div>);
}

function App() {
  return (
    <div id="parent">
      <div id="child">hello jsx</div>
      <HelloWorld content="react"></HelloWorld>
      <HelloWorld content={12345}></HelloWorld>
      <div id="child">hello world</div>
    </div>
  );
}


export default App;
