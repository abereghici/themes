-- blink.cmp, and nvim-cmp for configs that still use it

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	-- One color per family of completion kinds, following the syntax colors
	local kinds = {
		Text = c.text_subtle,
		Method = c.green,
		Function = c.green,
		Constructor = c.cyan,
		Field = c.blue,
		Variable = c.text,
		Class = c.cyan,
		Interface = c.cyan,
		Module = c.cyan,
		Property = c.blue,
		Unit = c.cyan_bright,
		Value = c.cyan_bright,
		Enum = c.cyan,
		Keyword = c.magenta,
		Snippet = c.magenta_bright,
		Color = c.yellow_bright,
		File = c.text,
		Reference = c.blue_bright,
		Folder = c.blue,
		EnumMember = c.cyan_bright,
		Constant = c.cyan_bright,
		Struct = c.cyan,
		Event = c.yellow,
		Operator = c.text_subtle,
		TypeParameter = c.cyan,
		Copilot = c.accent,
	}

	local groups = {
		BlinkCmpMenu = { link = "Pmenu" },
		BlinkCmpMenuBorder = { fg = c.border, bg = c.surface_raised },
		BlinkCmpMenuSelection = { link = "PmenuSel" },
		BlinkCmpScrollBarThumb = { link = "PmenuThumb" },
		BlinkCmpScrollBarGutter = { link = "PmenuSbar" },
		BlinkCmpLabel = { fg = c.text },
		BlinkCmpLabelDeprecated = { fg = c.text_subtlest, strikethrough = true },
		BlinkCmpLabelMatch = { fg = c.accent, bold = opts.bold },
		BlinkCmpLabelDetail = { fg = c.text_subtlest },
		BlinkCmpLabelDescription = { fg = c.text_subtlest },
		BlinkCmpKind = { fg = c.cyan },
		BlinkCmpSource = { fg = c.text_subtlest },
		BlinkCmpGhostText = { fg = c.text_subtlest, italic = opts.italic },
		BlinkCmpDoc = { fg = c.text, bg = c.surface_raised },
		BlinkCmpDocBorder = { fg = c.border, bg = c.surface_raised },
		BlinkCmpDocSeparator = { fg = c.border, bg = c.surface_raised },
		BlinkCmpDocCursorLine = { bg = c.selection },
		BlinkCmpSignatureHelp = { fg = c.text, bg = c.surface_raised },
		BlinkCmpSignatureHelpBorder = { fg = c.border, bg = c.surface_raised },
		BlinkCmpSignatureHelpActiveParameter = { link = "LspSignatureActiveParameter" },

		CmpItemAbbr = { fg = c.text },
		CmpItemAbbrDeprecated = { fg = c.text_subtlest, strikethrough = true },
		CmpItemAbbrMatch = { fg = c.accent, bold = opts.bold },
		CmpItemAbbrMatchFuzzy = { link = "CmpItemAbbrMatch" },
		CmpItemMenu = { fg = c.text_subtlest },
		CmpItemKind = { fg = c.cyan },
		CmpGhostText = { link = "BlinkCmpGhostText" },
		CmpDocumentation = { link = "BlinkCmpDoc" },
		CmpDocumentationBorder = { link = "BlinkCmpDocBorder" },
	}

	for kind, color in pairs(kinds) do
		groups["BlinkCmpKind" .. kind] = { fg = color }
		groups["CmpItemKind" .. kind] = { fg = color }
	end

	return groups
end
