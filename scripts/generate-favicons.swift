import AppKit
import CoreText

enum FaviconError: Error {
  case fontUnavailable
  case glyphUnavailable
  case contextUnavailable
  case imageUnavailable
  case pngUnavailable
}

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let assetDirectory = root
  .appendingPathComponent("public/assets/cdn.prod.website-files.com/6645320034faa83b10ba9f58")
let fontURL = assetDirectory.appendingPathComponent("66fe07cc7a07feeaa30a4500_Jager-MasterRegular.otf")

guard
  let provider = CGDataProvider(url: fontURL as CFURL),
  let displayFont = CGFont(provider)
else {
  throw FaviconError.fontUnavailable
}

func renderFavicon(size: Int, filename: String) throws {
  let dimension = CGFloat(size)
  let colorSpace = CGColorSpaceCreateDeviceRGB()

  guard let context = CGContext(
    data: nil,
    width: size,
    height: size,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
    throw FaviconError.contextUnavailable
  }

  context.setAllowsAntialiasing(true)
  context.setShouldAntialias(true)
  context.setFillColor(NSColor.black.cgColor)
  context.fill(CGRect(x: 0, y: 0, width: dimension, height: dimension))

  let font = CTFontCreateWithGraphicsFont(displayFont, dimension, nil, nil)
  var character: UniChar = 68
  var glyph = CGGlyph()

  guard CTFontGetGlyphsForCharacters(font, &character, &glyph, 1),
        let glyphPath = CTFontCreatePathForGlyph(font, glyph, nil)
  else {
    throw FaviconError.glyphUnavailable
  }

  let bounds = glyphPath.boundingBoxOfPath
  let inset = dimension * 0.105
  let available = dimension - (inset * 2)
  let scale = min(available / bounds.width, available / bounds.height)
  var transform = CGAffineTransform(
    a: scale,
    b: 0,
    c: 0,
    d: scale,
    tx: ((dimension - (bounds.width * scale)) / 2) - (bounds.minX * scale),
    ty: ((dimension - (bounds.height * scale)) / 2) - (bounds.minY * scale)
  )

  guard let centeredPath = glyphPath.copy(using: &transform) else {
    throw FaviconError.glyphUnavailable
  }

  context.setFillColor(NSColor.white.cgColor)
  context.addPath(centeredPath)
  context.fillPath()

  guard let image = context.makeImage() else {
    throw FaviconError.imageUnavailable
  }

  let representation = NSBitmapImageRep(cgImage: image)
  guard let png = representation.representation(using: .png, properties: [:]) else {
    throw FaviconError.pngUnavailable
  }

  try png.write(to: assetDirectory.appendingPathComponent(filename), options: .atomic)
}

try renderFavicon(size: 32, filename: "66463836617e88260b4ffa65_fav.png")
try renderFavicon(size: 256, filename: "66463839c40ed9904d65205b_app.png")
