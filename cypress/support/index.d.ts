/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    localhost(): void;
    fetchs(): void;
  }
}
