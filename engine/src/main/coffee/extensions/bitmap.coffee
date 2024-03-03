# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
{ importPColorsImage } = require('engine/prim/importpcolors')

SingleObjectExtensionPorter = require('engine/core/world/singleobjectextensionporter')

# This is a "polyfill" when running headlessly for testing without the Web API present. In that case, this should be
# enough for testing purposes.  If we ever need this to run "for real" headlessly, we'll probably need something more
# robust, like a library that provides a proper implementation.  -Jeremy B November 2022
if not ImageData?
  ImageData = class ImageData
    constructor: (@data, @width, @height) ->

isImageData = (image) ->
  image instanceof ImageData

checkIsImage = (image) ->
  if not isImageData(image)
    throw exceptions.extension("The given argument is not an image: #{image}")

# (ImageData) => Array[RGB]
averageColor = (image) ->
  checkIsImage(image)

  sums = image.data.reduce( (sumsSoFar, color, index) ->
    sumsSoFar[index % 4] = sumsSoFar[index % 4] + color
    sumsSoFar
  , [0, 0, 0, 0])
  pixels = image.width * image.height
  averages = sums.slice(0, 3).map( (sum) -> sum / pixels )
  averages

# (ImageData, 0 | 1 | 2 | 3) => ImageData
channel = (image, channel) ->
  checkIsImage(image)
  channel = Math.floor(channel)
  if (channel < 0 or channel > 3)
    throw exceptions.extension("Channel must be one of [0 1 2 3].")

  rgbaIndex = if channel is 0 then 3 else (channel - 1)
  newData = new Uint8ClampedArray(image.data.length)

  for index in [0...image.data.length] by 4
    value = image.data[index + rgbaIndex]
    newData[index    ] = value
    newData[index + 1] = value
    newData[index + 2] = value
    newData[index + 3] = 255

  new ImageData(newData, image.width, image.height)

# (World) => (ImageData, Int, Int) => Unit
copyToDrawing = (image, x, y) ->
  checkIsImage(image)
  # For the sake of performance, I added the `import-image` drawing event, which is a more direct way to do this. -John Chen May 2023
  workspace.updater.importImage(image, x, y)
  return

# (World) => (ImageData, String) => Unit
copyToShape = (image, name, rotatable = false) ->
  checkIsImage(image)
  image = scaled(image, 512, 512)
  workspace.updater.importImage(image, 0, 0, name, rotatable)
  return

# (World) => (ImageData, Boolean) => Unit
copyToPColors = (world) -> (image, useNetLogoColors) ->
  checkIsImage(image)
  getTopology  = ()     -> world.topology
  getPatchSize = ()     -> world.patchSize
  getPatchAt   = (x, y) -> world.getPatchAt(x, y)
  importPColorsImage(getTopology, getPatchSize, getPatchAt, useNetLogoColors, image)
  return

# (Int, Int) => ImageData
create = (width, height) ->
  # Create a new ImageData with the specified size
  newData = new Uint8ClampedArray(width * height * 4)
  new ImageData(newData, width, height)
  
# (ImageData, ImageData, Int, Int) => Unit
copyTo = (source, target, offsetX, offsetY) ->
  checkIsImage(source)
  checkIsImage(target)

  # Get the original dimensions
  oldWidth = source.width
  oldHeight = source.height
  newWidth = target.width
  newHeight = target.height
  data = source.data
  newData = target.data

  # Calculate the offset to place the original image at the center
  if typeof offsetX is 'undefined'
    offsetX = Math.floor((newWidth - oldWidth) / 2)
  if typeof offsetY is 'undefined'
    offsetY = Math.floor((newHeight - oldHeight) / 2)

  # Copy pixels from the original image to the new image
  for y in [0...oldHeight]
    for x in [0...oldWidth]
      # Calculate the coordinates in the new image
      newX = x + offsetX
      newY = y + offsetY

      # Check if the new coordinates are within the boundaries
      if newX >= 0 and newX < newWidth and newY >= 0 and newY < newHeight
        # Get the pixel values from the original image
        pixelData = getPixel(data, oldWidth, x, y)

        # Set the pixel values in the new image
        setPixel(newData, newWidth, newX, newY, pixelData)

# (ImageData, ImageData) => ImageData
differenceRgb = (image1, image2) ->
  checkIsImage(image1)
  checkIsImage(image2)
  if image1.width isnt image2.width or image1.height isnt image2.height
    throw exceptions.extension("Images must be the same size to take the difference.")

  newData = new Uint8ClampedArray(image1.data.length)

  diff = (arr1, arr2, index) ->
    Math.abs(arr1[index] - arr2[index])

  image1.data.forEach( (c1, index) ->
    newData[index] = if (index % 4 is 3)
      255
    else
      c2 = image2.data[index]
      Math.abs(c1 - c2)
  )

  new ImageData(newData, image1.width, image1.height)

