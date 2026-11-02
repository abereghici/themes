local modules = { "snacks", "completion", "git", "interface", "files", "markdown", "debug" }

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local highlights = {}
	for _, name in ipairs(modules) do
		for group, spec in pairs(require("bereghici.groups.plugins." .. name)(c, opts)) do
			highlights[group] = spec
		end
	end
	return highlights
end
