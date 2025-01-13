import { el, setChildren, svg } from 'redom';
import Cleave from 'cleave.js';
import { PageUserBasic } from './PageUserBasic.js';
import { ApiServer } from './ApiServer.js';
import { checkValidateSum } from './utils';
import { formatCurrency } from './validate.js';

/**
 * Класс PageCurrency отвечает за создание страницы валюты.
 */
export class PageCurrency extends PageUserBasic {
  /**
   * Создает экземпляр PageCurrency.
   */
  constructor(titlePage) {
    super(titlePage);
    this.currenciesUser = {};
    this.api = new ApiServer();
  }

  /**
   * Создает контейнер содержимого страницы валюты.
   */
  async contentPageContainer() {
    try {
      // Запускаем оба процесса параллельно
      const [currenciesUser] = await Promise.all([
        this.api.getCurrenciesUser(), // Получаем валюты пользователя из API.
        this.api.connectToCurrencyFeed((message) =>
          this.updateCurrencyFeed(message),
        ), // Устанавливаем обработчик для обновления курса валют.
      ]);

      this.currenciesUser = currenciesUser; // Сохраняем полученные валюты пользователя

      this.currencyFeedList = el(
        'ul.list-reset.currency__list.currency__list-feed', // Создаем список для отображения обновлений курса валют.
      );

      return el(
        '.container__currency-basic',
        el(
          '.currency__left',
          this.createYourCurrencies(), // Создаем блок с валютами.
          this.createCurrencyExchange(), // Создаем блок обмена валюты.
        ),
        el(
          '.currency__right',
          this.createCardBlue(
            'Изменение курсов в реальном времени',
            this.currencyFeedList, // Список обновлений курса валют.
            '.card-blue-currency',
            '.card__title-second-change',
          ),
        ),
      );
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      // Обработка ошибок, например, показать сообщение пользователю
    }
  }

  /**
   * Создает блок с валютами пользователя.
   */
  createYourCurrencies() {
    return this.createCardWhite(
      'Ваши валюты', // Заголовок блока с валютами.
      this.updateListCurrencies(this.currenciesItems()), // Обновляем список доступных валют пользователя.
      '.card__title-second-change',
      '.card-white-currency.card-white-currency-your',
    );
  }

  /**
   * Создает элементы списка доступных валют пользователя.
   */
  currenciesItems() {
    if (!this.currenciesUser || Object.keys(this.currenciesUser).length === 0) {
      return el('p.currency-description', 'Нет доступных валют'); // Возвращаем сообщение, если нет доступных валют.
    }

    return Object.entries(this.currenciesUser).map(([key, value]) => {
      if (value['amount'].toFixed(2) > 0) {
        return el(
          'li.currency-list__item',
          el(
            '.currency__item-block',
            el('span.currency__span.currency__span-name', key),
            el(
              'span.currency__span.currency__span-value',
              formatCurrency(value['amount']), // Отображаем сумму доступной валюты с двумя десятичными знаками.
            ),
          ),
        );
      }
    });
  }

  /**
   * Обновляет список доступных валют на странице.
   */
  updateListCurrencies() {
    let listCurrencies = document.querySelector('.currency__list');
    if (!listCurrencies) {
      return el('ul.list-reset.currency__list', this.currenciesItems());
    } else {
      listCurrencies.innerHTML = '';
      setChildren(listCurrencies, this.currenciesItems()); // Обновляем содержимое списка новыми элементами валюты.
      return listCurrencies;
    }
  }

