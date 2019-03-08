<template>
    <div class="my-order-boss">
        <my-nav :navigations="navs" :nav="nav" @navChanges="navChanges" :class="[ up ? 'fixed-top-bar' : '' ]" class="my-order-nav-customize"></my-nav>
        <div v-show="nav === '0'">
            <ul
                v-infinite-scroll="loadMore"
                :infinite-scroll-disabled=false
                infinite-scroll-distance="100"
                style="position: relative;">
                <OrderCard
                    v-for="(item, index) in localList0"
                    :key="index"
                    :nav="nav"
                    :orderId="item.id"
                    :code="item.code"
                    :title="item.title"
                    :payType="item.status"
                    :name="item.clientName"
                    :tel="item.clientPhone"
                    :dictRdata="dictRdata">
                </OrderCard>
            </ul>
            <div class="transparent-line-through-div" v-if="show0"><p>没有更多了</p></div>
        </div>
        <div v-show="nav === '1'">
            <ul
                v-infinite-scroll="loadMore"
                :infinite-scroll-disabled=false
                infinite-scroll-distance="100"
                style="position: relative;">
                <OrderCard
                    v-for="(item, index) in localList1"
                    :key="index"
                    :nav="nav"
                    :orderId="item.id"
                    :id="item.spreadId"
                    :code="item.code"
                    :title="item.title"
                    :payType="item.packStatus"
                    :name="item.clientName"
                    :tel="item.clientPhone"
                    :dictPack="dictPack">
                </OrderCard>
            </ul>
            <div class="transparent-line-through-div" v-if="show1"><p>没有更多了</p></div>
        </div>
    </div>
</template>

<script>
import Nav from 'components/nav.vue';
import OrderCard from 'components/orderCard.vue';
import store from 'store/index.js';
import { mapState, } from 'vuex';
import { dealQs, } from 'lib/script/hook.js';
import { hideWxOptionMenu, } from 'lib/script/util.js';

export default {
    name: 'myOrder',
    components: {
        'my-nav': Nav,
        OrderCard,
    },
    data() {
        return {
            nav: '0',
            navs: [
                { value: '0', text: '普通订单', },
                { value: '1', text: '拼团订单', },
            ],
            show0: false,
            show1: false,
            localList0: [],
            localList1: [],
            localPageNo0: 1,
            localPageNo1: 1,
            pageCount0: 1,
            qs: {},
            pageCount1: 1,
            requesting: false,
            up: false,
            beforeScrollTop: 0,
            dictRdata: null,
            dictPack: null,
        };
    },
    computed: {
        ...mapState({
            orderOrderList: state => state.order.orderOrderList,
            userInfo: state => state.user.userInfo,
        }),
    },
    watch: {
        nav(newVal) {
            if (newVal === '0' && this.localPageNo0 !== 1 || newVal === '1' && this.localPageNo1 !== 1) return;
            this.loadMore();
        },
    },
    async created() {
        this.qs = dealQs();
        if (!this.userInfo) await store.dispatch('getUserInfo');
        // 购买字典
        this.dictRdata = await store.dispatch('getDict', { type: 'wp_order_status', });
        this.dictRdata = this.dictRdata.map(item => Object.assign({}, {value:item.value}, {label:item.label}));
        // 拼团字典
        this.dictPack = await store.dispatch('getDict', { type: 'wp_goods_pack_status', });
        this.dictPack = this.dictPack.map(item => Object.assign({}, {value:item.value}, {label:item.label}));
    },
    mounted() {
        hideWxOptionMenu();
        window.addEventListener('scroll', this.srollFunc);
    },
    methods: {
        navChanges(val) {
            this.nav = val;
        },
        loadMore() {
            if(this.requesting) return;
            let type, count, pageno = null;
            if (this.nav === '0') {
                type = 'goods';
                count = this.pageCount0;
                pageno = this.localPageNo0;
            } else {
                type = 'pack';
                count = this.pageCount1;
                pageno = this.localPageNo1;
            }
            if (pageno > count) return;
            this.getListPage(type, pageno);
        },
        async getListPage(type, pageno) {
            this.requesting = true;
            store.commit('startRequest');
            const rdata = await store.dispatch('getOrderListPage', {
                objectType: type,
                // openId: this.userInfo.openid,
                appId: this.qs.subscribe,
                unionId: this.userInfo.unionid,
                pageNo: pageno,
                pageSize: 10,
            });
            store.commit('endRequest');
            this.dealHistory(rdata.data.data.page);
            this.requesting = false;
        },
        dealHistory(data) {
            if (this.nav === '0') {
                this.pageCount0 = data.pageCount;
                this.localPageNo0 = data.pageNo + 1;
                this.localList0.push(...data.list);
                this.show0 = this.pageCount0 < this.localPageNo0 && this.localList0.length >= 10 ? true : false;
            } else {
                this.pageCount1 = data.pageCount;
                this.localPageNo1 = data.pageNo + 1;
                this.localList1.push(...data.list);
                this.show1 = this.pageCount1 < this.localPageNo1 && this.localList1.length >= 10 ? true : false;
            }
        },
        srollFunc() {
            const windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (windowScrollTop <= 50) {
                this.up = false;
            }
            if (windowScrollTop <= 300) {
                this.beforeScrollTop = windowScrollTop;
                return;
            }
            if (this.beforeScrollTop < windowScrollTop) {
                this.up = false;
                this.beforeScrollTop = windowScrollTop;
            } else {
                this.up = true;
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.srollFunc);
    },
};
</script>

<style lang="less" >
    .fixed-top-bar {
        position: fixed !important;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
    }
    .my-order-boss {
        .xtr6(padding-bottom, 15);
    }
    .my-order-nav-customize {
        p.nav-active {
            color: @proColor !important;
            border-bottom: solid 3px @proColor !important;
        }
    }
</style>