# (String) => ImageData
fromBase64 = (base64) ->
  # Probably we shouldn't be going to the global for the function, but meh.
  { data, width, height } = modelConfig.base64ToImageData(base64)
  new ImageData(data, width, height)

# (ImageData) => String
toBase64 = (image) ->
  checkIsImage(image)
  modelConfig.imageDataToBase64(image)

# () => ImageData
fromView = () ->
  # As with `copy-to-drawing` I don't like the extra conversion here, as we can get the `ImageData` from the backing
  # canvas, but this should be good enough for now.  -Jeremy B November 2022
  base64 = workspace.importExportPrims.exportViewRaw()
  fromBase64(base64)

# This implementation does not match the desktop version, which uses a Java algorithm I didn't want to track down and
# re-implement.  This is very simple and looks fine.  I have no idea what else the Java algorithm could be doing to
# fancy it up.  -Jeremy B November 2022
# (ImageData) => ImageData
toGrayscale = (image) ->
  checkIsImage(image)
  newData = new Uint8ClampedArray(image.data.length)

  for index in [0...image.data.length] by 4
    # https://en.wikipedia.org/wiki/Grayscale
    # Also preserved the alpha channel
    # Changed the formula based on the SRGB color space (the most common one used in screens) -John Chen May 2023
    value = Math.floor(image.data[index] * 0.2126 + image.data[index + 1] * 0.7152 + image.data[index + 2] * 0.0722)
    newData[index    ] = value
    newData[index + 1] = value
    newData[index + 2] = value
    newData[index + 3] = image.data[index + 3]

  new ImageData(newData, image.width, image.height)

# (ImageData) => Int
height = (image) ->
  checkIsImage(image)
  image.height

# (ImageData, Int, Int) => ImageData
boxScale = (image, width, height) ->
  xScale = width  / image.width
  yScale = height / image.height
  newData = new Uint8ClampedArray(width * height * 4)

  boxWidth  = Math.ceil(1 / xScale)
  boxHeight = Math.ceil(1 / yScale)

  for y in [0...height]
    for x in [0...width]
      newIndex = 4 * ((y * width) + x)

      boxXStart = Math.floor(x / xScale)
      boxYStart = Math.floor(y / yScale)

      boxXEnd = Math.min(boxXStart + boxWidth,  image.width  - 1)
      boxYEnd = Math.min(boxYStart + boxHeight, image.height - 1)

      # There is no reason not to scale the alpha channel as well. -John Chen May 2023
      rgbaSums = [0, 0, 0, 0]
      for boxX in [boxXStart..boxXEnd]
        for boxY in [boxYStart..boxYEnd]
          boxIndex = 4 * ((boxY * image.width) + boxX)
          rgbaSums[0] += image.data[boxIndex    ]
          rgbaSums[1] += image.data[boxIndex + 1]
          rgbaSums[2] += image.data[boxIndex + 2]
          rgbaSums[3] += image.data[boxIndex + 3]

      boxPixelCount = (boxXEnd - boxXStart + 1) * (boxYEnd - boxYStart + 1)

      newData[newIndex    ] = Math.floor(rgbaSums[0] / boxPixelCount)
      newData[newIndex + 1] = Math.floor(rgbaSums[1] / boxPixelCount)
      newData[newIndex + 2] = Math.floor(rgbaSums[2] / boxPixelCount)
      newData[newIndex + 3] = Math.floor(rgbaSums[3] / boxPixelCount)

  new ImageData(newData, width, height)

# (Array[Int], Int, Int, Int) => Array[RGBA]
getPixel = (data, width, x, y) ->
  index = 4 * ((y * width) + x)
  [0..3].map( (i) -> data[index + i] )

# (Array[Int], Int, Int) => Array[RGBA]
getPixelAPI = (image, x, y) ->
  checkIsImage(image)
  getPixel(image.data, image.width, x, y)

# (Array[Int], Int, Int, Int, Array[RGBA]) => Unit
setPixel = (data, width, x, y, rgba) ->
  index = 4 * ((y * width) + x)
  for i in [0..3]
    data[index + i] = rgba[i]
  return
  
