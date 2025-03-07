/**
 * Создает скелетон навигационного меню.
 */
const createNavSkeleton = (activeIndex) => {
  const navItems = [
    { id: "li-1", href: "/atm", text: "Банкоматы" },
    { id: "li-2", href: "/accounts-all", text: "Счета" },
    { id: "li-3", href: "/currency", text: "Валюта" },
    { id: "li-4", href: "/login", text: "Выйти" },
  ];

  return navItems
    .map((item, index) => {
      const activeClass = index === activeIndex ? "nav__link-background" : ""; // Устанавливаем класс для активного элемента.
      return `
            <li id="${item.id}" class="nav__item">
                <a href="${item.href}" class="nav__link ${activeClass}">${item.text}</a>
            </li>
        `;
    })
    .join(""); // Объединяем массив строк в одну строку HTML.
};

/**
 * Создает скелетон заголовка страницы.
 */
const createSkeletonHeader = (liNumber) => {
  return `
    <div class="header">
        <div class="header__container">
            <svg width="106" height="34" viewBox="0 0 106 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.048 24.984C27.152 27.672 25.584 29.768 23.344 31.272C21.104 32.744 18.448 33.48 15.376 33.48C12.464 33.48 9.936 32.824 7.792 31.512C5.648 30.168 3.968 28.28 2.752 25.848C1.568 23.416 0.976 20.52 0.976 17.16C0.976 13.8 1.568 10.904 2.752 8.472C3.968 6.04 5.648 4.168 7.792 2.856C9.936 1.512 12.448 0.839999 15.328 0.839999C21.696 0.839999 25.792 3.448 27.616 8.664L25.264 9.768C24.528 7.56 23.36 5.896 21.76 4.776C20.16 3.624 18.064 3.048 15.472 3.048C13.104 3.048 11.008 3.624 9.184 4.776C7.392 5.896 6 7.512 5.008 9.624C4.016 11.736 3.52 14.248 3.52 17.16C3.52 20.072 4 22.584 4.96 24.696C5.952 26.808 7.328 28.44 9.088 29.592C10.88 30.712 12.976 31.272 15.376 31.272C17.936 31.272 20.112 30.664 21.904 29.448C23.696 28.2 24.944 26.408 25.648 24.072L28.048 24.984ZM43.939 8.52C46.179 8.52 48.147 9.016 49.843 10.008C51.571 11 52.915 12.44 53.875 14.328C54.867 16.184 55.363 18.408 55.363 21C55.363 23.592 54.867 25.832 53.875 27.72C52.915 29.576 51.571 31 49.843 31.992C48.147 32.984 46.179 33.48 43.939 33.48C41.699 33.48 39.715 32.984 37.987 31.992C36.291 31 34.947 29.576 33.955 27.72C32.995 25.832 32.515 23.592 32.515 21C32.515 18.408 32.995 16.184 33.955 14.328C34.947 12.44 36.291 11 37.987 10.008C39.715 9.016 41.699 8.52 43.939 8.52ZM43.939 10.584C41.219 10.584 39.027 11.512 37.363 13.368C35.731 15.224 34.915 17.768 34.915 21C34.915 24.232 35.731 26.776 37.363 28.632C39.027 30.488 41.219 31.416 43.939 31.416C46.659 31.416 48.835 30.488 50.467 28.632C52.131 26.776 52.963 24.232 52.963 21C52.963 17.768 52.131 15.224 50.467 13.368C48.835 11.512 46.659 10.584 43.939 10.584ZM63.4251 4.344C62.8171 4.344 62.3211 4.168 61.9371 3.816C61.5851 3.432 61.4091 2.936 61.4091 2.328C61.4091 1.72 61.5851 1.24 61.9371 0.887999C62.3211 0.503998 62.8171 0.311997 63.4251 0.311997C64.0331 0.311997 64.5131 0.503998 64.8651 0.887999C65.2491 1.24 65.4411 1.72 65.4411 2.328C65.4411 2.936 65.2491 3.432 64.8651 3.816C64.5131 4.168 64.0331 4.344 63.4251 4.344ZM64.6251 9V33H62.2251V9H64.6251ZM73.1939 33V9H75.3539L75.4979 13.8C76.2339 12.104 77.4019 10.808 79.0019 9.912C80.6019 8.984 82.4099 8.52 84.4259 8.52C87.0819 8.52 89.2739 9.272 91.0019 10.776C92.7299 12.28 93.5939 14.504 93.5939 17.448V33H91.1939V18.216C91.1939 15.592 90.5379 13.672 89.2259 12.456C87.9139 11.24 86.2339 10.632 84.1859 10.632C82.6819 10.632 81.2739 10.984 79.9619 11.688C78.6499 12.36 77.5939 13.352 76.7939 14.664C75.9939 15.976 75.5939 17.576 75.5939 19.464V33H73.1939ZM102.889 29.064C103.529 29.064 104.041 29.272 104.425 29.688C104.841 30.072 105.049 30.584 105.049 31.224C105.049 31.864 104.841 32.392 104.425 32.808C104.041 33.192 103.529 33.384 102.889 33.384C102.249 33.384 101.721 33.192 101.305 32.808C100.921 32.392 100.729 31.864 100.729 31.224C100.729 30.584 100.921 30.072 101.305 29.688C101.721 29.272 102.249 29.064 102.889 29.064Z" fill="white"/>
            </svg>
            <div class="header__nav">
                <ul class="nav__list list-reset">
                    ${createNavSkeleton(liNumber)} <!-- Вставляем элементы навигации -->
                </ul>
            </div>
        </div>
    </div>
    `;
};

