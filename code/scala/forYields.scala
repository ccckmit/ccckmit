/** Turn command line arguments to uppercase */
object forYields {
  def main(args: Array[String]) {
    val res = for (a <- args) yield a.toUpperCase
    println("Arguments: " + res.toString)
  }
}