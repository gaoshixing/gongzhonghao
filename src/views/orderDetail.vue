<template>
    <div class="order-detail-boss">
       <!--  <div class="order-detail-top-buy" :class="[lessThan1Hour ? 'lessThan1Hour' : '']">
            <p :style="{float: lessThan1Hour ? 'left' : ''}">请于 <span>{{leftTime}}</span> 内完成支付，即可报名成功！</p> <br v-if="!lessThan1Hour" />
            <button :class="[lessThan1Hour ? 'lessThan1Hour_button' : '']" >点击支付</button>
        </div> -->
        <div class="white">
            <p class="order-detail-section-title"><span>购买填写信息</span></p>
            <ul class="order-detail-section-ul">
                <!-- <li class="clearfix"><span>学员姓名</span><span>{{orderDetail.openName}}</span></li>
                <li class="clearfix"><span>学员手机</span><span>{{orderDetail.clientPhone}}</span></li>
                <li class="clearfix"><span>学员所属年级</span><span>{{orderDetail.openName}}</span></li> -->
                <li class="clearfix" v-for="item in myForm" :key="item.title"><span>{{item.title}}</span><span>{{item.value}}</span></li>
            </ul>
        </div>
        <div class="white">
            <p class="order-detail-section-title"><span>订单号：{{orderDetail.code}}</span> <span>{{orderDetail.statusLabel}}</span></p>
            <ul class="order-detail-section-ul">
                <li class="clearfix"><span>商品名称</span><span>{{orderDetail.title}}</span></li>
                <li class="clearfix"><span>支付金额</span><span>{{orderDetail.inPrice}}</span></li>
                <li class="clearfix"><span>创建订单时间</span><span>{{orderDetail.createDate}}</span></li>
                <li class="clearfix"><span>支付时间</span><span>{{orderDetail.inPriceDate}}</span></li>
                <li class="clearfix"><span>退款时间</span><span>{{orderDetail.outPriceDate}}</span></li>
            </ul>
        </div>
        <div class="white" v-show="orderDetail.status == 'refund'">
            <p class="order-detail-section-title"><span>退款信息</span></p>
            <ul class="order-detail-section-ul">
                <li class="clearfix"><span>退款金额</span><span>¥{{orderDetail.outPrice}}</span></li>
                <li class="clearfix"><span>退款理由</span><span class="order-detail-refund-reason">{{orderDetail.outPriceReason}}</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
import store from 'store/index.js';
import { mapState, } from 'vuex';
import { CountDown, } from 'lib/script/util.js';
export default {
    name: 'OrderDetail',
    data() {
        return {
            timer: null,
            leftTime: '',
            lessThan1Hour: false,
            endTimes: '2018/12/18 18:30:00',
            orderDetail:{},
            myForm: []
        };
    },
    async created() {
        this.setTitle();
        this.getOrderDetail();
        //this.dealCountDown();
        this.getformDateJson();

    },
    methods: {
        async getOrderDetail(){
            store.commit('startRequest');
            const rdata = await store.dispatch('getOrderDetail', {id: this.$route.query.id, });
            store.commit('endRequest');
            if(rdata){
                this.orderDetail = rdata.data.data
            }
        },
        async getformDateJson(){
            store.commit('startRequest');
            const rdata = await store.dispatch('getformDate', {id: this.$route.query.id, })
            const formId = rdata.data.data.formId
            const formData = rdata.data.data.data
            const rdataJson = await store.dispatch('getformDateJson', {id: formId, })
            const formDataLayout = rdataJson.data.data.layout

            let myForm = []
            for(let key in formData){
                formDataLayout.forEach(item => {
                    if(item.name == key){
                        myForm.push({
                            title:item.title,
                            value: formData[key]
                        })
                    }
                });
            }
            store.commit('endRequest');
            this.myForm = myForm
        },
        setTitle() {
            document.title = this.$route.query.type === 'goods' ? '订单详情' : '拼团订单详情';
        },
        dealCountDown() {
            const countDowns = new CountDown(this.endTimes, 'date');
            const countDownRdata = countDowns.init();
            if (countDownRdata.timer === 'loop') {
                // 页面顶部按钮适配
                if (countDownRdata.returnVal && ((countDownRdata.returnVal - new Date().getTime()) / 1000 ) < 3600) { // 一小时之内
                    this.lessThan1Hour = true;
                } else { // 一小时之外
                    this.lessThan1Hour = false;
                }
                this.leftTime = countDowns.getHMS(parseInt((countDownRdata.returnVal - new Date().getTime()) / 1000));
                this.timer = setInterval(() => {
                    this.leftTime = countDowns.getHMS(parseInt((countDownRdata.returnVal - new Date().getTime()) / 1000));
                    if (parseInt((countDownRdata.returnVal - new Date().getTime()) / 1000) <= 0) location.reload();
                }, 1000);
            } else if (countDownRdata.timer === 'end') {
                location.reload();
            }
        },
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang='less'>
    .order-detail-boss {
        .order-detail-top-buy {
            position: relative;
            box-sizing: border-box;
            background-color: #FDFCEC;
            .xtr6(height, 66);
            .xtr6(margin-bottom, 20);
            .xtr6(padding, 0, 15);
            .xtr6(font-size, 14);
            p {
                display: inline-block;
                .xtr6(padding-top, 11);
                span {
                    color: @attentionColor;
                }
            }
            button {
                outline: none;
                border: none;
                color: @fff;
                .xtr6(width, 68);
                .xtr6(height, 25);
                .xtr6(font-size, 12);
                .xtr6(margin-top, 10);
                border-radius: 3px;
                display: inline-block;
                background-color: @attentionColor;
            }
        }
        .lessThan1Hour {
            .xtr6(height, 36);
        }
        .lessThan1Hour_button {
            float: left;
            .xtr6(margin-top, 5);
        }
        >div {
            .xtr6(margin-bottom, 10);
        }
        .order-detail-section-title {
            color: @888;
            text-align: left;
            position: relative;
            border-bottom: solid .5px @e5;
            .xtr6(height, 46);
            .xtr6(font-size, 15);
            .xtr6(padding, 0, 20);
            span {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            span:nth-of-type(1) {
                .xtr6(left, 20);
            }
            span:nth-of-type(2) {
                color: @proColor;
                .xtr6(right, 20);
            }
        }
        .order-detail-section-ul {
            .xtr6(font-size, 14);
            li {
                clear: both;
                box-sizing: border-box;
                .xtr6(min-height, 37);
                .xtr6(padding, 0, 20);
                span {
                    .xtr6(line-height, 37)
                }
                span:nth-of-type(1) {
                    float: left;
                    color: @888;
                }
                span:nth-of-type(2) {
                    float: right;
                    color: @333;
                    text-align: right;
                    .xtr6(max-width, 224);
                }
            }
        }
    }
    .order-detail-refund-reason {
        .xtr6(margin-top, 7);
        .xtr6(margin-bottom, 10);
        .xtr6(line-height, 21)!important;
    }
</style>