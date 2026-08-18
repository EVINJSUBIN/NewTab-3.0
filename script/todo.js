const todoText = document.getElementById("todoText");
const todoAdd = document.getElementById("todoAdd");
const todoList = document.getElementById("todoList");

const TODO_KEY = "newtab-todos";

loadTodos();

todoAdd.addEventListener("click", addTodo);
todoText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const text = todoText.value.trim();
    if (!text) return;

    const todos = getTodos();
    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    set(TODO_KEY, JSON.stringify(todos));
    todoText.value = "";
    loadTodos();
}

function deleteTodo(id) {
    const todos = getTodos().filter(t => t.id !== id);
    set(TODO_KEY, JSON.stringify(todos));
    loadTodos();
}

function toggleTodo(id) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    set(TODO_KEY, JSON.stringify(todos));
    loadTodos();
}

function getTodos() {
    const data = get(TODO_KEY);
    return data ? JSON.parse(data) : [];
}

function loadTodos() {
    const todos = getTodos();
    todoList.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = todo.completed ? "todoComplete" : "";

        const span = document.createElement("span");
        span.textContent = todo.text;
        span.style.cursor = "pointer";
        span.addEventListener("click", () => toggleTodo(todo.id));

        const btn = document.createElement("button");
        btn.className = "todoDelete";
        btn.textContent = "×";
        btn.addEventListener("click", () => deleteTodo(todo.id));

        li.appendChild(span);
        li.appendChild(btn);
        todoList.appendChild(li);
    });
}
