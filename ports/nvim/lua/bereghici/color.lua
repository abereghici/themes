local M = {}

---@param hex string
---@return integer, integer, integer
local function channels(hex)
	return tonumber(hex:sub(2, 3), 16), tonumber(hex:sub(4, 5), 16), tonumber(hex:sub(6, 7), 16)
end

---Mix `fg` over `bg`, for tinted backgrounds the palette has no tint for.
---@param fg string
---@param bg string
---@param amount number 0 gives `bg`, 1 gives `fg`
---@return string
function M.mix(fg, bg, amount)
	local fr, fg_, fb = channels(fg)
	local br, bg_, bb = channels(bg)
	local function blend(a, b)
		return math.floor(a * amount + b * (1 - amount) + 0.5)
	end
	return string.format("#%02x%02x%02x", blend(fr, br), blend(fg_, bg_), blend(fb, bb))
end

return M
