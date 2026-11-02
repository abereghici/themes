-- Windows and overlays: bufferline, which-key, noice, nvim-notify, trouble, flash, mini,
-- todo-comments, treesitter-context, lazy.nvim and mason

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local bg = opts.transparent and "NONE" or c.surface
	local bg_panel = opts.transparent and "NONE" or c.surface_raised

	local groups = {
		-- bufferline derives the rest from TabLine and Normal
		BufferLineFill = { bg = bg_panel },
		BufferLineIndicatorSelected = { fg = c.accent, bg = bg },

		WhichKey = { fg = c.accent },
		WhichKeyGroup = { fg = c.blue },
		WhichKeyDesc = { fg = c.text },
		WhichKeySeparator = { fg = c.text_subtlest },
		WhichKeyValue = { fg = c.text_subtlest },
		WhichKeyIcon = { fg = c.cyan },
		WhichKeyNormal = { link = "NormalFloat" },
		WhichKeyBorder = { link = "FloatBorder" },
		WhichKeyTitle = { link = "FloatTitle" },

		NoiceCmdline = { fg = c.text },
		NoiceCmdlineIcon = { fg = c.accent },
		NoiceCmdlinePrompt = { fg = c.accent },
		NoiceCmdlinePopup = { fg = c.text, bg = bg_panel },
		NoiceCmdlinePopupBorder = { fg = c.accent, bg = bg_panel },
		NoiceCmdlinePopupTitle = { fg = c.accent, bg = bg_panel },
		NoiceCmdlineIconSearch = { fg = c.yellow },
		NoiceCmdlinePopupBorderSearch = { fg = c.yellow, bg = bg_panel },
		NoiceConfirm = { link = "NormalFloat" },
		NoiceConfirmBorder = { fg = c.accent, bg = bg_panel },
		NoicePopup = { link = "NormalFloat" },
		NoicePopupBorder = { link = "FloatBorder" },
		NoicePopupmenu = { link = "Pmenu" },
		NoicePopupmenuBorder = { fg = c.border, bg = c.surface_raised },
		NoicePopupmenuMatch = { link = "PmenuMatch" },
		NoicePopupmenuSelected = { link = "PmenuSel" },
		NoiceMini = { fg = c.text_subtle, bg = bg_panel },
		NoiceLspProgressTitle = { fg = c.text_subtlest },
		NoiceLspProgressClient = { fg = c.blue },
		NoiceLspProgressSpinner = { fg = c.accent },
		NoiceFormatProgressDone = { fg = c.surface, bg = c.green },
		NoiceFormatProgressTodo = { fg = c.text, bg = c.surface_nested },
		NoiceVirtualText = { fg = c.text_subtlest },

		-- nvim-notify blends its fade animation into this, so it needs a color even when transparent
		NotifyBackground = { bg = c.surface },

		TroubleNormal = { fg = c.text, bg = bg_panel },
		TroubleNormalNC = { link = "TroubleNormal" },
		TroubleText = { fg = c.text },
		TroubleCount = { fg = c.magenta, bg = c.surface_nested },
		TroubleCode = { fg = c.text_subtlest },
		TroubleSource = { fg = c.text_subtlest },
		TroubleFilename = { fg = c.blue },
		TroubleDirectory = { fg = c.blue },
		TroubleIconDirectory = { fg = c.blue },
		TroublePos = { fg = c.text_subtlest },
		TroubleIndent = { fg = c.surface_nested },
		TroublePreview = { link = "Visual" },

		FlashBackdrop = { fg = c.text_subtlest },
		FlashMatch = { fg = c.text, bg = c.tints.search },
		FlashCurrent = { fg = c.surface, bg = c.yellow },
		FlashLabel = { fg = c.surface, bg = c.magenta, bold = opts.bold },
		FlashPrompt = { link = "NormalFloat" },
		FlashPromptIcon = { fg = c.accent },
		FlashCursor = { link = "Cursor" },

		MiniIconsAzure = { fg = c.blue_bright },
		MiniIconsBlue = { fg = c.blue },
		MiniIconsCyan = { fg = c.cyan },
		MiniIconsGreen = { fg = c.green },
		MiniIconsGrey = { fg = c.text_subtle },
		MiniIconsOrange = { fg = c.yellow_bright },
		MiniIconsPurple = { fg = c.magenta },
		MiniIconsRed = { fg = c.red },
		MiniIconsYellow = { fg = c.yellow },

		MiniStatuslineModeNormal = { fg = c.surface, bg = c.accent, bold = opts.bold },
		MiniStatuslineModeInsert = { fg = c.surface, bg = c.green, bold = opts.bold },
		MiniStatuslineModeVisual = { fg = c.surface, bg = c.magenta, bold = opts.bold },
		MiniStatuslineModeReplace = { fg = c.surface, bg = c.red, bold = opts.bold },
		MiniStatuslineModeCommand = { fg = c.surface, bg = c.yellow, bold = opts.bold },
		MiniStatuslineModeOther = { fg = c.surface, bg = c.cyan, bold = opts.bold },
		MiniStatuslineDevinfo = { fg = c.text_subtle, bg = c.surface_nested },
		MiniStatuslineFileinfo = { link = "MiniStatuslineDevinfo" },
		MiniStatuslineFilename = { fg = c.text, bg = opts.transparent and "NONE" or c.surface_raised },
		MiniStatuslineInactive = { link = "StatusLineNC" },
		MiniTablineCurrent = { fg = c.text, bg = c.surface_nested, bold = opts.bold },
		MiniTablineVisible = { fg = c.text_subtle, bg = c.surface_raised },
		MiniTablineHidden = { fg = c.text_subtlest, bg = c.surface_raised },
		MiniTablineModifiedCurrent = { fg = c.yellow, bg = c.surface_nested, bold = opts.bold },
		MiniTablineModifiedVisible = { fg = c.yellow, bg = c.surface_raised },
		MiniTablineModifiedHidden = { fg = c.yellow, bg = c.surface_raised },
		MiniTablineFill = { link = "TabLineFill" },
		MiniTablineTabpagesection = { fg = c.surface, bg = c.accent },

		TreesitterContext = { bg = c.surface_raised },
		TreesitterContextLineNumber = { fg = c.text_subtle, bg = c.surface_raised },
		TreesitterContextBottom = { underline = true, sp = c.border },
		TreesitterContextSeparator = { fg = c.border },

		LazyNormal = { link = "NormalFloat" },
		LazyH1 = { fg = c.surface, bg = c.accent, bold = opts.bold },
		LazyH2 = { fg = c.accent, bold = opts.bold },
		LazyButton = { fg = c.text, bg = c.surface_nested },
		LazyButtonActive = { fg = c.surface, bg = c.accent, bold = opts.bold },
		LazySpecial = { fg = c.magenta },
		LazyProp = { fg = c.blue },
		LazyValue = { fg = c.yellow },
		LazyDimmed = { fg = c.text_subtlest },
		LazyComment = { link = "Comment" },
		LazyProgressDone = { fg = c.accent },
		LazyProgressTodo = { fg = c.surface_nested },
		LazyReasonPlugin = { fg = c.green },
		LazyReasonEvent = { fg = c.yellow },
		LazyReasonKeys = { fg = c.cyan },
		LazyReasonCmd = { fg = c.magenta },
		LazyReasonFt = { fg = c.blue },
		LazyReasonStart = { fg = c.text },
		LazyReasonSource = { fg = c.cyan_bright },
		LazyReasonImport = { fg = c.text_subtle },

		MasonNormal = { link = "NormalFloat" },
		MasonHeader = { fg = c.surface, bg = c.accent, bold = opts.bold },
		MasonHeaderSecondary = { fg = c.surface, bg = c.blue, bold = opts.bold },
		MasonHighlight = { fg = c.accent },
		MasonHighlightSecondary = { fg = c.blue },
		MasonHighlightBlock = { fg = c.surface, bg = c.accent },
		MasonHighlightBlockBold = { fg = c.surface, bg = c.accent, bold = opts.bold },
		MasonHighlightBlockSecondary = { fg = c.surface, bg = c.blue },
		MasonHighlightBlockBoldSecondary = { fg = c.surface, bg = c.blue, bold = opts.bold },
		MasonMuted = { fg = c.text_subtlest },
		MasonMutedBlock = { fg = c.text_subtle, bg = c.surface_nested },
		MasonMutedBlockBold = { fg = c.text_subtle, bg = c.surface_nested, bold = opts.bold },
		MasonHeading = { fg = c.text, bold = opts.bold },
		MasonError = { fg = c.red },
		MasonWarning = { fg = c.yellow },
	}

	local levels = { ERROR = c.red, WARN = c.yellow, INFO = c.blue, DEBUG = c.text_subtlest, TRACE = c.magenta }
	for level, color in pairs(levels) do
		groups["Notify" .. level .. "Border"] = { fg = color, bg = bg_panel }
		groups["Notify" .. level .. "Icon"] = { fg = color }
		groups["Notify" .. level .. "Title"] = { fg = color, bold = opts.bold }
		groups["Notify" .. level .. "Body"] = { fg = c.text, bg = bg_panel }
	end

	local todos = {
		FIX = c.red,
		TODO = c.magenta,
		HACK = c.yellow,
		WARN = c.yellow,
		PERF = c.cyan,
		NOTE = c.blue,
		TEST = c.green,
	}
	for keyword, color in pairs(todos) do
		groups["TodoBg" .. keyword] = { fg = c.surface, bg = color, bold = opts.bold }
		groups["TodoFg" .. keyword] = { fg = color }
		groups["TodoSign" .. keyword] = { fg = color }
	end

	return groups
end
