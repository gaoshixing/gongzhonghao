<template>
    <mt-tabbar class='buy-button-boss fix-iphonex' :class="[from !== 'buy' ? 'from-pack' : 'from-goods']">
        <p v-if="from !== 'buy'">拼团方式：低价抢购 > 分享邀请好友 > 拼团成功！</p>
        <div class="buy-fixed-button white">
            <div class="buy-fixed-content attention-color" v-if="from === 'group'">拼团价：￥{{price}}</div>
            <!-- 第三方 前来拼团 -->
            <div class="buy-fixed-content-third" v-if="from === 'third'">
                <p v-html="countDownTime" v-if="!cantBuy"></p>
                <p :style="{ marginTop: cantBuy ? '10px' : 0, color: '#F76260'}">{{leftPeople}}</p>
            </div>
            <!-- 直接购买 -->
            <div class="buy-fixed-content-third buy-fixed-content-buy" v-if="from === 'buy'">
                <p>原价：¥{{oldPrice}}</p>
                <p class="attention-color">￥{{price}} <span v-if="lowStock">少量库存</span></p>
            </div>
            <button class="button-fix button-buy-fix" @click="onclickJoin" :class="cantBuy ? 'cant-buy' : ''">{{buttonText}}</button>
        </div>
    </mt-tabbar>
</template>

<script>
import store from 'store/index.js';
import { Tabbar, Toast, } from 'mint-ui';
export default {
    name: 'BuyButton',
    components: {
        'mt-tabbar': Tabbar,
    },
    props: {
        from: { // 来源 buy group third
            type: String,
            default: 'group',
        },
        cantBuy: { // 是否还可购买
            type: Boolean,
            default: false,
        },
        lowStock: {
            type: Boolean,
            default: false,
        },
        oldPrice: {
            type: String,
        },
        price:{
            type: String,
        },
        buttonText: {
            type: String,
            default: '',
        },
        countDownTime: { // 拼团倒计时的时间
            type: String,
            default: '',
        },
        leftPeople: {},
        isuppack: {
            type: Boolean,
        },
        maxnum: {},
    },
    methods: {
        onclickJoin() {
            if(this.cantBuy) {
                Toast('该拼团已报满');
                return;
            }
            if (this.buttonText === '邀请拼团') {
                store.commit('setPopupGlobal', true);
                return;
            }
            this.$emit('onclickJoin');
        },
    },
};
</script>

<style lang="less" >
    .from-pack {
        .xtr6(height, 83);
    }
    .from-goods {
        .xtr6(height, 49);
    }
    .buy-button-boss {
        width: 100%;
        display: block;
        position: fixed;
        left: 0;
        .xtr6(bottom, 0);
        box-sizing: border-box;
        >p {
            color: @999;
            width: 100%;
            display: block;
            text-align: left;
            .xtr6(height, 34);
            .xtr6(font-size, 12);
            .xtr6(line-height, 34);
            .xtr6(padding-left, 15);
            background-color: #E9E9E9;
        }
        .buy-fixed-button {
            width: 100%;
            .xtr6(height, 49);
            position: relative;
        }
        .buy-fixed-content {
            float: left;
            color: @proColor;
            .xtr6(font-size, 17);
            .xtr6(padding-left, 17);
            .xtr6(line-height, 49);
        }
    }
    .buy-fixed-content-third {
        width: 100%;
        height: 100%;
        float: left;
        color: @proColor;
        box-sizing: border-box;
        .xtr6(padding-left, 17);
        .xtr6(padding-top, 8);
        .xtr6(font-size, 12);
        p {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: left;
            .xtr6(line-height, 18);
            display: block;
            .xtr6(max-width, 170);
        }
        p:nth-of-type(1) {
            color: @222;
            .xtr6(max-width, 210);
            span {
                color: @proColor;
            }
        }
    }
    .buy-fixed-content-buy {
        width: 100%;
        display: inline-block;
        p:nth-of-type(1) {
            color: @999;
            text-decoration: line-through;
        }
        p:nth-of-type(2) {
            width: 100%;
            display: block;
            color: @proColor;
            .xtr6(font-size, 14);
            span {
                float: right;
                color: @proColor !important;
                .xtr6(margin-right, 5);
                .xtr6(font-size, 12);
            }
        }
    }
    .cant-buy {
        opacity: .5;
    }
    .button-buy-fix {
        position: absolute;
        .xtr6(top, 7);
        .xtr6(height, 35) !important;
        .xtr6(width, 168) !important;
        .xtr6(line-height, 35) !important;
        .xtr6(margin-right, 15) !important;
        border-radius: 3px !important;
    }
</style>


