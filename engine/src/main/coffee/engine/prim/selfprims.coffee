# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, getTypeOf } = require('../core/typechecker')

{ exceptionFactory: exceptions } = require('util/exception')

class TypeSet

  # (Boolean, Boolean, Boolean, Boolean) => TypeSet
  constructor: (@link, @observer, @patch, @turtle) ->

  # (TypeSet) => TypeSet
  mergeWith: ({ link, observer, patch, turtle }) ->
    new TypeSet(@link or link, @observer or observer, @patch or patch, @turtle or turtle)

  # (TypeSet) => TypeSet
  mappend: (ts) ->
    @mergeWith(ts)

mempty = new TypeSet(false, false, false, false)

linkType     = new TypeSet(true,  false, false, false)
observerType = new TypeSet(false, true,  false, false)
patchType    = new TypeSet(false, false, true,  false)
turtleType   = new TypeSet(false, false, false, true)


module.exports =
  class SelfPrims

    # (() => Agent) => Prims
    constructor: (@_getSelf) ->

    # [T] @ (AbstractAgentSet[T]) => AbstractAgentSet[T]
    other: (agentSet) ->
      self = @_getSelf()
      agentSet.filter((agent) => agent isnt self)

    # [T] @ (AbstractAgentSet[T]) => Boolean
    _optimalAnyOther: (agentSet) ->
      self = @_getSelf()
      agentSet.exists((agent) -> agent isnt self)

    # [T] @ (AbstractAgentSet[T]) => Number
    _optimalCountOther: (agentSet) ->
      self = @_getSelf()
      (agentSet.filter((agent) -> agent isnt self)).size()

    # () => Number | TowardsInterrupt
    linkHeading: ->
      @_getSelfSafe(linkType, "link-heading").getHeading()

    # () => Number
    linkLength: ->
      @_getSelfSafe(linkType, "link-length").getSize()

    # (TypeSet) => Agent
    _getSelfSafe: (typeSet, primName) ->
      { link: allowsL, patch: allowsP, turtle: allowsT } = typeSet
      self = @_getSelf()
      if (checks.isTurtle(self) and allowsT) or (checks.isPatch(self) and allowsP) or (checks.isLink(self) and allowsL)
        self
      else
        part1    = "this code can't be run by a #{getTypeOf(self).niceName()}"
        agentStr = @_typeSetToAgentString(typeSet)
        part2    = if agentStr.length isnt 0 then ", only #{agentStr}" else ""
        throw exceptions.runtime(part1 + part2, primName)

    # (TypeSet) => String
    _typeSetToAgentString: (typeSet) ->
      if typeSet.turtle
        "a turtle"
      else if typeSet.patch
        "a patch"
      else if typeSet.link
        "a link"
      else
        ""
