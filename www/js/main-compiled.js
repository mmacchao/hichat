'use strict';

/**
 * Created by 6396000799 on 2016/7/29.
 */

var socket = io.connect();
var vm = new Vue({
    el: '#app',
    data: {
        wordColor: '#000', //输入的文字颜色
        nickname: '',
        beingSendMsg: '', //input输入框内容
        welcome: 'connect to server...',
        connect: false,
        loginSuccess: false,
        numbers: 0,
        canShowEmojiList: false,
        //所有对话信息
        dialogs: []
    },
    computed: {
        emojiList: function emojiList() {
            "use strict";
            //初始化 emoji 表情包

            var arr = [];
            for (var i = 1; i < 70; i++) {
                arr.push('img/emoji/' + i + '.gif');
            }
            return arr;
        }
    },
    init: function init() {
        var _this = this;

        //监听socket的connect事件, 此事件触发表示连接已建立
        socket.on('connect', function () {
            //connect属于非自定义事件
            //连接到服务器后, 显示昵称输入框
            _this.connect = true;
            _this.welcome = 'get yourself a nickname :)';

            //连接建立后使昵称框获得焦点
            _this.$nextTick(function () {
                "use strict";

                document.getElementById('nickname').focus();
            });
        });
        socket.on('nickExisted', function () {
            //监听 用户名 是否重复事件
            _this.welcome = 'nickname is taken, choose another pls';
        });
        socket.on('loginSuccess', function () {
            //登陆成功事件
            "use strict";

            _this.loginSuccess = true;
            // console.log(document.querySelector('#inputMsg'))
            document.querySelector('#inputMsg').focus();
        });
        socket.on('system', function (res) {
            //系统消息事件
            "use strict";

            res = JSON.parse(res);
            var words = res.nickname + (res.msg == 'login' ? ' joined' : ' left');
            // console.log(res.length)
            _this.numbers = res.length;
            _this.dialogs.push({ name: 'system', time: new Date().toLocaleTimeString(), words: { words: words, img: '', emoji: '' } });
        });
        socket.on('newMsg', function (nickname, words, color) {
            //接收服务器推送的文字
            "use strict";
            //处理文字中的emoji图片

            words = words.replace(/\[emoji:\s+(\d+)]/g, function ($0, $1) {
                return '<img src="img/emoji/' + $1 + '.gif">';
            });
            console.log(words);
            _this.dialogs.push({ name: nickname, time: new Date().toLocaleTimeString(), words: { words: words, img: '', emoji: '', color: color } });
        });
        socket.on('newImg', function (user, img, color) {
            //接收服务器推送的图片
            "use strict";

            console.log('newImg');
            _this.dialogs.push({ name: user, time: new Date().toLocaleTimeString(), words: { words: '', img: img, emoji: '', color: color } });
            console.log(img);
        });
    },

    methods: {
        //清屏
        clearScreen: function clearScreen() {
            "use strict";

            this.dialogs = [];
        },


        //单个emoji被点击
        selEmoji: function selEmoji(i) {
            "use strict";

            this.beingSendMsg += '[emoji: ' + (i + 1) + ']';
            this.canShowEmojiList = false;
        },


        //emoji按钮点击
        showEmojiList: function showEmojiList() {
            "use strict";

            this.canShowEmojiList = !this.canShowEmojiList;
        },
        submitNickname: function submitNickname(e) {
            console.log('sendname');
            if (this.nickname.trim()) {
                // console.log('login')
                socket.emit('login', this.nickname.trim());
            } else {
                this.nickname = '';
                // console.log(e.target.nodeName)
                if (e.target.nodeName != 'INPUT') {
                    e.target.previousElementSibling.focus();
                } else {
                    // console.log(e.target)
                    console.log('enter');
                    e.target.focus();
                }
            }
        },
        sendMsg: function sendMsg(msg) {
            this.beingSendMsg = '';
            document.querySelector('#inputMsg').focus();
            //信息不为空则发送
            if (msg.trim()) {
                // console.log('send');
                socket.emit('send', msg, this.wordColor);
                // console.log(this)
                // console.log(this.wordColor)
                msg = msg.replace(/\[emoji:\s+(\d+)]/g, function ($0, $1) {
                    return '<img src="img/emoji/' + $1 + '.gif">';
                });
                this.dialogs.push({ name: this.nickname, time: new Date().toLocaleTimeString(), words: { words: msg, img: '', emoji: '', color: this.wordColor } });
            }
        },
        sendImage: function sendImage(e) {
            "use strict";

            var _this2 = this;

            if (e.target.files.length != 0) {
                (function () {
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    if (!reader) {}
                    var that = _this2;
                    reader.onload = function (e) {
                        this.value = '';
                        socket.emit('img', e.target.result, that.wordColor);
                        // console.log(e.target.result);
                        that.dialogs.push({ name: that.nickname, time: new Date().toLocaleTimeString(), words: { words: '', img: e.target.result, emoji: '', color: that.wordColor } });
                    };
                    reader.readAsDataURL(file);
                })();
            }
        }
    },
    watch: {
        nickname: function nickname(newV) {
            "use strict";
            // console.log(newV);

            if (!newV.trim()) {
                this.welcome = 'get yourself a nickname :)';
            }
        },
        dialogs: function dialogs() {
            "use strict";
            //将对话列表最后一条显示在屏幕上

            var _this3 = this;

            this.$nextTick(function () {
                if (document.querySelector('#msgList > li:last-child') != null) {
                    document.querySelector('#msgList > li:last-child').scrollIntoView();
                    //保存对话列表
                    window.localStorage.setItem('msgList', JSON.stringify(_this3.dialogs));
                }
            });
        }
    }
});

//vm.dialogs初始化
if (window.localStorage.getItem('msgList') != null) {
    vm.dialogs = JSON.parse(window.localStorage.getItem('msgList'));
}
//# sourceMappingURL=main-compiled.js.map
