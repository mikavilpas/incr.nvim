# incr.nvim

> This is a @mikavilpas fork from <https://github.com/daliusd/incr.nvim>.
>
> The additions include
>
> - export all functions for easier usage in custom mappings
> - add end-to-end tests for easy maintainability
> - `is_active()` function to check if there is an active selection

This plugin uses nvim-treesitter to select nodes incrementally. You can start
selection in normal mode by clicking `tab` and then repeatedly clicking `tab`
select more scope. You can use `s-tab` to decrement selection.

## Installation

Using lazyvim.

```lua
{
  'mikavilpas/incr.nvim',
  config = true,
},
```

If you want to override default keys then use something like this:

```lua
{
  'mikavilpas/incr.nvim',
  opts = {
    incr_key = '<tab>', -- increment selection key
    decr_key = '<s-tab>', -- decrement selection key
  },
}
```

## History

nvim-treesitter main branch drop increment selection feature. From
<https://github.com/nvim-treesitter/nvim-treesitter/issues/4767#issue-1698676665>:

> incremental-selection mostly served as a proof-of-concept for non-highlighting
> uses of tree-sitter; if people are actively using it, they should consider
> moving it to a separate plugin (or seeing if textobjects don't serve this
> purposes even better); alternatively rewrite as simple node and scope
> textobjects;

This is basically gist of it. Initially I have tried to move this to my nvim
configuration as simple solution, but found out that simple solution was lacking
something as tree-sitter methods are not necessary doing what their
documentation says.

This does not match original nvim-treesitter incremental-selection feature - if
you are missing something feel free to create issue or even better PR.
