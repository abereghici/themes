local config = require("bereghici.config")

local M = {}

---@param opts? bereghici.Options
function M.setup(opts)
	config.extend(opts)
	-- lazy.nvim runs setup after LazyVim may already have applied the colorscheme
	if vim.g.colors_name == "bereghici" then
		M.load()
	end
end

---The palette for the current 'background', after on_colors.
---@return bereghici.Colors
function M.colors()
	-- palette.lua picks its variant when it runs, so a cached copy would pin the old 'background'
	package.loaded["bereghici.palette"] = nil
	local colors = require("bereghici.palette")
	package.loaded["bereghici.palette"] = nil
	config.options.on_colors(colors)
	return colors
end

function M.load()
	if vim.g.colors_name then
		vim.cmd("highlight clear")
	end
	vim.g.colors_name = "bereghici"

	local opts = config.options
	local colors = M.colors()
	local highlights = require("bereghici.groups").build(colors, opts)
	opts.on_highlights(highlights, colors)

	for name, spec in pairs(highlights) do
		vim.api.nvim_set_hl(0, name, spec)
	end
	for index, hex in ipairs(colors.ansi) do
		vim.g["terminal_color_" .. (index - 1)] = hex
	end
end

return M
