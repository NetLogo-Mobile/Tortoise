# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./core/abstractagentset')
Link             = require('./core/link')
Nobody           = require('./core/nobody')
Turtle           = require('./core/turtle')
{ SuperArray }   = require('super/superarray')
Type             = require('tortoise/util/typechecker')

# Function given a name for the sake of recursion --JAB (7/31/14)
# (Any) => String
Hasher =
  (x) ->
    if x instanceof Turtle or x instanceof Link
      x.id
    else if x is Nobody
      -1
    else if Type(x).isArray()
      f = (acc, x) -> 31 * acc + (if x? then Hasher(x) else 0)
      SuperArray(x).foldl(1)(f)
    else if x instanceof AbstractAgentSet
      Hasher(x.toArray())
    else
      x.toString()

module.exports = Hasher
