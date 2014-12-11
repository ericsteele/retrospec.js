@echo OFF

REM Get the current datetime (YYYY-MM-DD_HH-MM-SS format)
REM Src: http://stackoverflow.com/a/1445724
set HOUR=%time:~0,2%
set dtStamp9=%date:~-4%-%date:~4,2%-%date:~7,2%_%time:~1,1%-%time:~3,2%-%time:~6,2% 
set dtStamp24=%date:~-4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
if "%HOUR:~0,1%" == " " (set dtStamp=%dtStamp9%) else (set dtStamp=%dtStamp24%)

call:printInfo "install "retrospec" npm module globally"
call npm install retrospec -g

call:printInfo "cd to retrospec's parent directory (from retrospec.js\test\e2e)"
cd ..\..\..

call:printInfo "clone the "jquery-mobile" git repository"
call git clone https://github.com/jquery/jquery-mobile jquery-mobile

call:printInfo "cd into the 'jquery-mobile' directory"
cd jquery-mobile

call:printInfo "create output directory"
if not exist ..\jqm-e2e-results-%dtStamp% mkdir ..\jqm-e2e-results-%dtStamp%

call:printInfo "git checkout 3a22e02"
call git checkout 3a22e02
call:npmInstall

call:printInfo "initial run of retrospec"
call retrospec ..\retrospec.js\test\input\configs\jqm-retrospec-config-131.json -rs

:: Commence e2e test (20 consecutive revisions)
call:executeTests 01 2e1bb85
call:executeTests 02 277d379
call:executeTests 03 044a3f8
call:executeTests 04 aea0f99
call:executeTests 05 eb8d2ba
call:executeTests 06 b9b25ba
call:executeTests 07 1651544
call:executeTests 08 7378b55
call:executeTests 09 7b31cee
call:executeTests 10 bc4d8e2
call:executeTests 11 468d221
call:executeTests 12 5f34b77
call:executeTests 13 0e6bf28
call:executeTests 14 2d5b272
call:executeTests 15 1ff2d3a
call:executeTests 16 bbb3bd5
call:executeTests 17 40d4cb8
call:executeTests 18 87453e0
call:executeTests 19 4b66652

call:printInfo "returning to retrospec.js\test\e2e"
cd ..\retrospec.js\test\e2e

call:printInfo "jquery-mobile e2e test complete"

GOTO:EOF
:executeTests
call:gitCheckout %~2
call:npmInstall
call:runRetrospec %~1 %~2
GOTO:EOF

GOTO:EOF
:printInfo
echo [info] %~1
GOTO:EOF

GOTO:EOF
:gitCheckout
call:printInfo "git checkout %~1"
call git checkout %~1
GOTO:EOF

GOTO:EOF
:npmInstall
call:printInfo "npm install"
call npm install
GOTO:EOF

GOTO:EOF
:runRetrospec
call:printInfo "running retrospec"
call retrospec ..\retrospec.js\test\input\configs\jqm-retrospec-config-131.json -s > ..\jqm-e2e-results-%dtStamp%\results-for-sha-%~1-%~2.txt
GOTO:EOF
