# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

bundle = {

  # Math Prims

    'atan is undefined when both inputs are zero.': () ->
      "atan is undefined when both inputs are zero."

  , '_ isn_t a valid base for a logarithm.': (b) ->
      "#{b} isn't a valid base for a logarithm."

  , 'The square root of _ is an imaginary number.': (n) ->
      "The square root of #{n} is an imaginary number."

  , 'math operation produced a non-number': () ->
      "math operation produced a non-number"

  , 'math operation produced a number too large for NetLogo': () ->
      "math operation produced a number too large for NetLogo"

  , 'Division by zero.': () ->
      "Division by zero."

  , 'Can_t take logarithm of _.': (n) ->
      "Can't take logarithm of #{n}."

  , 'random-normal_s second input can_t be negative.': () ->
      "random-normal's second input can't be negative."

  , 'Both Inputs to RANDOM-GAMMA must be positive.': () ->
      "Both Inputs to RANDOM-GAMMA must be positive."

  , '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)': (n) ->
      "#{n} is not in the allowable range for random seeds (-2147483648 to 2147483647)"

  , '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
      "#{n} is too large to be represented exactly as an integer in NetLogo"

  , '_ expected input to be _ but got _ instead.': (prim, expectedType, actualType) ->
      "#{prim} expected input to be #{expectedType} but got #{actualType} instead."

  , 'List is empty.': () ->
      "List is empty."

  , 'Can_t find element _ of the list _, which is only of length _.': (n, list, length) ->
      "Can't find element #{n} of the list #{list}, which is only of length #{length}."

  , 'The list argument to reduce must not be empty.': () ->
      "The list argument to reduce must not be empty."

  , '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
      "#{endIndex} is greater than the length of the input list (#{listLength})."

  , '_ is less than zero.': (index) ->
      "#{index} is less than zero."

  , '_ is less than _.': (endIndex, startIndex) ->
      "#{endIndex} is less than #{startIndex}."

  , '_ got an empty list as input.': (prim) ->
      "#{prim} got an empty list as input."

  , '_ isn_t greater than or equal to zero.': (index) ->
      "#{index} isn't greater than or equal to zero."

}

module.exports = bundle