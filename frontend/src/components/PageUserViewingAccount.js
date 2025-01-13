import { el, svg } from 'redom';
import { PageUserViewing } from './PageUserViewing.js';
import { ApiServer } from './ApiServer.js';
import { Transaction } from './Transaction.js';
import { router } from './router.js';
import { arrRecipAccounts, checkValidateSum } from './utils.js';
import Cleave from 'cleave.js';

/**
 * Класс PageUserViewing отвечает за создание страницы просмотра информации о пользователе.
 */
export class PageUserViewingAccount extends PageUserViewing {
  /**
   * Создает экземпляр PageUserViewingAccount.
   */
  constructor(titlePage, buttonName, accountId) {
    super(titlePage);
    this.buttonName = buttonName;
    this.accounts = {};
    this.accountId = accountId;
    this.api = new ApiServer();
    this.transactions = accountId.transactions.map(
      (transaction) =>
        new Transaction(
          transaction.amount,
          transaction.date,
          transaction.from,
          transaction.to,
        ),
    );
  }

  createPageUserViewingAccount() {
    return this.createPage(this.contentPageContainer())
  }

  /**
   * Обновляет класс стрелки в зависимости от наличия элементов в выпадающем списке.
   */
  updateArrowClass(blockInput) {
    const dropdownItems = document.querySelectorAll('.dropdown__item');
    if (dropdownItems.length > 0) {
      blockInput.classList.add('arrow-up');
    } else {
      blockInput.classList.remove('arrow-up');
    }
  }

  /**
   * Добавляет обработчики событий к полю ввода и выпадающему списку для выбора счета.
   */
  inputSelectAddEventListener(input, dropdownList, blockInput) {
    input.addEventListener('focus', (event) => {
      dropdownList.classList.add('visible');
      this.updateArrowClass(blockInput);
      this.loadUsedAccounts(event.currentTarget.value, dropdownList);
    });

    input.addEventListener('input', (event) => {
      dropdownList.classList.add('visible'); // Показываем выпадающий список при вводе текста в поле ввода.
      dropdownList.classList.remove('hidden');
      this.loadUsedAccounts(event.currentTarget.value, dropdownList); // Загружаем использованные счета на основе введенного значения.
      this.updateArrowClass(blockInput); // Обновляем класс стрелки в блоке ввода.
    });

    dropdownList.addEventListener('click', (event) => {
      if (event.currentTarget.tagName === 'LI') {
        input.value = event.target.textContent; // Заполняем инпут выбранным значением из списка.
        dropdownList.classList.remove('visible'); // Скрываем выпадающий список после выбора элемента.
        dropdownList.innerHTML = '';
        this.updateArrowClass(blockInput); // Обновляем класс стрелки в блоке ввода после выбора элемента.
      }
    });
  }

