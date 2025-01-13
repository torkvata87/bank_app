import { el, setChildren, svg } from 'redom';
import { PageUserBasic } from './PageUserBasic.js';
import { calculationTop, chartDiagram } from './utils.js';
import { formatCurrency } from './validate.js';

/**
 * Класс PageUserViewing отвечает за создание страницы просмотра информации о пользователе.
 */
export class PageUserViewing extends PageUserBasic {
  /**
   * Создает экземпляр PageUserViewing.
   */
  constructor(titlePage, buttonName, accountId) {
    super(titlePage);
    this.buttonName = buttonName;
    this.accountId = accountId;
    this.arrival = [];
    this.expenditure = [];
    this.dataTransactionsYear = {};
    this.dataTransactionsSixMonth = {};
  }

  /**
   * Создает контейнер содержимого страницы с балансом счета и переданным контентом.
   */
  createPage(content) {
    return super.createPage([this.createBalanceAccount(), content]);
  }

  /**
   * Создает верхнюю часть страницы с заголовком и кнопкой возврата.
   */
  createTopPage() {
    const buttonPageBack = el(
      'button.btn.top__btn.btn-back.btn-reset',
      svg(
        'svg',
        {
          width: '16',
          height: '12',
          viewBox: '0 0 16 12',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        svg('path', {
          d: 'M3.83 5L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7L16 7V5L3.83 5Z',
          fill: 'white',
        }),
      ),
      this.buttonName,
    );
    buttonPageBack.addEventListener('click', this.pageBack.bind(this));
    return el('.container__top.container__top-viewing', [
      el('h1.top__title.top__title-viewing', this.titlePage),
      buttonPageBack,
    ]);
  }

  /**
   * Создает блок с балансом счета пользователя.
   */
  createBalanceAccount() {
    return el('.container__balance', [
      el('span.balance__span-id', `№ ${this.accountId.account.substring(11)}`),
      el('.balance__block-balance', [
        el('span.balance__span', 'Баланс'),
        this.updateBalance(this.accountId.balance),
      ]),
    ]);
  }

  /**
   * Обновляет отображение баланса счета на странице.
   */
  updateBalance(balance) {
    let spanBalance = document.querySelector('.span-balance-number');
    const formatBalance = formatCurrency(balance);
    if (!spanBalance) {
      spanBalance = el('span.balance__span-number', `${formatBalance} ₽`);
    } else {
      spanBalance.textContent = `${formatBalance} ₽`;
    }
    return spanBalance;
  }

  /**
   * Обновляет блок канваса для отображения диаграммы баланса или других графиков.
   */
  updateBlockCanvas(canvasName, ctx, blockTicks) {
    let diagramBalance = document.querySelector(`.block-canvas-${canvasName}`);
    if (!diagramBalance) {
      diagramBalance = el(
        `.block-canvas.block-canvas-${canvasName}`,
        ctx,
        blockTicks,
      );
    } else {
      diagramBalance.innerHTML = '';
      setChildren(diagramBalance, [ctx, blockTicks]);
    }
    return diagramBalance;
  }

  /**
   * Получает данные для диаграммы по транзакциям за год и шесть месяцев.
   */
  getDataDiagramYear() {
    const now = new Date();
    const nowYear = now.getFullYear();
    const currentMonth = now.getMonth(); // Индекс текущего месяца (0-11)

    const monthlySums = Array(12).fill(0);
    const sixMonthSums = Array(6).fill(0);

    const arrival = Array(12).fill(0); // Массив для приходов
    const expenditure = Array(12).fill(0); // Массив для расходов
    const labels = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ];

    this.transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === nowYear) {
        const monthIndex = date.getMonth();
        if (transaction.to === this.accountId.account) {
          monthlySums[monthIndex] += transaction.amount; // Приход
          arrival[monthIndex] += transaction.amount; // Приход
        } else {
          monthlySums[monthIndex] -= transaction.amount; // Расход
          expenditure[monthIndex] += transaction.amount; // Расход
        }
      }
    });

    // Обработка последних 6 месяцев
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Индекс месяца
      sixMonthSums[i] = monthlySums[monthIndex];
    }

    this.dataTransactionsYear = {
      data: monthlySums,
      labels: labels,
      arrival: arrival,
      expenditure: expenditure,
    };

    // Формируем метки для последних 6 месяцев
    const lastSixMonthsLabels = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Индекс месяца
      lastSixMonthsLabels.push(labels[monthIndex]);
    }

    this.dataTransactionsSixMonth = {
      data: sixMonthSums.reverse(),
      labels: lastSixMonthsLabels.reverse(), // Перевернем метки, чтобы они соответствовали порядку
    };
  }

  /**
   * Создает диаграмму баланса на канвасе в зависимости от имени канваса (например, "account" или "detail-arrival").
   */
  createDiagramBalance(canvasName) {
    let data, currency;

    if (canvasName === 'account') {
      data = this.dataTransactionsSixMonth;
      currency = '';
    } else {
      data = this.dataTransactionsYear;
      currency = '\u00A0₽';
    }

    const ctx = el(`canvas`);
    const maxValue = Math.max(...data.data);
    const min = 0;
    const maxValueArrival = data.arrival ? Math.max(...data.arrival) : 0;
    const maxValueExpenditure = data.expenditure
      ? Math.max(...data.expenditure)
      : 0;

    const maxArrival = Math.max(maxValueArrival, maxValueExpenditure);
    const median = Math.min(maxValueArrival, maxValueExpenditure);
    const max = canvasName !== 'detail-arrival' ? maxValue : maxArrival;

    const heightMedian = calculationTop(median, max);
    const itemMedian =
      canvasName !== 'detail-arrival'
        ? ''
        : el(
            'li.list-ticks__item.list-ticks__item-median',
            { style: `top: ${heightMedian}%;` },
            `${formatCurrency(median)}${currency}`,
          );

    const blockTicks = el(
      `ul.list-ticks.list-ticks-${canvasName}.list-reset`,
      el(
        'li.list-ticks__item.list-ticks__item-max',
        `${formatCurrency(max)}${currency}`,
      ),
      itemMedian,
      el(
        'li.list-ticks__item.list-ticks__item-min',
        `${formatCurrency(min)}${currency}`,
      ),
    );

    const block = this.updateBlockCanvas(canvasName, ctx, blockTicks);
    // Вызываем функцию для рисования диаграммы
    chartDiagram(canvasName, ctx, data, max, min);
    return block;
  }

  /**
   * Обновляет таблицу переводов с новыми данными.
   */
  updateTableTransfer(thead, tbody) {
    let tableTransfer = document.querySelector('.table-block');
    if (!tableTransfer) {
      tableTransfer = el('.table-block', el('table.table', thead, tbody));
    } else {
      tableTransfer.innerHTML = '';
      setChildren(tableTransfer, [thead, tbody]);
    }
    return tableTransfer;
  }

  /**
   * Создает строки переводов из массива транзакций.
   */
  createTrsTransfer(arrTransfers) {
    return arrTransfers
      .sort((a, b) => {
        return a.date.getTime() < b.date.getTime() ? 1 : -1;
      })
      .map((transfer) => {
        const sign = transfer.from === this.accountId.account ? '- ' : '+ ';
        const color =
          transfer.from === this.accountId.account ? 'red' : 'green';
        return el(
          'tr',
          el('td.table__td.table__td-from', transfer.from.substring(11)),
          el('td.table__td.table__td-to', transfer.to.substring(11)),
          el(
            `td.table__td.table__td-amount.table__td-${color}`,
            `${sign}${transfer.amount} ₽`,
          ),
          el('td.table__td.table__td-date', transfer.date.toLocaleDateString()),
        );
      });
  }

  /**
   * Создает историю переводов из массива транзакций.
   */
  createHistoryTransfers(arrTransfers) {
    const trsTableTransfer = this.createTrsTransfer(arrTransfers);

    const thAccountFrom = el(
      'th.table__th.table__th-from',
      { 'data-column': 'account-from' },
      'Счёт отправителя',
    );
    const thAccountTo = el(
      'th.table__th..table__th-to',
      { 'data-column': 'account-to' },
      'Счёт получателя',
    );
    const thAmount = el(
      'th.table__th.table__th-amount',
      { 'data-column': 'amount' },
      'Сумма',
    );
    const thDate = el(
      'th.table__th.table__th-date',
      { 'data-column': 'date' },
      'Дата',
    );
    const tbody = el('tbody', trsTableTransfer);
    const thead = el(
      'thead',
      el('tr', thAccountFrom, thAccountTo, thAmount, thDate),
    );
    return this.updateTableTransfer(thead, tbody);
  }
}
