local M = {}

-- Track whether incremental selection is active (started via this plugin).
-- This lets users check is_active() to conditionally dispatch keybindings.
local active = false

function M.is_active()
  local is_visual = vim.fn.mode():find("[vV]") ~= nil
  if not is_visual then
    return false
  end
  return active
end

-- Clear the active flag when leaving visual mode for a non-visual mode.
-- The builtin select_parent internally does v<Esc> then gv, which
-- momentarily exits visual mode, so we use vim.schedule to only check
-- after the dust settles.
local function clear_on_mode_change()
  local group = vim.api.nvim_create_augroup("IncrSelection", { clear = true })
  vim.api.nvim_create_autocmd("ModeChanged", {
    group = group,
    pattern = "[vV\x16]:*",
    callback = function()
      vim.schedule(function()
        local mode = vim.fn.mode()
        if not mode:find("[vV]") then
          active = false
          vim.api.nvim_create_augroup("IncrSelection", { clear = true })
        end
      end)
    end,
  })
end

M.select_treesitter_node = function()
  active = true
  clear_on_mode_change()

  -- enter visual mode so select_parent can get the cursor position as a range
  local mode = vim.api.nvim_get_mode()
  if mode.mode ~= "v" then
    vim.api.nvim_cmd({ cmd = "normal", bang = true, args = { "v" } }, {})
  end

  require("vim.treesitter._select").select_parent(1)
end

M.increment_selection = function()
  require("vim.treesitter._select").select_parent(1)
end

M.decrement_selection = function()
  require("vim.treesitter._select").select_child(1)
end

M.setup = function(config)
  local incr_key = config.incr_key and config.incr_key or "<tab>"
  local decr_key = config.decr_key and config.decr_key or "<s-tab>"

  vim.keymap.set(
    { "n" },
    incr_key,
    M.select_treesitter_node,
    { desc = "Select treesitter node" }
  )
  vim.keymap.set(
    "x",
    incr_key,
    M.increment_selection,
    { desc = "Increment selection" }
  )
  vim.keymap.set(
    "x",
    decr_key,
    M.decrement_selection,
    { desc = "Decrement selection" }
  )
end

return M
