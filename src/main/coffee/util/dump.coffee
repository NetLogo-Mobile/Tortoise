# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['shim/lodash'], (_) ->

  # Needs a name here since it's recursive --JAB (4/16/14)
  # (Any) => String
  Dump =
    (x) ->
      if _(x).isArray()
        itemStr = _(x).map(Dump).value().join(" ")
        "[#{itemStr}]"
      else if typeof(x) is "function" #@# I hate this; Lodash it
        if x.isReporter
          "(reporter task)"
        else
          "(command task)"
      else
        "" + x #@# `toString`

  Dump

)