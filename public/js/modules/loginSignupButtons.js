export function setupLoginSignupButtons() {
    const token = localStorage.getItem('auth_token');
    const userIcon = document.querySelector('.user');
    const navRight = document.querySelector('.right-nav');
    if (token == null) {
      if (userIcon) userIcon.remove();

      const unloggedButtonsContainer = document.createElement('li');
      unloggedButtonsContainer.classList.add('unlogged-buttons');
      const loginButton = document.createElement('a');
      loginButton.href = '/login';
      const registerButton = document.createElement('a');
      registerButton.href = '/plans.html';
      loginButton.innerHTML = `<button class="login-btn">Iniciar sesión</button>`;
      registerButton.innerHTML = `<button class="signup-btn">Registrarse</button>`;
      unloggedButtonsContainer.appendChild(loginButton);
      unloggedButtonsContainer.appendChild(registerButton);
      navRight.appendChild(unloggedButtonsContainer);
    }
}