-- render-markdown.nvim and CopilotChat, which renders its chat as markdown

local mix = require("bereghici.color").mix

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local groups = {
		RenderMarkdownCode = { bg = c.surface_raised },
		RenderMarkdownCodeBorder = { bg = c.surface_nested },
		RenderMarkdownCodeInfo = { fg = c.text_subtle },
		RenderMarkdownCodeInline = { fg = c.cyan, bg = c.surface_raised },
		RenderMarkdownInlineHighlight = { link = "Search" },
		RenderMarkdownBullet = { fg = c.text_subtle },
		RenderMarkdownDash = { fg = c.border },
		RenderMarkdownQuote = { fg = c.text_subtle },
		RenderMarkdownLink = { fg = c.magenta },
		RenderMarkdownWikiLink = { fg = c.magenta },
		RenderMarkdownChecked = { fg = c.green },
		RenderMarkdownUnchecked = { fg = c.text_subtle },
		RenderMarkdownTodo = { fg = c.magenta },
		RenderMarkdownTableHead = { fg = c.border },
		RenderMarkdownTableRow = { fg = c.border },
		RenderMarkdownMath = { link = "@markup.math" },
		RenderMarkdownSign = { link = "SignColumn" },
		RenderMarkdownSuccess = { fg = c.green },
		RenderMarkdownInfo = { fg = c.blue },
		RenderMarkdownHint = { fg = c.magenta },
		RenderMarkdownWarn = { fg = c.yellow },
		RenderMarkdownError = { fg = c.red },
		RenderMarkdownHtmlComment = { link = "Comment" },

		CopilotChatHeader = { fg = c.accent, bold = opts.bold },
		CopilotChatSeparator = { fg = c.border },
		CopilotChatStatus = { fg = c.text_subtlest },
		CopilotChatHelp = { fg = c.text_subtlest, italic = opts.italic },
		CopilotChatSelection = { link = "Visual" },
		CopilotChatAnnotation = { fg = c.text_subtlest },
		CopilotChatAnnotationHeader = { fg = c.blue },
		CopilotChatModels = { fg = c.cyan },
	}

	-- Every heading level is blue, as in the other editors, on a faint band of it
	for level = 1, 6 do
		groups["RenderMarkdownH" .. level] = { fg = c.blue, bold = opts.bold }
		groups["RenderMarkdownH" .. level .. "Bg"] = { bg = mix(c.blue, c.surface, 0.12) }
	end

	return groups
end
