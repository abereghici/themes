# Bereghici Wallpapers

Dynamic macOS wallpapers in the Bereghici palette. Each `.heic` holds a light and a dark image, and macOS shows the one that matches the appearance, the way it does with its own dynamic wallpapers.

| Wallpaper                                | Light                             | Dark                             |
| ---------------------------------------- | --------------------------------- | -------------------------------- |
| [Strata](bereghici-strata.heic)          | ![](previews/strata-light.jpg)    | ![](previews/strata-dark.jpg)    |
| [Stâlpul cerului](bereghici-pillar.heic) | ![](previews/pillar-light.jpg)    | ![](previews/pillar-dark.jpg)    |
| [Ridges](bereghici-ridges.heic)          | ![](previews/ridges-light.jpg)    | ![](previews/ridges-dark.jpg)    |
| [Overcast](bereghici-overcast.heic)      | ![](previews/overcast-light.jpg)  | ![](previews/overcast-dark.jpg)  |
| [Honeycomb](bereghici-honeycomb.heic)    | ![](previews/honeycomb-light.jpg) | ![](previews/honeycomb-dark.jpg) |
| [Contours](bereghici-contours.heic)      | ![](previews/contours-light.jpg)  | ![](previews/contours-dark.jpg)  |
| [Lake](bereghici-lake.heic)              | ![](previews/lake-light.jpg)      | ![](previews/lake-dark.jpg)      |

Strata keeps every band close to one lightness, so text stays readable over it in a translucent terminal.

## Usage

Open **System Settings → Wallpaper → Add Folder or Album → Choose Folder…**, pick this folder, choose a wallpaper and set it to **Automatic**. Or from a terminal:

```sh
osascript -e 'tell application "System Events" to tell every desktop to set picture to POSIX file "'"$PWD"'/bereghici-strata.heic"'
```

## How they're made

The wallpapers are designed in Claude Design and exported as PNGs at 6016 × 3888, 6K at a 16:10.3 aspect ratio, so macOS only scales them down. [`dynamic.swift`](dynamic.swift) packs each pair into one HEIC with ImageIO, and marks it with the `apple_desktop:apr` XMP property macOS reads: a binary property list `{l: 0, d: 1}`, the index of the light and the dark image.

```sh
swift wallpapers/dynamic.swift strata-light.png strata-dark.png wallpapers/bereghici-strata.heic
```

The previews are the same PNGs at 800 pixels wide:

```sh
sips -s format jpeg -s formatOptions 82 --resampleWidth 800 strata-light.png --out wallpapers/previews/strata-light.jpg
```
