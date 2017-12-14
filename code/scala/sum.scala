object sum {
  def main(args: Array[String]) {
    try {
      val elems = args map Integer.parseInt
      println("The sum of my arguments is: " + elems.foldRight(0) (_ + _))
    } catch {
      case e: NumberFormatException => 
        println("Usage: scala sum <n1> <n2> ... ")
    }
  }
}