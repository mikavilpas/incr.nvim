import z from "zod"
import type { NeovimContext } from "../support/tui-sandbox"
import { isHighlighted, isNotHighlighted } from "./utils"

const getIsActive = (nvim: NeovimContext): Cypress.Chainable<boolean> => {
  return nvim
    .runLuaCode({
      luaCode: `return require("incr").is_active()`,
    })
    .then((output) => z.boolean().parse(output.value))
}

describe("the plugin", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("can expand and collapse the highlighting", () => {
    cy.startNeovim({
      filename: "initial-file.lua",
    }).then((nvim) => {
      // wait until text on the start screen is visible
      cy.contains("local items")

      // select item1
      cy.typeIntoTerminal("f1")
      getIsActive(nvim).should("equal", false)

      // start selection
      cy.typeIntoTerminal("{enter}")

      // the text for item1 should now be highlighted, but item2 should not be
      isHighlighted("item")
      isNotHighlighted("item2")
      isNotHighlighted("item3")
      getIsActive(nvim).should("equal", true)

      // expand the highlighting
      cy.typeIntoTerminal("{enter}{enter}")

      // all the items should now be highlighted
      isHighlighted("item1")
      isHighlighted("item2")
      isHighlighted("item3")
      isNotHighlighted("items")
      getIsActive(nvim).should("equal", true)

      // collapse the highlighting
      cy.typeIntoTerminal("{backspace}")
      isHighlighted("item")
      isNotHighlighted("item2")
      isNotHighlighted("item3")
      getIsActive(nvim).should("equal", true)

      // end the selection
      cy.typeIntoTerminal("{esc}")
      isNotHighlighted("item")
      isNotHighlighted("item2")
      isNotHighlighted("item3")
      getIsActive(nvim).should("equal", false)

      // make sure is_active() is false when entering standard visual mode
      //
      // This detects a regression where it would stay true after the first
      // incremental-selection
      cy.typeIntoTerminal("viw")
      getIsActive(nvim).should("equal", false)
    })
  })
})
