<template>
    <div class="order-card-boss white" @click="onclickOrderCard">
        <div class="order-card-title">
            <span>订单号： {{code}}</span>
            <span
                v-for="(item, index) in dictRdata"
                :key="index"
                v-if="payType === item.value && nav === '0'"
                :class="[item.value === 'pay' ? 'payed' : 'order-card-title-dark']">
                {{item.label}}
            </span>
            <span
                v-for="(item, index) in dictPack"
                :key="index"
                v-if="payType == item.value && nav === '1'"
                :class="[ (item.value === 'pay') || (item.value === 'packsuccess') || (item.value === 'packing') ? 'payed' : 'order-card-title-dark']">
                {{item.label}}
            </span>
        </div>
        <div class="order-card-content">
            <p :class="[((payType === 'pay') || (payType === 'packsuccess') || (payType === 'packing')) ? '' : 'order-card-title-dark']">{{title}}</p>
            <span>学员姓名：&nbsp;{{name}}</span>
            <span>学员手机：&nbsp;{{tel}}</span>
            <div class="order-card-invite" v-if="payType === 'packing'" @click.stop="onclickInvitePack">邀请拼团</div>
        </div>
    </div>
</template>

<script>
import store from 'store/index.js';
export default {
    name: 'OrderCard',
    props: {
        nav: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            default: '',
        },
        dictRdata: {
            type: Array,
            default: () => {
                return [];
            },
        },
        dictPack: {
            type: Array,
            default: () => {
                return [];
            },
        },
        payType: {
            type: String,
            required: true,
        },
        code: {
            type: String,
        },
        title: {
            type: String,
        },
        name: {
            type: String,
            default: '',
        },
        tel: {
            type: String,
            default: '',
        },
    },
    methods: {
        onclickOrderCard() {
            this.$router.push({
                name: 'orderDetail',
                query: {
                    type: this.nav === '0' ? 'goods' : 'pack',
                    id: this.orderId,
                },
            });
        },
        onclickInvitePack() {
            this.$router.push({
                name: 'groupBuy',
                query: {
                    id: this.id,
                    type: 'pack',
                    from: 'invite',
                }
            });
        },
    },
};
</script>

<style lang="less" >
    .order-card-boss {
        .xtr6(height, 148);
        .xtr6(margin-top, 10);
        .xtr6(padding-left, 15);
        .xtr6(padding-bottom, 12);
        box-sizing: border-box;
        .order-card-title {
            .xtr6(height, 44);
            border-bottom: solid 1px @e5;
            box-sizing: border-box;
            span {
                display: inline-block;
                .xtr6(height, 44);
                .xtr6(line-height, 45);
                .xtr6(font-size, 13);
            }
            span:nth-of-type(1) {
                color: @999;
                float: left;
            }
            span:nth-of-type(2) {
                float: right;
                .xtr6(margin-right, 15);
            }
            span.payed {
                color: @proColor;
            }
        }
        .order-card-content {
            text-align: left;
            position: relative;
            .xtr6(padding-top, 15);
            box-sizing: border-box;
            p {
                color: @222;
                .xtr6(font-size, 17);
                .xtr6(margin-bottom, 8);
                .xtr6(line-height, 24);
            }
            span {
                color: @999;
                display: block;
                .xtr6(font-size, 13);
                .xtr6(line-height, 19);
            }
            span:nth-of-type(1) {
                .xtr6(margin-bottom, 8);
            }
        }
        .order-card-invite {
            text-align: center;
            color: @proColor;
            border: solid 1px @proColor;
            border-radius: 5px;
            position: absolute;
            .xtr6(width, 86);
            .xtr6(height, 30);
            .xtr6(right, 15);
            .xtr6(bottom, 0);
            .xtr6(font-size, 13);
            .xtr6(line-height, 30);
            box-sizing: border-box;
        }
        .order-card-title-dark {
            color: @999 !important;
        }
    }
</style>
