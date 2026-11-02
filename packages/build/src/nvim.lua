-- Loads the Neovim port in each appearance, with and without `transparent`, and prints what
-- editors.test.ts checks as JSON: links that point nowhere or bad colors, and the groups it compares.
local port, groups = arg[1], vim.json.decode(arg[2])
vim.opt.rtp:prepend(port)

-- A capture without a group of its own falls back to its parent, as Neovim resolves `@a.b.c`
local function resolve(name)
	while name do
		local hl = vim.api.nvim_get_hl(0, { name = name, link = false })
		if next(hl) then
			return hl
		end
		name = name:match("^(.+)%.[^.]+$")
	end
	return {}
end

local function hex(n)
	return n and string.format("#%06x", n) or nil
end

local result = {}
for _, appearance in ipairs({ "dark", "light" }) do
	for _, transparent in ipairs({ false, true }) do
		vim.o.background = appearance
		require("bereghici").setup({ transparent = transparent })
		vim.cmd.colorscheme("bereghici")

		-- Linking creates its target, so a link is sound when the theme or Neovim defines the target
		local defined = require("bereghici.groups").build(require("bereghici").colors(), require("bereghici.config").options)
		local broken = {}
		for name, spec in pairs(defined) do
			if spec.link and not defined[spec.link] and not next(vim.api.nvim_get_hl(0, { name = spec.link })) then
				table.insert(broken, name .. " -> " .. spec.link)
			end
			for _, key in ipairs({ "fg", "bg", "sp" }) do
				local value = spec[key]
				if value and value ~= "NONE" and not value:match("^#%x%x%x%x%x%x$") then
					table.insert(broken, name .. "." .. key .. " = " .. value)
				end
			end
		end

		local resolved = {}
		for _, name in ipairs(groups) do
			local hl = resolve(name)
			resolved[name] = { fg = hex(hl.fg), bg = hex(hl.bg), italic = hl.italic == true }
		end

		result[appearance .. (transparent and "-transparent" or "")] = { broken = broken, groups = resolved }
	end
end

io.stdout:write(vim.json.encode(result))
