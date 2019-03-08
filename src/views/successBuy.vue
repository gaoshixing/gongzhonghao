
<style lang='less'>
    .success-buy-gsx {
        .aro-base {
            .xtr6(padding, 0, 20, 20);
        }        
        .success-ico {
            text-align: center;
            .xtr6(padding, 50, 0, 50);
            img {
                .xtr6(widht, 33);
                .xtr6(height, 33);
                .xtr6(margin-right, 15);
                vertical-align: middle;
            }
            .succ-text {
                .xtr6(line-height, 25);
                .xtr6(font-size, 18);
                vertical-align: middle;
            }
        }
        .succ-text1 {
            .xtr6(line-height, 21);
            .xtr6(font-size, 14);
            font-weight: 400;
            color: @888;
            text-align: center;
        }
        .notice {
            .xtr6(margin-top, 30);
        }
        .succ-info {
            text-align: center;
            .xtr6(line-height, 28);
            .xtr6(font-size, 20);
            .xtr6(margin-top, 10);
        }
        .group-info {
            .xtr6(margin-top, 10);
            .xtr6(line-height, 30);
            .xtr6(font-size, 18);
            .time-text {
                color: @attentionColor;
            }
        }
        .mtF {
            .xtr6(margin-top, 50)
        }
        .mt {
            .xtr6(margin-top, 15)
        }
        .watch-public {
            text-align: center;
            .xtr6(line-height, 19);
            .xtr6(font-size, 13);
            .xtr6(margin-top, 30);
            color: @999;
        }
        .handle {
            .xtr6(padding, 0, 20)
        }
        .fix {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            opacity: .6;
            background-color: #000;
            img {
                .xtr6(width, 206);
                .xtr6(height, 109);
            }
            .fx1 {
                position: absolute;
                .xtr6(right, 40);
                .xtr6(top, 10);
            }
            .fx2 {
                position: absolute;
                .xtr6(right, 40);
                .xtr6(bottom, 10);
            }
        }
    }

</style>
<template>
    <div class="success-buy-gsx">
        <div class="aro-base white">
            <div class="success-ico">
                <img src="../assets/img/check1.png" alt="">
                <span v-if="qs.type!='pack'" class="succ-text">购买成功</span>
                <span v-else class="succ-text">成功参加拼团</span>
            </div>
            <p class="succ-text1"  v-if="qs.type!='pack'">您已成功购买</p>
            <p class="succ-text1" v-else>您已成功参加拼团</p>
            <p class="succ-info"  v-if="qs.type!='pack'">
                {{qs.name}}
            </p>
            <p class="succ-info" v-else>
                {{qs.name}}
            </p>
            <p class="succ-text1 notice" v-if="qs.type=='pack'&&qs.num/1>0">
                请于
            </p>
            <p class="group-info" v-if="qs.type=='pack'&&qs.num/1>0">
                <span class="time-text">{{popUpText}}</span>，邀请<span class="time-text">{{qs.num}}人</span>参加拼团，即可成功拼团！
            </p>
        </div>
        <div class="handle">
            <button class="button-large mtF"  v-if="qs.type!='pack'" @click="checkOrder">查看订单</button>
            <button class="button-large mt" v-if="qs.type=='pack'&&qs.num/1>0" @click="invite">邀请拼团</button>
            <button class="button-default mt" v-if="qs.type=='pack'&&qs.num/1>0" @click="checkOrder">查看订单</button>
            <button class="button-large mt" v-if="qs.type=='pack'&&qs.num/1==0" @click="checkOrder">查看订单</button>
        </div>
        <!-- <p class="watch-public">关注藤门国际</p> -->
    </div>
</template>

<script>
import { dealQs, } from 'lib/script/hook.js';
import {CountDown,  registerShare, waitUntil, } from 'lib/script/util.js'
import {mapState, } from 'vuex'
import store from 'store/index.js';
import { dateSlash, } from 'lib/script/util.js';

export default {
    data() {
        return {
            qs: {},
            isOrder: true,
            popUpText: '',
            info: {
                object: {
                    goodsList: [{}]
                }
            },
        }
    },

    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
    },

    async created() {
        wx.showOptionMenu();
        this.qs = dealQs();
        this.qs.name = decodeURIComponent(this.qs.name);
        this.qs.overDate = decodeURIComponent(this.qs.overDate);
        
        // if(!this.info) {
            store.commit('startRequest');
            const rdata = await store.dispatch('getInfo', {id: this.qs.id});
            this.info = rdata.data.data
            store.commit('endRequest')
        // }
        if (this.qs.type=='pack'&&this.qs.num/1>0) {
            wx.showOptionMenu();
            this.registerShares();
        }
    },

    mounted() {
        this.remainF()
    },

    methods: {

        registerShares() {
            const _this = this;
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
                        link: `${location.protocol}//${location.hostname}/index.html?id=${this.qs.id}&type=goods/#/buy`, // 分享链
                        imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                    };
                    if (this.qs.type == 'pack') {
                        appMessage.link =  `${location.protocol}//${location.hostname}/index.html?id=${this.qs.id}&type=pack&f=t`;
                    }
                    registerShare(appMessage);
                });
            });
        },

        remainF() {
            this.qs.overDate = new Date(dateSlash(this.qs.overDate))
            const countDowns = new CountDown(this.qs.overDate, 'date');
            const tempVal = countDowns.init();
            if (tempVal.timer == 'date') {
                this.popUpText = `${new Date(tempVal.returnVal).format('yyyy-MM-dd hh:mm:ss')}前`
               
            } else if (tempVal.timer == 'loop') {
                this.popUpText = `${countDowns.getHMS(parseInt((new Date(this.qs.overDate).getTime() - new Date().getTime()) / 1000))}内`;
                this.timer = setInterval(() => {
                    let residueT = new Date(this.qs.overDate).getTime() - new Date().getTime()
                    if (residueT<0) {
                        clearInterval(this.timer)
                        this.qs.num = 0
                    }
                    this.popUpText = `${countDowns.getHMS(parseInt(residueT / 1000))}内`;
                }, 1000);
            } else {
                this.qs.num = 0
            }
        },

        checkOrder() {
            this.$router.push({
                name: 'myOrder',
                query: {
                    subscribe: this.qs.subscribe
                }
            });
        },

        invite() {
            store.commit('setPopupGlobal', true);
        },
    },
}
</script>
