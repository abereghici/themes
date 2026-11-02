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
		text_subtle = "#a2a69d",
		text_subtlest = "#858a81",
		line_highlight = "#1e221a",
		selection = "#4b4f45",
		border = "#696d63",
		accent = "#eceac9",
		red = "#e99989",
		yellow = "#fabc86",
		green = "#a6d1b0",
		cyan = "#87c8cb",
		blue = "#97bfe6",
		magenta = "#d4acca",
		red_bright = "#ffbfb2",
		yellow_bright = "#ffd8ac",
		green_bright = "#c9e7d0",
		cyan_bright = "#b3e2e4",
		blue_bright = "#bedbf8",
		magenta_bright = "#ebcde3",
		tints = {
			added = "#262e25",
			added_emphasis = "#3c4a3c",
			added_strong = "#536755",
			removed = "#2f2820",
			removed_emphasis = "#4f3b32",
			removed_strong = "#705045",
			changed = "#242c2c",
			changed_emphasis = "#38454b",
			search = "#423828",
		},
		ansi = { "#1e221a", "#e99989", "#a6d1b0", "#fabc86", "#97bfe6", "#d4acca", "#87c8cb", "#a2a69d", "#858a81", "#ffbfb2", "#c9e7d0", "#ffd8ac", "#bedbf8", "#ebcde3", "#b3e2e4", "#eeefe9", },
	},
	light = {
		surface = "#f3f5ee",
		surface_raised = "#eaebe3",
		surface_nested = "#e1e3dc",
		text = "#2e3229",
		text_subtle = "#535750",
		text_subtlest = "#686a64",
		line_highlight = "#eaebe3",
		selection = "#c1c3bc",
		border = "#a3a49e",
		accent = "#263316",
		red = "#a84837",
		yellow = "#c3720f",
		green = "#1f7c44",
		cyan = "#007a80",
		blue = "#2f6da4",
		magenta = "#8b537f",
		red_bright = "#833426",
		yellow_bright = "#925613",
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
			search = "#ead6bf",
		},
		ansi = { "#e1e3dc", "#a84837", "#1f7c44", "#c3720f", "#2f6da4", "#8b537f", "#007a80", "#535750", "#686a64", "#833426", "#155f32", "#925613", "#20537f", "#6b3e62", "#005e63", "#2e3229", },
	},
}

return vim.o.background == "light" and variants.light or variants.dark
