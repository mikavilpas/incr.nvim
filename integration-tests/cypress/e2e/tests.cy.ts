import { isHighlighted, isNotHighlighted } from "./utils"

describe("the plugin", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("can expand and collapse the highlighting", () => {
    cy.startNeovim({
      filename: "initial-file.lua",
    }).then(() => {
      // wait until text on the start screen is visible
      cy.contains("local items")

      // select item1
      cy.typeIntoTerminal("f1")

      // start selection
      cy.typeIntoTerminal("{enter}")

      // the text for item1 should now be highlighted, but item2 should not be
      isHighlighted("item")
      isNotHighlighted("item2")
      isNotHighlighted("item3")

      // expand the highlighting
      cy.typeIntoTerminal("{enter}{enter}")

      // all the items should now be highlighted
      isHighlighted("item1")
      isHighlighted("item2")
      isHighlighted("item3")
      isNotHighlighted("items")

      // collapse the highlighting
      cy.typeIntoTerminal("{backspace}")
      isHighlighted("item")
      isNotHighlighted("item2")
      isNotHighlighted("item3")
    })
  })
})
