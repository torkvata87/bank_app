/// <reference types="cypress" />

describe("Bank", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/login");
    cy.get("input[name='login']").type("developer");
    cy.get("input[name='password']").type("skillbox");
    cy.contains("Войти").click();
  });

  it("Перевод суммы со счета на счет", () => {
    cy.url().should("eq", "http://localhost:8080/accounts-all");
    cy.contains("Открыть").click();
    cy.get("input[name='transfer-account']").type("61253747452820828268825011");
    cy.get("input[name='transfer-sum']").type("200", { force: true });
    cy.contains("Отправить").click();
  });

  it("Создание нового счета и перевод средств на новый счет", () => {
    cy.url().should("eq", "http://localhost:8080/accounts-all");
    cy.contains("Создать новый счёт").click();

    cy.get(".container__accounts .accounts__item:last-child:last-child h2")
      .invoke("text")
      .then((text) => {
        const accountTitle = text.trim();
        cy.contains("Открыть").click();
        cy.get("input[name='transfer-account']", { timeout: 10000 }).type(
          accountTitle,
        );
        cy.get("input[name='transfer-sum']").type("200", { force: true });
        cy.contains("Отправить").click();
      });
  });

  it("Перевод средств с нового счета", () => {
    cy.url().should("eq", "http://localhost:8080/accounts-all");
    cy.get(".container__accounts .accounts__item:last-child").within(() => {
      cy.contains("Открыть").click();
    });
    cy.get("input[name='transfer-account']").type("61253747452820828268825011");
    cy.get("input[name='transfer-sum']").type("200", { force: true });
    cy.contains("Отправить").click();
  });

  it("Обмен валюты", () => {
    cy.url().should("eq", "http://localhost:8080/accounts-all");
    cy.contains("Валюта").click();
    cy.get("input[name='sum-exchange']").type("200");
    cy.contains("Обменять").click();
  });
});
