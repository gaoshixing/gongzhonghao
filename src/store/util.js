import Vue from 'vue';

export default {
    state: {
        // 正在请求数
        requesting: 0,
        // 是否登录
        hasLogin: false,
        // 是否正在登录
        requestLogin: false,
        // 购买状态 group | buy
        buyType: null,
        // 引导分享弹窗
        popupAppGlobal: false,
    },
    mutations: {
        startRequest(state) {
            state.requesting += 1;
        },
        endRequest(state) {
            const count = state.requesting;
            state.requesting = Math.max(0, count - 1);
        },
        setHasLogin(state, data) {
            state.hasLogin = data;
        },
        setRequestLogin(state, data) {
            state.requestLogin = data;
        },
        setBuyType(state, data) {
            state.buyType = data;
        },
        setPopupGlobal(state, data) {
            state.popupAppGlobal = data;
        },
    },
    actions: {
        /**
         * 获得jssdk参数
         * @param {} url 链接
         */
        getJSSDKParams({ rootState, commit, }, { url, appId, }) {
            if (!rootState.jssdk._cacheJSSDKParams) {
                return Vue.axios.get(`/market/wxJssdk/get?url=${url}&appId=${appId}`).then(function(response) {
                    const jssdk = response.data.data;
                    commit('setJSSDKParams', jssdk);
                    commit('cacheJSSDKParams', true);
                    return jssdk;
                });
            } else {
                return rootState.jssdk.jssdkParams;
            }
        },
        /*
        * 获取图片地址
        */
        async getImg({ commit },data) {
            const rdata = await Vue.axios.get('/sys/attachment/getPath', {
                params: data,
            });
            if (rdata.status === 200) {
                return rdata.data.data.path;
            } else {
                return '';
            }
        },
        /*
        * 查字典 /a/ws/sys/dict/listData
        */
        async getDict({ commit, }, data) {
            const rdata = await Vue.axios.get('/sys/dict/listData', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                return rdata.data.data;
            } else {
                return [];
            }
        },
    },
};