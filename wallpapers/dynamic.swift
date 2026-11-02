// Packs a light and a dark image into one HEIC that macOS switches with the appearance.
// Usage: swift wallpapers/dynamic.swift <light.png> <dark.png> <out.heic>

import Foundation
import ImageIO
import UniformTypeIdentifiers

/// Prints the message to stderr and exits with `status`.
func fail(_ message: String, status: Int32 = 1) -> Never {
  FileHandle.standardError.write(Data("dynamic.swift: \(message)\n".utf8))
  exit(status)
}

struct Appearance: Encodable {
  let l: Int
  let d: Int
}

func image(_ path: String) -> CGImage {
  guard
    let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else { fail("can't read \(path)") }
  return image
}

let arguments = CommandLine.arguments
guard arguments.count == 4 else { fail("usage: dynamic.swift <light.png> <dark.png> <out.heic>", status: 64) }

let encoder = PropertyListEncoder()
encoder.outputFormat = .binary
let appearance = try encoder.encode(Appearance(l: 0, d: 1)).base64EncodedString()

let metadata = CGImageMetadataCreateMutable()
let namespace = "http://ns.apple.com/namespace/1.0/" as CFString
guard
  CGImageMetadataRegisterNamespaceForPrefix(metadata, namespace, "apple_desktop" as CFString, nil),
  CGImageMetadataSetValueWithPath(metadata, nil, "apple_desktop:apr" as CFString, appearance as CFString)
else { fail("can't write the appearance metadata") }

guard
  let destination = CGImageDestinationCreateWithURL(
    URL(fileURLWithPath: arguments[3]) as CFURL, UTType.heic.identifier as CFString, 2, nil)
else { fail("can't create \(arguments[3])") }

let options = [kCGImageDestinationLossyCompressionQuality: 0.9] as CFDictionary
CGImageDestinationAddImageAndMetadata(destination, image(arguments[1]), metadata, options)
CGImageDestinationAddImage(destination, image(arguments[2]), options)
guard CGImageDestinationFinalize(destination) else { fail("can't write \(arguments[3])") }
