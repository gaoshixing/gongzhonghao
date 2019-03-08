import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
        info: null,
        formInfo: null,
        previewInfo: null,
        expandId: null,
        readTaskPreview: null, // 阅读任务预览页面
        saleTaskStatistics: null,
    },
    mutations: {
        setInfo(state, data) {
            state.info = data;
        },
        setFormInfo(state, data) {
            state.formInfo = data;
        },
        setPreviewInfo(state, data) {
            state.previewInfo = data;
        },
        setExpandId(state, data) {
            state.expandId = data;
        },
        setReadTaskPreview(state, data) {
            state.readTaskPreview = data;
        },
        setSaleTaskStatistics(state, data) {
            state.saleTaskStatistics = data;
        },
    },
    actions: {
        async getInfo({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpSpreadDetail/objectForm', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setInfo', rdata.data.data);
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        async getFormInfo({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpTask/form', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setFormInfo', rdata.data.data);
            } else {
                Toast(rdata.data.message);
                return;
            }
        },
        /*
        * 任务详情页面获取任务信息 以及 预览页面需要的信息
        */
        async getPreviewInfo({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpTask/objectForm', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setPreviewInfo', rdata.data.data);
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /*
        * 保存任务 获取推广ID
        */
        async saveTask({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpSpreadDetail/save', data);
            if (rdata.data.statusCode === 200) {
                commit('setExpandId', rdata.data.data);
            } else {
                //Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        async getReadTaskPreviewInfo({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpTask/readObjectForm', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setReadTaskPreview', rdata.data.data);
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /*
        * 推广员推广数据获取
        */
        async getExpandeNum({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpSpreadDetail/saleTaskStatistics', data);
            if (rdata.data.statusCode === 200) {
                commit('setSaleTaskStatistics', rdata.data.data);
                return rdata.data;
            } else {
                Toast(rdata.data.message);
                return false;
            }
        },
        /*
        * 推广详情页的推广列表
        */
        async getExpandDetailExpandList({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpSpreadDetail/listPage', data);
            if (rdata.data.statusCode === 200) {
                console.log('this is list page rdata___', rdata.data);
                return rdata.data;
            } else {
                Toast(rdata.data.messages);
                return;
            }
        },
        /*
        * 点击推广详情 显示列表项 market/wpOrder/listPage
        */
        async getSuccessExpandListPage({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpOrder/listPage', data);
            if (rdata.data.statusCode === 200) {
                console.log('点击推广详情 显示列表项', rdata.data);
                return rdata.data;
            } else {
                Toast(rdata.data.message);
                return false;
            }
        },
    },
};