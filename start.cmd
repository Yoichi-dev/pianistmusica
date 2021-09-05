@echo off
@REM MIDI起動
start call "C:\Program Files (x86)\Tobias Erichsen\loopMIDI\loopMIDI.exe"
@REM ２秒待つ
timeout /t 2 > nul
@REM 光るの起動
start call "%USERPROFILE%\Downloads\SoundMage2_v1200\SoundMage2.exe"
@REM ２秒待つ
timeout /t 2 > nul
@REM NODE起動
node index.js