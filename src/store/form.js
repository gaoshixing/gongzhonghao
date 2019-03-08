import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
        count: 0,
    },
    mutations: {
        setCount(state, count) {
            state.count = count;
        },
    },
    actions: {
        async getformDateJson({ commit, }, data) {
            const rdata = await Vue.axios.get('common/comFormTable/viewForm', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                commit('setCount', rdata.data.data);
            } else {
               Toast(rdata.data.message);
            }
            return rdata;
        },
        async getformDate({ commit, }, data) {
            const rdata = await Vue.axios.get('common/comFormTable/viewFormData', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
            } else {
               Toast(rdata.data.message);
            }
            return rdata;
        },

        // 邀请页面保存 market/wpInvitingPage/saveDynamicFormData
        async saveformDate({ commit, }, data) {
            const rdata = await Vue.axios.post('market/wpInvitingPage/saveDynamicFormData', 
               data,
            );
            if (rdata.data.statusCode === 200) {
            } else {
               Toast(rdata.data.message);
            }
            return rdata;
        },

        // 绑定手机号
        async bindPhoneNumber({ commit, }, data) {
            const rdata = Vue.prototype.wxAxios.post('/studentBinding', 
               data,
            );
            if (rdata.data.statusCode === 200) {
            } else {
               Toast(rdata.data.message);
            }
            return rdata;
        },
    },
};