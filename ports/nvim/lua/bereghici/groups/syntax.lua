-- The legacy :syntax groups. Tree-sitter captures and many plugins link back to these.

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	return {
		Comment = { fg = c.text_subtlest, italic = opts.italic },
		SpecialComment = { fg = c.text_subtle, italic = opts.italic },
		Todo = { fg = c.surface, bg = c.yellow, bold = opts.bold },

		Constant = { fg = c.cyan },
		Number = { link = "Constant" },
		Float = { link = "Number" },
		Boolean = { link = "Constant" },
		String = { fg = c.yellow },
		Character = { fg = c.yellow_bright },

		Identifier = { fg = c.text },
		Function = { fg = c.green },

		Statement = { fg = c.magenta },
		Keyword = { fg = c.magenta },
		Conditional = { fg = c.magenta, italic = opts.italic },
		Repeat = { fg = c.magenta, italic = opts.italic },
		Label = { fg = c.magenta_bright },
		Exception = { fg = c.magenta, italic = opts.italic },
		Operator = { fg = c.text_subtle },

		PreProc = { fg = c.magenta_bright },
		Include = { fg = c.magenta },
		Define = { link = "PreProc" },
		Macro = { link = "@function.macro" },
		PreCondit = { link = "PreProc" },

		Type = { fg = c.cyan },
		StorageClass = { fg = c.magenta },
		Structure = { link = "Type" },
		Typedef = { link = "Type" },

		Special = { fg = c.magenta_bright },
		SpecialChar = { fg = c.cyan },
		Tag = { fg = c.magenta },
		Delimiter = { fg = c.text_subtle },
		Debug = { fg = c.red_bright },

		Underlined = { underline = true },
		Bold = { bold = opts.bold },
		Italic = { italic = opts.italic },
		Ignore = { fg = c.text_subtlest },
		Error = { fg = c.red },

		-- Filetype syntax files that ship with Neovim and still show up without Tree-sitter
		diffAdded = { link = "Added" },
		diffRemoved = { link = "Removed" },
		diffChanged = { link = "Changed" },
		diffFile = { fg = c.blue, bold = opts.bold },
		diffNewFile = { fg = c.green },
		diffOldFile = { fg = c.red },
		diffLine = { fg = c.magenta },
		diffIndexLine = { fg = c.text_subtle },
		gitcommitSummary = { fg = c.text },
		gitcommitOverflow = { fg = c.red },
		helpHyperTextJump = { fg = c.magenta, underline = true },
		helpCommand = { fg = c.cyan },
		helpExample = { fg = c.text_subtle },
		markdownCode = { fg = c.cyan },
		markdownLinkText = { fg = c.magenta, underline = true },
		qfFileName = { fg = c.blue },
		qfLineNr = { fg = c.text_subtlest },
	}
end
