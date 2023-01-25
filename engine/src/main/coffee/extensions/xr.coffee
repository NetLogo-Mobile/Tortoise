# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
GlobalStateExtensionPorter = require('../engine/core/world/globalstateextensionporter')

getXR = () =>
  if window?.TortugaXR?
    return window.TortugaXR.Instance
  else
    return null

extensionName = "xr"

exportGlobal = () ->
    if XR = getXR()
        XR.ExportState()
    else {}
        
formatGlobal = (exported) ->
    JSON.stringify(exported).replace(/,/g, "`")

readGlobal = (line) ->
    JSON.parse(line[0].replace(/`/g, ","))
    
importGlobal = (state, objects) ->
    if XR = getXR()
        XR.ImportState(state)

module.exports = {
  porter: new GlobalStateExtensionPorter(extensionName,
    exportGlobal, formatGlobal, readGlobal, importGlobal
  )
  init: (workspace) =>
    # () -> Unit
    clearAll = () ->
      return
      
    # () => Boolean
    isSupported = () ->
      if XR = getXR()
        return XR.IsSupported()
      else
        return false
      
    # () => Boolean
    isOn = () ->
      if XR = getXR()
        return XR.IsOn()
      else
        return false
      
    # () => Unit
    startXR = () ->
      if XR = getXR()
        return XR.Switch(true)
      else
        workspace.printPrims.print("Try to start the XR view.")
      return
      
    # () => Unit
    stopXR = () ->
      if XR = getXR()
        return XR.Switch(false)
      else
        workspace.printPrims.print("Try to stop the XR view.")
      return

    # () -> [Number, Number]
    getGravity = () ->
      if XR = getXR()
        XR.GetGravity()
      else
        [0, 0]

    # () -> Number
    getScale = () ->
      if XR = getXR()
        XR.GetScale()
      else
        0
      
    # (Number) -> Unit
    setScale = (scale) ->
      if XR = getXR()
        XR.SetScale(scale)
      else
        workspace.printPrims.print("Try to set the mapping scale between real-world and model world to #{scale}.")
      return

    # () -> Number
    xcor = () ->
      if XR = getXR()
        XR.GetXcor()
      else
        0

    # () -> Number
    ycor = () ->
      if XR = getXR()
        XR.GetYcor()
      else
        0

    # () => Unit
    showWireframes = () ->
      if XR = getXR()
        XR.ShowWireframes()
      else
        workspace.printPrims.print("Try to ask the XR view to show all room wireframes.")
      return

    # () => Unit
    hideWireframes = () ->
      if XR = getXR()
        XR.HideWireframes()
      else
        workspace.printPrims.print("Try to ask the XR view to hide all room wireframes.")
      return

    # (String) => Unit
    showWireframe = (id) ->
      if XR = getXR()
        XR.ShowWireframe(id)
      else
        workspace.printPrims.print("Try to ask the XR view to show the room wireframe #{id}.")
      return

    # (String) => Unit
    hideWireframe = (id) ->
      if XR = getXR()
        XR.HideWireframe(id)
      else
        workspace.printPrims.print("Try to ask the XR view to hide the room wireframe #{id}.")
      return

    # (Wildcard) => Unit
    roomScan = (callback) ->
      if XR = getXR()
        XR.RoomScan(callback)
      else
        workspace.printPrims.print("Try to initiate an XR room scan.")
      return
      
    # (Number) => Boolean
    isRoomScanSupported = (type) ->
      if XR = getXR()
        return XR.IsRoomScanSupported(type)
      else
        return false
        
    # () => List
    scans = () ->
      if XR = getXR()
        return XR.GetKnownIDs()
      else
        return []

    # () => String
    currentScan = () ->
      if XR = getXR()
        return XR.GetCurrentScan()
      else
        return []

    # (String) => Unit
    useScan = (id) ->
      if XR = getXR()
        return XR.SetCurrentScan(id)
      else
        workspace.printPrims.print("Try to set the current scan to #{id}.")
      return

    # (Number, Number) -> Unit
    resizeWorld = (xmin, ymin) ->
      if XR = getXR()
        XR.ResizeWorld(xmin, ymin)
      else
        workspace.printPrims.print("Try to resize the world based on the current scan.")
      return

    # (String) -> List
    getDimensions = () ->
      if XR = getXR()
        return XR.GetDimensions()
      else
        return [0, 0]
      
    # (Wildcard) => Unit
    iterateAsPatches = (callback) ->
      if XR = getXR()
        XR.IterateAsPatches(callback)
      else
        workspace.printPrims.print("Try to iterate on the current scan as patches.")
      return

    # (Wildcard) => Unit
    iterateAsTurtles = (callback) ->
      if XR = getXR()
        XR.IterateAsTurtles(callback)
      else
        workspace.printPrims.print("Try to iterate on the current scan as turtles.")
      return

    # (Number, Number) -> Boolean
    insideScan = () ->
      if XR = getXR()
        return XR.InsideScan(SelfManager.self())
      else
        return true

    # (String, String) -> Number
    colorOf = (type, label) ->
      if XR = getXR()
        return XR.GetColorOf(type, label)
      else
        return 0

    {
      name: "xr"
    , clearAll: clearAll
    , prims: {
        "IS-SUPPORTED?": isSupported,
        "IS-ON?": isOn,
        "START": startXR,
        "STOP": stopXR,
        "GET-GRAVITY": getGravity,
        "GET-SCALE": getScale,
        "SET-SCALE": setScale,
        "XCOR": xcor,
        "YCOR": y,
        "SHOW-WIREFRAMES": showWireframes,
        "HIDE-WIREFRAMES": hideWireframes,
        "SHOW-WIREFRAME": showWireframe,
        "HIDE-WIREFRAME": hideWireframe,
        "ROOM-SCAN": roomScan,
        "CURRENT-SCAN": currentScan,
        "USE-SCAN": useScan,
        "IS-ROOM-SCAN-SUPPORTED?": isRoomScanSupported,
        "SCANS": scans,
        "RESIZE-WORLD": resizeWorld,
        "GET-DIMENSIONS": getDimensions,
        "ITERATE-AS-PATCHES": iterateAsPatches,
        "ITERATE-AS-TURTLES": iterateAsTurtles,
        "INSIDE-SCAN?": insideScan,
        "COLOR-OF": colorOf,
      }
    }
}