local M = {}

---@alias bereghici.Highlights table<string, vim.api.keyset.highlight>

---@class bereghici.Options
---@field transparent? boolean Leave Normal, floats and sidebars without a background, so the terminal's shows through
---@field dim_inactive? boolean Give windows without focus a dimmer look
---@field italic? boolean Italicize comments and control-flow keywords
---@field bold? boolean Embolden headings, titles, the current line number and the active mode
---@field on_colors? fun(colors: bereghici.Colors) Change the palette before the groups are built from it
---@field on_highlights? fun(highlights: bereghici.Highlights, colors: bereghici.Colors) Change or add groups before they are set

---@class bereghici.Config: bereghici.Options
---@field transparent boolean
---@field dim_inactive boolean
---@field italic boolean
---@field bold boolean
---@field on_colors fun(colors: bereghici.Colors)
---@field on_highlights fun(highlights: bereghici.Highlights, colors: bereghici.Colors)

---@type bereghici.Config
M.defaults = {
	transparent = false,
	dim_inactive = false,
	italic = true,
	bold = true,
	on_colors = function() end,
	on_highlights = function() end,
}

---@type bereghici.Config
M.options = vim.deepcopy(M.defaults)

---@param opts? bereghici.Options
function M.extend(opts)
	M.options = vim.tbl_deep_extend("force", vim.deepcopy(M.defaults), opts or {})
end

return M
