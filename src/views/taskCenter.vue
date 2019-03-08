<template>
    <div class="task-center-boss">
        <div class="task-center-guide" v-if="showGuide">
            <img src="../assets/img/guide1.png" alt="">
            <div class="task-center-button" @click="onclickChangeShowGuide"></div>
        </div>
        <my-nav :navigations="navs" :nav="nav" @navChanges="navChanges" :class="[ up ? 'fixed-top-bar' : '' ]" class="task-center-nav-customize"></my-nav>
        <ul
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="100"
            style="position: relative;">
            <div v-show="nav === '0'">
                <TaskCard v-for="(item, index) in listPage0" :key="index" :title="item.title" :endTime="item.endTime" @onclickTaskCard="onclickTaskCard(item.id)"></TaskCard>
                <div class="transparent-line-through-div" v-if="nomore0"><p>没有更多了</p></div>
            </div>
            <div v-show="nav === '1'">
                <TaskCard v-for="(item, index) in listPage1" :key="index" :title="item.title" :endTime="item.endTime" @onclickTaskCard="onclickTaskCard(item.id)"></TaskCard>
                <div class="transparent-line-through-div" v-if="nomore1"><p>没有更多了</p></div>
            </div>
            <div v-show="nav === '2'">
                <TaskCard v-for="(item, index) in listPage2" :key="index" :title="item.title" :endTime="item.endTime" @onclickTaskCard="onclickTaskCard(item.id)"></TaskCard>
                <div class="transparent-line-through-div" v-if="nomore2"><p>没有更多了</p></div>
            </div>
            <div v-show="nav === '3'">
                <TaskCard v-for="(item, index) in listPage3" :key="index" :title="item.title" :endTime="item.endTime" @onclickTaskCard="onclickTaskCard(item.id)"></TaskCard>
                <div class="transparent-line-through-div" v-if="nomore3"><p>没有更多了</p></div>
            </div>
        </ul>
        <div class="tab-top-div"></div>
        <Tabbar :value="value"></Tabbar>
    </div>
</template>

<script>
import Nav from 'components/nav.vue';
import Tabbar from 'components/tabbar.vue';
import TaskCard from 'components/taskCard.vue';
import { mapState } from 'vuex';
import store from 'store/index.js';
import { InfiniteScroll, } from 'mint-ui';
import { wait, hideWxOptionMenu, } from 'lib/script/util.js';

