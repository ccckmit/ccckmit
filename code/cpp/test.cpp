#include<iostream>
using namespace std;

    typedef struct fuction
{
  float fi;
  int fj;
  struct fuction *Next;
}Node;

Node *AddTail(Node *, float , int);
Node *Add(Node *, Node *);
void Print(Node *head);

int main(){
Node *A,*B,*C; 
Node *A2 = new Node(), *A1=new Node(), *A0=new Node(); 
A2->fi = 5; A2->fj = 2; A2->Next = A1;
A1->fi = 4; A1->fj = 1; A1->Next = A0;
A0->fi = 1; A0->fj = 0; A0->Next = NULL; 
A = A2;
Print(A);
// B ?? 糶





   C = Add(A, A);
Print(C);

   system("PAUSE");
   return 0;
}

void Print(Node *head) {
     Node *ptr = head;
     while (ptr != NULL) {
           cout << "(" << ptr->fi << " " << ptr->fj << ")";
           ptr = ptr->Next;
     }
}

Node *AddTail(Node *tail, float fi, int fj) //玒计计笲
 
	{ 
	  Node *p;
	  p= new Node; 
	  p->fi = fi; 
	  p->fj = fj; 
	  p->Next =NULL; 
      tail->Next=p;
	  return (p); 
	} 
 
Node *Add(Node *List1, Node *List2) //add function 
	{ 
               Node *ctail;
	  Node *List3 = NULL; 
	  List3=new Node;
	  List3=ctail;
 List1=List1->Next;
  List2=List2->Next;
	  while (List1 != NULL || List2 != NULL)  //兜Αぃ 
	  { 

	    if (List1->fj == List2->fj)           //计, 玒计 
	    { 
	      ctail = AddTail(ctail, List1->fi + List2->fi, List1->fj); 
	      List1 = List1->Next; 
	      List2 = List2->Next; 
	    } 
	    else if (List1->fj > List2->fj)  //玒计1>2 
	    { 
	      ctail = AddTail(ctail, List1->fi, List1->fj); 
	      List1 = List1->Next; 
	    } 
	    else {                                                   
	      ctail = AddTail(ctail, List2->fi, List2->fj);  //玒计2>1 
	      List2 = List2->Next; 
	    } 
	  } 
	  return (List3); 
	} 
          

