import qs from 'querystring';
import store from 'store/index.js';
import jssdk from 'lib/plugins/jssdk';
/*
* 设置页面标题
*/
export function setTitle(to) {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    } else {
        document.title = '';
    }
};

/*
* 配置 jssdk
*/
export async function jssdkConfig() {
    // if (store.state.jssdk.jssdkConfig) {
    //     return next();
    // }
    if (!store.state.user.userInfo) {
        await store.dispatch('getUserInfo');
    }

    function jssdkCheck() {
        return new Promise(function(resolve, reject) {
            jssdk.error(function(res) {
                reject(new Error(res.errMsg));
            });
            jssdk.ready(function(res) {
                resolve(true);
            });
        });
    }
    for (let i = 0; i < 3; i++) {
        // 获取JS-SDK
        const params = await store.dispatch('getJSSDKParams', {
            appId: store.state.user.userInfo.appId,
            url: encodeURIComponent(location.href.substr(0, location.href.indexOf('#'))),
        });
        store.commit('setJSSDKReady', false);
        store.commit('setJSSDKError', false);
        store.commit('setJSSDKConfig', false);
        jssdk.config({  
            debug: true,
            appId: params.appId, // 必填，公众号的唯一标识
            timestamp: params.timestamp, // 必填，生成签名的时间戳
            nonceStr: params.noncestr, // 必填，生成签名的随机串
            signature: params.signature, // 必填，签名，见附录1
            jsApiList: [ // 接口
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'closeWindow',
                'hideOptionMenu',
                'showOptionMenu',
                'chooseWXPay',
                'getLocation',
                'getLocalImgData',
                'hideMenuItems',
                'showMenuItems',
                'getLocation'
            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        store.commit('setJSSDKParams', params);
        store.commit('cacheJSSDKParams', true);

        /* eslint-disable handle-callback-err */
        const result = await jssdkCheck().catch(err => false);

        if (result) break;
    }
};

export async function checkUserInfo(to, from, next) {
    if (store.state.util.popupAppGlobal) store.commit('setPopupGlobal', false); // 分享引导弹窗 切换页面的时候 自动关闭
    if (!store.state.user.userInfo) await store.dispatch('getUserInfo');
    next();
};

export async function dealHash(to) {
    let hashs = '';
    let searches = location.search;
    if (!location.hash || location.hash === '#/') {
        const qss = qs.decode(location.search.substr(location.search.indexOf('?') + 1));
        Object.keys(qss).forEach(item => {
            if (item.includes('router')) {
                hashs = qss[item];
                if (searches.startsWith('?router') && searches.split('&').length >= 2) {
                    let tempData = '';
                    searches.split('&').splice(1).forEach(item => tempData += item + '&');
                    tempData = tempData.substr(0, tempData.length - 1);
                    hashs += '?' + tempData;
                    searches = searches.split('&')[0];
                    location.replace(`${location.protocol}//${location.hostname}${location.pathname}${searches}/#/${hashs}`);
                } else {
                    setTimeout(() => { location.hash = `/${hashs}`; }, 0);
                }
            }
        });
    }
    // 本地测试使用
    // else {
    //     if (!location.href.includes('router=') && location.hash) {
    //         searches = searches.endsWith('/') ? searches.substr(0, searches.length - 1) : searches;
    //         location.replace(`${location.protocol}//${location.hostname}${location.pathname}?router=${location.hash.substr(2)}/${location.hash}${searches}`);
    //     }
    // }
    await jssdkConfig();
};
/*
* 处理地址栏qs
*/
export function dealQs() {
    const obj = {};
    let url = location.href;
    const tempArr = url.split('?');
    tempArr.forEach(item => {
        if(item.includes('#/')) item = item.substr(0, item.indexOf('#/'));
        item = item.split('&');
        item.forEach(items => {
            items = items.split('=');
            obj[items[0]] = items[1];
        });
    });
    return obj;
};