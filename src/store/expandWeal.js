import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
        wealNum: null,
        wealList: [],
        fanliObject:{
            count:{},
            page:{
                list:[]
            }
        },
    },
    mutations: {
        setWealNum(state, data) {
            state.wealNum = data;
        },
        setWealList(state, data) {
            state.wealList = data;
        },
        setFanliObject(state, data) {
            state.fanliObject = data;
        },
    },
    actions: {
        async getWealNum({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpAppsFollow/wxDetail', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setWealNum', rdata.data.data);
            } else {
                Toast(rdata.data.message);
            }
            return rdata;
        },
        async getWealList({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpRebate/listPage', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setWealList', rdata.data.data);
            } else {
                Toast(rdata.data.message);
            }
            return rdata;
        },
        async getFanliObject({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpRebate/appListPage', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setFanliObject', rdata.data.data);
            } else {
                Toast(rdata.data.message);
            }
            return rdata;
        },
    },
};