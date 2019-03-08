import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
     
    },
    mutations: {
      
    },
    actions: {
        /*
        spoc-market/a/ws/market/wpAppsSetting/form
        http://localhost:8192/spoc-market/a/ws/market/wpApps/getAppsByOfficeId?companyId=174
        spoc-market/a/ws/market/wpApps/getAppsByOfficeId
        */
        async getAppsByOfficeId({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpApps/getAppsByOfficeId', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                // Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        // /ws/market/wpAppsSetting/form
        async form({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpAppsSetting/form', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
    },
};