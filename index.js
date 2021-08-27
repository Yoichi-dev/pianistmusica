// OBS関連
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

// MIDIキーボード関連
const midi = require('midi');

// OBSのBGMミュートフラグ
let obsBgmMuteFlg = false;

// カウント秒数
const notPlayTime = 3;

// OBS情報
const OBS_ADDRESS = 'localhost:4444'; // デフォルト
const PASSWORD = 'P@ssW0rd!'; // 例

// MIDI情報
const inputMidiName = 'RD Series';
const outputMidiName = 'loopMIDI Port';

// BGMソースの名称
const BGM_NAME = 'BGM';

// 規定オープンフラグ
let inputOpenFlg = false;
let outputOpenFlg = false;

// 接続されている端末取得
const inputMidiDevice = new midi.Input();

// MIDIの受信ポートがいくつあるかを調べる
const inputList = inputMidiDevice.getPortCount();

// 入力デバイスオープン
for (let i = 0; i < inputList; i++) {
    if (inputMidiDevice.getPortName(i) == inputMidiName) {
        // オープン
        inputMidiDevice.openPort(i);
        console.log('入力オープン成功');
        inputOpenFlg = true;
    }
}

// 出力先
const outputMidiDevice = new midi.output();

// 出力ポート一覧取得
const outputList = outputMidiDevice.getPortCount();

// 出力デバイスオープン
for (let i = 0; i < outputList; i++) {
    if (outputMidiDevice.getPortName(i) == outputMidiName) {
        // オープン
        outputMidiDevice.openPort(i);
        console.log('出力オープン成功');
        outputOpenFlg = true;
    }
}

if (!inputOpenFlg || !outputOpenFlg) {
    console.log('入出力のオープンに失敗しました');
    process.exit(1);
}

// OBS接続情報設定
obs.connect({
    address: OBS_ADDRESS,
    password: PASSWORD
})
    .then(() => {
        console.log('OBS接続成功');
    })
    .catch(err => {
        console.log(err);
    });

console.log(`${notPlayTime}秒間ピアノ演奏がないとBGMがオンになります`)

// BGM復帰秒数
let count = notPlayTime;

// 無演奏カウントダウン
const countDown = () => {
    // ミュートになっている時だけカウント
    if (obsBgmMuteFlg) {
        if (count != 3) {
            console.log(`無演奏カウント：${count}`);
        }
        count--;
        if (count < 0) {
            obsBgmMuteFlg = false;
            console.log('OBSミュート解除');
            changeMute('SetMute', BGM_NAME, obsBgmMuteFlg);
            count = notPlayTime;
        }
    }
}

// タイマー設定（3秒演奏していないか確認）
setInterval(countDown, 1000);

// MIDIメッセージを監視（演奏しているか）
inputMidiDevice.on('message', (deltaTime, message) => {

    // [ 254 ] を無視する
    if (String(message) == '254') {
        return
    }

    // BGMをミュートに
    if (!obsBgmMuteFlg) {
        obsBgmMuteFlg = true;
        // ミュート切り替え
        console.log('OBSミュート設定');
        changeMute('SetMute', BGM_NAME, obsBgmMuteFlg);
    }

    outputMidiDevice.sendMessage(message);

    // カウントを元に
    count = notPlayTime;
});

// ソケットエラー
obs.on('error', err => {
    console.error('socket error:', err);
});

// ミュートに設定
function changeMute(methodNm, sourceNm, mute) {
    obs.send(methodNm, {
        source: sourceNm,
        mute: mute
    })
        .then(data => {
            console.log(`OBSミュート操作：${data.status}`);
        })
        .catch(err => {
            console.log(err);
        });
}

// 今は「Ctrl + C」で終了
console.log('「Ctrl + C」で終了');
// obs.disconnect();
// midiDevice.closePort();