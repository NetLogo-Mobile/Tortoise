// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler.json

import
  org.nlogo.{ api, core, drawing },
    api.Color,
    core.LogoList,
    drawing.{ DrawingAction, LinkStamp, TurtleStamp },
      DrawingAction.{ ClearDrawing, CreateDrawing, DrawLine, ImportDrawing, MarkClean, MarkDirty, ReadImage
                    , RescaleDrawing, SendPixels, SetColors, StampImage }

import
  TortoiseJson.{ fields, JsArray, JsBool, JsDouble, JsInt, JsObject, JsString }

sealed trait DrawingActionConverter[T <: DrawingAction] extends JsonConverter[T] {

  protected def `type`: String

  override protected def baseProps: JsObject =
    JsObject(fields("type" -> JsString(`type`)))

  protected def colorList(c: AnyRef): List[Int] = {

    val hasTransparency =
      c match {
        case ll: LogoList if ll.length == 4 => true
        case _                              => false
      }

    val awtColor = Color.getColor(c)

    if (hasTransparency)
      List(awtColor.getRed, awtColor.getGreen, awtColor.getBlue, awtColor.getAlpha)
    else
      List(awtColor.getRed, awtColor.getGreen, awtColor.getBlue)

  }

}

object DrawingActionToJsonConverters {

  // scalastyle:off cyclomatic.complexity
  implicit def drawingAction2Json(target: DrawingAction): JsonWritable =
    target match {
      case ClearDrawing     => ClearDrawingConverter
      case MarkClean        => MarkCleanConverter
      case MarkDirty        => MarkDirtyConverter
      case RescaleDrawing   => RescaleDrawingConverter // Not yet generated by the NLW engine, but should be whenever patch size is changed --JAB (1/3/18)
      case x: CreateDrawing => new CreateDrawingConverter(x)
      case x: DrawLine      => new DrawLineConverter(x)
      case x: ImportDrawing => new ImportDrawingConverter(x)
      case x: ReadImage     => new ReadImageConverter(x)
      case x: SendPixels    => new SendPixelsConverter(x)
      case x: SetColors     => new SetColorsConverter(x)
      case x: StampImage    => new StampImageConverter(x)
      case x                => throw new Exception(s"Serialize this mysterious drawing action: $x")
    }
  // scalastyle:on cyclomatic.complexity

}

object ClearDrawingConverter extends DrawingActionConverter[ClearDrawing.type] {
  override protected val target     = ClearDrawing
  override protected val `type`     = "clear-drawing"
  override protected val extraProps = JsObject(fields())
}

object MarkCleanConverter extends DrawingActionConverter[MarkClean.type] {
  override protected val target     = MarkClean
  override protected val `type`     = "mark-clean"
  override protected val extraProps = JsObject(fields())
}

object MarkDirtyConverter extends DrawingActionConverter[MarkDirty.type] {
  override protected val target     = MarkDirty
  override protected val `type`     = "mark-dirty"
  override protected val extraProps = JsObject(fields())
}

object RescaleDrawingConverter extends DrawingActionConverter[RescaleDrawing.type] {
  override protected val target     = RescaleDrawing
  override protected val `type`     = "rescale-drawing"
  override protected val extraProps = JsObject(fields())
}

class SetColorsConverter(override protected val target: SetColors) extends DrawingActionConverter[SetColors] {
  override protected val `type`     = "set-colors"
  override protected val extraProps = JsObject(fields("base64" -> JsString(target.base64)))
}

class ReadImageConverter(override protected val target: ReadImage) extends DrawingActionConverter[ReadImage] {
  override protected val `type`     = "read-image"
  override protected val extraProps = JsObject(fields("imageBytes" -> JsArray(target.imageBytes.map(x => JsInt(x)))))
}

class SendPixelsConverter(override protected val target: SendPixels) extends DrawingActionConverter[SendPixels] {
  override protected val `type`     = "send-pixels"
  override protected val extraProps = JsObject(fields("dirty" -> JsBool(target.dirty)))
}

class ImportDrawingConverter(override protected val target: ImportDrawing) extends DrawingActionConverter[ImportDrawing] {
  override protected val `type`     = "import-drawing"
  override protected val extraProps = JsObject(fields("imageBase64" -> JsString(target.imageBase64)))
}

class CreateDrawingConverter(override protected val target: CreateDrawing) extends DrawingActionConverter[CreateDrawing] {
  override protected val `type`     = "create-drawing"
  override protected val extraProps = JsObject(fields("dirty" -> JsBool(target.dirty)))
}

class StampImageConverter(override protected val target: StampImage) extends DrawingActionConverter[StampImage] {

  override protected val `type` = "stamp-image"

  private val (agentType, stampProperties) =
    target.stamp match {

      case t: TurtleStamp =>
        import t._
        val obj =
          JsObject(fields(
            "color"     -> JsArray(colorList(color) map JsInt),
            "heading"   -> JsDouble(heading),
            "size"      -> JsDouble(size),
            "x"         -> JsDouble(x),
            "y"         -> JsDouble(y),
            "shapeName" -> JsString(shapeName),
            "stampMode" -> JsString(stampMode)
          ))

        ("turtle", obj)

      case l: LinkStamp   =>
        import l._
        val obj =
          JsObject(fields(
            "color"     -> JsArray(colorList(color) map JsInt),
            "heading"   -> JsDouble(heading),
            "midpointX" -> JsDouble(midpointX),
            "midpointY" -> JsDouble(midpointY),
            "shapeName" -> JsString(shapeName),
            "x1"        -> JsDouble(x1),
            "x2"        -> JsDouble(x2),
            "y1"        -> JsDouble(y1),
            "y2"        -> JsDouble(y2),
            "thickness" -> JsDouble(thickness),
            "directed?" -> JsBool(isDirected),
            "size"      -> JsDouble(size),
            "hidden?"   -> JsBool(isHidden),
            "stampMode" -> JsString(stampMode)
          ))

        ("link", obj)

    }

  override protected val extraProps =
    JsObject(fields(
      "agentType" -> JsString(agentType),
      "stamp"     -> stampProperties
    ))

}

class DrawLineConverter(override protected val target: DrawLine) extends DrawingActionConverter[DrawLine] {

  override protected val `type` = "line"

  import target._

  override protected val extraProps =
    JsObject(fields(
      "fromX"   -> JsDouble(x1),
      "fromY"   -> JsDouble(y1),
      "rgb"     -> JsArray(colorList(penColor) map JsInt),
      "size"    -> JsDouble(penSize),
      "toX"     -> JsDouble(x2),
      "toY"     -> JsDouble(y2),
      "penMode" -> JsString(penMode)
    ))

}
