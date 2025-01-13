module.exports = {
  transform: {
    '\\.js$': 'babel-jest', // Применяем babel-jest для файлов .js
  },
  testEnvironment: 'jest-environment-jsdom', // Используем jsdom как окружение тестирования
};
