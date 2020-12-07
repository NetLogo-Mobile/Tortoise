# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Validator  = require('./validator')
ListChecks = require('./list-checks')
MathChecks = require('./math-checks')

class Checker

  constructor: (i18nBundle, dumper, listPrims, randomPrims) ->
    validator = new Validator(i18nBundle, dumper)
    @list     = new ListChecks(validator, dumper, listPrims)
    @math     = new MathChecks(validator, randomPrims)

module.exports = Checker