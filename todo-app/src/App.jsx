
import React, { useState, useEffect } from 'react';
import { createContext } from 'react';


export const ThemeContext = createContext('dark')

// Assets //
import './assets/images/favicon-32x32.png';
import sun from './assets/images/icon-sun.svg'
import moon from './assets/images/icon-moon.svg'
import cross from './assets/images/icon-cross.svg';
import check from './assets/images/icon-check.svg';


// Assets //

//Components //

//Components //

const App = () => {

  const [state, setState] = useState(() => {
    const storeList = JSON.parse(localStorage.getItem('todoList'))
    return {
      todo: '',
      todoList: storeList || [],
      showAll: true,
      showActive: false,
      showCompleted: false

    }

  })


  const { todo, todoList, showAll, showActive, showCompleted } = state

  var todoListLenght = todoList.length

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const handleOnClick = () => {
    const list = todoList;
    list.push({ text: todo, isChecked: false }); // Store the todo text and checkbox state as an object
    setState({ todo: '', todoList: list, showAll: true }); // display todolist when clicked

    localStorage.setItem('todoList', JSON.stringify(list))
  }

  useEffect(() => {
    const savedList = localStorage.getItem('todoList')

    if (savedList) {
      setState({ ...state, todoList: JSON.parse(savedList) })
    }
  }, [])


  const handleDelete = (index) => {
    const list = todoList
    list.splice(index, 1)
    setState({ todo: '', todoList: list, showAll: true });
  }

  const handleCrossOut = (index) => {
    const list = [...todoList]; // Create a copy of the todoList array
    list[index].isChecked = !list[index].isChecked; // Toggle the isChecked value of the clicked item
    setState({ ...state, todoList: list }); // Update the state with the updated todoList array
    localStorage.setItem('todoList', JSON.stringify(list))

    if (list[index].isChecked) {
      todoListLenght = todoListLenght - 1
    } else {
      return todoListLenght
    }
  };

  const handleAll = () => {
    setState({ ...state, showAll: true, showActive: false, showCompleted: false });// display completed todo
  }

  const handleActive = () => {
    setState({ ...state, showAll: false, showActive: true, showCompleted: false }); // display active todo
  }

  const handleCompleted = () => {
    setState({ ...state, showAll: false, showActive: false, showCompleted: true }); // display completed todo

  }

  const filteredList = showAll ? todoList : showActive ? todoList.filter((item) => !item.isChecked) : todoList.filter((item) => item.isChecked);

  const [theme, setTheme] = useState('dark')

  // Update the theme in local storage whenever it changes


  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme);
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);



  const handleClearCompleted = () => {
    const list = todoList.filter((item) => !item.isChecked)
    setState({ ...state, todoList: list })
  }

  const [placeholder, setPlaceHolder] = useState("Create a new todo...")

  function handleFocus() {
    setPlaceHolder('Currently typing...')
  }

  function handleBlur() {
    setPlaceHolder('Create a new todo...')
  }



  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="todo-wrapper" id={theme}>
          <div className="top-wrapper">
            <div className="toggle-wrapper">
              <h1>TODO</h1>
              <div className="toggle-theme">
                <button aria-label="dark-mode" id="dark-mode"
                  onClick={toggleTheme}><img src={moon} alt="" aria-hidden="true"></img></button>
                <button aria-label="light-mode" id="light-mode"
                  onClick={toggleTheme}><img src={sun} alt="" aria-hidden="true"></img></button>
              </div>
            </div>

            <div className="input-wrapper">
              <input
                onChange={handleOnChange}
                name="todo"
                value={todo}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
              ></input>
              <button
                onClick={handleOnClick}
                className="checkbox"
                aria-label="add-todo"></button>
            </div>
          </div>

          <div className="task-wrapper">
            <div className="task-container">

              {
                filteredList.length ?
                  filteredList.map((value, index) => {
                    return (
                      <div draggable key={index} className="task-holder" onDragOver={(e) => {
                        e.preventDefault();
                      }} onDrop={(e) => {
                        const sourceIndex = e.dataTransfer.getData('todo/app');
                        const targetIndex = index;
                        if (sourceIndex !== targetIndex) {
                          const list = [...todoList];
                          const [removed] = list.splice(sourceIndex, 1);
                          list.splice(targetIndex, 0, removed);
                          setState({ ...state, todoList: list });
                        }
                      }}>
                        <div className="task-check">
                          <div className="checkbox"
                            onClick={() => handleCrossOut(index)}
                            style={{
                              background: value.isChecked ? `linear-gradient(to right, hsla(192, 100%, 67%, 0.6),hsla(280, 87%, 65%, 0.6)), url(${check}) center no-repeat ` : 'transparent'
                            }}
                          ></div>

                          <p style={{ textDecoration: value.isChecked ? 'line-through' : 'none' }}>{value.text}</p>

                        </div>
                        <div className='delete-wrapper'>
                          <button
                            className='delete'
                            onClick={() => handleDelete(index)}
                            aria-label='delete'><img src={cross} aria-hidden="true"></img></button>
                        </div>
                      </div>
                    )
                  }) : <p className="else">No Exixting Records</p>
              }
              <div className="items-left">
                <span>{todoListLenght - todoList.filter(item => item.isChecked).length} items left</span>
                <div className="task-filter-desktop">
                  <button className={showAll ? 'all' : ''} onClick={handleAll}
                    style={{ color: showAll ? 'hsl(220, 98%, 61%)' : "" }

                    }>
                    All
                  </button>
                  <button className={showActive ? 'active' : ''} onClick={handleActive}
                    style={{ color: showActive ? 'hsl(220, 98%, 61%)' : "" }} >
                    Active
                  </button>
                  <button className={showCompleted ? 'completed' : ''} onClick={handleCompleted}
                    style={{ color: showCompleted ? 'hsl(220, 98%, 61%)' : "" }}
                  >
                    Completed </button>

                </div>
                <span className="clear" onClick={handleClearCompleted}>Clear Completed</span>
              </div>



            </div>



            <div className="task-filter">
              <button className={showAll ? 'all' : ''} onClick={handleAll}
                style={{ color: showAll ? 'hsl(220, 98%, 61%)' : "" }

                }>
                All
              </button>
              <button className={showActive ? 'active' : ''} onClick={handleActive}
                style={{ color: showActive ? 'hsl(220, 98%, 61%)' : "" }} >
                Active
              </button>
              <button className={showCompleted ? 'completed' : ''} onClick={handleCompleted}
                style={{ color: showCompleted ? 'hsl(220, 98%, 61%)' : "" }}
              >
                Completed </button>

            </div>




            <div className="hint">
              <span>Drag and Drop to reorder list</span>
            </div>
          </div>
        </div >

      </ThemeContext.Provider >
    </>
  )
}

export default App
