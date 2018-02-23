double[] add(double a[], double b[]) {
  double c[];
  int m = sizeof(a);
  int n = sizeof(b);
  if (m == n) {
    for (i=0; i<n; i++) {
	  c[i] = a[i] + b[i];
	}
  } else {
    printf("error");
  }
  return c;
}

int main() {
  double c[]=add([1,2,3,4], [4,3,2,1]);
  printf("c="+c);
}