import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import '../../todo.css'
import {
  createSet,
  createAdd,
  createRemove,
  createToggle
} from './actions.js'

let idSeq = Date.now()
const LS_KEY = '$-todos_'

// **重点函数**
function bindActionCreators(actionCreators, dispatch) {
  const ret = {}
  for (let key in actionCreators) {
    // args 不定参数
    ret[key] = function (...args) {
      const itemCreator = actionCreators[key]
      const action = itemCreator(...args)
      dispatch(action)
    }
  }
  return ret
}

const Control = memo(function Control(props) {
  const { addTodo } = props
  const inputRef = useRef()
  const onSubmit = (e) => {
    e.preventDefault();
    let newText = inputRef.current.value.trim()
    if (newText.length == 0) {
      return;
    }
    addTodo({
      id: ++idSeq,
      text: newText,
      complete: false
    })
    inputRef.current.value = ''
  }

  return (
    <div className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          ref={inputRef}
          className="new-todo"
          placeholder="请输入内容"
        />
      </form>
    </div>
  )
})

const TodoItem = memo(function TodoItem(props) {
  const {
    todo: {
      id,
      text,
      complete
    },
    removeTodo,
    toggleTodo
  } = props
  const onChange = () => {
    toggleTodo(id)
  }
  const onRemove = () => {
    removeTodo(id)
  }
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        onChange={onChange}
        checked={complete} />
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  )
})

const Todos = memo(function Todos(props) {
  const { todolist, toggleTodo, removeTodo } = props
  return (
    <ul>
      {
        todolist.map(item => {
          return (
            <TodoItem
              key={item.id}
              todo={item}
              toggleTodo={toggleTodo}
              removeTodo={removeTodo}
            />)
        })
      }
    </ul>
  )
})

function TodoList() {
  const [todolist, setTodolist] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)

  function reducer(state, action) {
    const { type, payload } = action
    const { todolist, incrementCount } = state
    switch (type) {
      case 'set':
        return {
          ...state,
          todolist: payload,
          incrementCount: incrementCount + 1
        }
      case 'add':
        return {
          ...state,
          todolist: [...todolist, payload],
          incrementCount: incrementCount + 1
        }
      case 'remove':
        return {
          ...state,
          todolist: todolist.filter(item => {
            return item.id !== payload
          })
        }
      case 'toggle':
        return {
          ...state,
          todolist: todolist.map(item => {
            return item.id === payload ? { ...item, complete: !item.complete } : item
          })
        }
      default:

    }
  }


  const dispatch = useCallback((action) => {
    const state = {
      todolist,
      incrementCount
    }
    const setters = {
      todolist: setTodolist,
      incrementCount: setIncrementCount
    }
    const newState = reducer(state, action)
    for (let key in newState) {
      setters[key](newState[key])
    }
  }, [todolist, incrementCount])

  //注意两个useEffect的顺序
  useEffect(() => {
    let todolist = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    dispatch(createSet(todolist))
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todolist))
  }, [todolist]);

  return (
    <div className="todo-list">
      <Control {...bindActionCreators({ addTodo: createAdd }, dispatch)} />
      <Todos {...bindActionCreators({ removeTodo: createRemove, toggleTodo: createToggle }, dispatch)} todolist={todolist} />
    </div>
  )
}

export default TodoList;
