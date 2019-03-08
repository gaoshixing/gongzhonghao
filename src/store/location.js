import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
     
    },
    mutations: {
      
    },
    actions: {
        /*
            http://localhost:8192/spoc-market/a/ws/sys/Area/findMapVO?pids=6882&typeLevel=4 全部接口
        */
        async allArea({ commit, }, data) {
            const rdata = await Vue.axios.get('/sys/Area/findMapVO', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /**
         * erweima http://47.93.31.175:8080/spoc-crm/a/ws/crm/crmLocation/getOfficeByProvinceAndCity?province=7&city=247
         */
        async getCompany({ commit, }, data) {
            const rdata = await Vue.crm.get('/crm/crmLocation/getOfficeByProvinceAndCity', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                // Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        // 搜索
        async findByNameS({ commit, }, data) {
            const rdata = await Vue.axios.get('/sys/Area/findByName', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },
        /**
         * http://gc.ditu.aliyun.com/regeocoding?l=39.97646,116.3039&type=010
         */
        async getCompany({ commit, }, data) {
            const rdata = await Vue.prototype.wxCrm.get('/crm/crmLocation/getOfficeByProvinceAndCity', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                // Toast(rdata.data.message);
                return;
            }
            return rdata;
        },

        // 经纬度 哪地区 /spoc-market/a/ws/market/wpApps/regeocoding?jwd=40.7222826728,114.8895263672

        async getCurrArea({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpApps/regeocoding', {params:data});
            if (rdata.data.statusCode === 200) {
                
            } else {
                Toast(rdata.data.message);
                return;
            }
            return rdata;
        },

    },
};