  /**
   * Загружает использованные счета на основе введенного значения и обновляет выпадающий список.
   */
  loadUsedAccounts(value, dropdownList) {
    const usedAccounts =
      JSON.parse(localStorage.getItem('usedAccounts')) || arrRecipAccounts(); // Получаем использованные счета из localStorage или используем предустановленные.

    dropdownList.innerHTML = '';

    const filteredAccounts = usedAccounts.filter(
      (account) => account.includes(value), // Фильтруем использованные счета по введенному значению
    );

    if (filteredAccounts.length > 0) {
      filteredAccounts.forEach((account) => {
        const listItem = el(
          'li.dropdown__list-item.dropdown__item',
          { role: 'option', tabindex: '0' },
          account,
        );

        listItem.addEventListener('click', (event) => {
          this.handlerKeyItemTransfer(listItem);
        });
        listItem.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') this.handlerKeyItemTransfer(listItem); // Обрабатываем нажатие клавиши Enter на элементе списка переводов.
        });
        dropdownList.appendChild(listItem); // Добавляем элемент списка в выпадающий список.
      });
      dropdownList.classList.add('visible'); // Показываем список, если есть совпадения.
      dropdownList.classList.remove('hidden');
    } else {
      dropdownList.classList.remove('visible'); // Скрываем список, если нет совпадений.
      dropdownList.classList.add('hidden');
    }
  }

  /**
   * Обрабатывает выбор элемента из выпадающего списка при нажатии клавиши Enter.
   */
  handlerKeyItemTransfer(element) {
    this.itemActions(element); // Выполняем действия при выборе элемента.
    element.parentNode.classList.add('visible');
    const input = element.parentNode.previousSibling;
    input.value = element.textContent;
  }

  /**
   * Создает новый перевод с полями ввода для номера счета и суммы перевода.
   */
  createNewTransfer() {
    const input = el('input.form__input.form__input-viewing', {
      name: 'transfer-account',
      type: 'text',
      placeholder: 'Placeholder',
    });

    const dropdownList = el(
      'ul.dropdown__list.dropdown__list-transfer.hidden.list-reset',
      {
        role: 'listbox',
        'aria-labelledby': 'select-button',
      },
    );

    const inputSum = el('input.form__input.form__input-viewing', {
      name: 'transfer-sum',
      type: 'text',
      placeholder: 'Placeholder',
    });

    const blockCustomSelect = el(
      '.form__block-input.form__block-input-after',
      { id: 'blockTransfer' },
      [
        el(
          'label.form__label.form__label-viewing',
          { for: 'transfer-account' },
          'Номер счета получателя',
        ),
        input,
        dropdownList,
      ],
    );

    const blockInput = el(
      '.form__block-input',
      { id: 'blockSum' },
      el(
        'label.form__label.form__label-viewing',
        { for: 'transfer-sum', id: 'transfer-sum' },
        'Сумма перевода',
      ),
      inputSum,
    );

    this.inputSelectAddEventListener(input, dropdownList, blockCustomSelect); // Добавляем обработчики событий к полю ввода и выпадающему списку.

    const button = el(
      'button.btn.btn-send.btn-reset',
      svg(
        'svg',
        {
          width: '20',
          height: '16',
          viewBox: '0 0 20 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        svg('path', {
          d: 'M18 16H2C0.89543 16 0 15.1046 0 14V1.913C0.0466084 0.842547 0.928533 -0.00101428 2 -9.95438e-07H18C19.1046 -9.95438e-07 20 0.89543 20 2V14C20 15.1046 19.1046 16 18 16ZM2 3.868V14H18V3.868L10 9.2L2 3.868ZM2.8 2L10 6.8L17.2 2H2.8Z',
          fill: 'white',
        }),
      ),
      'Отправить', // Текст кнопки отправки перевода.
    );

    const form = el('form.form.form-viewing', [
      blockCustomSelect,
      blockInput,
      button,
    ]);

    new Cleave(input, {
      numeral: true,
      numeralDecimalScale: 0,
      delimiter: '',
      numeralPositiveOnly: true,
    });

    new Cleave(inputSum, {
      numeral: true,
      delimiter: ' ',
      numeralPositiveOnly: true,
    });

    form.addEventListener('submit', this.transferRecipient.bind(this)); // Добавляем обработчик события отправки формы.

    return this.createCardBlue('Новый перевод', form, '.card-blue-transfer'); // Возвращаем элемент карточки нового перевода с формой.
  }

  /**
   * Обрабатывает событие навигации назад при нажатии на кнопку назад.
   */
  pageBack(event) {
    event.preventDefault();
    router.navigate('/accounts-all'); // Перенаправляем на страницу со всеми счетами.
  }

  /**
   * Создает контейнер содержимого страницы просмотра информации о пользователе.
   */
  contentPageContainer() {
    if (Object.keys(this.dataTransactionsYear).length === 0) {
      this.getDataDiagramYear(); // Получаем данные для диаграммы по годам, если они отсутствуют.
    }

    const blockNewTransfer = this.createNewTransfer(); // Создаем блок нового перевода.

    const blockDiagramBalance = this.createCardWhite(
      'Динамика баланса',
      this.createDiagramBalance('account'),
      '.card__title-second-diagram',
      '.card-blue-diagram',
    );

    const blockHistoryTransfers = this.createCardBlue(
      'История переводов',
      this.createHistoryTransfers([...this.transactions].slice(-10)), // Отображаем последние 10 транзакций.
      '.card-blue-history',
    );

    [blockDiagramBalance, blockHistoryTransfers].forEach((block) => {
      block.addEventListener('click', this.openDetailHistoryBalance.bind(this));
      block.tabIndex = '0';
      block.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') this.openDetailHistoryBalance(block);
      });
    });

    document.addEventListener('click', (event) => {
      const dropdownList = document.querySelector('.dropdown__list');
      const blockInput = document.getElementById('blockTransfer');

      if (dropdownList) {
        const input = dropdownList.previousSibling;
        if (
          !dropdownList.contains(event.target) && // Если клик не внутри dropdownList
          event.target !== input &&
          blockInput
        ) {
          blockInput.classList.remove('arrow-up');
          dropdownList.classList.add('hidden');
          // Скрываем список
        }
      }
    });

    return [
      el('.container__transfer-diagram', blockNewTransfer, blockDiagramBalance),
      blockHistoryTransfers,
    ];
  }

  /**
   * Преобразует номер счета из поля ввода и проверяет его на валидность.
   */
  async transformationNumberAccount(inputTransferAccount) {
    try {
      const arrAccounts = await this.api.getAccounts(); // Получаем список счетов из API.

      let transferError = document.getElementById('transferError');
      if (transferError) transferError.remove(); // Удаляем предыдущие сообщения об ошибках.

      arrAccounts.forEach(
        (account) =>
          (this.accounts[account.account.substring(11)] = account.account), // Заполняем объект счетов.
      );

      const accountValue = inputTransferAccount.value; // Получаем значение из поля ввода номера счета.
      let errorText = '';

      if (!accountValue) {
        errorText = 'Номер счета не может быть пустым'; // Проверка на пустое значение.
      } else if (this.accounts.hasOwnProperty(accountValue)) {
        return this.accounts[accountValue]; // Возвращаем номер счета, если он найден в объектах счетов.
      } else if (arrRecipAccounts().includes(accountValue)) {
        return accountValue; // Возвращаем номер счета, если он найден в предустановленных значениях.
      } else {
        errorText = 'Указанный номер счета не найден'; // Сообщение об ошибке, если счет не найден.
      }

      if (errorText) {
        const blockInput = document.getElementById('blockTransfer');
        transferError = el(
          'p.form__error.error-text',
          { id: 'transferError' },
          errorText,
        );
        blockInput.append(transferError); // Добавляем сообщение об ошибке в блок ввода номера счета.
        return false;
      }
    } catch (error) {
      throw TypeError(error.message);
    }
  }

  /**
   * Обрабатывает отправку формы перевода средств между счетами.
   */
  async transferRecipient(event) {
    event.preventDefault();

    const inputTransferAccount = document.querySelector(
      'input[name="transfer-account"]',
    );

    const inputTransferSum = document.querySelector(
      'input[name="transfer-sum"]',
    );

    const rawSumValue = inputTransferSum.value.replace(' ', ''); // Убираем пробелы из суммы перевода.

    let isValid = true; // Флаг для проверки валидности данных.

    try {
      const recipientAccount =
        await this.transformationNumberAccount(inputTransferAccount); // Преобразуем и проверяем номер счета получателя.

      if (!recipientAccount) {
        isValid = false; // Если номер счета не валиден, устанавливаем флаг в false.
      }

      if (!checkValidateSum(rawSumValue, this.accountId.balance)) {
        isValid = false; // Проверяем валидность суммы перевода по балансу счета.
      }

      if (!isValid) return; // Если данные не валидны, выходим из функции.

      const transferData = {
        from: this.accountId.account,
        to: recipientAccount,
        amount: rawSumValue,
      };

      const isTransfer = await this.api.transferFunds(transferData); // Запрашиваем перевод средств через API.

      this.transactions = isTransfer.transactions.map(
        (transaction) =>
          new Transaction(
            transaction.amount,
            transaction.date,
            transaction.from,
            transaction.to,
          ),
      );

      if (isTransfer) {
        this.updateBalance(isTransfer.balance); // Обновляем баланс после успешного перевода.
        this.getDataDiagramYear(); // Получаем данные для диаграммы по годам после перевода средств.
        this.createDiagramBalance('account'); // Создаем диаграмму баланса после обновления данных.
        this.createHistoryTransfers(this.transactions.slice(-10)); // Обновляем историю переводов, отображая последние 10 транзакций.

        let usedAccounts =
          JSON.parse(localStorage.getItem('usedAccounts')) ||
          arrRecipAccounts();

        if (!usedAccounts.includes(inputTransferAccount.value)) {
          usedAccounts.push(inputTransferAccount.value);
          localStorage.setItem('usedAccounts', JSON.stringify(usedAccounts));
        }

        inputTransferSum.value = '';
      }
    } catch (error) {
      const blockInput = document.getElementById('blockTransfer');

      const transferError = el(
        'p.form__error.error-text',
        { id: 'transferError' },
        error.message,
      );
      blockInput.append(transferError); // Добавляем сообщение об ошибке в блок ввода.
      console.error('Ошибка перевода:', error);
    }
  }

  /**
   * Обрабатывает событие навигации назад при нажатии на кнопку назад.
   */
  openDetailHistoryBalance(event) {
    router.navigate(`/account/${this.accountId.account}/detail`); // Перенаправляем на страницу детализации баланса по ID счета.
  }
}

