/**
 * Класс Transaction представляет собой транзакцию с определенной суммой, датой и участниками.
 */
export class Transaction {
  /**
   * Создает экземпляр Transaction.
   */
  constructor(amount, date, from, to) {
    this.amount = amount;
    this.date = new Date(date);
    this.from = from;
    this.to = to;
  }
}
