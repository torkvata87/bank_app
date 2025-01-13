import { el, setChildren } from 'redom';

import { ApiServer } from './ApiServer.js';
import { Header } from './Header.js';
import { LoginForm } from './LoginForm.js';
import { PageUserAccounts } from './PageUserAccounts.js';
import { PageCurrency } from './PageCurrency.js';
import { PageMapATM } from './PageMapAtm.js';
import {
  skeletonAccountDetail,
  skeletonAccountDetailBalance,
  skeletonCurrency, skeletonMapATM,
  skeletonPageCardList
} from './skeletons.js';
import { Account } from './Account.js';
import {PageUserViewingAccount} from "./PageUserViewingAccount";
import {PageDetailBalanceAccount} from "./PageDetailBalanceAccount";

export class UIManager {
  constructor() {
    this.listAccounts = [];
    this.accountId = {};
    this.pageUserViewingAccountIds = {};
    this.pageDetailBalanceAccountIds = {};
    this.api = new ApiServer();
    this.header = new Header();
    this.authorization = new LoginForm();
    this.pageCurrency = new PageCurrency('Валютный обмен');
    this.pageMapATM = new PageMapATM('Карта банкоматов');
  }

  /**
   * Рендерит страницу с указанным содержимым, навигацией и именем страницы.
   */
  renderPage(content, navigation, pageName) {
    document.body.innerHTML = '';
    try {
      setChildren(document.body, [
        this.header.renderHeader(navigation, pageName),
        content,
      ]);
    } catch (error) {
      setChildren(document.body, this.pageError(error.message));
    }
  }

  /**
   * Рендерит страницу с формой авторизации.
   */
  renderPageLogin() {
    const content = this.contentLogin();
    this.renderPage(content, false, '');
  }

  /**
   * Рендерит страницу со списком счетов пользователя с предварительной загрузкой скелетона.
   */
  async renderPageUserAccounts() {
    const accounts = await this.contentCardList();
    this.renderPage(accounts, true, '/accounts-all');
  }

  /**
   * Рендерит страницу детализации счета по ID с предварительной загрузкой скелетона.
   */
  async renderPageAccountDetail(id) {
    const accountDetailAccount = await this.contentAccountDetail(id);
    this.renderPage(accountDetailAccount, true, '');
  }

  /**
   * Рендерит страницу детализации баланса по ID счета с предварительной загрузкой скелетона.
   */
  async renderPageDetailBalance(id) {
    const accountDetailBalance = await this.contentAccountDetailBalance(id);
    this.renderPage(accountDetailBalance, true, '');
  }

  /**
   * Рендерит страницу валютного обмена с предварительной загрузкой скелетона.
   */
  async renderPageCurrency() {
    const currencyPage = await this.contentCurrency();
    this.renderPage(currencyPage, true, '/currency');
  }

  /**
   * Рендерит страницу карты банкоматов с предварительной загрузкой скелетона.
   */
  async renderPageMapATM() {
    const mapPage = await this.contentMapATM();
    this.renderPage(mapPage, true, '/atm');
  }

  /**
   * Создает контент с формой авторизации.
   */
  contentLogin() {
    try {
      return this.authorization.createBlockAuthorization();
    } catch (error) {
      return this.pageError(error.message);
    }
  }

  /**
   * Создает контент страницы со списком счетов пользователя с предварительной загрузкой скелетона.
   */
  async contentCardList() {
    document.querySelector('body').innerHTML = skeletonPageCardList();
    try {
      if (this.listAccounts.length === 0) {
        await this.getAccounts();
      }
      if (!this.pageUserAccounts) {
        this.pageUserAccounts = new PageUserAccounts(
            'Ваши счета',
            'Создать новый счёт',
            this.listAccounts,
        );
      }
      return this.pageUserAccounts.createPageUserAccounts();
    } catch (error) {
      return this.pageError(error.message);
    }
  }

  /**
   * Рендерит контент страницы детализации счета по ID с предварительной загрузкой скелетона.
   */
  async contentAccountDetail(id) {
    document.querySelector('body').innerHTML = skeletonAccountDetail();

    try {
      if (!this.accountId.account || this.accountId.account !== id) {
        await this.getAccountId(id);
      }

      if (!(id in this.pageUserViewingAccountIds)) {
        this.pageUserViewingAccountIds[id] = new PageUserViewingAccount(
            'Просмотр счёта',
            'Вернуться назад',
            this.accountId,
        );
      }

      return this.pageUserViewingAccountIds[id].createPageUserViewingAccount();
    } catch (error) {
      return this.pageError(error.message);
    }
  }

  /**
   * Рендерит контент страницы детализации баланса по ID счета с предварительной загрузкой скелетона.
   */
  async contentAccountDetailBalance(id) {
    document.querySelector('body').innerHTML = skeletonAccountDetailBalance();

    try {
      if (!this.accountId.account || this.accountId.account !== id) {
        await this.getAccountId(id);
      }

      if (!(id in this.pageDetailBalanceAccountIds)) {
        this.pageDetailBalanceAccountIds[id] = new PageDetailBalanceAccount(
            'История баланса',
            'Вернуться назад',
            this.accountId,
        );
      }

      return this.pageDetailBalanceAccountIds[id].createPageDetailBalanceAccount();
    } catch (error) {
      return this.pageError(error.message);
    }
  };

  /**
   * Рендерит контент страницы валютного обмена с предварительной загрузкой скелетона.
   */
  async contentCurrency() {
    document.querySelector('body').innerHTML = skeletonCurrency();

    try {
      return this.pageCurrency.createPage(
          await this.pageCurrency.contentPageContainer(),
          '.container__currency',
          '.top__title-currency',
      );
    } catch (error) {
      return this.pageError(error.message);
    }
  };

  /**
   * Рендерит контент страницы карты банкоматов с предварительной загрузкой скелетона.
   */
  async contentMapATM() {
    document.querySelector('body').innerHTML = skeletonMapATM();

    try {
      return await this.pageMapATM.createPageMapATM()
    } catch (error) {
      return this.pageError(error.message);
    }
  };

  async getAccounts() {
    const arrAccounts = await this.api.getAccounts();
    this.listAccounts = arrAccounts.map((account) => {
      return new Account(
        account.account,
        account.balance,
        account.mine,
        account.transactions.map((transaction) => transaction),
      );
    });
  }

  async getAccountId(id) {
    const objAccount = await this.api.getAccountById(id);
    this.accountId = new Account(
        objAccount.account,
        objAccount.balance,
        objAccount.mine,
        objAccount.transactions.map((transaction) => transaction),
    );
  }

  /**
   * Создает элемент с сообщением об ошибке.
   */
  pageError(textError) {
    const titleError = el('h2.second-title-error', textError); // Создаем элемент заголовка с сообщением об ошибке.
    return el('#container.container', titleError); // Возвращаем контейнер с заголовком ошибки.
  }
}
