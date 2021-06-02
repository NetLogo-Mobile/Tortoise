# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

module.exports = {

  init: (workspace) ->

    # (String, (String) => Unit) => Unit
    fromFilepath = (filepath, callback) ->
      # `TestModels` needs this, and I don't see any sensible way around it --JAB (3/13/19)
      if Polyglot?
        workspace.ioConfig.importFile(filepath)(callback)
      else
        throw exceptions.extension("'fetch:file-async' is not supported in NetLogo Web.  Use 'fetch:user-file-async' instead.")
      return

    # (String) => String
    fromFilepathSynchronously = (filepath, callback) ->
      throw exceptions.extension("'fetch:file' is not supported in NetLogo Web.  Use 'fetch:user-file-async' instead.")
      return

    # (String, (String) => Unit) => Unit
    fromURL = (url, callback) ->
      workspace.ioConfig.slurpURLAsync(url)(callback, workspace.reportErrors)
      return

    # (String) => String
    fromURLSynchronously = (url) ->
      workspace.ioConfig.slurpURL(url)

    # ((Boolean|String) => Unit) => String
    fromFileDialog = (callback) ->
      workspace.ioConfig.slurpFileDialogAsync(callback)
      return

    # () => String
    fromFileDialogSynchronously = ->
      throw exceptions.extension("'fetch:user-file' is not supported in NetLogo Web.  Use 'fetch:user-file-async' instead.")
      return

    {
      name: "fetch"
    , prims: {
                   "FILE": fromFilepathSynchronously
      ,      "FILE-ASYNC": fromFilepath
      ,             "URL": fromURLSynchronously
      ,       "URL-ASYNC": fromURL
      ,       "USER-FILE": fromFileDialogSynchronously
      , "USER-FILE-ASYNC": fromFileDialog
      }
    }

}
