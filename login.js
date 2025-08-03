const testUser = {
    id: Date.now(), // أو أي ID ثابت مثل 1
    email: 'test@example.com',
    password: '123456'
};

const dbRequest = indexedDB.open('TodoAppDB', 1);

dbRequest.onsuccess = function (event) {
    db = event.target.result;
    console.log('🚀 قاعدة البيانات تم فتحها بنجاح');


    // تأكد من وجود المستخدم التجريبي وإلا أضفه
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function () {
        const users = getAllRequest.result;
        const exists = users.some(u => u.email === testUser.email);
        if (!exists) {
            store.add(testUser);
            console.log('✅ تم إضافة مستخدم تجريبي');
        } else {
            console.log('ℹ️ المستخدم التجريبي موجود مسبقًا');
        }
    };

    transaction.oncomplete = function () {
        console.log('🚀 قاعدة البيانات جاهزة');
    };
};

dbRequest.onerror = function () {
    console.error('❌ فشل فتح قاعدة البيانات');
};




const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');

    const request = store.getAll();
    request.onsuccess = function () {
        const users = request.result;
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            saveSession(user);
            window.location.href = 'todo.html'; 
        } else {
            errorMessage.textContent = 'Email or password is incorrect';
        }
    };
});

function saveSession(user) {
    const transaction = db.transaction(['session'], 'readwrite');
    const store = transaction.objectStore('session');
    const session = {
        userId: user.id,
        email: user.email,
        loginTime: new Date()
    };
    store.clear(); 
    store.add(session);
}
