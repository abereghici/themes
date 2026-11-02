-- Every capture in :h treesitter-highlight-groups. Most link to a legacy group so languages
-- without a parser look the same; the ones the legacy groups can't express get their own.

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	return {
		["@variable"] = { fg = c.text },
		["@variable.builtin"] = { fg = c.magenta, italic = opts.italic },
		["@variable.parameter"] = { fg = c.magenta_bright },
		["@variable.parameter.builtin"] = { fg = c.magenta_bright },
		["@variable.member"] = { fg = c.blue },

		["@constant"] = { link = "Constant" },
		["@constant.builtin"] = { link = "Constant" },
		["@constant.macro"] = { link = "Constant" },

		["@module"] = { fg = c.cyan },
		["@module.builtin"] = { fg = c.cyan },
		["@label"] = { link = "Label" },

		["@string"] = { link = "String" },
		["@string.documentation"] = { fg = c.yellow },
		["@string.regexp"] = { fg = c.yellow_bright },
		["@string.escape"] = { fg = c.cyan },
		["@string.special"] = { fg = c.yellow_bright },
		["@string.special.symbol"] = { fg = c.cyan_bright },
		["@string.special.path"] = { fg = c.yellow, underline = true },
		["@string.special.url"] = { fg = c.magenta, underline = true },

		["@character"] = { link = "Character" },
		["@character.special"] = { link = "SpecialChar" },

		["@boolean"] = { link = "Boolean" },
		["@number"] = { link = "Number" },
		["@number.float"] = { link = "Float" },

		["@type"] = { link = "Type" },
		["@type.builtin"] = { link = "Type" },
		["@type.definition"] = { link = "Type" },

		["@attribute"] = { fg = c.green },
		["@attribute.builtin"] = { fg = c.green },
		["@property"] = { fg = c.blue },

		["@function"] = { link = "Function" },
		["@function.builtin"] = { fg = c.green_bright },
		["@function.call"] = { link = "Function" },
		["@function.macro"] = { fg = c.green },
		["@function.method"] = { link = "Function" },
		["@function.method.call"] = { link = "Function" },
		["@constructor"] = { fg = c.cyan },
		["@operator"] = { link = "Operator" },

		["@keyword"] = { link = "Keyword" },
		["@keyword.coroutine"] = { fg = c.magenta, italic = opts.italic },
		["@keyword.function"] = { link = "Keyword" },
		["@keyword.operator"] = { link = "Keyword" },
		["@keyword.import"] = { link = "Include" },
		["@keyword.type"] = { link = "Keyword" },
		["@keyword.modifier"] = { link = "Keyword" },
		["@keyword.repeat"] = { link = "Repeat" },
		["@keyword.return"] = { link = "Exception" },
		["@keyword.debug"] = { link = "Debug" },
		["@keyword.exception"] = { link = "Exception" },
		["@keyword.conditional"] = { link = "Conditional" },
		["@keyword.conditional.ternary"] = { link = "Operator" },
		["@keyword.directive"] = { link = "PreProc" },
		["@keyword.directive.define"] = { link = "Define" },

		["@punctuation.delimiter"] = { link = "Delimiter" },
		["@punctuation.bracket"] = { fg = c.text_subtle },
		["@punctuation.special"] = { fg = c.magenta_bright },

		["@comment"] = { link = "Comment" },
		["@comment.documentation"] = { link = "Comment" },
		["@comment.error"] = { fg = c.surface, bg = c.red, bold = opts.bold },
		["@comment.warning"] = { fg = c.surface, bg = c.yellow, bold = opts.bold },
		["@comment.todo"] = { fg = c.surface, bg = c.magenta, bold = opts.bold },
		["@comment.note"] = { fg = c.surface, bg = c.blue, bold = opts.bold },

		["@markup.strong"] = { bold = true },
		["@markup.italic"] = { italic = true },
		["@markup.strikethrough"] = { strikethrough = true },
		["@markup.underline"] = { underline = true },
		["@markup.heading"] = { fg = c.blue, bold = opts.bold },
		["@markup.quote"] = { fg = c.text_subtle, italic = opts.italic },
		["@markup.math"] = { fg = c.cyan_bright },
		["@markup.link"] = { fg = c.magenta },
		["@markup.link.label"] = { fg = c.magenta, underline = true },
		["@markup.link.url"] = { fg = c.magenta_bright, underline = true },
		["@markup.raw"] = { fg = c.cyan },
		["@markup.raw.block"] = { fg = c.text },
		["@markup.list"] = { fg = c.cyan },
		["@markup.list.checked"] = { fg = c.green },
		["@markup.list.unchecked"] = { fg = c.text_subtle },

		["@diff.plus"] = { link = "Added" },
		["@diff.minus"] = { link = "Removed" },
		["@diff.delta"] = { link = "Changed" },

		["@tag"] = { link = "Tag" },
		["@tag.builtin"] = { link = "Tag" },
		-- JSX captures components as @tag and elements as @tag.builtin, which falls back past these
		["@tag.javascript"] = { fg = c.cyan },
		["@tag.tsx"] = { fg = c.cyan },
		["@tag.attribute"] = { fg = c.blue },
		["@tag.delimiter"] = { fg = c.text_subtle },

		["@none"] = {},
		["@conceal"] = { link = "Conceal" },
		["@spell"] = {},
		["@nospell"] = {},
	}
end