export default {
    name: 'TaskCenter',
    components: {
        Tabbar,
        TaskCard,
        'my-nav': Nav,
        InfiniteScroll,
    },
    data() {
        return {
            nav: '0',
            value: '0',
            showGuide: false,
            up: false,
            navs: [
                { value: '0', text: '购买任务', },
                { value: '1', text: '拼团任务', },
                { value: '2', text: '邀请任务', },
                { value: '3', text: '阅读任务', },
            ],
            localPageNo0: 0,
            localPageNo1: 0,
            localPageNo2: 0,
            localPageNo3: 0,
            localPageCount0: 1,
            localPageCount1: 1,
            localPageCount2: 1,
            localPageCount3: 1,
            listPage0: [],
            listPage1: [],
            listPage2: [],
            listPage3: [],
            beforeScrollTop: 0,
            requesting: false,
            nomore0: false,
            nomore1: false,
            nomore2: false,
            nomore3: false,
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            listPage: state => state.taskCenter.listPage,
            pageNo: state => state.taskCenter.pageNo,
            pageCount: state => state.taskCenter.pageCount,
        }),
    },
    watch: {
        nav() {
            let pageNos, counts = null;
            store.commit('setListPage', []);
            switch(this.nav) {
                case '0': store.commit('setPageNo', this.localPageNo0); pageNos = this.localPageNo0; counts = this.localPageCount0; break;
                case '1': store.commit('setPageNo', this.localPageNo1); pageNos = this.localPageNo1; counts = this.localPageCount1; break;
                case '2': store.commit('setPageNo', this.localPageNo2); pageNos = this.localPageNo2; counts = this.localPageCount2; break;
                case '3': store.commit('setPageNo', this.localPageNo3); pageNos = this.localPageNo3; counts = this.localPageCount3; break;
            };
            if (counts <= pageNos && pageNos!== 1) return;
            this.getListPage();
        },
    },
    async created() {
        if (!this.userInfo) await store.dispatch('getUserInfo');
        if (this.userInfo.taskMaskIsShow === '1') this.showGuide = true;
        this.getListPage();
    },
    async mounted() {
        hideWxOptionMenu();
        window.addEventListener('scroll', this.srollFunc);
    },
    methods: {
        onclickChangeShowGuide() {
            this.showGuide = false;
            store.dispatch('getWetherFirstLink', {
                openId: this.userInfo.openid,
                type: 'task',
            });
        },
        onclickTaskCard(id) {
            let from = null;
            this.$router.push({
                name: 'taskDetail',
                query: {
                    id,
                    from: this.nav, // 0: 购买 1:拼团 2:邀请 3:阅读
                    openid: this.userInfo.openid,
                },
            });
        },
        navChanges(val) {
            this.nav = val;
        },
        async getListPage() {
            const wetherGet = this.wetherGetListPage();
            if (!wetherGet) return;
            this.requesting = true;
            const data = {
                isShow: '1',
                pageNo: wetherGet.pageNo,
                showType: this.nav,
                pageSize: 10,
            };
            store.commit('startRequest');
            await store.dispatch('getListPage', data);
            store.commit('endRequest');
            this.dealHsitory();
            this.requesting = false;
        },
        loadMore() {
            if (this.requesting) return;
            if (this.pageCount === this.pageNo) return;
            this.getListPage();
        },
        dealHsitory() {
            switch(this.nav) {
                case '0':
                    this.localPageNo0 = this.pageNo;
                    this.localPageCount0 = this.pageCount;
                    this.listPage0.push(...this.listPage);
                    this.nomore0 = this.pageCount <= this.pageNo && this.listPage0.length >= 10 ? true : false;
                break;
                case '1':
                    this.localPageNo1 = this.pageNo;
                    this.localPageCount1 = this.pageCount;
                    this.listPage1.push(...this.listPage);
                    this.nomore1 = this.pageCount <= this.pageNo && this.listPage1.length >= 10 ? true : false;
                break;
                case '2':
                    this.localPageNo2 = this.pageNo;
                    this.localPageCount2 = this.pageCount;
                    this.listPage2.push(...this.listPage);
                    this.nomore2 = this.pageCount <= this.pageNo && this.listPage2.length >= 10 ? true : false;
                break;
                case '3':
                    this.localPageNo3 = this.pageNo;
                    this.localPageCount3 = this.pageCount;
                    this.listPage3.push(...this.listPage);
                    this.nomore3 = this.pageCount <= this.pageNo && this.listPage3.length >= 10 ? true : false;
                break;
            }        
        },
        wetherGetListPage() {
            let pageNos = null;
            let pageCounts = null;
            switch(this.nav) {
                case '0': pageNos = this.localPageNo0; pageCounts = this.localPageCount0; break;
                case '1': pageNos = this.localPageNo1; pageCounts = this.localPageCount1; break;
                case '2': pageNos = this.localPageNo2; pageCounts = this.localPageCount2; break;
                case '3': pageNos = this.localPageNo3; pageCounts = this.localPageCount3; break;
            };
            pageNos++;
            if (pageNos > pageCounts) {
                return false;
            } else {
                return {
                    pageNo: pageNos,
                };
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

<style lang="less">
.task-center-boss {
    height: 0;
    position: relative;
    .task-center-guide {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: fixed;
        z-index: 9999;
        img {
            width: 100%;
            height: 100%;
            display: block;
        }
        .task-center-button {
            position: absolute;
            .xtr6(width, 180);
            .xtr6(height, 80);
            left: 50%;
            transform: translateX(-50%);
            bottom: 12%;
            z-index: 10000;
        }
    }
    .task-center-nav {
        .xtr6(height, 40);
        .xtr6(margin-bottom, 10);
        box-sizing: border-box;
        border-bottom: solid 1px @ddd;
        li {
            float: left;
            width: 25%;
            .xtr6(font-size, 15);
            .xtr6(line-height, 45);
            .xtr6(height, 40);
            box-sizing: border-box;
            font-weight: bold;
            color: #303030;
        }
        li.nav-active {
            color: @acColor;
            border-bottom: solid 2px @acColor;
        }
    }
}
.fixed-top-bar {
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
}
.task-center-nav-customize {
    p {
        display: inline-block !important;
        width: 100% !important;
    }
}
</style>