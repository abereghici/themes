-- nvim-dap, nvim-dap-ui, nvim-dap-virtual-text and neotest

local mix = require("bereghici.color").mix

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local bg_panel = opts.transparent and "NONE" or c.surface_raised

	return {
		DapBreakpoint = { fg = c.red },
		DapBreakpointCondition = { fg = c.yellow },
		DapBreakpointRejected = { fg = c.text_subtlest },
		DapLogPoint = { fg = c.blue },
		DapStopped = { fg = c.green },
		DapStoppedLine = { bg = mix(c.green, c.surface, 0.14) },

		DapUINormal = { fg = c.text, bg = bg_panel },
		DapUIEndOfBuffer = { fg = bg_panel == "NONE" and c.surface_nested or c.surface_raised },
		DapUIScope = { fg = c.accent, bold = opts.bold },
		DapUIType = { fg = c.cyan },
		DapUIValue = { fg = c.text },
		DapUIVariable = { fg = c.text },
		DapUIModifiedValue = { fg = c.yellow, bold = opts.bold },
		DapUIDecoration = { fg = c.border },
		DapUIThread = { fg = c.green },
		DapUIStoppedThread = { fg = c.cyan },
		DapUIFrameName = { fg = c.text },
		DapUICurrentFrameName = { fg = c.accent, bold = opts.bold },
		DapUISource = { fg = c.blue },
		DapUILineNumber = { fg = c.text_subtlest },
		DapUIFloatBorder = { link = "FloatBorder" },
		DapUIWatchesEmpty = { fg = c.text_subtlest },
		DapUIWatchesValue = { fg = c.green },
		DapUIWatchesError = { fg = c.red },
		DapUIBreakpointsPath = { fg = c.blue },
		DapUIBreakpointsInfo = { fg = c.green },
		DapUIBreakpointsLine = { fg = c.text_subtlest },
		DapUIBreakpointsCurrentLine = { fg = c.accent, bold = opts.bold },
		DapUIBreakpointsDisabledLine = { fg = c.text_subtlest },
		DapUIWinSelect = { fg = c.accent, bold = opts.bold },
		DapUIPlayPause = { fg = c.green },
		DapUIRestart = { fg = c.green },
		DapUIStop = { fg = c.red },
		DapUIUnavailable = { fg = c.text_subtlest },
		DapUIStepOver = { fg = c.blue },
		DapUIStepInto = { fg = c.blue },
		DapUIStepBack = { fg = c.blue },
		DapUIStepOut = { fg = c.blue },
		DapUIPlayPauseNC = { link = "DapUIPlayPause" },
		DapUIRestartNC = { link = "DapUIRestart" },
		DapUIStopNC = { link = "DapUIStop" },
		DapUIUnavailableNC = { link = "DapUIUnavailable" },
		DapUIStepOverNC = { link = "DapUIStepOver" },
		DapUIStepIntoNC = { link = "DapUIStepInto" },
		DapUIStepBackNC = { link = "DapUIStepBack" },
		DapUIStepOutNC = { link = "DapUIStepOut" },

		NvimDapVirtualText = { fg = c.text_subtlest, italic = opts.italic },
		NvimDapVirtualTextChanged = { fg = c.yellow, italic = opts.italic },
		NvimDapVirtualTextError = { fg = c.red },
		NvimDapVirtualTextInfo = { fg = c.blue },

		NeotestPassed = { fg = c.green },
		NeotestFailed = { fg = c.red },
		NeotestRunning = { fg = c.yellow },
		NeotestSkipped = { fg = c.text_subtlest },
		NeotestUnknown = { fg = c.text_subtle },
		NeotestWatching = { fg = c.cyan },
		NeotestAdapterName = { fg = c.magenta, bold = opts.bold },
		NeotestNamespace = { fg = c.cyan },
		NeotestDir = { fg = c.blue },
		NeotestFile = { fg = c.blue },
		NeotestTest = { fg = c.text },
		NeotestFocused = { bold = opts.bold, underline = true },
		NeotestMarked = { fg = c.accent, bold = opts.bold },
		NeotestTarget = { fg = c.red },
		NeotestIndent = { fg = c.surface_nested },
		NeotestExpandMarker = { fg = c.text_subtlest },
		NeotestBorder = { link = "FloatBorder" },
		NeotestWinSelect = { fg = c.accent, bold = opts.bold },
	}
end
