import { el } from 'redom';
import { PageUserBasic } from './PageUserBasic.js';
import { ApiServer } from './ApiServer.js';

/**
 * Класс PageMapATM отвечает за создание страницы с картой банкоматов.
 */
export class PageMapATM extends PageUserBasic {
  /**
   * Создает экземпляр PageMapATM.
   */
  constructor(titlePage) {
    super(titlePage);
    this.api = new ApiServer();
    this.pointsATM = []; // Инициализируем массив для хранения точек банкоматов.
  }

  async createPageMapATM() {
    // return this.createPage(this.contentPageContainer())
    return this.createPage(
        await this.contentPageContainer(),
        '.container__map',
        '.top__title-map')
  }

  /**
   * Создает контейнер содержимого страницы карты банкоматов.
   */
  async contentPageContainer() {
    try {
      this.pointsATM = await this.api.getBanks(); // Получаем точки банкоматов из API.
      this.initMap(); // Инициализируем карту с банкоматами.
      return el('#map.map'); // Возвращаем элемент карты.
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
   * Инициализирует карту и добавляет на нее точки банкоматов.
   */
  initMap() {
    ymaps.ready(() => {
      const myMap = new ymaps.Map('map', {
        center: [55.77, 37.64], // Координаты центра карты (Москва).
        zoom: 10.55, // Уровень масштабирования карты.
      });

      this.pointsATM.forEach((point) => {
        const placemark = new ymaps.Placemark(
          [point.lat, point.lon], // Координаты точки банкомата.
          {
            hintContent: "<span class='span-map'>Coin.</span>", // Подсказка при наведении на маркер.
          },
          {
            preset: 'islands#blueIcon', // Предустановленный стиль маркера (синий).
            iconLayout: 'default#image', // Используем изображение для маркера.
            iconImageSize: [50, 60], // Размер изображения маркера.
            iconColor: '#116acc', // Цвет маркера.
          },
        );

        placemark.events.add('mouseenter', function (e) {
          e.get('target').options.set({ preset: 'islands#greenIcon' }); // Изменяем цвет маркера при наведении мыши.
        });

        placemark.events.add('mouseleave', function (e) {
          e.get('target').options.set({ preset: 'islands#blueIcon' }); // Возвращаем цвет маркера при уходе мыши.
        });

        myMap.geoObjects.add(placemark); // Добавляем маркер на карту.
      });
    });
  }
}
