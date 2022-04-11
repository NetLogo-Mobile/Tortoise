# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

bundle = {

  # Math Prims

    'atan is undefined when both inputs are zero.': () ->
      "当2个输入均为0时，atan无意义。"

  , '_ isn_t a valid base for a logarithm.': (b) ->
      "#{b} 不是对数的有效基数。"

  , 'The square root of _ is an imaginary number.': (n) ->
      "#{n} 小于0，平方根无意义。"

  , 'math operation produced a non-number': () ->
      "出现了一个非数字型输入，无法计算。"

  , 'math operation produced a number too large for NetLogo': () ->
      "生成/输入的数对于Netlogo来说太大了。"

  , 'Division by zero.': () ->
      "除数为0，无意义。"

  , 'Can_t take logarithm of _.': (n) ->
      "不能生成 #{n} 的对数"

  , 'random-normal_s second input can_t be negative.': () ->
      "random-normal's second input can't be negative."

  , 'Both Inputs to RANDOM-GAMMA must be positive.': () ->
      "Both Inputs to RANDOM-GAMMA must be positive."

  , '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)': (n) ->
      "#{n} is not in the allowable range for random seeds (-2147483648 to 2147483647)"

  , '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
      "#{n} is too large to be represented exactly as an integer in NetLogo"

  , '_ expected input to be _ but got _ instead.': (prim, expectedType, actualType) ->
      "#{prim} 需要 #{expectedType} 类型的输入，但收到了 #{actualType} 类型的输入。"

  , 'List is empty.': () ->
      "列表为空。"

  , 'Can_t find element _ of the _ _, which is only of length _.': (n, type, list, length) ->
      "不能找到 #{type} #{list} 的第 #{n} 项, 因为这个列表只有 #{length} 项。"

  , 'The list argument to reduce must not be empty.': () ->
      "The list argument to reduce must not be empty."

  , '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
      "#{endIndex} is greater than the length of the input list (#{listLength})."

  , '_ is less than zero.': (index) ->
      "#{index} 小于0。"

  , '_ is less than _.': (endIndex, startIndex) ->
      "#{endIndex} 作为末数小于了初数 #{startIndex}."

  , '_ got an empty _ as input.': (prim, type) ->
      "#{prim} 得到了一个 #{type} 类型的空数据。"

  , '_ isn_t greater than or equal to zero.': (index) ->
      "#{index} 应该大于等于0"

  , 'Can_t find the _ of a list with no numbers: __': (aspect, list, punc) ->
      "Can't find the #{aspect} of a list with no numbers: #{list}#{punc}"

  , 'Requested _ random items from a list of length _.': (count, length) ->
      "Requested #{count} random items from a list of length #{length}."

  , 'Requested _ random agents from a set of only _ agents.': (count, size) ->
      "Requested #{count} random agents from a set of only #{size} agents."

  , 'Can_t find the _ of a list without at least two numbers: __': (aspect, list, punc) ->
      "Can't find the #{aspect} of a list without at least two numbers: #{list}#{punc}"

  , 'Invalid list of points: _': (points) ->
      "Invalid list of points: #{points}"

  , 'Requested _ random agents from a set of only _ agents.': (n, size) ->
      "Requested #{n} random agents from a set of only #{size} agents."

  , 'First input to _ can_t be negative.': (prim) ->
      "First input to #{prim} can't be negative."

  , '_ expected a true/false value from _, but got _ instead.': (prim, item, value) ->
    "#{prim} 需要来自 #{item} 的布尔值（true/false）作为输入, 但是得到了 #{value} 作为输入。"

  , '_ expected input to be a _ agentset or _ but got _ instead.': (prim, agentType, value) ->
    "#{prim} 需要 #{agentType} 类型的主体集合或 #{agentType} 类型的主体，但是得到了 #{value} 作为输入。"

  , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.': (prim, agentType, list, value) ->
    "List inputs to #{prim} must only contain #{agentType}, #{agentType} agentset, or list elements.  The list #{list} contained #{value} which is NOT a #{agentType} or #{agentType} agentset."

  , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.': (prim, agentType, list, value) ->
    "List inputs to #{prim} must only contain #{agentType}, #{agentType} agentset, or list elements.  The list #{list} contained a different type agentset: #{value}."

  , 'SORT-ON works on numbers, strings, or agents of the same type, but not on _ and _': (type1, type2) ->
    "SORT-ON works on numbers, strings, or agents of the same type, but not on #{type1} and #{type2}"

  , 'anonymous procedure expected _ input_, but only got _': (needed, given) ->
    "anonymous procedure expected #{needed} input#{if needed > 1 then "s" else ""}, but only got #{given}"

  , 'REPORT can only be used inside TO-REPORT.': () ->
    "REPORT 只能在 TO-REPORT 中使用。"

  , 'STOP is not allowed inside TO-REPORT.': () ->
    "STOP 不能在 TO-REPORT 中使用。"

  , 'Reached end of reporter procedure without REPORT being called.': () ->
    "Reached end of reporter procedure without REPORT being called."

  , '_ doesn_t accept further inputs if the first is a string': (primName) ->
    "#{primName} doesn't accept further inputs if the first is a string"

  , 'Unfortunately, no perfect equivalent to `_` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.': (primName) ->
    "Unfortunately, no perfect equivalent to `#{primName}` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web."

  , 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.': (x, y) ->
    "The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions."

  , 'Cannot move turtle beyond the world_s edge.': () ->
    "不能把海龟带出世界的边缘。"

  , 'there is no heading of a link whose endpoints are in the same position': () ->
    "联结相同位置的2点的 link 没有方向。"

  , 'No heading is defined from a point (_,_) to that same point.': (x, y) ->
    "从点(#{x} , #{y})到同一点没有方向。"

}

module.exports = bundle
