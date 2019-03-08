<template>
    <div class="group-buy-boss">
        <BuyIntro
            :imgUrl="imgUrl"
            :title="info && info.object.packName"
            :intro="info && info.object.goodsList[0].introduction"
            :oldPrice="info && info.object.packOriPrice"
        ></BuyIntro>
        <p class="group-left-tips white" v-show="info">
            <img src="../assets/img/groupBuy.png" alt="">
            <span v-if="info && (info.object.packNum !== '0' || info.object.isPurchase === '1' || qs.f === 't')">已有{{info && info.object.packNum}}人参加拼团，</span>{{info && info.object.memberNum}}人参加即拼团成功！
        </p>
        <my-nav :navigations="navs" :nav="nav" @navChanges="navChanges" class="group-buy-nav-customize"></my-nav>
        <div class="group-detail white" v-show="nav === '0'">
            <p>详情描述</p>
            <div v-html="info && info.object.goodsList[0].details"></div>
        </div>
        <div class="group-rule white" v-show="nav === '1'">
            拼团规则文案待完善
        </div>
        <div class="throw-div"></div>
        <BuyButton
            :price="info && info.object.goodsList[0].price"
            :oldPrice="info && info.object.packOriPrice"
            :cantBuy="cantBuy"
            @onclickJoin="onclickJoin"
            :from="from"
            :buttonText="isPurchase"
            :leftPeople="leftPeople"
            :isuppack="isuppack"
            :maxnum="maxnum"
            :countDownTime="countDownTime">
        </BuyButton>
        <mt-popup
            v-model="popupTips"
            class="buy-popup-tips">
            <p>支付成功！</p>
            <span>{{popUpText}} </span>
            <button class="confirm-info-button" @click="onclickToShare">点此分享</button>
        </mt-popup>
    </div>
</template>

