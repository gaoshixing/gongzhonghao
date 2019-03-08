
<style lang='less'>
    .success-buy-gsx {
        min-height: 100vh;
        .aro-base {
            .xtr6(padding, 0, 20);
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
            .xtr6(line-height, 30);
            .xtr6(font-size, 20);
            font-weight: 400;
            text-align: center;
        }
        .keeyCode {
            .xtr6(margin-top, 50);
            .xtr6(padding, 0, 27);
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            img {
                box-sizing: border-box;
                .xtr6(width, 150); 
                .xtr6(height, 150);
            }
            .erqode {
                border: 1px solid #979797;
            }
        }
    }

</style>
<template>
    <div class="success-buy-gsx white">
        <div class="aro-base white">
            <div class="success-ico">
                <img src="../assets/img/check1.png" alt="">
                <span  class="succ-text">购买成功</span>
            </div>
            <p class="succ-text1">请关注我们的公众号 查看您的订单</p>
        </div>
        <div class="keeyCode" >
            <img :src="qs.qrcodeUrl" alt="" class="erqode">
            <img src="../assets/img/changan.png" alt="">
        </div>
        <!-- <p class="watch-public">关注藤门国际</p> -->
    </div>
</template>

<script>
import { dealQs, } from 'lib/script/hook.js';
import {CountDown, hideWxOptionMenu, } from 'lib/script/util.js'
export default {
    data() {
        return {
            isShowFix: false,
            qs: {},
            isOrder: true,
            popUpText: '',
        }
    },

    created() {
        this.qs = dealQs();
        this.qs.qrcodeUrl = decodeURIComponent(this.qs.qrcodeUrl);
    },

    mounted() {
        hideWxOptionMenu();
    },

    methods: {

        checkOrder() {
            this.$router.push({
                name: 'myOrder'
            })
        },

        invite() {
            this.isShowFix = true
        }
        
    }
}
</script>
