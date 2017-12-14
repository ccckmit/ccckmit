mac020:docker mac020$ docker pull ubuntu:latest
latest: Pulling from library/ubuntu
660c48dd555d: Pull complete 
4c7380416e78: Pull complete 
421e436b5f80: Pull complete 
e4ce6c3651b3: Pull complete 
be588e74bd34: Pull complete 
Digest: sha256:7c67a2206d3c04703e5c23518707bdd4916c057562dd51c74b99b2ba26af0f79
Status: Downloaded newer image for ubuntu:latest
mac020:docker mac020$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              latest              20c44cd7596f        2 weeks ago         123MB
mac020:docker mac020$ sudo docker run -t -i ubuntu:latest /bin/bash
Password:
mac020:docker mac020$ docker run -t -i ubuntu:latest /bin/bash
root@02847d7babe8:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
    5  sudo apt-get update
    6  apt-get update
    8  apt-get install git
   13  git clone https://github.com/ccckmit/code.git
   29  apt-get install -y pkg-config gcc
   30  apt-get install libglib2.0-dev
   34  apt-get install -y vim
   35  vim hashtable.c
   36  gcc hashtable.c -Wall -o hashtable `pkg-config --cflags --libs glib-2.0`
   94  curl -sL https://deb.nodesource.com/setup_8.x | bash -
   95  apt-get install -y nodejs
   96  node -v
mac020:docker mac020$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                       PORTS               NAMES
f247322cfa90        ubuntu:latest       "/bin/bash"         4 minutes ago       Exited (127) 2 minutes ago                       blissful_bardeen
88ee5522f9f9        ubuntu:latest       "/bin/bash"         5 minutes ago       Exited (127) 4 minutes ago                       sad_noether
02847d7babe8        ubuntu:latest       "/bin/bash"         21 hours ago        Exited (0) 2 seconds ago                         agitated_yonath

mac020:docker mac020$ docker start -i 0284
root@02847d7babe8:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@02847d7babe8:/# gcc
gcc: fatal error: no input files
compilation terminated.
root@02847d7babe8:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@02847d7babe8:/# cd home
root@02847d7babe8:/home# ls
code  git
root@02847d7babe8:/home# cd code
root@02847d7babe8:/home/code# ls
JavaScript  README.md  c  cpp  electronjs  go  html  installer  kotlin  nodejs  python  scala  shell  verilog
