import { el } from 'redom';
import { PageUserViewing } from './PageUserViewing.js';
import { Transaction } from './Transaction.js';
import { router } from './router.js';

/**
 * Класс PageDetailBalanceAccount отвечает за создание страницы детализации баланса счета.
 */
export class PageDetailBalanceAccount extends PageUserViewing {
  /**
   * Создает экземпляр PageDetailBalanceAccount.
   */
  constructor(titlePage, buttonName, accountId) {
    super(titlePage);
    this.buttonName = buttonName;
    this.accountId = accountId;
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

  createPageDetailBalanceAccount() {
    return this.createPage(this.contentPageContainer())
  }

  /**
   * Создает контейнер содержимого страницы детализации баланса счета.
   */
  contentPageContainer() {
    if (Object.keys(this.dataTransactionsYear).length === 0) {
      this.getDataDiagramYear(); // Получаем данные для диаграммы по годам, если они отсутствуют.
    }

    const blockDiagramBalance = this.createCardWhite(
      'Динамика баланса',
      this.createDiagramBalance('detail'),
      '.card__title-second-dynamic',
      '.card-white-detail',
    );

    const blockDiagramBalanceRatio = this.createCardWhite(
      'Соотношение входящих и исходящих транзакций',
      this.createDiagramBalance('detail-arrival'),
      '.card__title-second-comparison',
      '.card-white-detail-arrival',
    );

    this.transactionsRemains = [...this.transactions];

    let buttonShowMore;
    if (this.transactionsRemains.length > 0) {
      buttonShowMore = el('button.btn-reset.btn.btn-show', 'Показать больше');
      buttonShowMore.addEventListener('click', () => {
        this.showMoreTransactions(buttonShowMore); // Добавляем обработчик события для показа дополнительных транзакций.
      });
    } else {
      buttonShowMore = '';
    }

    const blockTable = el(
      '.card-blue__block-table',
      this.createHistoryTransfers(this.transactionsRemains.slice(-25)), // Отображаем последние 25 транзакций.
      buttonShowMore,
    );

    const blockHistoryTransfers = this.createCardBlue(
      'История переводов',
      blockTable,
      '.card-blue-history-detail',
    );

    this.transactionsRemains = this.transactionsRemains.slice(0, -25); // Удаляем отображенные транзакции из массива оставшихся.

    return el(
      '.container__detail',
      blockDiagramBalance,
      blockDiagramBalanceRatio,
      blockHistoryTransfers,
    );
  }

  /**
   * Показывает дополнительные транзакции при нажатии на кнопку "Показать больше".
   */
  showMoreTransactions(buttonShowMore) {
    const addBlockHistoryTransfers = this.createTrsTransfer(
      this.transactionsRemains.slice(-25), // Получаем следующие 25 транзакций для отображения.
    );
    this.transactionsRemains = this.transactionsRemains.slice(0, -25); // Удаляем отображенные транзакции из массива оставшихся.

    buttonShowMore.remove(); // Удаляем кнопку "Показать больше".

    let buttonShowMoreLast;
    if (this.transactionsRemains.length > 0) {
      buttonShowMoreLast = el(
        'button.btn-reset.btn.btn-show',
        'Показать больше',
      );
      buttonShowMoreLast.addEventListener('click', () => {
        this.showMoreTransactions(buttonShowMoreLast); // Добавляем обработчик события для показа дополнительных транзакций.
      });
    } else {
      buttonShowMoreLast = '';
    }
    const tbody = document.querySelector('tbody'); // Находим элемент таблицы для добавления новых строк с транзакциями.
    addBlockHistoryTransfers.forEach((tr) => tbody.append(tr)); // Добавляем новые строки в таблицу.
    const card = document.querySelector('.card-blue__block-table');
    card.append(buttonShowMoreLast); // Добавляем кнопку "Показать больше" в блок таблицы переводов.
  }

  /**
   * Обрабатывает событие навигации назад при нажатии на кнопку назад.
   */
  pageBack(event) {
    event.preventDefault();
    router.navigate(`/account/${this.accountId.account}`); // Перенаправляем на страницу детализации счета по ID.
  }
}
