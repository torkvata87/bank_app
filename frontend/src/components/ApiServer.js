// import { Cleave } from 'cleave.js';

const SERVER_URL = 'http://localhost:3000';

/**
 * Класс ApiServer для взаимодействия с сервером API.
 */
export class ApiServer {
  /**
   * Создает экземпляр ApiServer.
   */
  constructor() {
    this.serverUrl = SERVER_URL;
    this.socket = null;
  }

  /**
   * Получает токен из sessionStorage.
   */
  getToken() {
    return sessionStorage.getItem('authToken');
  }

  /**
   * Устанавливает токен в sessionStorage.
   */
  setToken(token) {
    sessionStorage.setItem('authToken', token);
  }

  /**
   * Получает заголовки запроса с токеном, если он есть.
   */
  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Basic ${token}`,
      }),
    };
  }

  /**
   * Выполняет вход пользователя и получает токен авторизации.
   */
  async login({ login, password }) {
    try {
      const response = await fetch(`${this.serverUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (data && data.payload && data.payload.token) {
        this.setToken(data.payload.token);
        return data.payload.token;
      } else {
        throw ReferenceError('не удалось получить токен');
      }
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch') message = 'нет соединения с сервером';
      console.error('Ошибка:', error);
      throw TypeError(`Ошибка авторизации: ${message}`);
    }
  }

  /**
   * Получает список счетов пользователя.
   */
  async getAccounts() {
    try {
      const response = await fetch(`${this.serverUrl}/accounts`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw TypeError('Ошибка получения счетов');
      }
      const data = await response.json();
      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }

  /**
   * Получает подробную информацию о счете по ID.
   */
  async getAccountById(id) {
    try {
      const response = await fetch(`${this.serverUrl}/account/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw TypeError('Ошибка получения информации о счете');
      }

      const data = await response.json();

      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }

  /**
   * Создает новый счет.
   */
  async createAccount() {
    try {
      const response = await fetch(`${this.serverUrl}/create-account`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new TypeError('Ошибка создания счета');
      }

      const data = await response.json();
      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }

  /**
   * Переводит средства между счетами.
   */
  async transferFunds({ from, to, amount }) {
    try {
      const response = await fetch(`${this.serverUrl}/transfer-funds`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ from, to, amount }),
      });

      if (!response.ok) {
        throw new TypeError(`Ошибка перевода средств на счет ${to}`);
      }

      const data = await response.json();

      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }

  /**
   * Получает список валют пользователя.
   */
  async getCurrenciesUser() {
    try {
      const response = await fetch(`${this.serverUrl}/currencies`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new TypeError('Ошибка получения валют');
      }

      const data = await response.json();
      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }

  /**
   * Покупает указанное количество валюты по заданному курсу обмена.
   */
  async currencyBuy({ from, to, amount }) {
    try {
      const response = await fetch(`${this.serverUrl}/currency-buy`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ from, to, amount }),
      });

      if (!response.ok) {
        throw new TypeError(`Ошибка валютного обмена на счет ${to}`);
      }

      const data = await response.json();
      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }

  /**
   * Подключается к WebSocket для получения обновлений по курсам валюты и устанавливает обработчик сообщений.
   */
  connectToCurrencyFeed(onMessageReceived) {
    this.socket = new WebSocket('ws://localhost:3000/currency-feed');

    this.socket.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'EXCHANGE_RATE_CHANGE') {
        onMessageReceived(message);
      }
    };
  }

  /**
   * Отключается от WebSocket и очищает ссылку на сокет.
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Получает список банков из API.
   */
  async getBanks() {
    try {
      const response = await fetch(`${this.serverUrl}/banks`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new TypeError('Ошибка получения списка точек мест банкоматов');
      }

      const data = await response.json();
      return data.payload;
    } catch (error) {
      let message = error.message;
      if (message === 'Failed to fetch')
        message = 'Ошибка: нет соединения с сервером';
      console.error(message);
      throw TypeError(message);
    }
  }
}
