let db;

// فتح قاعدة البيانات
const request = indexedDB.open('todoDB', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('session', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('archive', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadTodos();  
};

request.onerror = function(event) {
    console.error("Database error: ", event.target.errorCode);
};


