/**
 * Форматирует значение поля ввода при вводе пользователя.
 */
export const formatLoginFields = (valueField) => {
  let value = valueField.trim().toLowerCase(); // Получаем значение и приводим его к нижнему регистру.
  value = value.replace(/[а-яё]/g, ''); // Удаляем все символы кириллицы.
  value = value.replace(/^[-\s]+|[-\s]+$/g, ''); // Удаляем лишние пробелы и дефисы в начале и конце строки.
  value = value.replace(/-+/g, '-'); // Заменяем несколько пробелов или дефисов на один дефис.
  value = value.replace(/\s+/g, ''); // Заменяем несколько пробелов или дефисов на один дефис.
  return value; // Обновляем значение поля ввода.
};

export const createErrorText = (valueSum, balance) => {
  if (valueSum === '') {
    return 'Поле суммы перевода не может быть пустым';
  }
  if (valueSum === '0') {
    return 'Сумма перевода не может быть 0 ₽';
  }
  if (valueSum > balance) {
    return 'Сумма перевода не может быть больше, чем на счете';
  }
  return '';
};

export const createLoginErrorText = (valueField, inputName) => {
  if (valueField.length < 6) {
    return `${inputName} должен состоять не менее чем из 6 символов`; // Проверка длины значения поля ввода.
  }
  return '';
};

/**
 * Форматирует значение валюты в строку с двумя десятичными знаками.
 */
export const formatCurrency = (value) => {
  let formatCur = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(',', '.');

  if (formatCur.includes('.00')) return formatCur.replace('.00', '');
  return formatCur;
};
