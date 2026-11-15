-- Bereghici Dark and Light. Generated from abereghici/themes; do not edit.
-- Each require builds fresh tables, so on_colors can change them without touching the next load.

---@class bereghici.Tints
---@field added string
---@field added_emphasis string
---@field added_strong string
---@field removed string
---@field removed_emphasis string
---@field removed_strong string
---@field changed string
---@field changed_emphasis string
---@field search string

---@class bereghici.Colors
---@field surface string Editor background
---@field surface_raised string Panels, sidebars, floats
---@field surface_nested string Popups, the active tab on a raised surface
---@field text string
---@field text_subtle string Punctuation, operators, inactive items
---@field text_subtlest string Comments, line numbers, ignored items
---@field line_highlight string The cursor line
---@field selection string The visual selection, with text on it
---@field border string
---@field accent string The brand moss: the cursor, focused borders, the prompt
---@field red string
---@field yellow string
---@field green string
---@field cyan string
---@field blue string
---@field magenta string
---@field red_bright string
---@field yellow_bright string
---@field green_bright string
---@field cyan_bright string
---@field blue_bright string
---@field magenta_bright string
---@field tints bereghici.Tints Opaque diff and search backgrounds
---@field ansi string[] ANSI 0–15

---@type table<"dark"|"light", bereghici.Colors>
local variants = {
	dark = {
		surface = "#12150f",
		surface_raised = "#181b14",
		surface_nested = "#1e221a",
		text = "#eeefe9",
		text_subtle = "#bbbeb6",
		text_subtlest = "#a2a69d",
		line_highlight = "#2e3229",
		selection = "#4b4f45",
		border = "#696d63",
		accent = "#a6d1b0",
		red = "#d37e6d",
		yellow = "#f5ac69",
		green = "#79b589",
		cyan = "#5daeb2",
		blue = "#74a3d1",
		magenta = "#bc8db1",
		red_bright = "#e99989",
		yellow_bright = "#fabc86",
		green_bright = "#a6d1b0",
		cyan_bright = "#87c8cb",
		blue_bright = "#97bfe6",
		magenta_bright = "#d4acca",
		tints = {
			added = "#082f16",
			added_emphasis = "#0e4624",
			added_strong = "#155f32",
			removed = "#45140c",
			removed_emphasis = "#632419",
			removed_strong = "#833426",
			changed = "#0a2842",
			changed_emphasis = "#153d5f",
			search = "#413523",
		},
		ansi = { "#1e221a", "#d37e6d", "#79b589", "#f5ac69", "#74a3d1", "#bc8db1", "#5daeb2", "#bbbeb6", "#a2a69d", "#e99989", "#a6d1b0", "#fabc86", "#97bfe6", "#d4acca", "#87c8cb", "#eeefe9", },
	},
	light = {
		surface = "#f3f5ee",
		surface_raised = "#eaebe3",
		surface_nested = "#e1e3dc",
		text = "#171914",
		text_subtle = "#3e413b",
		text_subtlest = "#535750",
		line_highlight = "#e1e3dc",
		selection = "#c1c3bc",
		border = "#858680",
		accent = "#263316",
		red = "#a84837",
		yellow = "#925613",
		green = "#1f7c44",
		cyan = "#007a80",
		blue = "#2f6da4",
		magenta = "#8b537f",
		red_bright = "#833426",
		yellow_bright = "#6b3c03",
		green_bright = "#155f32",
		cyan_bright = "#005e63",
		blue_bright = "#20537f",
		magenta_bright = "#6b3e62",
		tints = {
			added = "#d3e1d1",
			added_emphasis = "#b3ceb5",
			added_strong = "#93ba9a",
			removed = "#ead9cf",
			removed_emphasis = "#dfbdb1",
			removed_strong = "#d4a294",
			changed = "#d3dfe3",
			changed_emphasis = "#b4c9d8",
			search = "#ddcebb",
		},
		ansi = { "#e1e3dc", "#a84837", "#1f7c44", "#925613", "#2f6da4", "#8b537f", "#007a80", "#3e413b", "#535750", "#833426", "#155f32", "#6b3c03", "#20537f", "#6b3e62", "#005e63", "#171914", },
	},
}

return vim.o.background == "light" and variants.light or variants.dark
