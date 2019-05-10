// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import java.nio.file.{ Path, Files => RealFiles }
import scala.collection.mutable.Map

object Files {
  val pretendFiles = Map[String, Array[Byte]]()

  def createDirectories(path: Path): Unit = { }

  def write(path: Path, bytes: Array[Byte]): Unit = {
    pretendFiles(path.normalize.toString) = bytes
  }

  def readAllBytes(path: Path): Array[Byte] = {
    // if a real file exists at the path, return its bytes.
    // if not, we probably intercepted the write call
    // so return our fake bytes -Jeremy B May 2019
    val file = path.toFile
    if (file.exists) {
      RealFiles.readAllBytes(path)
    } else {
      pretendFiles(path.normalize.toString)
    }
  }

  def readToSingleString(path: Path): String = {
    val file = path.toFile
    if (file.exists) {
      val realLines = RealFiles.readAllLines(path)
      String.join("\n", realLines)
    } else {
      new String(pretendFiles(path.normalize.toString))
    }
  }
}
