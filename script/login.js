document.getElementById('login-btn').addEventListener('click', () =>{
    const userNameInput = document.getElementById('username');
    const userName = userNameInput.value;

    const inputPassword = document.getElementById('password');
    const password = inputPassword.value;

    if(userName == 'admin' && password == 'admin123') {
        alert('login successful');
        window.location.assign('./home.html');
    }
    else {
        alert('login failed');
        return;
    }
});
