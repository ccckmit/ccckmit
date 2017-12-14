#include<list>
#include<iostream>

int main(void)
{  
   using namespace std; 
   int i;
   list<int> obj;
   list<int>::iterator j;
   for(i=0;i<10;i++)
   {
       obj.push_back(i+1);
   }
   for(j=obj.begin();j!=obj.end();j++)
      cout<<(*j)<<"  ";
   cout<<endl;
   obj.push_front(0);
   
   j=obj.begin();
   for(i=0;i<7;i++)
      j++;
   obj.insert(j,11);
   for(j=obj.begin();j!=obj.end();j++)
      cout<<(*j)<<"  ";
   cout<<endl;
   return 1;
}
