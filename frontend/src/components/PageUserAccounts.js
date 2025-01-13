import { el, svg, setChildren } from 'redom';
// import { Cleave } from 'cleave.js';
import { Account } from './Account.js';
import { PageUserBasic } from './PageUserBasic.js';
import { ApiServer } from './ApiServer.js';
// import { sortType } from "./utils.js";

/**
 * Класс PageUserAccounts отвечает за создание страницы со счетами пользователя.
 */
export class PageUserAccounts extends PageUserBasic {
  /**
   * Создает экземпляр PageUserAccounts.
   */
  constructor(titlePage, buttonName, listAccounts) {
    super(titlePage);
    this.buttonName = buttonName;
    this.listAccounts = listAccounts;
    this.api = new ApiServer();
  }

  createPageUserAccounts() {
    return this.createPage(this.contentPageContainer());
}

  /**
   * Создает верхнюю часть страницы со счетами, включая кнопку создания нового счета.
   */
  createTopPage() {
    const buttonCreateNewAccount = el(
      'button.btn.top__btn.btn-add.btn-reset',
      svg(
        'svg',
        {
          width: '16',
          height: '16',
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        svg('path', {
          d: 'M7.99999 7.69167e-06L8 8.00001M8 8.00001L8.00001 16M8 8.00001L16 8.00001M8 8.00001L0 8',
          stroke: 'white',
          'stroke-width': '2',
        }),
      ),
      this.buttonName,
    );

    buttonCreateNewAccount.addEventListener(
      'click',
      this.createNewAccount.bind(this),
    );

    return el('.container__top.container__top-accounts', [
      el('.top__block-title', [
        el('h1.top__title', this.titlePage),
        this.createBlockSortAccounts(),
      ]),
      buttonCreateNewAccount,
    ]);
  }

  /**
   * Создает контейнер содержимого страницы со счетами пользователя.
   */
  contentPageContainer = () => {
    const arrCardsAccount = this.listAccounts.map((account) =>
      account.createAccountCard(),
    );

    let blockAccounts = document.querySelector('.container__accounts');
    if (!blockAccounts) {
      return el('ul.container__accounts.list-reset', arrCardsAccount);
    } else {
      blockAccounts.innerHTML = '';
      arrCardsAccount.forEach((account) => blockAccounts.append(account));
    }
  };

  /**
   * Создает новый счет и обновляет список счетов на странице.
   */
  async createNewAccount() {
    const newItem = await this.api.createAccount();
    const newAccount = new Account(
      newItem.account,
      newItem.balance,
      newItem.mine,
      newItem.transactions.map((transaction) => transaction),
    );

    this.listAccounts.push(newAccount);

    const arrCardsAccount = this.listAccounts.map((account) =>
      account.createAccountCard(),
    );
    setChildren(
      document.querySelector('.container__accounts'),
      arrCardsAccount,
    );
  }

  /**
   * Создает элементы списка сортировки для доступных типов сортировки счетов.
   */
  createSortItems() {
    const sortType = {
      number: 'По номеру',
      balance: 'По балансу',
      transaction: 'По последней транзакции',
    };

    const items = Object.entries(sortType).map(([sortName, textSort]) => {
      const item = el(
        'li.dropdown__item',
        { id: `by-${sortName}`, role: 'option', tabindex: '0' },
        textSort,
      );
      item.addEventListener('click', (event) => {
        this.handlerKeyItemSort(item);
      });
      item.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') this.handlerKeyItemSort(item);
      });
      return item;
    });
    return items;
  }

  /**
   * Создает блок с элементами сортировки для отображения на странице.
   */
  createBlockSortAccounts() {
    const dropdownBtn = el(
      'button.dropdown__btn.dropdown__btn-accounts.btn-reset',
      { 'aria-expanded': false, 'aria-haspopur': 'listbox' },
      'Сортировка',
    );
    const dropdownUl = el(
      'ul.dropdown__list.hidden.list-reset',
      { role: 'listbox', 'aria-labelledby': 'select-button' },
      this.createSortItems(),
    );

    const selectSort = [dropdownBtn, dropdownUl];

    dropdownBtn.addEventListener('click', () => {
      this.dropdownUp(dropdownBtn);
    });
    dropdownBtn.addEventListener('keyup', (event) => {
      if (event.key === 'Tab') this.dropdownUp(dropdownBtn);
    });

    document.addEventListener('click', this.handleDocumentClick.bind(this));

    return el('div.top__dropdown-sort', selectSort);
  }

  /**
   * Обрабатывает выбор элемента из выпадающего списка при нажатии клавиши Enter.
   */
  handlerKeyItemSort(element) {
    this.itemActions(element, '');
    const sortName = element.id;
    this.sortAccounts(sortName);
    this.contentPageContainer();
  }

  /**
   * Сортирует список счетов по выбранному критерию (номер, баланс или дата последней транзакции).
   */
  sortAccounts(sort) {
    this.listAccounts = this.listAccounts.sort((a, b) => {
      if (sort === 'by-number') {
        return Number(a.account.substring(11)) < Number(b.account.substring(11))
          ? 1
          : -1;
      } else if (sort === 'by-balance') {
        return a.balance < b.balance ? 1 : -1;
      } else {
        const aLastTransaction =
          a.transactions && a.transactions.length > 0
            ? new Date(a.transactions[a.transactions.length - 1].date)
            : null;
        const bLastTransaction =
          b.transactions && b.transactions.length > 0
            ? new Date(b.transactions[b.transactions.length - 1].date)
            : null;

        // Если у одного из счетов нет транзакций, ставим его в конец списка
        if (!aLastTransaction) return 1; // a без транзакций идет после b
        if (!bLastTransaction) return -1; // b без транзакций идет после a

        return aLastTransaction.getTime() < bLastTransaction.getTime() ? 1 : -1; // Сортируем по дате
      }
    });
  }
}
