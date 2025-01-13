import 'babel-polyfill';
import './normalize.css';
import './style.css';
import './skeleton.css';
import './media.css';
import './media_skeleton.css';
import { router } from './components/router.js';

document.addEventListener('DOMContentLoaded', async () => {
  let token = sessionStorage.getItem('authToken');

  if (token) {
    let sessionTimeout;
    let sessionTimeoutExit;
    if (sessionTimeoutExit) {
      clearTimeout(sessionTimeoutExit);
    }
    // Сброс токена при обновлении страницы
    sessionTimeoutExit = setTimeout(() => {
      token = '';
      sessionStorage.removeItem('authToken');
      router.navigate('/login');
    }, 300);

    // Функция для сброса таймера сессии
    const resetSessionTimer = () => {
      clearTimeout(sessionTimeout);
      sessionTimeout = setTimeout(() => {
        sessionStorage.removeItem('authToken');
        router.navigate('/login');
      }, 60000);
    };
    resetSessionTimer();
    // Сброс таймера при взаимодействии с пользователем
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keydown', resetSessionTimer);
    document.addEventListener('click', resetSessionTimer);
  } else {
    router.navigate('/login');
  }
});
