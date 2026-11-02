-- snacks.nvim: dashboard, picker and explorer, notifier, indent, input, dim and zen

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local bg = opts.transparent and "NONE" or c.surface
	local bg_panel = opts.transparent and "NONE" or c.surface_raised

	local groups = {
		SnacksNormal = { link = "NormalFloat" },
		SnacksNormalNC = { link = "NormalFloat" },
		SnacksWinBar = { link = "Title" },
		SnacksWinBarNC = { link = "SnacksWinBar" },
		SnacksBackdrop = { bg = opts.transparent and "NONE" or c.surface },
		SnacksTitle = { link = "FloatTitle" },
		SnacksFooter = { link = "FloatFooter" },
		SnacksWinKey = { fg = c.accent },
		SnacksWinKeySep = { fg = c.text_subtlest },
		SnacksWinKeyDesc = { fg = c.text_subtle },
		SnacksWinSeparator = { link = "WinSeparator" },

		-- The LazyVim start screen
		SnacksDashboardNormal = { fg = c.text, bg = bg },
		SnacksDashboardHeader = { fg = c.accent },
		SnacksDashboardTitle = { fg = c.accent, bold = opts.bold },
		SnacksDashboardIcon = { fg = c.green },
		SnacksDashboardDesc = { fg = c.text },
		SnacksDashboardKey = { fg = c.yellow, bold = opts.bold },
		SnacksDashboardFile = { fg = c.text },
		SnacksDashboardDir = { fg = c.text_subtlest },
		SnacksDashboardSpecial = { fg = c.magenta },
		SnacksDashboardFooter = { fg = c.text_subtle, italic = opts.italic },
		SnacksDashboardTerminal = { link = "SnacksDashboardNormal" },

		SnacksPicker = { fg = c.text, bg = bg_panel },
		SnacksPickerBorder = { fg = c.border, bg = bg_panel },
		SnacksPickerTitle = { fg = c.accent, bg = bg_panel, bold = opts.bold },
		SnacksPickerFooter = { fg = c.text_subtle, bg = bg_panel },
		SnacksPickerBox = { link = "SnacksPicker" },
		SnacksPickerBoxBorder = { link = "SnacksPickerBorder" },
		SnacksPickerBoxTitle = { link = "SnacksPickerTitle" },
		SnacksPickerInput = { link = "SnacksPicker" },
		SnacksPickerInputBorder = { fg = c.accent, bg = bg_panel },
		SnacksPickerInputTitle = { link = "SnacksPickerTitle" },
		SnacksPickerInputSearch = { fg = c.magenta },
		SnacksPickerList = { link = "SnacksPicker" },
		SnacksPickerListBorder = { link = "SnacksPickerBorder" },
		SnacksPickerListTitle = { link = "SnacksPickerTitle" },
		SnacksPickerListCursorLine = { bg = c.selection },
		SnacksPickerPreview = { fg = c.text, bg = bg },
		SnacksPickerPreviewBorder = { link = "SnacksPickerBorder" },
		SnacksPickerPreviewTitle = { fg = c.green, bg = bg_panel, bold = opts.bold },
		SnacksPickerPreviewCursorLine = { link = "CursorLine" },
		SnacksPickerPrompt = { fg = c.accent },
		SnacksPickerMatch = { fg = c.accent, bold = opts.bold },
		SnacksPickerSearch = { link = "Search" },
		SnacksPickerSelected = { fg = c.magenta },
		SnacksPickerUnselected = { fg = c.text_subtlest },
		SnacksPickerTotals = { fg = c.text_subtlest },
		SnacksPickerSpinner = { fg = c.accent },
		SnacksPickerToggle = { fg = c.surface, bg = c.blue },
		SnacksPickerSpecial = { fg = c.magenta_bright },
		SnacksPickerLabel = { fg = c.magenta, bold = opts.bold },
		SnacksPickerFile = { fg = c.text },
		SnacksPickerDirectory = { fg = c.blue },
		SnacksPickerDir = { fg = c.text_subtlest },
		SnacksPickerPathHidden = { fg = c.text_subtlest },
		SnacksPickerPathIgnored = { fg = c.text_subtlest },
		SnacksPickerTree = { fg = c.border },
		SnacksPickerRow = { fg = c.yellow },
		SnacksPickerCol = { fg = c.text_subtlest },
		SnacksPickerComment = { link = "Comment" },
		SnacksPickerDesc = { fg = c.text_subtle },
		SnacksPickerGitStatusAdded = { fg = c.green },
		SnacksPickerGitStatusModified = { fg = c.blue },
		SnacksPickerGitStatusDeleted = { fg = c.red },
		SnacksPickerGitStatusRenamed = { fg = c.cyan },
		SnacksPickerGitStatusCopied = { fg = c.cyan },
		SnacksPickerGitStatusUntracked = { fg = c.yellow },
		SnacksPickerGitStatusIgnored = { fg = c.text_subtlest },
		SnacksPickerGitStatusUnmerged = { fg = c.red_bright },
		SnacksPickerGitStatusStaged = { fg = c.green_bright },

		SnacksNotifierHistory = { fg = c.text, bg = bg_panel },
		SnacksNotifierHistoryTitle = { fg = c.accent, bold = opts.bold },
		SnacksNotifierHistoryDateTime = { fg = c.text_subtlest },

		SnacksIndent = { fg = c.surface_nested },
		SnacksIndentBlank = { link = "SnacksIndent" },
		SnacksIndentScope = { fg = c.border },
		SnacksIndentChunk = { link = "SnacksIndentScope" },

		SnacksInputNormal = { fg = c.text, bg = bg_panel },
		SnacksInputBorder = { fg = c.accent, bg = bg_panel },
		SnacksInputTitle = { fg = c.accent, bg = bg_panel, bold = opts.bold },
		SnacksInputIcon = { fg = c.accent },
		SnacksInputPrompt = { link = "SnacksInputTitle" },

		SnacksDim = { fg = c.text_subtlest },
		SnacksZen = { link = "Normal" },
		SnacksScratchKey = { link = "SnacksWinKey" },
		SnacksScratchDesc = { link = "SnacksWinKeyDesc" },
	}

	local levels = { Error = c.red, Warn = c.yellow, Info = c.blue, Debug = c.text_subtlest, Trace = c.text_subtlest }
	for level, color in pairs(levels) do
		groups["SnacksNotifier" .. level] = { fg = c.text, bg = bg_panel }
		groups["SnacksNotifierIcon" .. level] = { fg = color }
		groups["SnacksNotifierTitle" .. level] = { fg = color, bold = opts.bold }
		groups["SnacksNotifierBorder" .. level] = { fg = color, bg = bg_panel }
		groups["SnacksNotifierFooter" .. level] = { fg = color }
	end

	return groups
end
