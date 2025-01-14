# Мини-банковское приложение

Данный проект представляет собой мини-банковское приложение на **Webpack** с использованием библиотеки **Redom** для управления состоянием и маршрутизации с помощью **Navigo**. В приложении диаграммы баланса счетов пользователя реализованы на **Chart.js**, а валидация полей ввода – с применением **Cleave.js**. Приложение позволяет пользователям управлять своими счетами, осуществлять переводы между валютными счетами и просматривать курсы валют в реальном времени.

Также используются **unit**-тесты и **end-to-end**-тесты для проверки валидации и правильности ввода данных в поля.

Сайт работает в паре с локальным сервером, который предоставляет API для авторизации, управления счетами и выполнения транзакций.

## Основные функции

- **Управление счетами:** создание новых счетов, отображение баланса и истории транзакций.
- **Переводы между валютными счетами.**
- **Отображение курсов валют в реальном времени.**
- **Построение диаграмм динамики баланса** с использованием Chart.js.
- **Валидация полей ввода** с помощью Cleave.js для улучшения пользовательского опыта.
- 
## Структура проекта

- Страница авторизации
- Страница с картой банкоматов
- Страница с карточками счетов пользователя
- Страница с валютами

На странице "Счета" при клике на кнопку "Открыть" на карточке счета пользователя открывается страница просмотра счета пользователя. При клике на диаграмму просмотра баланса по счету за последние 6 месяцев или на таблицу транзакций открывается страница детального просмотра транзакций пользователя.

## Установка и запуск

### Предварительные требования

Убедитесь, что у вас установлены следующие инструменты:

- [Node.js](https://nodejs.org/) (рекомендуется версия 14 или выше)
- [npm](https://www.npmjs.com/) (устанавливается вместе с Node.js)

### Клонирование репозитория

Сначала клонируйте репозиторий:

```
git clone https://gitlab.skillbox.ru/ekaterina_osipova_3/Js-advanced-diploma.git
cd js_advanced_diploma/frontend
```
1. Клонируйте данный репозиторий к себе на диск:
```
git clone <адрес репозитория>
cd <папка с проектом>/frontend
```

2. Установите все необходимые зависимости:
```
npm install
```

3. Запустите сервер:
```
npm run dev
```

4. Откройте браузер и перейдите по адресу `http://localhost:8080`, чтобы увидеть результат.

## Запуск локального сервера

Приложение работает в паре с локальным сервером, который предоставляет API для авторизации, управления счетами и выполнения транзакций. 
Для запуска локального сервера в отдельном окне выполните следующие действия:
```
cd <папка с проектом>/backend
npm install
npm start
```
Локальный сервер запустит свою работу по адресу `http://localhost:3000` с уведомлением об успешном запуске.

Для доступа к приложению на странице авторизации по адресу `http://localhost:8080` следующие учетные данные:

- **Логин:** `developer`
- **Пароль:** `skillbox`

## Существующие счета

После запуска сервера доступны следующие счета:

1. Ваш пользовательский счёт с длинной историей переводов (на него будут регулярно поступать входящие переводы с произвольных счетов):
- `74213041477477406320783754`

2. Набор других счетов для проверки функционала:
- `61253747452820828268825011`
- `05168707632801844723808510`
- `17307867273606026235887604`
- `27120208050464008002528428`
- `2222400070000005`
- `5555341244441115`

## Технологии и инструменты

- **Chart.js** - библиотека для создания красивых и анимированных графиков на JavaScript.
- **Navigo** - минималистичный роутер для одностраничных приложений на JavaScript.
- **Redom** - быстрая и легкая библиотека для создания пользовательских интерфейсов с помощью JavaScript.
- **Cleave.js** - библиотека для форматирования полей ввода.
- **Webpack** - сборщик модулей для современных JavaScript-приложений.
- **Babel** - компилятор JavaScript, который позволяет использовать новые возможности языка в старых браузерах.

### Сборка приложения

Для сборки приложения в продакшн режиме выполните:

```
cd js_advanced_diploma/frontend
npm run build
```

Собранные файлы будут находиться в папке `dist`.

## Проверка результатов тестов

### Тестирование с использованием Jest

Для запуска тестов используйте команду:

```
cd js_advanced_diploma/frontend
npm test
```


### End-to-End тестирование с использованием Cypress

Для запуска тестов End-to-End выполните следующую команду:

```
npm run cy
```

Это откроет интерфейс Cypress, где вы сможете запустить ваши E2E тесты.

## Пояснения для проверяющих преподавателей

1. **Структура проекта**: Проект организован в соответствии с принципами модульности. Каждый компонент имеет свою ответственность и может быть легко протестирован.
2. **Тесты**: В проекте реализованы как юнит-тесты (с использованием Jest), так и E2E тесты (с использованием Cypress). Это позволяет убедиться в целостности и работоспособности приложения.
3. **Адаптивность**: Все страницы адаптивны и корректно отображаются на мобильных устройствах.

## Улучшения и дополнения

1. **Адаптивность страниц**: Все страницы приложения адаптированы под различные мобильные устройства.
2. **Скелетоны загрузки**: При загрузке каждой страницы используются скелетоны, что улучшает пользовательский опыт.
3. **Оптимизация производительности**: Код оптимизирован для повышения производительности и уменьшения времени загрузки страниц.

## Заключение

Данный проект демонстрирует навыки работы с современными JavaScript библиотеками и инструментами для создания интерактивных веб-приложений.
