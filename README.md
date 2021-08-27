# 塔野ムジカ(@PianistMusica)向けOBS拡張機能
本システムはOBSとMIDIキーボードを接続した際、演奏が始まると自動でBGMソースをミュートにすると言うものになります  
また、演奏が終了後MIDIキーボードが3秒無音が続くと自動でBGMソースのミュートが解除されます


# Requirement
- [OBS](https://obsproject.com/ja)
- [obs-websocket](https://github.com/Palakis/obs-websocket)
- [Node.js](https://nodejs.org/ja/)
- [Python](https://www.python.org/)
- [Desktop development with C++](https://github.com/nodejs/node-gyp#on-windows)
- [loopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html)


# Demo
https://twitter.com/yoichiro_sub/status/1429811089630326789


# Installation
```bash
npm i
```


# Usage
```bash
git clone https://github.com/Yoichi-dev/pianistmusica.git
cd pianistmusica
node index.js
```
または `start.cmd` を実行


# Author
よーいちろー（[@TYoichiro](https://twitter.com/TYoichiro)）
