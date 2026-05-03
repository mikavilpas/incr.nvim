import z from "zod"
import type { NeovimContext } from "../support/tui-sandbox.js"
import { isHighlighted, isNotHighlighted } from "./utils.js"

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

      // also verify for visual line mode (V), which is used for different
      // keybinding dispatch (e.g. indent motion vs treesitter selection)
      cy.typeIntoTerminal("{esc}")
      cy.typeIntoTerminal("V")
      getIsActive(nvim).should("equal", false)
    })
  })

  it("works together with the builtin ]n (select next sibling node)", () => {
    cy.startNeovim({
      filename: "initial-file.lua",
    }).then(() => {
      cy.contains("local items")

      // move cursor to "item1"
      cy.typeIntoTerminal("f1")

      // start incremental selection - should select the string content node
      cy.typeIntoTerminal("{enter}")
      isHighlighted("item")
      isNotHighlighted("item2")

      // expand to select the full string "item1", then the field node
      // AST: field > string > string_content
      // We need to reach the `field` level so ]n can jump between sibling fields
      cy.typeIntoTerminal("{enter}")
      isHighlighted('"item1"')

      // use the builtin ]n to select the next sibling (field containing "item2")
      cy.typeIntoTerminal("]n")
      isHighlighted('"item2"')
      isNotHighlighted('"item1"')
      isNotHighlighted('"item3"')

      // and use the reverse mapping to go back to select "item1"
      cy.typeIntoTerminal("[n")
      isHighlighted('"item1"')
      isNotHighlighted('"item2"')
      isNotHighlighted('"item3"')
    })
  })
})
