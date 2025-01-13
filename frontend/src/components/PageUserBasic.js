import { el } from 'redom';

export class PageUserBasic {
  constructor(titlePage) {
    this.titlePage = titlePage;
  }

  createTopPage(titleStyle) {
    return el(`h1.top__title${titleStyle}`, this.titlePage);
  }

  createPage(content, containerStyle = '', titleStyle = '') {
    return el(`#container.container${containerStyle}`, [
      this.createTopPage(titleStyle),
      content,
    ]);
  }

  createCardBlue(titleSecond, content, cardStyle = '', titleStyle = '') {
    return el(
      `.card-blue${cardStyle}`,
      el(`h2.card__title-second${titleStyle}`, titleSecond),
      content,
    );
  }

  createCardWhite(titleSecond, content, titleStyle = '', cardStyle = '') {
    return el(
      `.card-white${cardStyle}`,
      el(`h2.card__title-second${titleStyle}`, titleSecond),
      content,
    );
  }

  dropdownUp(element) {
    const dropDownUl = element.nextSibling;
    dropDownUl.classList.toggle('hidden');
    dropDownUl.classList.toggle('visible');
    element.classList.toggle('dropdown__btn-up');
  }

  handleDocumentClick(event) {
    const dropdownBtns = document.querySelectorAll('.dropdown__btn');
    if (dropdownBtns.length > 0) {
      dropdownBtns.forEach((dropdownBtn) => {
        const dropdownUl = dropdownBtn.nextSibling;

        if (
          dropdownUl &&
          !dropdownUl.contains(event.target) &&
          !dropdownBtn.contains(event.target)
        ) {
          dropdownUl.classList.remove('visible');
          dropdownUl.classList.add('hidden');
          dropdownBtn.classList.remove('dropdown__btn-up');
        }
      });
    }
  }

  itemActions(element, styleCheckMark = '') {
    const dropdownBtn = element.parentNode.previousSibling;
    const dropdownUl = element.parentNode;
    const items = document.querySelectorAll('.dropdown__item');

    items.forEach((item) =>
      item.classList.remove(`check-mark${styleCheckMark}`),
    );
    element.classList.add(`check-mark${styleCheckMark}`);
    dropdownUl.classList.remove('visible');
    dropdownUl.classList.add('hidden');
    dropdownBtn.classList.add('dropdown__btn-up');
  }

  handlerItem(event, styleCheckMark = '') {
    this.itemActions(event.currentTarget, styleCheckMark);
  }

  // isValidateSum(valueSum, balance, styleText = "") {
  //   let errorText = "";
  //   let transferError = document.getElementById("textErrorSum");
  //   if (transferError) transferError.remove();
  //   if (valueSum === "") {
  //     errorText = "Поле суммы перевода не может быть пустым";
  //   }
  //   if (valueSum === "0") {
  //     errorText = "Сумма перевода не может быть 0 ₽";
  //   }
  //   if (valueSum > balance) {
  //     errorText = "Сумма перевода не может быть больше, чем на счете";
  //   }
  //
  //   if (errorText) {
  //     const blockInput = document.getElementById("blockSum");
  //     transferError = el(
  //       `p.form__error.error-text${styleText}`,
  //       { id: "textErrorSum" },
  //       errorText,
  //     );
  //     blockInput.append(transferError);
  //     return false;
  //   }
  //   return true;
  // }
}
