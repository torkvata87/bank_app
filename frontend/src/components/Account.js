import { el } from 'redom';
// import { Cleave } from 'cleave.js';
import { router } from './router.js';
import { Transaction } from './Transaction.js';
import { formatCurrency } from './validate.js';

/**
 * Класс Account представляет счет пользователя.
 */
export class Account {
  /**
   * Создает экземпляр счета.
   */
  constructor(account, balance, mine, transactions) {
    this.account = account;
    this.balance = balance;
    this.mine = mine;
    this.transactions = transactions.map(
      (transaction) =>
        new Transaction(
          transaction.amount,
          transaction.date,
          transaction.from,
          transaction.to,
        ),
    );
  }

  /**
   * Создает карточку счета для отображения на странице.
   */
  createAccountCard() {
    const blockTransaction = el('.card__block-transaction', [
      el('span.card__span-transaction', 'Последняя транзакция:'),
      el('span.card__span-date', this.lastTransaction()),
    ]);

    const buttonOpen = el(
      'button.btn.btn-reset',
      { 'data-id': this.account },
      'Открыть',
    );

    const blockButton = el('.card__block-bottom', [
      blockTransaction,
      buttonOpen,
    ]);

    const card = el(
      'li.accounts__item',
      el('.card', [
        el('h2.card__title', this.account.substring(11)), // Отображает номер счета без первых 11 символов.
        el('span.card__span-balance', `${formatCurrency(this.balance)} ₽`),
        blockButton,
      ]),
    );

    buttonOpen.addEventListener('click', () => {
      router.navigate(`/account/${buttonOpen.dataset.id}`); // Перенаправляет на страницу детализации счета по ID.
    });
    return card;
  }

  /**
   * Получает дату последней транзакции из массива транзакций.
   */
  lastTransaction() {
    if (!this.transactions || this.transactions.length === 0) {
      return 'Нет транзакций'; // Возвращает сообщение, если транзакций нет.
    }

    const lastTransaction = this.transactions.reduce((latest, current) => {
      return latest.date > current.date ? latest : current; // Находит последнюю транзакцию по дате.
    });

    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
    }).format(lastTransaction.date); // Форматирует дату последней транзакции.
    return `${formattedDate} ${lastTransaction.date.getFullYear()}`; // Возвращает отформатированную дату с годом.
  }
}
