/**
    关注引导页(不用登陆)
 */

<style lang='less'>

    .introduction-page {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        img {
            width: 100%
        }
    }

</style>
<template>
    <div class="introduction-page">
        <img :src="rdata1.filePath" alt="">
    </div>
</template>

<script>
import { dealQs, } from 'lib/script/hook.js';
import {mapState} from 'vuex'
import store from 'store/index.js';
import { registerShare, waitUntil, } from 'lib/script/util.js';
export default {
    data() {
        return {
            qs: {},
            rdata1: {
            },
        }
    },

    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            appId: state => state.user.userInfo.appId,
        })
    },

    async created() {
        const _this = this;
        if (!this.userInfo) await store.dispatch('getUserInfo');
        waitUntil(() => {
            return !!store.state.jssdk.jssdkConfig;
        }, () => {
            /*
            * 分享
            */
            store.commit('addJSSDKReadyCallback', () => {
                const appMessage = {
                    title: _this.userInfo.appsName, // 分享标题
                    desc:  '', // 分享描述
                    link: `${location.protocol}//${location.hostname}${location.pathname}?router=location&from=attention`, // 分享链接
                    imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                };
                registerShare(appMessage);
            });
        });
        this.qs = dealQs();
    },

    async mounted() {
        if (this.qs.from == 'pc') {
            let obj2 = {
                appId: this.qs.formId,
                type: 'subscribe'
            }
            let data = await store.dispatch('form', obj2);
            this.rdata1 = JSON.parse(data.data.data.json)
            return
        }
        let obj2 = {
            companyId: this.qs.compId,
        }
        let data = await store.dispatch('getAppsByOfficeId', obj2);
        this.rdata1 = JSON.parse(data.data.data.json)
    },
    
    
}
</script>