//   accountId.transactions = [
//     { date: new Date("2024-01-15"), from: "43380004654787468115307626", to: "05168707632801844723808510", amount: 1500 },
//     { date: new Date("2024-01-20"), from: "17307867273606026235887604", to: "43380004654787468115307626", amount: 2000 },
//     { date: new Date("2024-02-05"), from: "43380004654787468115307626", to: "27120208050464008002528428", amount: 3000 },
//     { date: new Date("2024-02-10"), from: "2222400070000005", to: "43380004654787468115307626", amount: 2500 },
//     { date: new Date("2024-03-12"), from: "43380004654787468115307626", to: "5555341244441115", amount: 1000 },
//     { date: new Date("2024-03-25"), from: "61253747452820828268825011", to: "43380004654787468115307626", amount: 500 },
//     { date: new Date("2024-04-08"), from: "43380004654787468115307626", to: "17307867273606026235887604", amount: 1200 },
//     { date: new Date("2024-05-15"), from: "05168707632801844723808510", to: "43380004654787468115307626", amount: 1800 },
//     { date: new Date("2024-06-20"), from: "43380004654787468115307626", to: "27120208050464008002528428", amount: 2200 },
//     { date: new Date("2024-07-30"), from: "2222400070000005", to: "43380004654787468115307626", amount: 1600 },
//     { date: new Date("2024-08-15"), from: "61253747452820828268825011", to: "43380004654787468115307626", amount: 3000 },
//     { date: new Date("2024-09-05"), from: "43380004654787468115307626", to: "5555341244441115", amount: 4000 },
//     { date: new Date("2024-09-15"), from: "17307867273606026235887604", to: "43380004654787468115307626", amount: 500 },
//     { date: new Date("2024-10-10"), from: "05168707632801844723808510", to: "43380004654787468115307626", amount: 3500 },
// ];
