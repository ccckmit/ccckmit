## C

* [Jserv -- C02: phonebook](https://hackmd.io/s/HJJUmdXsZ)
  * 習題：用來理解 cache 對 C 語言效能的影響。
* https://github.com/embedded2015/rubi
  * sudo apt-get install g++-multilib

```
    1  ping www.google.com
    2  ping 127.0.0.1
    3  ping 210.59.154.30
    4  ddd
    5  ping mdbookspace.com
    6  ls
    7  gcc
    8  ls
    9  pwd
   10  ls
   11  mkdir git
   12  cd git
   13  ls
   14  git clone https://github.com/embedded2015/rubi.git
   15  sudo apt install git
   16  git
   17  sudo apt-get update
   18  sudo apt install git
   19  ls
   20  git clone https://github.com/embedded2015/rubi.git
   21  cd rubi
   22  ls
   23  make
   24  ls
   25  make
   26  ls
   27  ./rubi progs/fib.rb
   28  cd ..
   29  git clone https://github.com/jserv/amacc.git
   30  cd amacc
   31  ls
   32  make
   33  sudo apt-get install qemu-user
   34  sudo apt-get install gcc-arm-linux-gnueabi
   35  ls
   36  make
   37  sudo apt-get install arm-linux-gnueabihf-gcc
   38  cd ..
   39  git clone https://github.com/jserv/mini-arm-os.git
   40  cd mini-arm-os/
   41  ls
   42  make
   43  cd 00-HelloWorld/
   44  ls
   45  make
   46  sudo apt-get install arm-none-eabi-gcc
   47  cd ..
   48* 
   49  cd beckus-qemu_stm32-b37686f/
   50  ls
   51  ./configure --disable-werror --enable-debug     --target-list="arm-softmmu"     --extra-cflags=-DSTM32_UART_NO_BAUD_DELAY     --extra-cflags=-DSTM32_UART_ENABLE_OVERRUN     --disable-gtk
   52  sudo apt-get install zlib
   53  sudo apt-get install zlib1g-dev
   54  make
   55  ./configure --disable-werror --enable-debug     --target-list="arm-softmmu"     --extra-cflags=-DSTM32_UART_NO_BAUD_DELAY     --extra-cflags=-DSTM32_UART_ENABLE_OVERRUN     --disable-gtk
   56  sudo apt-get install libtool-bin
   57  ./configure --disable-werror --enable-debug     --target-list="arm-softmmu"     --extra-cflags=-DSTM32_UART_NO_BAUD_DELAY     --extra-cflags=-DSTM32_UART_ENABLE_OVERRUN     --disable-gtk
   58  sudo apt-get install libglib2.22
   59  sudo apt-get install libglib
   60  sudo apt-get install libglib2.22-dev
   61  sudo apt-get install libglslib2.22-dev
   62  cd ..
   63  ls
   64  cd mini-arm-os/
   65  ls
   66  cd 00-HelloWorld/
   67  make
   68  cd ..
   69  git clone https://github.com/embedded2015/phonebook.git
   70  cd phonebook/
   71  ls
   72  make
   73  ./phonebook_orig
   74  ./phonebook_opt
   75  history

```