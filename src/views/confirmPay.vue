<template>
    <div class="confirm-pay-boss">
        <p> <img src="../assets/img/clock.png" alt=""> 请于 <span class="attention-color">{{timing}}</span> 内完成支付，即可成功报名！</p>
        <p>金额共计</p>
        <p class="attention-color">¥ 2999.00</p>
        <div class="button-container">
            <button class="button-large confirm-pay-button" @click="onclickPay"><img src="../assets/img/wechat.png" alt=""> 微信支付</button>
        </div>
    </div>
</template>

<script>
import { CountDown, hideWxOptionMenu, } from 'lib/script/util.js';
import { mapState, } from 'vuex';
import store from 'store/index.js';
import { dealQs, } from 'lib/script/hook.js';
export default {
    name: 'ConfirmPay',
    data() {
        return {
            timing: '30分钟',
            timer: null,
            endtime: 1799,
            qs: null,
        };
    },
    computed: {
        ...mapState({
            from: state => state.util.buyType,
        }),
    },
    watch: {
        endtime(newVal) {
            if (newVal < 0) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
    },
    created() {
        this.qs = dealQs();
        const countDowns = new CountDown(this.endtime, 'time');
        this.timer = setInterval(() => {
            this.endtime--;
            this.timing = countDowns.init().returnVal;
        }, 1000);
    },
    mounted() {
        hideWxOptionMenu();
    },
    methods: {
        async onclickPay() {
            store.commit('startRequest');
            const rdata = await store.dispatch('payOrder', {
                id: this.qs.id,
                inPrice: this.qs.price,
            });
            store.commit('endRequest');
            if (this.from === 'buy') {
                this.$router.push({
                    name: 'myOrder',
                });
            } else {
                this.$router.push({
                    name: 'groupBuy',
                    query: {
                        isPay: 'payed',
                    },
                });
            }
        },
    },
};
</script>

<style lang="less" >
    .confirm-pay-boss {
        // .xtr6(padding, 20);
        p:nth-of-type(1) {
            color: @333;
            background-color: @fff;
            text-align: left;
            .xtr6(padding, 0, 0, 0, 15);
            .xtr6(font-size, 14);
            .xtr6(height, 40);
            .xtr6(line-height, 40);
            .xtr6(margin-bottom, 50);
            .xtr6(margin-top, 20);
            span {
                color: @proColor;
            }
            img {
                display: inline-block;
                .xtr6(width, 14);
                .xtr6(height, 14);
                vertical-align: middle;
            }
        }
        p:nth-of-type(2) {
            color: @888;
            .xtr6(font-size, 14);
            .xtr6(margin-bottom, 15);
        }
        p:nth-of-type(3) {
            color: @proColor;
            .xtr6(font-size, 27);
            .xtr6(margin-bottom, 90);
        }
        .confirm-pay-button {
            img {
                .xtr6(width, 27);
                .xtr6(height, 22);
                vertical-align: middle;
            }
            z-index: 999;
            outline: none;
            background-color: #4CBF00;
        }
    }
</style>