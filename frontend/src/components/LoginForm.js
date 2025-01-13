import { el } from 'redom';
import { router } from './router.js';
import { ApiServer } from './ApiServer.js';
import { createLoginErrorText, formatLoginFields } from './validate.js';

/**
 * Класс LoginForm отвечает за создание и обработку формы входа.
 */
export class LoginForm {
  /**
   * Создает экземпляр LoginForm и инициализирует API сервер.
   */
  constructor() {
    this.api = new ApiServer();
  }

  /**
   * Создает блок авторизации с заголовком и кнопкой входа.
   */
  createBlockAuthorization() {
    const title = el('h1.login__page', 'Вход в аккаунт'); // Заголовок страницы входа.
    const button = el('button.btn.btn-login.btn-reset', 'Войти'); // Кнопка входа.
    const form = el(
      'form.form',
      el(
        '.form__block-fields',
        this.createInput('Логин', 'login', 'text'), // Поле ввода логина.
        this.createInput('Пароль', 'password', 'password'), // Поле ввода пароля.
      ),
      button,
    );

    const blockAuthorization = el('.card-login', title, form); // Создаем элемент блока авторизации.
    form.addEventListener('submit', this.validateForm.bind(this)); // Добавляем обработчик события для валидации формы при отправке.
    return el('#container.container.container-login', blockAuthorization); // Возвращаем элемент блока авторизации с контейнером.
  }

  /**
   * Создает элемент ввода с меткой, типом и плейсхолдером.
   */
  createInput(
    labelText,
    nameInput,
    typeInput = 'text',
    placeholder = 'Placeholder',
  ) {
    const input = el('input.form__input', {
      type: typeInput,
      placeholder: placeholder,
      name: nameInput,
      // value: labelText === "Логин" ? "developer" : "skillbox", // Устанавливаем значение по умолчанию для логина и пароля.
      value: labelText === 'Логин' ? '' : '',
    });

    input.addEventListener('input', () => {
      input.value = formatLoginFields(input.value);
    }); // Добавляем обработчик события для форматирования значения ввода.

    return el(
      `.form__block-input.input-${nameInput}`,
      el('label.form__label.form__label-login', { for: nameInput }, labelText), // Создаем метку для поля ввода.
      input,
    );
  }

  /**
   * Валидация значения поля ввода логина и пароля по заданным критериям.
   */
  validateLoginInput(inputValue, styleName, inputName) {
    let inputError = createLoginErrorText(inputValue, inputName);
    const blockInput = document.querySelector(`.input-${styleName}`);
    let inputEr = document.getElementById(`${styleName}Error`);

    if (inputEr) inputEr.remove(); // Удаляем предыдущие сообщения об ошибках, если они есть.

    if (inputError.length > 0) {
      const textError = el(
        'p.form__error.error-text.error-login',
        { id: `${styleName}Error` },
        inputError, // Создаем элемент с сообщением об ошибке.
      );
      blockInput.append(textError); // Добавляем сообщение об ошибке в блок ввода.
    }
    return !(inputError.length > 0); // Возвращаем true, если ошибок нет; иначе false.
  }

  /**
   * Валидация формы при отправке. Проверяет логин и пароль перед отправкой на сервер.
   */
  async validateForm(event) {
    event.preventDefault();

    const inputLoginValue = document.querySelector('input[name="login"]').value;
    const inputPasswordValue = document.querySelector(
      'input[name="password"]',
    ).value;

    const isValidateLogin = this.validateLoginInput(
      inputLoginValue,
      'login',
      'Логин',
    ); // Валидация логина.
    const isValidatePassword = this.validateLoginInput(
      inputPasswordValue,
      'password',
      'Пароль',
    ); // Валидация пароля.

    if (!isValidateLogin || !isValidatePassword) return; // Если есть ошибки валидации, выходим из функции.

    const credentials = {
      login: inputLoginValue,
      password: inputPasswordValue,
    };

    try {
      const token = await this.api.login(credentials); // Пытаемся выполнить вход с учетными данными пользователя.

      if (token) {
        router.navigate(`/accounts-all/`); // Перенаправляем на страницу со счетами после успешного входа.
      }
    } catch (error) {
      const formBlockFields = document.querySelector('.form__block-fields');
      const loginError = el('p.form__error.error-text', error.message); // Создаем элемент с сообщением об ошибке авторизации.
      formBlockFields.append(loginError); // Добавляем сообщение об ошибке в блок полей формы.
    }
  }
}
