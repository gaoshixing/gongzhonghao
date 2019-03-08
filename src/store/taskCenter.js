import Vue from 'vue';
import { Toast, } from 'mint-ui';
import { dateSlash, } from 'lib/script/util.js';
import store from 'store/index.js';

export default {
    state: {
        listPage: [],
        pageNo: 1,
        pageCount: 1,
    },
    mutations: {
        setListPage(state, data) {
            state.listPage = data;
        },
        setPageNo(state, data) {
            state.pageNo = data;
        },
        setPageCount(state, data) {
            state.pageCount = data;
        },
    },
    actions: {
        async getListPage({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpTask/listPage', data);
            if (rdata.data.statusCode === 200) {
                const list = rdata.data.data.list;
                list.forEach(item => {
                    item.endTime = item.endTime ? new Date(dateSlash(item.endTime)).format('yyyy-MM-dd hh:mm:ss') : null;
                });
                commit('setListPage', list);
                commit('setPageNo', rdata.data.data.pageNo);
                commit('setPageCount', rdata.data.data.pageCount);
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /*
        * 是否是第一次进入该页面 修改蒙版展示
        */
        async getWetherFirstLink({ state, }, data) {
            const rdata = await Vue.axios.get('/market/wpAppsFollow/updateMask', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                store.dispatch('getUserInfo');
            } else {
                Toast(rdata.data.message);
            }
            return rdata;
        },
    },
};