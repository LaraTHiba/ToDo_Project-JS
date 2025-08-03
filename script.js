const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');


form.addEventListener('submit', function(e) {
    e.preventDefault();

    const taskText = input.value.trim();
    if(taskText ==='') return;

    addTodo(taskText);
    input.value = '';
});


function addTodo(text, isDone = false, skipDB = false){
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


    if(!skipDB) addTaskDB(text, isDone);    
}

function addTaskDB(text, isDone) {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    const task = {
        title: text,
        completed: isDone,
        createdAt: new Date()
    };
    store.add(task);
}

function toggleDone(button) {
    const li = button.closest('li');
    const text = li.querySelector('span').textContent;
    const isNowDone = !li.classList.contains('done');
    li.classList.toggle('done');
    reorderTasks();

    updateTaskInDB(text, isNowDone);
}

function updateTaskInDB(text, isDone) {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');

    const request = store.getAll();
    request.onsuccess = function() {
        const allTasks = request.result;
        const task = allTasks.find(t => t.title === text);

        if (task) {
            task.completed = isDone;
            store.put(task);
        }
    };
}

function deleteTodo(button) {
    const li =button.closest('li');
    const text = li.querySelector('span').textContent;
    li.remove();

    deleteTaskFromDB(text);
}

function deleteTaskFromDB(text) {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');

    const request = store.getAll();
    request.onsuccess = function() {
        const allTasks = request.result;
        const task = allTasks.find(t => t.title === text);

        if (task) {
            store.delete(task.id);
        }
    };
}


function loadTodos() {

    const transaction = db.transaction(['tasks'], 'readonly');
    const store = transaction.objectStore('tasks');

    const request = store.getAll();
    request.onsuccess = function() {
        const tasks = request.result;
        tasks.forEach(task => {
            addTodo(task.title, task.completed, true);
        });
    };

}


function reorderTasks() {
    const items =  Array.from(document.querySelectorAll('#todo-list li'));
    const undoneItems = items.filter(li => !li.classList.contains('done'));
    const completed = items.filter(li => li.classList.contains('done'));

    list.innerHTML = '';
    [...undoneItems, ...completed].forEach(li => list.appendChild(li));
}

