/** Print prime numbers less than 100, very inefficiently */
object primes extends Application {
  def isPrime(n: Int) = (2 until n) forall (n % _ != 0)
  for (i <- 900 to 1000 if isPrime(i)) println(i)
}