-- lualine's "auto" theme loads this one while the bereghici colorscheme is active
local c = require("bereghici").colors()
local opts = require("bereghici.config").options
local fill = opts.transparent and "NONE" or c.surface_raised

---@param color string
local function mode(color)
	return {
		a = { fg = c.surface, bg = color, gui = opts.bold and "bold" or nil },
		b = { fg = c.text, bg = c.surface_nested },
		c = { fg = c.text_subtle, bg = fill },
	}
end

return {
	normal = mode(c.accent),
	insert = mode(c.green),
	visual = mode(c.magenta),
	replace = mode(c.red),
	command = mode(c.yellow),
	terminal = mode(c.cyan),
	inactive = {
		a = { fg = c.text_subtlest, bg = fill },
		b = { fg = c.text_subtlest, bg = fill },
		c = { fg = c.text_subtlest, bg = fill },
	},
}
