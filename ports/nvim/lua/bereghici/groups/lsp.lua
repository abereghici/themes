---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	local severities = {
		Error = c.red,
		Warn = c.yellow,
		Info = c.blue,
		Hint = c.magenta,
		Ok = c.green,
	}
	-- Virtual text sits on its severity's diff/search tint; magenta has none, so hints go without
	local tints = {
		Error = c.tints.removed,
		Warn = c.tints.search,
		Info = c.tints.changed,
		Ok = c.tints.added,
	}
	-- Light yellow on the search tint falls short of 4.5:1; its brighter step holds it in both
	local virtual_fg = { Warn = c.yellow_bright }

	local groups = {
		DiagnosticUnnecessary = { fg = c.text_subtlest },
		DiagnosticDeprecated = { strikethrough = true, sp = c.text_subtle },

		LspReferenceText = { bg = c.selection },
		LspReferenceRead = { link = "LspReferenceText" },
		LspReferenceWrite = { bg = c.selection, underline = true, sp = c.border },
		LspReferenceTarget = { link = "LspReferenceText" },
		LspInlayHint = { fg = c.text_subtlest, bg = opts.transparent and "NONE" or c.surface_raised },
		LspCodeLens = { fg = c.text_subtlest },
		LspCodeLensSeparator = { fg = c.border },
		LspSignatureActiveParameter = { fg = c.accent, bold = opts.bold, underline = true },
		LspInfoBorder = { link = "FloatBorder" },

		-- Semantic tokens: types map onto the Tree-sitter captures so both agree
		["@lsp.type.class"] = { link = "@type" },
		["@lsp.type.comment"] = { link = "@comment" },
		["@lsp.type.decorator"] = { link = "@attribute" },
		["@lsp.type.enum"] = { link = "@type" },
		["@lsp.type.enumMember"] = { link = "@constant" },
		["@lsp.type.event"] = { link = "@type" },
		["@lsp.type.function"] = { link = "@function" },
		["@lsp.type.interface"] = { link = "@type" },
		["@lsp.type.keyword"] = { link = "@keyword" },
		["@lsp.type.macro"] = { link = "@function.macro" },
		["@lsp.type.method"] = { link = "@function.method" },
		["@lsp.type.modifier"] = { link = "@keyword.modifier" },
		["@lsp.type.namespace"] = { link = "@module" },
		["@lsp.type.number"] = { link = "@number" },
		["@lsp.type.operator"] = { link = "@operator" },
		["@lsp.type.parameter"] = { link = "@variable.parameter" },
		["@lsp.type.property"] = { link = "@property" },
		["@lsp.type.regexp"] = { link = "@string.regexp" },
		["@lsp.type.string"] = { link = "@string" },
		["@lsp.type.struct"] = { link = "@type" },
		["@lsp.type.type"] = { link = "@type" },
		["@lsp.type.typeParameter"] = { link = "@type.definition" },
		["@lsp.type.variable"] = {},
		["@lsp.type.builtinType"] = { link = "@type.builtin" },
		["@lsp.type.selfKeyword"] = { link = "@variable.builtin" },
		["@lsp.type.selfParameter"] = { link = "@variable.builtin" },
		["@lsp.type.lifetime"] = { link = "@keyword.modifier" },
		["@lsp.type.formatSpecifier"] = { link = "@string.escape" },
		["@lsp.type.escapeSequence"] = { link = "@string.escape" },
		["@lsp.type.unresolvedReference"] = { undercurl = true, sp = c.red },
		["@lsp.mod.deprecated"] = { link = "DiagnosticDeprecated" },
		["@lsp.mod.defaultLibrary"] = {},
		["@lsp.mod.documentation"] = {},
		["@lsp.typemod.function.defaultLibrary"] = { link = "@function.builtin" },
		["@lsp.typemod.method.defaultLibrary"] = { link = "@function.builtin" },
		["@lsp.typemod.variable.defaultLibrary"] = { link = "@variable.builtin" },
		["@lsp.typemod.variable.global"] = { link = "@constant" },
		["@lsp.typemod.variable.static"] = { link = "@constant" },
		["@lsp.typemod.variable.readonly"] = { link = "@constant" },
		["@lsp.typemod.variable.injected"] = { link = "@variable" },
		["@lsp.typemod.string.injected"] = { link = "@string" },
		["@lsp.typemod.keyword.async"] = { link = "@keyword.coroutine" },
		["@lsp.typemod.keyword.injected"] = { link = "@keyword" },
		["@lsp.typemod.operator.injected"] = { link = "@operator" },
	}

	for severity, color in pairs(severities) do
		groups["Diagnostic" .. severity] = { fg = color }
		groups["DiagnosticVirtualText" .. severity] = {
			fg = virtual_fg[severity] or color,
			bg = (opts.transparent or not tints[severity]) and "NONE" or tints[severity],
		}
		groups["DiagnosticVirtualLines" .. severity] = { fg = color }
		groups["DiagnosticUnderline" .. severity] = { undercurl = true, sp = color }
		groups["DiagnosticSign" .. severity] = { fg = color }
		groups["DiagnosticFloating" .. severity] = { fg = color }
	end

	return groups
end
