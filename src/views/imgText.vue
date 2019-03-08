<template>
    <div class="img-text-boss white">
        <p class="img-text-title">{{title}}</p>
        <p class="img-text-article-info">
            <span>{{info && info.updateDate | timeSplit }}</span>
            <span>{{ info && info.author }}</span>
            <a v-if="userInfo && userInfo.hasSubscribe === '1'" :href="userInfo && userInfo.bizUrl">{{userInfo && userInfo.appsName}}</a>
            <span v-if="userInfo && userInfo.hasSubscribe === '2'" class="user-info-apps-name" @click="onclickGoingToQRPage">{{userInfo && userInfo.appsName}}</span>
        </p>
        <div class="img-text-container white" v-html="content"></div>
    </div>
</template>

<script>
import store from 'store';
import { mapState, } from 'vuex';
import { dealQs, } from 'lib/script/hook.js';
import setWechatTitle from 'lib/script/setWechatTitle.js';
import { registerShare, waitUntil, hideWxOptionMenu, } from 'lib/script/util.js';
export default {
    name: 'ImgText',
    data() {
        return {
            title: '',
            content: null,
            info: null,
            qs: {},
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
    },
    filters: {
        timeSplit(v) {
            if (!v) return;
            return v.split(' ')[0];
        },
    },
    async created() {
        wx.showOptionMenu();
        const _this = this;
        this.qs = dealQs();
        let rdata = null;
        store.commit('startRequest');
        if(this.qs.id) {
            rdata = await store.dispatch('getInfo', { id: this.qs.id, });
        };
        if(this.qs.taskId) {
            rdata = await store.dispatch('getReadTaskPreviewInfo', { id: this.qs.taskId, type: this.qs.type});
        }
        this.content = rdata.data.data.object.list[0].content;
        this.title = rdata.data.data.object.list[0].title;
        this.info = rdata.data.data.object.list[0];
        store.commit('endRequest');
        waitUntil(() => {
            return !!store.state.jssdk.jssdkConfig;
        }, () => {
            /*
            * 分享
            */
            store.commit('addJSSDKReadyCallback', () => {
                const appMessage = {
                    title: _this.title, // 分享标题
                    desc: _this.info.intro, // 分享描述
                    link: `${location.protocol}//${location.hostname}${location.pathname}?${location.href.split('/#/')[1].split('?')[1]}/#/${location.href.split('/#/')[1].split('?')[0]}`, // 分享链接
                    imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                };
                registerShare(appMessage);
            });
        });
    },
    mounted() {
        const _this = this;
        waitUntil(() => {
            return !!_this.userInfo;
        }, () => {
            this.dealPageTitle(_this.userInfo.appsName);
        });

        if(this.qs.taskId) hideWxOptionMenu();
    },
    methods: {
        onclickGoingToQRPage() {
            this.$router.push({
                name: 'introductionPage',
                query: {
                    from: 'pc',
                    formId: this.userInfo.appId,
                },
            });
        },
        /*
        * 设置页面标题
        */
        dealPageTitle() {
            window.addEventListener('scroll', this.srollFunction);
        },
        srollFunction() {
            const windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (windowScrollTop <= 50) {
                document.title = '';
            } else {
                document.title = this.title;
                // setWechatTitle(this.title);
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('srcoll', this.srollFunction);
    },
    beforeRouteEnter(to, from, next) {
        store.dispatch('getUserInfo');
        next();
    },
};
</script>

<style lang="less">
    .img-text-boss {
        width: 100%;
        text-align: left;
        box-sizing: border-box;
        .xtr6(padding, 20, 15, 20, 15);
        .img-text-title {
            color: @000;
            .xtr6(font-size, 24);
            .xtr6(margin-bottom, 8);
        }
        .img-text-article-info {
            color: @888;
            display: inline-block;
            .xtr6(font-size, 15);
            .xtr6(margin-bottom, 30);
            span {
                .xtr6(margin-right, 5);
            }
            a {
                color: #576B95;
                text-decoration: none;
            }
        }
        .img-text-container {
            img {
                width: 100%;
                .xtr6(margin, 20, 0);
            }
            color: @222;
            .xtr6(font-size, 17);
            .xtr6(line-height, 25);
            .xtr6(margin-bottom, 55);
            // video 使用的是 iframe 进行播放; 控制 iframe 的样式; 适配 小屏 及 以下...
            iframe {
                .xtr6(min-width, 345);
                max-width: 100%;
            }
        }
    }
    .user-info-apps-name {
        color: #576B95 !important;
    }
</style>
