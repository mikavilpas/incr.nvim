import { flavors } from "@catppuccin/palette"
import { rgbify, textIsVisibleWithBackgroundColor } from "@tui-sandbox/library"

export const isHighlighted = (text: string): Cypress.Chainable<JQuery> =>
  textIsVisibleWithBackgroundColor(
    text,
    rgbify(flavors.macchiato.colors.surface1.rgb),
  )

export const isNotHighlighted = (text: string): Cypress.Chainable<JQuery> =>
  textIsVisibleWithBackgroundColor(
    text,
    rgbify(flavors.macchiato.colors.base.rgb),
  )