# (Array[Int], Int, Int, Int, Array[RGBA]) => Unit
setPixelAPI = (image, x, y, rgba) ->
  checkIsImage(image)
  if !Array.isArray(rgba) or rgba.length < 3 or rgba.length > 4
    throw exceptions.extension("The input color must be an array of length 3.")
  if rgba.length == 3
    rgba.push(255)
  setPixel(image.data, image.width, x, y, rgba)
  return

arrMult = (arr, scalar) ->
  arr.map( (v, i) -> v * scalar )

arrAdd = (arr1, arr2) ->
  arr1.map( (v1, i) -> v1 + arr2[i] )

# (ImageData, Int, Int) => ImageData
bilinearScale = (image, width, height) ->
  xScale = (width - 1) / (image.width - 1)
  yScale = (height - 1) / (image.height - 1)
  newData = new Uint8ClampedArray(width * height * 4)

  for y in [0...height]
    for x in [0...width]
      oldXRaw = x / xScale
      oldYRaw = y / yScale

      x1 = Math.min(Math.floor(oldXRaw), image.width  - 1)
      y1 = Math.min(Math.floor(oldYRaw), image.height - 1)
      x2 = Math.min(Math.ceil(oldXRaw),  image.width  - 1)
      y2 = Math.min(Math.ceil(oldYRaw),  image.height - 1)

      q11 = getPixel(image.data, image.width, x1, y1)
      q12 = getPixel(image.data, image.width, x1, y2)
      q21 = getPixel(image.data, image.width, x2, y1)
      q22 = getPixel(image.data, image.width, x2, y2)

      [p1, p2] = if x1 is x2
        [q11, q22]
      else
        x1Mod = (x2 - oldXRaw)
        x2Mod = (oldXRaw - x1)
        p1 = arrAdd(arrMult(q11, x1Mod), arrMult(q21, x2Mod))
        p2 = arrAdd(arrMult(q12, x1Mod), arrMult(q22, x2Mod))
        [p1, p2]

      # Fixed an issue where if y1 = y2, only q11 is used. --John Chen Mar 2024
      p = if y1 is y2
        p1
      else
        arrAdd(arrMult(p1, y2 - oldYRaw), arrMult(p2, oldYRaw - y1))

      setPixel(newData, width, x, y, p.map( (v) -> Math.floor(v) ))

  new ImageData(newData, width, height)

# This implementation does not exactly match desktop's version, which uses a Java function to do the scaling.  I did not
# care to track it down and re-implement it exactly here, since this looks and works fine.  If exactness between them is
# required in the future, we can either switch desktop to use this version, switch them both to a common library that
# works on web and the JVM, or track down the Java algorithm.  -Jeremy B November 2022
# (ImageData, Int, Int) => ImageData
scaled = (image, width, height) ->
  checkIsImage(image)
  if image.width is width and image.height is height
    image
  else if image.width > width and image.height > height
    boxScale(image, width, height)
  else
    bilinearScale(image, width, height)

# (ImageData) => Int
width = (image) ->
  checkIsImage(image)
  image.width

exportError = (_) -> throw exceptions.extension("Writing directly from a file is not supported in NetLogo Web.  Instead you can use the SaveTo extension to synchronously write an image file.")

importError = (_) -> throw exceptions.extension("Reading directly from a file is not supported in NetLogo Web.  Instead you can use the Fetch extension to synchronously read in an image file.")

extensionName = "bitmap"

exportImageData = (image) ->
  image

importImageData = (exportedObj) ->
  exportedObj.data

bitmapExtension = {

  porter: new SingleObjectExtensionPorter(extensionName, isImageData, toBase64, exportImageData, toBase64, fromBase64, importImageData)

  init: (workspace) ->
    {
      name: extensionName
    , prims: {
        "AVERAGE-COLOR": averageColor
      , "CHANNEL": channel
      , "COPY-TO": copyTo
      , "COPY-TO-DRAWING": copyToDrawing
      , "COPY-TO-SHAPE": copyToShape
      , "COPY-TO-PCOLORS": copyToPColors(workspace.world)
      , "CREATE": create
      , "DIFFERENCE-RGB": differenceRgb
      , "EXPORT": exportError
      , "FROM-BASE64": fromBase64
      , "TO-BASE64": toBase64
      , "FROM-VIEW": fromView
      , "TO-GRAYSCALE": toGrayscale
      , "IMPORT": importError
      , "SCALED": scaled
      , "HEIGHT": height
      , "WIDTH": width
      , "GET-PIXEL": getPixelAPI
      , "SET-PIXEL": setPixelAPI
      }
    }
}

module.exports = bitmapExtension
