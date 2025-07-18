const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

window.addEventListener('DOMContentLoaded', loadTodos);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const taskText = input.value.trim();
    if(taskText ==='') return;

    addTodo(taskText);
    updateLocalStorage();
    input.value = '';
});


function addTodo(text, isDone =false){
    const li= document.createElement('li');
    if(isDone) li.classList.add('done');

    li.innerHTML = `
        <span>${text}</span>
        <div>
        <button onclick="toggleDone(this)">✓</button>
        <button onclick="deleteTodo(this)">🗑</button>
        </div>
    `;
    list.appendChild(li);
    reorderTasks();
    updateLocalStorage
}

function toggleDone(button) {
    const li = button.closest('li');
    li.classList.toggle('done');
    updateLocalStorage();
    reorderTasks();
}

function deleteTodo(button) {
    const li =button.closest('li');
    li.remove();
    updateLocalStorage();
}



function loadTodos() {
    const todos = geTodosFromLocalStorage();
    todos.forEach(todo => {
        addTodo(todo.text, todo.isDone);
    });
}

function geTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function updateLocalStorage() {
    const items = document.querySelectorAll('#todo-list li');
    const todos = [];

    items.forEach(li =>{
        const text = li.querySelector('span').textContent;
        const done = li.classList.contains('done');
        todos.push({ text, done });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

function reorderTasks() {
    const items =  Array.from(document.querySelectorAll('#todo-list li'));
    const undoneItems = items.filter(li => !li.classList.contains('done'));
    const completed = items.filter(li => li.classList.contains('done'));

    list.innerHTML = '';
    [...undoneItems, ...completed].forEach(li => list.appendChild(li));
}