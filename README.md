# incr.nvim

> This is a @mikavilpas fork from <https://github.com/daliusd/incr.nvim>.
>
> The additions include
>
> - export all functions for easier usage in custom mappings
> - add end-to-end tests for easy maintainability. Tested against neovim nightly
>   and stable versions
> - `is_active()` function to check if there is an active selection

This plugin uses nvim-treesitter to select nodes incrementally. You can start
selection in normal mode by clicking `tab` and then repeatedly clicking `tab`
select more scope. You can use `s-tab` to decrement selection.

Requires **Neovim >= 0.12.0**.

## Installation

Using lazy.nvim:

```lua
{
  'mikavilpas/incr.nvim',
  version = "*", -- use latest version tag, recommended
  config = true,
},
```

If you want to override default keys:

```lua
{
  'mikavilpas/incr.nvim',
  version = "*", -- use latest version tag, recommended
  opts = {
    incr_key = '<tab>', -- increment selection key (normal + visual)
    decr_key = '<s-tab>', -- decrement selection key (visual)
  },
}
```

## History

This started as a fork of <https://github.com/daliusd/incr.nvim>, which
extracted the incremental selection feature after it was
[removed from nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/issues/4767#issue-1698676665).

Since Neovim 0.12.0 ships built-in treesitter incremental selection, this plugin
was refactored to be a thin wrapper around the builtin, keeping only the
keybinding setup and `is_active()` API.
