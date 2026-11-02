-- gitsigns.nvim

---@param c bereghici.Colors
---@param opts bereghici.Config
---@return bereghici.Highlights
return function(c, opts)
	return {
		GitSignsAdd = { fg = c.green },
		GitSignsChange = { fg = c.blue },
		GitSignsDelete = { fg = c.red },
		GitSignsTopdelete = { link = "GitSignsDelete" },
		GitSignsChangedelete = { fg = c.yellow },
		GitSignsUntracked = { fg = c.text_subtlest },
		GitSignsAddNr = { link = "GitSignsAdd" },
		GitSignsChangeNr = { link = "GitSignsChange" },
		GitSignsDeleteNr = { link = "GitSignsDelete" },
		GitSignsAddLn = { link = "DiffAdd" },
		GitSignsChangeLn = { link = "DiffChange" },
		GitSignsDeleteLn = { link = "DiffDelete" },
		GitSignsAddInline = { bg = c.tints.added_strong },
		GitSignsChangeInline = { bg = c.tints.changed_emphasis },
		GitSignsDeleteInline = { bg = c.tints.removed_strong },
		GitSignsAddPreview = { link = "DiffAdd" },
		GitSignsDeletePreview = { link = "DiffDelete" },
		GitSignsDeleteVirtLn = { link = "DiffDelete" },
		GitSignsStagedAdd = { fg = c.tints.added_strong },
		GitSignsStagedChange = { fg = c.tints.changed_emphasis },
		GitSignsStagedDelete = { fg = c.tints.removed_strong },
		GitSignsCurrentLineBlame = { fg = c.text_subtlest, italic = opts.italic },
	}
end
