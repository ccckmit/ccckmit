/* Adding ! as a method on int's */
object extendBuiltins extends Application {
  def fact(n: Int): BigInt =
    if (n == 0) 1 else fact(n-1) * n
  class Factorizer(n: Int) {
    def ! = fact(n)
  }
  implicit def int2fact(n: Int) = new Factorizer(n)

  println("10! = " + (10!))
}