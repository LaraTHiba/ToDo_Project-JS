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
