# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./abstractagentset')
ColorModel       = require('./colormodel')
linkCompare      = require('./structure/linkcompare')
VariableManager  = require('./structure/variablemanager')
TurtleSet        = require('./turtleset')
{ checks }       = require('./typechecker')

Comparator                       = require('util/comparator')
{ exceptionFactory: exceptions } = require('util/exception')

{ ifInterrupt, DeathInterrupt } = require('util/interrupts')
{ Setters, VariableSpecs }      = require('./link/linkvariables')
{ ExtraVariableSpec }           = require('./structure/variablespec')

class StampMode
  constructor: (@name) -> # (String) => StampMode

Stamp      = new StampMode("normal")
StampErase = new StampMode("erase")

module.exports =
  class Link

    # type RegLinkStampFunc = (Number, Number, Number, Number, Number, Number, Number, RGB, String, Number, String) => Unit

    _breed:            undefined # Breed
    _name:             undefined # String
    _updateVarsByName: undefined # (String*) => Unit
    _varManager:       undefined # VariableManager

    # The type signatures here can be found to the right of the parameters. --JAB (4/21/15)
    constructor: (@id, @isDirected, @end1, @end2, @world, genUpdate, @_registerDeath, @_registerRemoval        # Number, Boolean, Turtle, Turtle, World, (Updatable) => (String*) => Unit, (Number) => Unit, (Link) => Unit
                , @_registerLinkStamp, @_getLinksByBreedName, breed = @world.breedManager.links(), @_color = 5 # RegLinkStampFunc, (String) => LinkSet, Breed, Number
                , @_isHidden = false, @_label = "", @_labelcolor = 9.9, @_shape = "default", @_thickness = 0   # Boolean, String, Number, String, Number
                , @tiemode = "none") ->                                                                        # String
      @_updateVarsByName = genUpdate(this)

      varNames     = @_varNamesForBreed(breed)
      @_varManager = @_genVarManager(varNames)

      Setters.setBreed.call(this, breed)
      @end1.linkManager.add(this)
      @end2.linkManager.add(this)
      @updateEndRelatedVars()
      @_updateVarsByName("directed?")

    # () => String
    getBreedName: ->
      @_breed.name

    # () => String
    getBreedNameSingular: ->
      @_breed.singular

    # Tragically needed by `LinkCompare` for compliance with NetLogo's insane means of sorting links --JAB (9/6/14)
    # () => Number
    getBreedOrdinal: ->
      @_breed.ordinal

    # Unit -> String
    getName: ->
      @_name

    # (String) => Any
    getVariable: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_varManager[varName] = value
      return

    # (String, Any) => Maybe[Any]
    setIfValid: (varName, value) ->
      @_varManager.setIfValid(varName, value)

    # () => DeathInterrupt
    die: ->
      @_breed.remove(this)
      if not @isDead()
        @end1.linkManager.remove(this)
        @end2.linkManager.remove(this)
        @_registerRemoval(this)
        @_seppuku()
        @id = -1
      return DeathInterrupt

    # () => Unit
    stamp: ->
      @_drawStamp(Stamp)
      return

    # () => Unit
    stampErase: ->
      @_drawStamp(StampErase)
      return

    # () => TurtleSet
    bothEnds: ->
      new TurtleSet([@end1, @end2], @world)

    # () => Turtle
    otherEnd: ->
      if @end1 is @world.selfManager.myself() then @end2 else @end1

    # () => Unit
    tie: ->
      Setters.setTieMode.call(this, "fixed")
      return

    # () => Unit
    untie: ->
      Setters.setTieMode.call(this, "none")
      return

    # () => Unit
    updateEndRelatedVars: ->
      @_updateVarsByName("heading", "size", "midpointx", "midpointy")
      return

    # () => String
    toString: ->
      if not @isDead()
        "(#{@getName()})"
      else
        "nobody"

    # () => (Number, Number)
    getCoords: ->
      [@getMidpointX(), @getMidpointY()]

    # () => Number | TowardsInterrupt
    getHeading: ->
      @world.topology.towards(@end1.xcor, @end1.ycor, @end2.xcor, @end2.ycor)

    # () => Number
    getMidpointX: ->
      @world.topology.midpointx(@end1.xcor, @end2.xcor)

    # () => Number
    getMidpointY: ->
      @world.topology.midpointy(@end1.ycor, @end2.ycor)

    # () => Number
    getSize: ->
      @world.topology.distanceXY(@end1.xcor, @end1.ycor, @end2.xcor, @end2.ycor)

    # (String) => Boolean
    isBreed: (breedName) ->
      @_breed.name.toUpperCase() is breedName.toUpperCase()

    # () => Boolean
    isDead: ->
      @id is -1

    # (() => Any) => Unit
    ask: (f) ->
      if not @isDead()
        @world.selfManager.askAgent(f)(this)
        if @world.selfManager.self().isDead?()
          return DeathInterrupt
      else
        throw exceptions.runtime("That #{@getBreedNameSingular()} is dead.", "ask")
      return

    # [Result] @ (() => Result) => Result
    projectionBy: (f) ->
      if not @isDead()
        @world.selfManager.askAgent(f)(this)
      else
        throw exceptions.runtime("That #{@_breed.singular} is dead.", "of")

    # (Any) => { toInt: Number }
    compare: (x) ->
      if checks.isLink(x)
        switch linkCompare(this, x)
          when -1 then Comparator.LESS_THAN
          when  0 then Comparator.EQUALS
          when  1 then Comparator.GREATER_THAN
          else exceptions.internal("Comparison should only yield an integer within the interval [-1,1]")
      else
        Comparator.NOT_EQUALS

    # () => Boolean
    hasVariable: (varName) ->
      @_varManager.has(varName)

    # () => Array[String]
    varNames: ->
      @_varManager.names()

    # (StampMode) => Unit
    _drawStamp: (mode) ->

      { xcor: e1x, ycor: e1y } = @end1
      { xcor: e2x, ycor: e2y } = @end2

      stampHeading = ifInterrupt(@world.topology.towards(e1x, e1y, e2x, e2y), 0)

      color = ColorModel.colorToList(@_color)
      midX  = @getMidpointX()
      midY  = @getMidpointY()

      @_registerLinkStamp(e1x, e1y, e2x, e2y, midX, midY, stampHeading, color, @_shape, @_thickness, @isDirected, @getSize(), @_isHidden, mode.name)
      return

    # Unit -> Unit
    _refreshName: ->
      @_name = "#{@_breed.singular} #{@end1.id} #{@end2.id}"
      return

    # (Breed) => Array[String]
    _varNamesForBreed: (breed) ->
      linksBreed = @world.breedManager.links()
      if breed is linksBreed or not breed?
        linksBreed.varNames
      else
        linksBreed.varNames.concat(breed.varNames)

    # () => Unit
    _seppuku: ->
      @_registerDeath(@id)
      return

    # (Array[String]) => VariableManager
    _genVarManager: (extraVarNames) ->
      extraSpecs = extraVarNames.map((name) -> new ExtraVariableSpec(name))
      allSpecs   = VariableSpecs.concat(extraSpecs)
      new VariableManager(this, allSpecs)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_updateVarsByName(varName)
      return
