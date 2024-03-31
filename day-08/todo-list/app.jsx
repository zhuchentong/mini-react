import React from "./core/React.js";
import "./style.css";

function TodoItem({ item, onFinish, onCancel, onRemove }) {
  return (
    <div className={`task-item ${item.state}`}>
      <div style="min-width: 100px;">{item.title}</div>
      <div>
        {item.state === "active" && (
          <button onClick={() => onFinish(item.id)}>完成</button>
        )}
        {item.state === "finished" && (
          <button onClick={() => onCancel(item.id)}>取消</button>
        )}
        <button onClick={() => onRemove(item.id)}>删除</button>
      </div>
    </div>
  );
}

function App() {
  const [list, setList] = React.useState([]);
  const [text, setText] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    const taskList = localStorage.getItem("task-list");
    if (taskList) {
      setList(JSON.parse(taskList));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("task-list", JSON.stringify(list));
  }, [list]);

  function getRamdomId() {
    return Math.random().toString(32).slice(2);
  }

  function createItem(title) {
    return {
      id: getRamdomId(),
      state: "active",
      title,
    };
  }

  function onFinish(id) {
    setList(
      list.map((item) => {
        if (item.id === id) {
          item.state = "finished";
        }

        return item;
      })
    );
  }

  function onCancel(id) {
    setList(
      list.map((item) => {
        if (item.id === id) {
          item.state = "active";
        }

        return item;
      })
    );
  }

  function onRemove(id) {
    setList(list.filter((item) => item.id !== id));
  }

  function onAdd() {
    if (text.trim()) {
      setList([...list, createItem(text)]);
      setText("");
    }
  }

  return (
    <div>
      <h1>TODO-LIST</h1>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
        <button onClick={() => onAdd()}>添加</button>
        <button>保存</button>
      </div>
      <div>
        <input
          type="radio"
          name="filter"
          id="all"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
        >
          all
        </input>
        <label htmlFor="all">all</label>

        <input
          type="radio"
          name="filter"
          id="active"
          checked={filter === "active"}
          onChange={() => setFilter("active")}
        >
          active
        </input>
        <label htmlFor="active">active</label>

        <input
          type="radio"
          name="filter"
          id="finish"
          checked={filter === "finished"}
          onChange={() => setFilter("finished")}
        >
          finished
        </input>
        <label htmlFor="finish">finish</label>
      </div>
      <div>
        {...list
          .filter((item) => {
            switch (filter) {
              case "active":
                return item.state === "active";
              case "finished":
                return item.state === "finished";
              default:
                return true;
            }
          })
          .map((item) => (
            <TodoItem
              item={item}
              onCancel={onCancel}
              onFinish={onFinish}
              onRemove={onRemove}
            ></TodoItem>
          ))}
      </div>
    </div>
  );
}

export default App;
