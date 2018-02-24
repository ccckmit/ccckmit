D:\git\matplotnode>@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe
" -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebCl
ient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%
;%ALLUSERSPROFILE%\chocolatey\bin"

Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----       2017/6/11  上午 10:51            chocInstall
Getting latest version of the Chocolatey package for download.
Getting Chocolatey from https://chocolatey.org/api/v2/package/chocolatey/0.10.7
.
Downloading 7-Zip commandline tool prior to extraction.
Extracting C:\Users\user\AppData\Local\Temp\chocolatey\chocInstall\chocolatey.z
ip to C:\Users\user\AppData\Local\Temp\chocolatey\chocInstall...
Installing chocolatey on this machine
Creating ChocolateyInstall as an environment variable (targeting 'Machine')
  Setting ChocolateyInstall to 'C:\ProgramData\chocolatey'
WARNING: It's very likely you will need to close and reopen your shell
  before you can use choco.
Restricting write permissions to Administrators
We are setting up the Chocolatey package repository.
The packages themselves go to 'C:\ProgramData\chocolatey\lib'
  (i.e. C:\ProgramData\chocolatey\lib\yourPackageName).
A shim file for the command line goes to 'C:\ProgramData\chocolatey\bin'
  and points to an executable in 'C:\ProgramData\chocolatey\lib\yourPackageName
'.

Creating Chocolatey folders if they do not already exist.

WARNING: You can safely ignore errors related to missing log files when
  upgrading from a version of Chocolatey less than 0.9.9.
  'Batch file could not be found' is also safe to ignore.
  'The system cannot find the file specified' - also safe.
chocolatey.nupkg file not installed in lib.
 Attempting to locate it from bootstrapper.
PATH environment variable does not have C:\ProgramData\chocolatey\bin in it. Add
ing...
警告: Not setting tab completion: Profile file does not exist at
'C:\Users\user\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1'.
Chocolatey (choco.exe) is now ready.
You can call choco from anywhere, command line or powershell by typing choco.
Run choco /? for a list of functions.
You may need to shut down and restart powershell and/or consoles
 first prior to using choco.
Ensuring chocolatey commands are on the path
Ensuring chocolatey.nupkg is in the lib folder