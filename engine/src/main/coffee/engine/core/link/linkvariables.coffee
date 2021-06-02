# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')
{ checks } = require('engine/core/typechecker')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

{ exceptionFactory: exceptions } = require('util/exception')

# In this file: `this.type` is `Link`

# (String) => Unit
setShape = (shape) ->
  @_shape = shape.toLowerCase()
  @_genVarUpdate("shape")
  return

# (AbstractAgentSet|Breed|String) => Unit
setBreed = (breed) ->

  trueBreed =
    if checks.isString(breed)
      @world.breedManager.get(breed)
    else if checks.isAgentSet(breed)
      specialName = breed.getSpecialName()
      if specialName? and @world.breedManager.get(specialName).isLinky()
        @world.breedManager.get(specialName)
      else
        throw exceptions.runtime("You can't set BREED to a non-link-breed agentset.", "set")
    else
      breed

  @world.linkManager.trackBreedChange(this, trueBreed, @_breed?.name ? "")

  if @_breed isnt trueBreed
    trueBreed.add(this)
    @_breed?.remove(this)

    newNames = @_varNamesForBreed(trueBreed)
    oldNames = @_varNamesForBreed(@_breed)
    @_varManager.refineBy(oldNames, newNames)

  @_breed = trueBreed
  @_genVarUpdate("breed")

  setShape.call(this, trueBreed.getShape())

  @_refreshName()

  if not @world.breedManager.links().contains(this)
    @world.breedManager.links().add(this)

  return

# (Number) => Unit
setColor = (color) ->
  @_color = ColorModel.wrapColor(color)
  @_genVarUpdate("color")
  return

# (Turtle) => Unit
setEnd1 = (turtle) ->
  @end1 = turtle
  @_genVarUpdate("end1")
  return

# (Turtle) => Unit
setEnd2 = (turtle) ->
  @end2 = turtle
  @_genVarUpdate("end2")
  return

# (Boolean) => Unit
setIsHidden = (isHidden) ->
  @_isHidden = isHidden
  @_genVarUpdate("hidden?")
  return

# (String) => Unit
setLabel = (label) ->
  @_label = label
  @_genVarUpdate("label")
  return

# (Number) => Unit
setLabelColor = (color) ->
  @_labelcolor = ColorModel.wrapColor(color)
  @_genVarUpdate("label-color")
  return

# (Number) => Unit
setThickness = (thickness) ->
  @_thickness = thickness
  @_genVarUpdate("thickness")
  return

# (String) => Unit
setTieMode = (mode) ->
  @tiemode = mode
  @_genVarUpdate("tie-mode")
  return

Setters = {
  setBreed
  setColor
  setEnd1
  setEnd2
  setIsHidden
  setLabel
  setLabelColor
  setShape
  setThickness
  setTieMode
}

VariableSpecs = [
  new MutableVariableSpec('breed',       (-> @_getLinksByBreedName(@_breed.name)), setBreed)
, new MutableVariableSpec('color',       (-> @_color),                             setColor)
, new MutableVariableSpec('end1',        (-> @end1),                               setEnd1)
, new MutableVariableSpec('end2',        (-> @end2),                               setEnd2)
, new MutableVariableSpec('hidden?',     (-> @_isHidden),                          setIsHidden)
, new MutableVariableSpec('label',       (-> @_label),                             setLabel)
, new MutableVariableSpec('label-color', (-> @_labelcolor),                        setLabelColor)
, new MutableVariableSpec('shape',       (-> @_shape),                             setShape)
, new MutableVariableSpec('thickness',   (-> @_thickness),                         setThickness)
, new MutableVariableSpec('tie-mode',    (-> @tiemode),                            setTieMode)
]

module.exports = {
  Setters
  VariableSpecs
}
