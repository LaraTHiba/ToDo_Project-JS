let db;

const request = indexedDB.open('todoDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;

    // إنشاء الجداول
    if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        usersStore.createIndex('email', 'email', { unique: true });
    }

    if (!db.objectStoreNames.contains('session')) {
        db.createObjectStore('session', { keyPath: 'id', autoIncrement: true });
    }

    if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    }

    if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
    }

    if (!db.objectStoreNames.contains('archive')) {
        db.createObjectStore('archive', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("🚀 قاعدة البيانات تم فتحها بنجاح");
};

request.onerror = function(event) {
    console.error("❌ Database error: ", event.target.errorCode);
};
