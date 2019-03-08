<template>
    <div class="group-buy-boss">
        <BuyIntro
            type="buy"
            :imgUrl="imgUrl"
            :title="info && info.object.name"
            :intro="info && info.object.introduction"
            :oldPrice="info && info.object.oriPrice"
        ></BuyIntro>
        <div class="group-detail white">
            <p>详情描述</p>
            <div v-html="info && info.object.details"></div>
        </div>
        <div class="throw-div"></div>
        <BuyButton
            @onclickJoin="onclickJoin"
            from="buy"
            :lowStock="lowStock"
            :oldPrice="info && info.object.oriPrice"
            :price="info && info.object.price"
            :buttonText="buttonText">
        </BuyButton>
    </div>
</template>

<script>
import { Popup, Toast, } from 'mint-ui';
import Nav from 'components/nav.vue';
import BuyIntro from 'components/buyIntro.vue';
import BuyButton from 'components/buyButton.vue';
import { mapState, } from 'vuex';
import store from 'store/index.js';
import { CountDown, registerShare, waitUntil, } from 'lib/script/util.js';
import { dealQs, } from 'lib/script/hook.js';
export default {
    name: 'GroupBuy',
    components: {
        BuyIntro,
        'my-nav': Nav,
        BuyButton,
        Popup,
    },
    data() {
        return {
            nav: 0,
            id: null,
            navs: [
                { value: 0, text: '详情描述', },
                { value: 1, text: '拼团规则', },
            ],
            imgUrl: '',
            lowStock: false,
            buttonText: '立即购买',
            qs: {},
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            info: state => state.TaskDetail.info,
        }),
    },
    async created() {
        wx.showOptionMenu();
        if (!this.userInfo) await store.dispatch('getUserInfo'); // 获取用户信息
        this.qs = dealQs();
        this.id = this.qs.id;
        if(!this.info) {
            store.commit('startRequest');
            const rdata = await store.dispatch('getInfo', {id: this.id});
            store.commit('endRequest');
            this.lowStock = rdata.data.data.object.remainNum === null ? false : Boolean(Number(rdata.data.data.object.remainNum) <= 10);
            if (this.info.object.attachmentId) this.imgUrl = await store.dispatch('getImg', {id: this.info.object.attachmentId});
        }
        this.registerShares();
    },
    methods: {
        navChanges(val) {
            this.nav = val;
        },
        onclickJoin() {
            store.commit('setBuyType', 'buy');
            this.$router.push({
                name: 'confirmInfo',
                query: {
                    id: this.id,
                    price: this.info.object.price,
                    desc: this.info.object.name,
                    url: this.imgUrl,
                    formIds: this.info.object.formIds[0],
                },
            });
        },
        /*
        * 设置分享
        */
        registerShares() {
            const _this = this;
            waitUntil(() => {
                return !!store.state.jssdk.jssdkConfig;
            }, () => {
                console.log('_this.userInfo', _this.userInfo);
                /*
                * 分享
                */
                store.commit('addJSSDKReadyCallback', () => {
                    const appMessage = {
                        title: _this.info.object.name, // 分享标题
                        desc: _this.info.object.introduction, // 分享描述
                        link: `${location.protocol}//${location.hostname}${location.pathname}?${location.href.split('/#/')[1].split('?')[1]}/#/${location.href.split('/#/')[1].split('?')[0]}`, // 分享链接
                        imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                    };
                    registerShare(appMessage);
                });
            });
        },
    },
};
</script>

<style lang="less" >
    .group-buy-boss {
        .group-detail {
            .xtr6(padding, 15);
            >p {
                color: @222;
                .xtr6(font-size, 14);
                .xtr6(margin-bottom, 6);
                text-align: left;
            }
            >div {
                color: @999;
                text-align: left;
                .xtr6(font-size, 12);
                .xtr6(line-height, 15);
                p, span {
                    .xtr6(margin-bottom, 10);
                }
                // video 使用的是 iframe 进行播放; 控制 iframe 的样式; 适配 小屏 及 以下...
                iframe {
                    .xtr6(min-width, 345);
                    max-width: 100%;
                }
            }
        }
        .group-rule {
            .xtr6(padding, 15);
        }
    }
    .throw-div {
        .xtr6(height, 62);
    }
</style>