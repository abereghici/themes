local M = {}

local modules = { "editor", "syntax", "treesitter", "lsp", "plugins" }

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
function M.build(c, opts)
	local highlights = {}
	for _, name in ipairs(modules) do
		for group, spec in pairs(require("bereghici.groups." .. name)(c, opts)) do
			highlights[group] = spec
		end
	end
	return highlights
end

return M
