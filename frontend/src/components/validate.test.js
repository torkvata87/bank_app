import {
  formatLoginFields,
  createErrorText,
  // formatCurrency,
  createLoginErrorText,
} from './validate.js'; // Замените на правильный путь к вашему модулю

describe('formatLoginFields', () => {
  test('должен правильно форматировать слова с разным регистром и разделенных пробелами', () => {
    const input = 'Primer - Vvoda - Test';
    const result = formatLoginFields(input);

    expect(result).toBe('primer-vvoda-test'); // Проверяем корректное форматирование
  });

  test('должен удалять кириллические символы', () => {
    const input = 'Тест123';
    const result = formatLoginFields(input);

    expect(result).toBe('123'); // Все кириллические символы должны быть удалены
  });

  test('должен удалять подряд идущие пробелы и заменять подряд идущие дефисы на один дефис', () => {
    const input = '   ---   Test Input   --   ';
    const result = formatLoginFields(input);

    expect(result).toBe('testinput'); // Лишние пробелы и дефисы должны быть удалены
  });
});

describe('createErrorText', () => {
  test('должен сообщать об ошибке при пустом значении в поле ввода суммы', () => {
    const result = createErrorText('', 100);
    expect(result).toBe('Поле суммы перевода не может быть пустым');
  });

  test('должен сообщать об ошибке при нулевом значении в поле ввода суммы', () => {
    const result = createErrorText('0', 100);
    expect(result).toBe('Сумма перевода не может быть 0 ₽');
  });

  test('должен сообщать об ошибке, если введенное значение суммы превышает баланс', () => {
    const result = createErrorText('150', 100);
    expect(result).toBe('Сумма перевода не может быть больше, чем на счете');
  });

  test('должен пропускать валидное значение введенной суммы', () => {
    const result = createErrorText('50', 100);
    expect(result).toBe('');
  });

  test('должен правильно обрабатывать ввод десятичных значений суммы', () => {
    const result = createErrorText('99.99', 100);
    expect(result).toBe('');

    const resultExceeds = createErrorText('100.01', 100);
    expect(resultExceeds).toBe(
      'Сумма перевода не может быть больше, чем на счете',
    );
  });
});

describe('createLoginErrorText', () => {
  test('должен возвращать сообщение об ошибке, если длина меньше 6 символов', () => {
    const result = createLoginErrorText('abc', 'Логин');
    expect(result).toBe('Логин должен состоять не менее чем из 6 символов');
  });

  test('должен возвращать пустую строку, если длина равна 6 символам', () => {
    const result = createLoginErrorText('abcdef', 'Логин');
    expect(result).toBe('');
  });

  test('должен возвращать пустую строку, если длина больше 6 символов', () => {
    const result = createLoginErrorText('abcdefgh', 'Логин');
    expect(result).toBe('');
  });

  test('должен корректно обрабатывать пустую строку', () => {
    const result = createLoginErrorText('', 'Логин');
    expect(result).toBe('Логин должен состоять не менее чем из 6 символов');
  });
});