const createSkeletonTop = () => {
  return `
        <div class="container__top container__top-accounts skeleton-top skeleton-top-card">
        <div class="top__block-title skeleton-text skeleton-text-card"></div>
        <div class="skeleton-text skeleton-btn skeleton-btn-card"></div>
    </div>
    <div class="container__balance">
        <div class="skeleton-text skeleton-text-number"></div>
        <div class="skeleton-text "></div>
    </div>
    `;
};

/**
 * Создает скелетон страницы со списком карточек.
 */
export const skeletonPageCardList = () => {
  return `
    ${createSkeletonHeader(1)}
    <div id="container" class="container">
        <div class="container__top container__top-accounts skeleton-top">
            <div class="top__block-title skeleton-title">
                <div class="skeleton-text"></div>
                <div class="skeleton-text skeleton-text-sort"></div>
            </div>
            <div class="skeleton-text skeleton-btn"></div>
        </div>
        <div class="skeleton-accounts">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    </div>
    `;
};

/**
 * Создает скелетон страницы детализации счета.
 */
export const skeletonAccountDetail = () => {
  return `
    ${createSkeletonHeader(5)}
    <div id="container" class="container">
        ${createSkeletonTop()}
        <div class="container__transfer-diagram">
            <div class="skeleton-card skeleton-card-account skeleton-card-transfer"></div>
            <div class="skeleton-card skeleton-card-account skeleton-card-balance"></div>
        </div>
        <div class="skeleton-card skeleton-card-table"></div>
    </div>
    `;
};

/**
 * Создает скелетон страницы детализации баланса счета.
 */
export const skeletonAccountDetailBalance = () => {
  return `
    ${createSkeletonHeader(5)}
    <div id="container" class="container">
        ${createSkeletonTop()}
        <div class="container__detail">
            <div class="skeleton-card skeleton-card-table"></div>
            <div class="skeleton-card skeleton-card-table"></div>
            <div class="skeleton-card skeleton-card-table-transfer"></div>
        </div>
    </div>
    `;
};

/**
 * Создает скелетон страницы валюты.
 */
export const skeletonCurrency = () => {
  return `
    ${createSkeletonHeader(2)}
    <div id="container" class="container">
    <div class="container__top container__top-accounts skeleton-top">
        <div class="top__block-title skeleton-text skeleton-text-card"></div>
    </div>
    <div class="container__currency-basic">
        <div class="currency__left">
            <div class="skeleton-card skeleton-card-currency"></div>
            <div class="skeleton-card skeleton-card-currency skeleton-card-currency-bottom"></div>
        </div>
        <div class="currency__right">
            <div class="skeleton-card skeleton-card-currency skeleton-card-currency-right"></div>
        </div>
    </div>
</body>`;
};

/**
 * Создает скелетон страницы карты банкоматов.
 */
export const skeletonMapATM = () => {
  return `
    ${createSkeletonHeader(0)}
    <div id="container" class="container">
        <div class="container__top container__top-accounts skeleton-top skeleton-top-map">
            <div class="top__block-title skeleton-text skeleton-text-card"></div>
        </div>
        <div class = "map">
            <div class = "skeleton-card skeleton-card-map"> </div>
        </div>
    </div>
  `;
};
