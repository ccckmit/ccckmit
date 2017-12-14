#include<map>
#include<iostream>
using namespace std;
int main()
{
   map<int,const char*> student;
   map<int,const char*>::iterator mi;
   typedef pair <int,const char*> Pair;
   student.insert(Pair(1001,"sun"));
   student.insert(Pair(1002,"li"));
   student.insert(Pair(1003,"zheng"));
   student.insert(Pair(1004,"zhang"));
   mi=student.find(1003);//�d��Ǹ���1003���ǥ�
   if(mi==student.end())
       cout<<"1003 not found!"<<endl;
   else
     cout<<mi->first<<"  "<<mi->second<<endl;
   return 1;
}
