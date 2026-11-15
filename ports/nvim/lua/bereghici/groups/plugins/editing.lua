-- In-buffer decorations: indent-blankline, mini.indentscope, rainbow-delimiters, vim-illuminate,
-- mini.cursorword and mini.hipatterns

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local groups = {
		-- Guides and scopes follow snacks.indent
		IblIndent = { link = "SnacksIndent" },
		IblWhitespace = { link = "Whitespace" },
		IblScope = { link = "SnacksIndentScope" },
		MiniIndentscopeSymbol = { link = "SnacksIndentScope" },
		MiniIndentscopeSymbolOff = { fg = c.yellow },

		-- Word references, as LSP document highlights draw them
		IlluminatedWordText = { link = "LspReferenceText" },
		IlluminatedWordRead = { link = "LspReferenceRead" },
		IlluminatedWordWrite = { link = "LspReferenceWrite" },
		MiniCursorword = { link = "LspReferenceText" },
		MiniCursorwordCurrent = { link = "MiniCursorword" },

		RainbowDelimiterRed = { fg = c.red },
		RainbowDelimiterYellow = { fg = c.yellow },
		RainbowDelimiterBlue = { fg = c.blue },
		RainbowDelimiterOrange = { fg = c.yellow_bright },
		RainbowDelimiterGreen = { fg = c.green },
		RainbowDelimiterViolet = { fg = c.magenta },
		RainbowDelimiterCyan = { fg = c.cyan },
	}

	-- The same keyword colors as todo-comments
	local keywords = { Fixme = c.red, Hack = c.yellow, Todo = c.magenta, Note = c.blue }
	for keyword, color in pairs(keywords) do
		groups["MiniHipatterns" .. keyword] = { fg = c.surface, bg = color, bold = opts.bold }
	end

	return groups
end
