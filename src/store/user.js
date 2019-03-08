import Vue from 'vue';
import { Toast, } from 'mint-ui';

export default {
    state: {
        userInfo: null,
    },
    mutations: {
        setUserInfo(state, data) {
            state.userInfo = data;
        },
    },
    actions: {
        /*
        * 获取用户信息
        */
        async getUserInfo({ commit, data }) {
            const rdata = await Vue.prototype.wxAxios.get('/wxUserInfoData');
            // commit('setUserInfo', {"id":null,"remarks":null,"createDate":null,"updateDate":null,"openid":"oiq2z0iBwOld1i3Wz-LZb1axaEcI","unionid":"oi5ID1QjNK1JZP8C7wyKqjk7xEa4","token":null,"user":null,"hasSubscribe":"1","sycStatus":null,"appId":"5a2d5ed47bb542d2b944793ad47c40c8","ecId":null,"code":"BJ181205031","name":"南風逝","gender":"1","city":"海淀","province":"北京","country":"中国","avatarId":null,"avatarUrl":"http://thirdwx.qlogo.cn/mmopen/icSvKiab9DVQJl1FibdMr9F72KIy73qmwBncenCN1F75uT7KJvpQTDmL2RpflfpbCN0ibrKjnrkpDWzfK1ZvlicDTAfCiaXv4Yr9ZJ/132","password":null,"phone":null,"wxId":null,"type":"ordinary","salerFlag":"1","status":"pass","isUse":"1","registrationTime":null,"loginDate":null,"salerDate":"2018-12-05 10:18:23","subscribeTime":"1970-01-18 20:52:57","unsubscribeTime":null,"createTime":null,"updateTime":null,"appsQrcodeUrl":"/spoc-market/upload/all/20181205/二维码_20181205095433_140.jpg","appsHeadUrl":"/spoc-market/upload/all/20181205/touxiang_20181205095428_324.png","appsName":"千帆云智订阅号","bizUrl":"https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzNDk5MDczMA==&scene=126&sessionid=1543974831&subscene=0#wechat_redirect","rebateMaskIsShow":"0","taskMaskIsShow":"0"});
            if (rdata.data.statusCode === 200) {
                commit('setUserInfo', rdata.data.data);
            } else {
                Toast(rdata.data.message);
                return {};
            }
            return rdata.data;
        },
        /*
        * 推广员注册 POST /a/ws/market/wpAppsFollow/enrollSpreed
        */
        async expenderSignUp({ commit, }, data) {
            const rdata = await Vue.axios.post('/market/wpAppsFollow/enrollSpreed', data);
            if (rdata.data.statusCode === 200) {
                return rdata.data;
            } else {
                Toast(rdata.data.message);
                return false;
            }
            return rdata.data;
        },
        /*
        * /sys/user/sendVerifyCode 获取验证码
        */
        async getAutoCode({ commit, }, data) {
            const rdata = await Vue.axios.get('/market/wpAppsFollow/sendVerifyCode', {
                params: data,
            });
            if (rdata.data.statusCode === 200) {
                return rdata.data;
            } else {
                Toast(rdata.data.message);
                return false;
            }
            return rdata.data;        
        },
        /*
        * /a/ws/choiceschool/xxStudent/matchMobile 匹配学生信息中的手机号码
        */
        async getStudentMatchMobile({ commit, }, data) {
            const rdata = await Vue.prototype.schoolAxios.get('/choiceschool/xxStudent/matchMobile', {
                params: data
            });
            if (rdata.data.statusCode === 200) {
                return rdata.data.data;
            } else {
                Toast(rdata.data.message);
                return false;
            }
        },
    },
};