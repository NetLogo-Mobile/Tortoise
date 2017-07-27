// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

object ExtDefReader {
  // scalastyle:off line.size.limit
  def getAll(): Seq[String] = Seq(
    """{ "name": "codap", "prims": [ { "name": "init", "actionName": "init", "argTypes": ["command"] }, { "name": "call", "actionName": "call", "argTypes": ["wildcard"] } ] }""",
    """{ "name": "nlmap", "prims": [ { "name": "from-list", "actionName": "from-list", "argTypes": ["list"], "returnType": "wildcard" }, { "name": "to-list", "actionName": "to-list", "argTypes": ["wildcard"], "returnType": "list" }, { "name": "is-map?", "actionName": "is-map?", "argTypes": ["wildcard"], "returnType": "boolean" }, { "name": "get", "actionName": "get", "argTypes": ["wildcard", "string"], "returnType": "wildcard" }, { "name": "remove", "actionName": "remove", "argTypes": ["wildcard", "string"], "returnType": "wildcard" }, { "name": "add", "actionName": "add", "argTypes": ["wildcard", "string", "wildcard"], "returnType": "wildcard" } ] }"""
  )
  // scalastyle:on line.size.limit
}
