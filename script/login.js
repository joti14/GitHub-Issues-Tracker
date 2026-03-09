document.getElementById('login-btn').addEventListener('click', () =>{
    const userNameInput = document.getElementById('username');
    const userName = userNameInput.value.trim();

    const inputPassword = document.getElementById('password');
    const password = inputPassword.value.trim();

    if(userName.toLowerCase() === 'admin' && password.toLowerCase() === 'admin123') {
        alert('login successful');
        window.location.assign('./home.html');
    }
    else {
        alert('login failed');
        return;
    }
});
