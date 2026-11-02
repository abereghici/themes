local mix = require("bereghici.color").mix

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local bg = opts.transparent and "NONE" or c.surface
	-- Sidebars and floats sit one step up from the editor, or show the terminal through
	local bg_panel = opts.transparent and "NONE" or c.surface_raised
	local inactive = opts.dim_inactive
			and (opts.transparent and { fg = c.text_subtle } or { fg = c.text, bg = c.surface_raised })
		or { link = "Normal" }

	return {
		Normal = { fg = c.text, bg = bg },
		NormalNC = inactive,
		NormalFloat = { fg = c.text, bg = bg_panel },
		FloatBorder = { fg = c.border, bg = bg_panel },
		FloatTitle = { fg = c.accent, bg = bg_panel, bold = opts.bold },
		FloatFooter = { fg = c.text_subtle, bg = bg_panel },
		NormalSB = { fg = c.text, bg = bg_panel },

		Cursor = { fg = c.surface, bg = c.accent },
		lCursor = { link = "Cursor" },
		CursorIM = { link = "Cursor" },
		TermCursor = { link = "Cursor" },
		CursorLine = { bg = c.line_highlight },
		CursorColumn = { link = "CursorLine" },
		ColorColumn = { bg = c.line_highlight },
		LineNr = { fg = c.text_subtlest },
		LineNrAbove = { link = "LineNr" },
		LineNrBelow = { link = "LineNr" },
		CursorLineNr = { fg = c.accent, bold = opts.bold },
		CursorLineSign = { link = "SignColumn" },
		CursorLineFold = { link = "FoldColumn" },
		SignColumn = { fg = c.text_subtlest, bg = "NONE" },
		FoldColumn = { fg = c.text_subtlest, bg = "NONE" },
		Folded = { fg = c.text_subtle, bg = bg_panel },
		Conceal = { fg = c.text_subtlest },
		NonText = { fg = c.selection },
		EndOfBuffer = { fg = bg == "NONE" and c.surface_nested or c.surface },
		Whitespace = { fg = c.selection },
		SpecialKey = { fg = c.text_subtlest },
		VertSplit = { link = "WinSeparator" },
		WinSeparator = { fg = c.border, bg = "NONE" },

		Visual = { bg = c.selection },
		VisualNOS = { link = "Visual" },
		Search = { fg = c.text, bg = c.tints.search },
		IncSearch = { fg = c.surface, bg = c.yellow },
		CurSearch = { link = "IncSearch" },
		Substitute = { fg = c.surface, bg = c.red },
		MatchParen = { fg = c.accent, bg = c.selection, bold = opts.bold },
		QuickFixLine = { bg = c.line_highlight, bold = opts.bold },

		Pmenu = { fg = c.text, bg = c.surface_raised },
		PmenuSel = { bg = c.selection },
		PmenuKind = { fg = c.cyan, bg = c.surface_raised },
		PmenuKindSel = { fg = c.cyan, bg = c.selection },
		PmenuExtra = { fg = c.text_subtle, bg = c.surface_raised },
		PmenuExtraSel = { fg = c.text_subtle, bg = c.selection },
		PmenuMatch = { fg = c.accent, bold = opts.bold },
		PmenuMatchSel = { fg = c.accent, bg = c.selection, bold = opts.bold },
		PmenuSbar = { bg = c.surface_nested },
		PmenuThumb = { bg = c.border },
		PmenuBorder = { link = "FloatBorder" },
		WildMenu = { link = "PmenuSel" },
		ComplMatchIns = { fg = c.text_subtle },

		StatusLine = { fg = c.text, bg = opts.transparent and "NONE" or c.surface_nested },
		StatusLineNC = { fg = c.text_subtlest, bg = bg_panel },
		StatusLineTerm = { link = "StatusLine" },
		StatusLineTermNC = { link = "StatusLineNC" },
		TabLine = { fg = c.text_subtle, bg = bg_panel },
		TabLineSel = { fg = c.text, bg = c.surface_nested, bold = opts.bold },
		TabLineFill = { bg = bg_panel },
		WinBar = { fg = c.text_subtle, bg = bg },
		WinBarNC = { fg = c.text_subtlest, bg = bg },

		Title = { fg = c.accent, bold = opts.bold },
		Directory = { fg = c.blue },
		ModeMsg = { fg = c.text_subtle },
		MsgArea = { fg = c.text },
		MsgSeparator = { fg = c.border, bg = bg_panel },
		MoreMsg = { fg = c.green },
		Question = { fg = c.green },
		ErrorMsg = { fg = c.red, bold = opts.bold },
		WarningMsg = { fg = c.yellow },
		OkMsg = { fg = c.green },
		StderrMsg = { link = "ErrorMsg" },
		StdoutMsg = { link = "MsgArea" },

		DiffAdd = { bg = c.tints.added },
		DiffDelete = { bg = c.tints.removed },
		DiffChange = { bg = c.tints.changed },
		DiffText = { bg = c.tints.changed_emphasis },
		DiffTextAdd = { bg = c.tints.added_emphasis },
		Added = { fg = c.green },
		Removed = { fg = c.red },
		Changed = { fg = c.blue },

		SpellBad = { sp = c.red, undercurl = true },
		SpellCap = { sp = c.yellow, undercurl = true },
		SpellLocal = { sp = c.cyan, undercurl = true },
		SpellRare = { sp = c.magenta, undercurl = true },

		-- Snippet placeholders and other virtual text the editor itself shows
		SnippetTabstop = { bg = mix(c.blue, c.surface, 0.12) },
		SnippetTabstopActive = { link = "SnippetTabstop" },
		healthError = { fg = c.red },
		healthSuccess = { fg = c.green },
		healthWarning = { fg = c.yellow },
		RedrawDebugNormal = { reverse = true },
		RedrawDebugClear = { bg = c.yellow },
		RedrawDebugComposed = { bg = c.green },
		RedrawDebugRecompose = { bg = c.red },
		FloatShadow = { bg = c.surface_nested, blend = 80 },
		FloatShadowThrough = { bg = c.surface_nested, blend = 100 },
	}
end