  /**
   * Обновляет выпадающий список доступных валют при нажатии на кнопку выбора валюты.
   */
  updateListDropDown(dropDownBtn) {
    let listCurrencies = Object.keys(this.currenciesUser); // Получаем массив ключей (валют) из объекта currenciesUser.

    const currencyItem = listCurrencies.map((currency) => {
      const item = el(
        'li.dropdown__item.dropdown__list-item',
        { role: 'option', tabindex: '0' },
        currency,
      );

      item.addEventListener('click', (event) => {
        this.handlerKeyItemCurrency(event.currentTarget);
      });

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') this.handlerKeyItemCurrency(item); // Добавляем обработчик нажатия клавиши Enter для выбора элемента из выпадающего списка.
      });
      return item;
    });

    let listDropDown = dropDownBtn.nextSibling;

    if (listDropDown) {
      listDropDown.innerHTML = '';
      currencyItem.forEach((item) => listDropDown.append(item));
      return listDropDown; // Возвращаем обновленный выпадающий список.
    } else {
      return el(
        'ul.dropdown__list.dropdown__list-currency.hidden.list-reset',
        {
          role: 'listbox',
          'aria-labelledby': 'select-button',
        },
        currencyItem,
      );
    }
  }

  /**
   * Создает элемент выбора валюты с меткой и кнопкой выпадающего списка.
   */
  createCurrencySelect(id, label, textBtn) {
    const dropDownBtn = el(
      'button.btn-reset.dropdown__btn.dropdown__btn-currency',
      { id: id, 'aria-expanded': false, 'aria-haspopup': 'listbox' }, // Атрибут aria для улучшения доступности.
      textBtn,
    );

    dropDownBtn.addEventListener('click', () => {
      this.dropdownUp(dropDownBtn);
    }); // Добавляем обработчик клика на кнопку выбора.

    document.addEventListener('click', this.handleDocumentClick.bind(this)); // Добавляем обработчик клика по документу.

    return el(
      '.currency-select',
      el('label.form-currency__label', { for: id }, label), // Создаем метку для элемента выбора.
      el(
        '.currency-select__block',
        dropDownBtn,
        this.updateListDropDown(dropDownBtn),
      ),
    );
  }

  /**
   * Обрабатывает выбор элемента из выпадающего списка при нажатии клавиши Enter.
   */
  handlerKeyItemCurrency(element) {
    this.itemActions(element, '-currency');
    const dropDownBtn = element.parentNode.previousSibling;
    dropDownBtn.textContent = element.textContent;
  }

  /**
   * Создает блок обмена валюты с выбором валют и полем ввода суммы.
   */
  createCurrencyExchange() {
    const blockCustomSelectFrom = this.createCurrencySelect(
      'from-exchange',
      'Из',
      'BTC', // Валюта по умолчанию для выбора "Из".
    );
    const blockCustomSelectTo = this.createCurrencySelect(
      'to-exchange',
      'в',
      'ETH', // Валюта по умолчанию для выбора "В".
    );
    const inputSum = el('input.form__input', {
      name: 'sum-exchange',
      type: 'text',
      placeholder: '0.00', // Плейсхолдер для поля ввода суммы.
    });
    const blockInputSum = el(
      '.form__block-input-exchange-sum',
      { id: 'blockSum' },
      el('label.form-currency__label', { for: 'sum-exchange' }, 'Сумма'),
      inputSum,
    );

    const button = el('button.btn.btn-exchange.btn-reset', 'Обменять'); // Кнопка для выполнения обмена валюты.
    const form = el(
      'form.form-exchange',
      el(
        '.form__block-left',
        el(
          '.form__exchange-inputs',
          blockCustomSelectFrom,
          blockCustomSelectTo,
        ),
        blockInputSum,
      ),
      button,
    );


    new Cleave(inputSum, {
      numeral: true,
      delimiter: ' ',
      numeralPositiveOnly: true,
    });

    form.addEventListener('submit', this.currencyExchange.bind(this)); // Добавляем обработчик события отправки формы.

    return this.createCardWhite(
      'Обмен валюты',
      form,
      '.card__title-second-exchange',
      '.card-white-currency.card-white-currency-exchange',
    );
  }

  /**
   * Обрабатывает обмен валюты при отправке формы обмена.
   */
  async currencyExchange(event) {
    event.preventDefault();

    const dropDownBtnFrom = document.getElementById('from-exchange');
    const dropDownBtnTo = document.getElementById('to-exchange');

    const textDropDownBtnFrom = dropDownBtnFrom.textContent;
    const textDropDownBtnTo = dropDownBtnTo.textContent;

    const inputExchangeSum = document.querySelector(
      'input[name="sum-exchange"]',
    );

    const rawSumValue = inputExchangeSum.value.replace(' ', ''); // Убираем пробелы из значения суммы.
    const balance = this.currenciesUser[textDropDownBtnFrom].amount; // Получаем баланс выбранной валюты.

    if (!checkValidateSum(rawSumValue, balance, '.error-text-currency')) return; // Проверяем валидность суммы.

    const exchangeData = {
      from: textDropDownBtnFrom,
      to: textDropDownBtnTo,
      amount: rawSumValue,
    };

    try {
      const isExchange = await this.api.currencyBuy(exchangeData);

      if (isExchange) {
        this.currenciesUser = isExchange; // Обновляем список доступных валют пользователя после успешного обмена.
        this.updateListCurrencies(); // Обновляем отображение списка доступных валют.
        inputExchangeSum.value = '';
      }
    } catch (error) {
      const blockInput = document.getElementById('blockSum');

      const transferError = el(
        'p.form__error.error-text.error-text-currency',
        { id: 'textErrorSum' },
        error.message, // Создаем элемент с сообщением об ошибке перевода.
      );
      blockInput.append(transferError);
      console.error('Ошибка перевода:', error);
    }
  }

  /**
   * Создает элемент списка обновлений курса валют на основе полученного сообщения.
   */
  createCurrenciesFeedItem(message) {
    const change = message.change === 1 ? 'growth' : 'fall'; // Определяем направление изменения курса (рост или падение).
    const changeColor = message.change === 1 ? '#76ca66' : '#fd4e5d'; // Устанавливаем цвет изменения курса в зависимости от направления.
    return el(
      'li.currency-list__item',
      el(
        `.currency__item-block.currency__item-block-${change}`,
        el(
          'span.currency__span-feed.currency__span.currency__span-name',
            `${message.from}/${message.to}`,
        ),
        el(
          `span.currency__span-feed.currency__span-feed-value.currency__span.currency__span-value.currency__span-${change}`,
            formatCurrency(message.rate),
          svg(
            `svg.svg-currency-value`,
            {
              width: '20',
              height: '10',
              viewBox: '0 0 20 10',
              fill: 'none',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            svg('path', {
              d: 'M20 10L10 0L0 10L20 10Z',
              fill: changeColor,
            }),
          ),
        ),
      ),
    );
  }

  /**
   * Обновляет список курсов валют при получении нового сообщения от WebSocket.
   */
  async updateCurrencyFeed(message) {
    try {
      this.createCurrencyFeedList(message); // Создаем элемент списка обновлений курса валют.
    } catch (error) {
      this.api.disconnect(); // Отключаемся от WebSocket в случае ошибки.
    }
  }

  /**
   * Добавляет элемент обновления курса к списку курсов на странице.
   */
  createCurrencyFeedList(message) {
    this.currencyFeedList.insertBefore(
      this.createCurrenciesFeedItem(message),
      this.currencyFeedList.firstChild,
    );

    const leftBlock = document.querySelector('.currency__left');
    const gap = parseInt(window.getComputedStyle(leftBlock).gap, 10);
    const cardCurrency = document.querySelector('.card-white-currency-your');
    const cardCurrencyExchange = document.querySelector(
      '.card-white-currency-exchange',
    );
    const rightBlock = document.querySelector('.card-blue-currency');

    let leftHeight =
      Number(gap) +
      Number(cardCurrency.offsetHeight) +
      Number(cardCurrencyExchange.offsetHeight);

    let rightHeight = rightBlock.offsetHeight;

    if (rightHeight > leftHeight) {
      this.currencyFeedList.removeChild(this.currencyFeedList.lastChild);
    }
  }
}