<script>
import { Popup, Toast, } from 'mint-ui';
import Nav from 'components/nav.vue';
import BuyIntro from 'components/buyIntro.vue';
import BuyButton from 'components/buyButton.vue';
import { mapState, } from 'vuex';
import store from 'store/index.js';
import { CountDown, registerShare, waitUntil, dateSlash, } from 'lib/script/util.js';
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
            nav: '0',
            id: null,
            cantBuy: false,
            navs: [
                { value: '0', text: '详情描述', },
                { value: '1', text: '拼团规则', },
            ],
            popupTips: false,
            timer: null,
            popUpText: null,
            imgUrl: '',
            packEndTime: null,
            countDownTime: '',
            isPurchase: '', // 是否已经购买
            from: null,
            leftPeople: '',
            isuppack: false,
            maxnum: null,
            qs: {},
        };
    },
    computed: {
        ...mapState({
            info: state => state.TaskDetail.info,
            userInfo: state => state.user.userInfo,
        }),
    },
    async created() {
        wx.showOptionMenu();
        this.qs = dealQs();
        this.id = this.qs.id;
        store.commit('startRequest');
        if (!this.userInfo) await store.dispatch('getUserInfo'); // 获取用户信息
        const rdata = await store.dispatch('getInfo', { id: this.id, openId: this.userInfo.openid, unionId: this.userInfo.unionid, }); // 获取团购信息
        this.packEndTime = this.info.object.endTime;
        store.commit('endRequest');
        this.imgUrl = await store.dispatch('getImg', {id: this.info.object.goodsList[0].attachmentId});
        this.isPurchase = this.info.object.isPurchase === '1' ? '邀请拼团' : '参加拼团';
        console.log('this.qs.f', this.qs.f);
        this.from = this.qs.f === 't' ? 'third' : 'group'; // 具体点哪个链接进入 from = third 的话是点朋友圈分享被邀请来的
        
        /*
        * 剩余数量的计算
        *   非超员拼团 ==> 起拼人数 - 已拼团人数
        * 
        *   超员拼团
        *       是否设置上限 ==> 
        *               无上限 ==> 该拼团不限人数
        *               有上限 ==> 还可邀请多少人
        *   
        *   拼团报满
        *       该拼团已报满
        *
        */
        this.isuppack = this.info.object.isUpPack === '0' ? false : true; // 是否超员成团
        this.maxnum = this.info.object.maxNum === null ? null : this.info.object.maxNum; // 上限是多少 null 无限
        if (this.isuppack) {
            if (this.maxnum === null) { // 无上限
                this.leftPeople = '该拼团不限人数';
            } else {
                const lefts = Number(this.maxnum) + Number(this.info.object.memberNum) - Number(this.info.object.packNum);
                this.leftPeople =  lefts > 0 ? `还需邀请${lefts}人` : '该拼团已报满';
                this.cantBuy = lefts > 0 ? false : true;
            }
        } else {
            const lefts = Number(this.info.object.memberNum) - Number(this.info.object.packNum);
            this.leftPeople = lefts > 0 ? `还需邀请${lefts}人` : '该拼团已报满';
            this.cantBuy = lefts > 0 ? false : true;
        }
        /*
        * 处理截止时间
        *  时间已过 拼团下架
        *  24小时之内 展示倒计时
        *  24小时以外 展示截止时间
        */
        const countDowns = new CountDown(dateSlash(this.packEndTime), 'date');
        console.log(dateSlash(this.packEndTime));
        const tempVal = countDowns.init();
        console.log('tempVal', tempVal);
        if (tempVal.timer === 'end') { // 超时
            this.countDownTime = '该团购已下架';
        } else if (tempVal.timer === 'loop') { // 24 小时之内
            const _this = this;
            this.timer = setInterval(() => {
                _this.countDownTime = '剩余：<span class="attention-color">' + countDowns.getHMS(parseInt((new Date(dateSlash(this.packEndTime)).getTime() - new Date().getTime()) / 1000)) + '</span>';
            }, 1000);
        } else { // 大于一天
            this.countDownTime = '截止日期: <span class="attention-color">' + this.packEndTime + '</span>';
        }
        this.registerShares();
    },
    methods: {
        navChanges(val) {
            this.nav = val;
        },
        onclickJoin() {
            if (this.isPurchase === '邀请拼团') {
                store.commit('setPopupGlobal', true);
                return;
            }
            this.$router.push({
                name: 'confirmInfo',
                query: {
                    id: this.id,
                    price: this.info.object.goodsList[0].price,
                    desc: this.info.taskName,
                    url: this.imgUrl,
                    formIds: this.info.object.goodsList[0].formIds[0],
                },
            });
        },
        onclickToShare() {
            this.popupTips = false;
            Toast('分享成功');
            clearInterval(this.timer);
            this.timer = null;
        },
        /*
        * 设置分享
        */
        registerShares() {
            const _this = this;
            const link =  this.isPurchase === '邀请拼团' ? `${location.protocol}//${location.hostname}${location.pathname}?${location.href.split('/#/')[1].split('?')[1]}&f=t` : `${location.protocol}//${location.hostname}${location.pathname}?${location.href.split('/#/')[1].split('?')[1]}/#/${location.href.split('/#/')[1].split('?')[0]}`;
            console.log('link______', link);
            waitUntil(() => {
                return !!store.state.jssdk.jssdkConfig;
            }, () => {
                /*
                * 分享
                */
                store.commit('addJSSDKReadyCallback', () => {
                    const appMessage = {
                        title: _this.info.object.packName, // 分享标题
                        desc: _this.info.object.goodsList[0].introduction, // 分享描述
                        link, // 分享链接
                        imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                    };
                    console.log('appMessage____', appMessage);
                    registerShare(appMessage);
                });
            });
        },
    },
    beforDestrory() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="less" >
    .group-buy-boss {
        .group-left-tips {
            color: @proColor;
            text-align: left;
            .xtr6(height, 40);
            .xtr6(line-height, 40);
            .xtr6(padding-left, 15);
            .xtr6(font-size, 14);
            .xtr6(margin-bottom, 10);
            img {
                float: left;
                display: inline-block;
                .xtr6(width, 15);
                .xtr6(height, 15);
                .xtr6(margin-top, 12);
                .xtr6(margin-right, 10);
            }
        }
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
                .xtr6(line-height, 18);
                p {
                    .xtr6(margin-bottom, 10);
                }
                span {
                    display: inline-block;
                    .xtr6(margin-bottom, 10);
                }
                span:last-child {
                    .xtr6(margin-bottom, 0);
                }
                p:last-child {
                    .xtr6(margin-bottom, 0);
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
    .buy-popup-tips {
        .xtr6(width, 280);
        .xtr6(height, 165);
        border-radius: 5px;
        box-sizing: border-box;
        .xtr6(padding, 25, 0, 0, 0);
        p {
            color: @000;
            .xtr6(font-size, 18);
            .xtr6(margin-bottom, 13);
        }
        span {
            color: @888;
            display: block;
            .xtr6(font-size, 15);
            .xtr6(margin-bottom, 15);
            .xtr6(line-height, 22);
            .xtr6(padding, 0, 25, 0, 25);
        }
    }
    .confirm-info-button {
        width: 100%;
        border: none;
        outline: none;
        color: @proColor;
        background-color: @fff;
        .xtr6(font-size, 18);
        .xtr6(height, 50);
        border-top: solid 1px @e5;
    }
    .throw-div {
        .xtr6(height, 79);
    }
    .group-buy-nav-customize {
        ul {
            margin-bottom: 0 !important;
            border-bottom: solid .5px @DA;
            p.nav-active {
                color: @proColor !important;
                .xtr6(line-height, 48) !important;
                .xtr6(height, 47) !important;
                border-bottom: solid 3px @proColor !important;
            }
        }
    }
</style>