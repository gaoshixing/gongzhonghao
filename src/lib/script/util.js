import store from 'store/index.js';
import querystring from 'querystring';

const shareList = [
    'menuItem:share:appMessage',
    'menuItem:share:timeline',
    'menuItem:share:qq',
    'menuItem:share:weiboApp',
    'menuItem:favorite',
    'menuItem:share:facebook',
    'menuItem:share:QZone',
];

/**
 * 获得querystring
 *
 * @return {object} 返回qs
 */
export function getQS() {
    return querystring.parse(location.href.split('?')[1]);
}

/*
* 截取时间
*/
export function timeSplit(v) {
    if(!v) return v;
    return v.split(' ')[0].replace(/-/g, '.');
};

/*
* 设置微信分享
*/
export function registerShare(option) {
    option = Object.assign(option, {
        success: function() {
            store.commit('setPopupGlobal', false);
        },
    });
    // wx.updateAppMessageShareData(option); // 分享到朋友圈
    // wx.updateTimelineShareData(option); // 分享给朋友
    wx.onMenuShareTimeline(option); // 分享到朋友圈
    wx.onMenuShareAppMessage(option); // 分享给朋友
    wx.onMenuShareQQ(option); // 分享给qq
    wx.onMenuShareWeibo(option); // 分享给腾讯微博
    wx.onMenuShareQZone(option); // 分享到QQ空间
};

/*
* 获取地理位置
*/
export function getLocation() {
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    });
};

/*
* 倒计时 时间点 24小时
*
* @param val: string
* @param type: string 传入时间类型 date time
*
*/
export class CountDown {
    constructor(val, type) {
        this.name = 'CountDown';
        this.val = val;
        this.type = type;
        this.timer = null; // 定时器
        this.returnVal = null;
    };
    init() {
        let endVal = 0;
        let loop = false;
        const nowVal = new Date().getTime();
        if (this.type === 'date') {
            endVal = new Date(this.val).getTime();
            const leftTime = parseInt((endVal - nowVal) / 1000);
            if (leftTime <= 0 ) {
                this.returnVal = false;
                loop = 'end'; // 超时
            } else if (leftTime < 86400) {
                this.returnVal =  endVal;
                loop = 'loop'; // 24 小时之内
            } else {
                this.returnVal =  this.val;
                loop = 'date'; // 一日以上的时间
            }
        }
        if (this.type === 'time') {
            endVal = this.val--;
            loop = 'loop';
            this.returnVal = this.getHMS(endVal);
        }
        return {
            returnVal: this.returnVal,
            timer: loop,
        };
    };

    getHMS(t) {
        let h,m,s = null;
        h = Math.floor(t / 3600);
        m = Math.floor((t % 3600) / 60);
        s = t % 60;
        return `${this.getZero(h, 'h')}${this.getZero(m, 'm')}${this.getZero(s, 's')}`;
    };

    getZero(n, type) {
        if (n) {
        n = n <= 9 ? ('0' + n) : (n);
        if (type === 'h') {
            n = n + '小时';
        } else if (type === 'm') {
            n = n + '分钟';
        } else {
            n = n + '秒';
        }
            return n;
        } else {
            if (type === 'm') {
                return '00分';
            } else if (type === 's') {
                return '00秒';
            } else {
                return '';
            }
        }
    };

    clearTimer() {
        this.timer = null;
        clearInterval(this.timer);
    };
};

/**
 * 等待毫秒数
 */
export function wait(ms) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, ms);
    });
};

/*
* 处理时间显示
*/
export function dateSlash(v) {
    if (!v) return v;
    return v.replace(/-/g, '/');
};

/*
* 等待
*/
export async function waitUntil(fn1, cb, interval=50, loop=100) {
    for(let i = 0; i <= loop; i++) {
        if (!fn1()) {
            await wait(interval);
        } else {
            cb && cb();
            break;
        }
    }
};

/** 
 *  苹果 键盘收起bug
*/
 export function wResize() {
    document.body.addEventListener('focusout', () => {
        document.body.scrollTop =  document.body.scrollHeight ;
    })
};

/*
* hideOptionMenu
*/
export function hideWxOptionMenu() {
    waitUntil(() => {
        return !!store.state.jssdk.jssdkConfig;
    }, () => {
        wx.hideOptionMenu();
    });
};