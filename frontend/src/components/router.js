import Navigo from 'navigo';

import { UIManager } from './UIManager';

const manager = new UIManager();
/**
 * Создает новый экземпляр маршрутизатора с корневым путем "/".
 */
export const router = new Navigo('/');

/**
 * Обработчик маршрута для страницы входа.
 * При переходе на этот маршрут рендерится блок входа.
 */
router.on('/login', () => {
  manager.renderPageLogin();
});

/**
 * Обработчик маршрута для страницы со всеми счетами.
 * Рендерит страницу со списком счетов, если токен существует.
 */
router.on('/accounts-all/', async () => {
  let token = sessionStorage.getItem('authToken');
  if (!token) {
    router.navigate('/login');
    return;
  }
  try {
    await manager.renderPageUserAccounts();
  } catch (error) {
    manager.renderPage('h2', error.message, true, '/accounts-all');
  }
});

/**
 * Обработчик маршрута для страницы детализации счета по ID.
 * Рендерит страницу детализации счета, если токен существует.
 */
router.on('/account/:id', async ({ data: { id } }) => {
  let token = sessionStorage.getItem('authToken');
  if (!token) {
    router.navigate('/login');
    return;
  }
  try {
    await manager.renderPageAccountDetail(id);
  } catch (error) {
    manager.renderPage('h2', error.message, true, '');
  }
});

/**
 * Обработчик маршрута для страницы детализации баланса по ID счета.
 * Рендерит страницу детализации баланса, если токен существует.
 */
router.on('/account/:id/detail', async ({ data: { id } }) => {
  let token = sessionStorage.getItem('authToken');
  if (!token) {
    router.navigate('/login');
    return;
  }
  await manager.renderPageDetailBalance(id);
});

/**
 * Обработчик маршрута для страницы валюты.
 * Рендерит страницу с валютами, если токен существует.
 */
router.on('/currency', async () => {
  let token = sessionStorage.getItem('authToken');
  if (!token) {
    router.navigate('/login');
    return;
  }
  await manager.renderPageCurrency();
});

/**
 * Обработчик маршрута для страницы с банкоматами.
 * Рендерит страницу с картой банкоматов, если токен существует.
 */
router.on('/atm', async () => {
  let token = sessionStorage.getItem('authToken');
  if (!token) {
    router.navigate('/login');
    return;
  }
  await manager.renderPageMapATM();
});

/**
 * Запускает маршрутизатор и обрабатывает текущий URL.
 */
router.resolve();
