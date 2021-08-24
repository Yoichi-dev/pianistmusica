// OBS関連
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

// MIDIキーボード関連
const midi = require('midi');

// OBSのBGMミュートフラグ
let obsBgmMuteFlg = false;

// カウント秒数
const notPlayTime = 3;
console.log(`${notPlayTime}秒間ピアノ演奏がないとBGMがオンになります`)

// OBS情報
const OBS_ADDRESS = 'localhost:4444'; // デフォルト
const PASSWORD = 'P@ssW0rd!'; // 例

// BGMソースの名称
const BGM_NAME = 'BGM';

// 接続されている端末取得
const midiDevice = new midi.Input();

try {
    midiDevice.getPortCount();
    midiDevice.getPortName(1);
    midiDevice.openPort(1);
    midiDevice.ignoreTypes(false, false, false);
    console.log('MIDIキーボード接続成功');
} catch (err) {
    console.log(`MIDI error : ${err}`);
    obs.disconnect();
    midiDevice.closePort();
    // 強制終了
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
midiDevice.on('message', (deltaTime, message) => {
    // BGMをミュートに
    if (!obsBgmMuteFlg) {
        obsBgmMuteFlg = true;
        // ミュート切り替え
        console.log('OBSミュート設定');
        changeMute('SetMute', BGM_NAME, obsBgmMuteFlg);
    }
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