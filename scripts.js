const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
const resetBtn = document.querySelector("#reset-button");



let oldInputValue;
let taskIdCounter = 0;

const generateTaskId = () => {
  taskIdCounter++;
  return taskIdCounter;
};

const saveTodo = (text, done = 0, save = 1, id = null) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  const taskId = id || generateTaskId();
  resetBtn.classList.remove("hide");

  todo.dataset.id = taskId;

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = `${taskId}- ${text}`; 
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ id: taskId, text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const getTodoById = (id) => {
  const todos = document.querySelectorAll(".todo");

  for (const todo of todos) {
    const taskId = todo.dataset.id;
    if (taskId === id.toString() || `Task #${taskId}` === id.toString()) {
      return todo;
    }
  }

  return null;
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updateTodoLocalStorage(todo.dataset.id, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};
resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resetAllTasks();
});
const resetAllTasks = () => {
 
  todoList.innerHTML = "";
  localStorage.removeItem("todos");
  taskIdCounter = 0;
  resetBtn.classList.add("hide");
};


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(parentEl.dataset.id);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLocalStorage(parentEl.dataset.id);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0, todo.id);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (taskId) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.id !== taskId);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
  if (filteredTodos.length === 0) {
    resetBtn.classList.add("hide");
  }
};

const updateTodoStatusLocalStorage = (taskId) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.id === taskId ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (taskId, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.id === taskId ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
