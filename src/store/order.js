/*
* 我的订单
* 确认订单信息
* 支付
*/
import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
        orderOrderList: [],
        orderPageNo: 1,
        orderPageCount: 1,
    },
    mutations: {
        setOrderListPage(state, data) {
            state.listPage = data;
        },
        setOrderPageNo(state, data) {
            state.pageNo = data;
        },
        setOrderPageCount(state, data) {
            state.pageCount = data;
        },
    },
    actions: {
        /*
        * 获取订单列表 POST /a/ws/market/wpOrder/listPage
        */
        async getOrderListPage({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpOrder/listPage', data);
            if (rdata.data.statusCode === 200) {
                console.log('[ rdata ]', rdata.data);
                commit('setOrderListPage', rdata.data.data.list);
                commit('setOrderPageNo', rdata.data.data.pageNo);
                commit('setOrderPageCount', rdata.data.data.pageCount);
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /*
        * 保存订单
        */
        async saveOrders({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpOrder/save', data);
            if (rdata.data.statusCode === 200) {
                // Toast('订单信息确认成功');
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /*
        * 手机号 用户名
        * market/wpOrder/getClientByOpenId?openId=
        */
        async userBaseInfo({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpOrder/getClientByOpenId', {data});
            if (rdata.data.statusCode === 200) {
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /*
        * 支付订单
        */
        async payOrder({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpOrder/pay', data);
            if (rdata.data.statusCode === 200) {
                // Toast('支付成功');
            } else {
                Toast('支付失败');
                return;
            }
            return rdata;
        },
        /*
        * 获取订单详情
        */
        async getOrderDetail({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpOrder/form', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                console.log(rdata.data);
            } else {
                Toast(rdata.data.message);
                return false;
            }
            return rdata
        },
    },
};