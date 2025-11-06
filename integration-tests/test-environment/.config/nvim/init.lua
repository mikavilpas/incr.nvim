-- renovate: datasource=github-releases depName=folke/lazy.nvim
local lazy_version = "v11.17.5"

-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "--branch=" .. lazy_version,
    lazyrepo,
    lazypath,
  })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

-- Make sure to setup `mapleader` and `maplocalleader` before
-- loading lazy.nvim so that mappings are correct.
-- This is also a good place to setup other settings (vim.opt)
vim.g.mapleader = " "
vim.g.maplocalleader = " "
vim.o.swapfile = false

_G.repo_root = vim.fn.fnamemodify(vim.uv.os_environ().HOME, ":h:h:h:h")

require("lazy").setup({
  spec = {
    { "catppuccin/nvim", name = "catppuccin", priority = 1000 },

    {
      "mikavilpas/incr.nvim",
      -- for tests, always use the code from this repository
      dir = _G.repo_root,
      opts = {
        incr_key = "<enter>", -- increment selection key
        decr_key = "<backspace>", -- decrement selection key
      },
    },
  },
})

vim.cmd.colorscheme("catppuccin-macchiato")
