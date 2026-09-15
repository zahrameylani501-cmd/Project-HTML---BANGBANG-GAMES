// AUTH: REGISTER, LOGIN, LOGOUT, GUARD (LOCALSTORAGE, VALIDASI SEDERHANA)
const usersKey = 'gamehub-users';
const sessionKey = 'gamehub-current-user';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');

// AMBIL & SIMPAN DATA USER
function loadUsers() {
    try {
        const raw = localStorage.getItem(usersKey);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

// SESSION USER YANG LAGI LOGIN
function setCurrentUser(username) {
    localStorage.setItem(sessionKey, username);
}

function getCurrentUser() {
    return localStorage.getItem(sessionKey);
}

function logout() {
    localStorage.removeItem(sessionKey);
    window.location.href = 'login.html';
}

// LEMPAR KE LOGIN KALO BELUM LOGIN (DIPANGGIL DI HALAMAN YANG BUTUH LOGIN)
function guardPage() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

//VALIDASI
function usernameValid(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function passwordValid(password) {
    return password.length >= 6 && password.trim() === password && !/\s/.test(password);
}

// PROSES LOGIN
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorText = document.getElementById('login-error');

        const users = loadUsers();
        const found = users.find(function (u) {
            return u.username.toLowerCase() === username.toLowerCase() && u.password === password;
        });

        if (!username || !password) {
            errorText.textContent = 'Username dan password wajib diisi.';
            loginForm.reset();
        } else if (!found) {
            errorText.textContent = 'Username atau password salah.';
            loginForm.reset();
        } else {
            errorText.textContent = '';
            setCurrentUser(found.username);
            window.location.href = 'index.html';
        }
    });
}

// PROSES REGISTER
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const errorText = document.getElementById('register-error');

        const users = loadUsers();
        const alreadyExists = users.some(function (u) {
            return u.username.toLowerCase() === username.toLowerCase();
        });

        if (!username || !password || !confirmPassword) {
            errorText.textContent = 'Semua kolom wajib diisi.';
            registerForm.reset();
        } else if (!usernameValid(username)) {
            errorText.textContent = 'Username 3-20 karakter, hanya huruf/angka/underscore, tanpa spasi.';
            registerForm.reset();
        } else if (!passwordValid(password)) {
            errorText.textContent = 'Password minimal 6 karakter dan tidak boleh mengandung spasi.';
            registerForm.reset();
        } else if (password !== confirmPassword) {
            errorText.textContent = 'Konfirmasi password tidak cocok.';
            registerForm.reset();
        } else if (alreadyExists) {
            errorText.textContent = 'Username sudah dipakai, coba yang lain.';
            registerForm.reset();
        } else {
            errorText.textContent = '';
            users.push({ username: username, password: password });
            saveUsers(users);
            setCurrentUser(username);
            window.location.href = 'index.html';
        }
    });
}

// TOMBOL LOGOUT (ADA DI NAV HALAMAN INDEX/GAME/FAVORIT)
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

const loginClose = document.getElementById('close-login');
if (loginClose) {
    loginClose.addEventListener('click', function () {
        window.history.back();
    });
}