<template>
    <div class="expand-weal-boss">
        <div class="expand-weal-top-div"></div>
        <div class="expand-weal-guide" v-if="showGuide">
            <img src="../assets/img/guide2.png" alt="">
            <div class="expand-weal-button" @click="onclickChangeShowGuide"></div>
        </div>
        <div class="expand-weal-top white">
            <ul>
                <li>
                    <p>领取任务数</p>
                    <span>{{wealNum && wealNum.taskNum}}</span>
                </li>
                <li>
                    <p>成功推广数</p>
                    <span>{{wealNum && wealNum.successNum}}</span>
                </li>
                <li>
                    <p>推广签单数</p>
                    <span>{{wealNum && wealNum.signNum}}</span>
                </li>
            </ul>
            <div class="expand-weal-top-button">
                <button class="button-large expand-weal-top-button-weal" @click="onclickTogetMoney">我要返利</button>
            </div>
        </div>
        <div class="expand-weal-bottom white">
            <div :class="[localListPage.length && showNoData ? '' : 'expand-no-data-bottom']">
                返利记录
                <p
                    class="expand-left"
                    @click="onclickTogetMoney">
                    推广签单共{{resObj.count.total}}笔，剩余<span style="color:#FF7814;">{{resObj.count.remain}}</span>笔未返利
                </p>
            </div>
            <ul
                v-infinite-scroll="loadMore"
                :infinite-scroll-disabled=false
                infinite-scroll-distance="100"
                style="position: relative;">
             <!--   <li
                    v-for="(item, index) in localListPage"
                    :key="index">
                   <p>{{item.time | stringSplit}}</p>
                   <span>返利金额: {{item.price | priceFilter}}</span>
               </li> -->
               <li class="task-center-list-card white" v-for="(item, index) in resObj.page.list" :key="index">
                    <div class="task-center-list-card-user-infos">
                        <img :src="item.openAvatarUrl" alt="">
                        <span>{{item.openName}}</span>
                        <button :class="item.status == '已返利' ? 'can-fundel' : 'cant-fundel'">{{item.status}}</button>
                    </div>
                    <div class="task-center-list-card-weal-infos">
                        <p>签单时间：{{item.signTime}}</p>
                        <p v-show="item.price">返利金额：{{item.price | priceFilter}}</p>
                    </div>
                </li>
               <!-- <li class="expander-weal-list-card white">
                   <div class="expander-weal-list-card-user-infos">
                        <img :src="userInfo.avatarUrl" alt="">
                        <span>一二三四五六七八九十一二三四五六七八九十</span>
                        <button class="can-fundel">未返利</button>
                   </div>
                   <div class="expander-weal-list-card-weal-infos">
                       <p>签单时间：2018.7.18 21:04:35</p>
                   </div>
               </li>
               <li class="expander-weal-list-card white">
                   <div class="expander-weal-list-card-user-infos">
                        <img :src="userInfo.avatarUrl" alt="">
                        <span>一二三四五六七八九十一二三四五六七八九十</span>
                        <button class="cant-fundel">已返利</button>
                   </div>
                   <div class="expander-weal-list-card-weal-infos">
                       <p>签单时间：2018.7.18 21:04:35</p>
                       <p>返利金额：1300.00</p>
                   </div>
               </li> -->
            </ul>
        </div>
        <div v-if="!resObj.page.list.length && showNoData" class="no-data-div">
            <img src="../assets/img/no-data.png" alt="" >
            <p>暂无返利记录</p>
        </div>
        <div class="transparent-line-through-div" v-if="localPageNo > pageCount"><p>没有更多了</p></div>
        <div class="tab-top-div"></div>
        <Tabbar :value="value"></Tabbar>
        <a href="tel:18301489983" id="tel" style="display: none"></a>
    </div>
</template>

<script>
import store from 'store/index.js';
import { mapState, } from 'vuex';
import Tabbar from 'components/tabbar.vue';
import { MessageBox, InfiniteScroll } from 'mint-ui';
import { hideWxOptionMenu, } from 'lib/script/util.js';

export default {
    name: 'expandWeal',
    components: {
        Tabbar,
        InfiniteScroll,
    },
    data() {
        return {
            value: '1',
            showGuide: false,
            localListPage: [],
            pageNo: 1,
            pageCount: 1,
            localPageNo: 1,
            localPageSize: 10,
            requesting: false,
            showNoData: false, // 确保数据请求完之后再显示 no-data logo
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            wealNum: state => state.expandWeal.wealNum,
            wealList: state => state.expandWeal.wealList,
            resObj: state => state.expandWeal.fanliObject,
        }),
    },
    async created() {
        if (!this.userInfo) await store.dispatch('getUserInfo');
        if (this.userInfo.rebateMaskIsShow === '1') this.showGuide = true;
        await Promise.all([
           store.dispatch('getWealNum', {openId: this.userInfo.openid}),
        ]);
    },
    mounted() {
        hideWxOptionMenu();
        this.getListPage();
    },
    filters: {
        stringSplit(v) {
            if (!v) return v;
            return v.split(' ')[0].replace(/-/g, '.');
        },
        priceFilter(v) {
            if (!v) return v || '--';
            return v.substr(0, v.indexOf('.') + 3);
        },
    },
    methods: {
        onclickChangeShowGuide() {
            this.showGuide = false;
            store.dispatch('getWetherFirstLink', {
                openId: this.userInfo.openid,
                type: 'rebate',
            });
        },
        onclickTogetMoney() {
            MessageBox.confirm('', {
                title: '提示',
                confirmButtonText: '拨打',
                message: `&nbsp;&nbsp;&nbsp;&nbsp;返利用户请拨打咨询电话&nbsp;&nbsp;&nbsp;&nbsp; 18304189983`
            }).then(action => {
                if(action === 'confirm') {
                    document.getElementById('tel').click();
                }
            }).catch(() => {});
        },
        loadMore() {
            if (this.requesting) return;
            if (this.localPageNo > this.pageCount) return;
            this.getListPage();
        },
        async getListPage() {
            this.requesting = true;
            const data = {
                pageNo: this.localPageNo,
                pageSize: this.localPageSize,
                openId: this.userInfo.openid,
            };
            store.commit('startRequest');
            await store.dispatch('getFanliObject', data);
            store.commit('endRequest');
            this.showNoData = true;
            this.dealHsitory();
            this.requesting = false;
        },
        dealHsitory() {
            this.pageNo = this.resObj.page.pageNo;
            this.localPageNo = this.pageNo + 1;
            this.pageCount = this.resObj.page.pageCount;
            this.localListPage.push(...this.resObj.page.list);
        },
    },
    beforeDestroy() {
        // document.body.height = 0;
        // document.body.scrollHeight = 0;
        // document.documentElement.scrollHeight = 0; 
    },
};
</script>

<style lang="less" >
.expand-weal-boss {
    width: 100%;
    height: 0;
    .expand-weal-top-div {
        .xtr6(height, 20);
    }
    .expand-weal-guide {
        width: 100%;
        left: 0;
        top: 0;
        position: fixed;
        z-index: 9999;
        img {
            width: 100%;
            height: 100%;
            display: block;
        }
        .expand-weal-button {
            position: absolute;
            .xtr6(width, 180);
            .xtr6(height, 80);
            left: 50%;
            transform: translateX(-50%);
            bottom: 13%;
            z-index: 10000;
        }
    }
    .expand-weal-top {
        width: 100%;
        .xtr6(height, 165);
        .xtr6(padding, 20, 20);
        position: relative;
        box-sizing: border-box;
        ul {
            color: @999;
            width: 100%;
            .xtr6(height, 60);
            .xtr6(margin-bottom, 20);
            li {
                float: left;
                width: 33%;
                .xtr6(padding-top, 5);
                p {
                    color: @999;
                    .xtr6(font-size, 12);
                    .xtr6(line-height, 20);
                }
                span {
                    color: @proColor;
                    .xtr6(font-size, 24);
                    .xtr6(line-height, 40);
                }
            }
            li:nth-of-type(n+2) {
                border-left: solid 1px #eee;
            }
        }
    }
    .expand-weal-bottom {
        .xtr6(margin-top, 10);
        .xtr6(margin-bottom, 15);
        >div {
            color: @999;
            text-align: left;
            .xtr6(margin-left, 15);
            .xtr6(font-size, 13);
            .xtr6(height, 44);
            .xtr6(line-height, 44);
            border-bottom: solid .5px @e5;
            > p {
                float: right;
                .xtr6(padding-right, 15);
            }    
        }
        li {
            color: @999;
            text-align: left;
            .xtr6(margin-left, 15);
            .xtr6(padding-top, 15);
            .xtr6(font-size, 13);
            .xtr6(height, 80);
            box-sizing: border-box;
            border-bottom: solid .5px @e5;
            p {
                .xtr6(line-height, 20);
            }
            span {
                color: @222;
                .xtr6(font-size, 17);
                //.xtr6(line-height, 40);
            }
        }
        li:last-child {
            border-bottom: none;
        }

        .task-center-list-card {
            box-sizing: border-box;
            border-bottom: solid .5px @DA;
            .xtr6(height, 76);
            .xtr6(padding, 15, 15, 16, 0);
            .task-center-list-card-user-infos {
                .xtr6(height, 21);
                .xtr6(line-height, 21);
                .xtr6(margin-bottom, 9);
                img {
                    float: left;
                    border-radius: 50%;
                    display: inline-block;
                    .xtr6(width, 21);
                    .xtr6(height, 21);
                    .xtr6(margin-right, 9);
                }
                span {
                    color: @333;
                    float: left;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .xtr6(font-size, 12);
                    .xtr6(max-width, 250);
                }
                button {
                    outline: none;
                    border: none;
                    float: right;
                    border-radius: 2px;
                    .xtr6(width, 50);
                    .xtr6(height, 21);
                    .xtr6(font-size, 12);
                }
                button.can-fundel {
                    color: @fff;
                    opacity: .6;
                    background-color: @proColor;
                }
                button.cant-fundel {
                    color: @fff;
                    background-color: @ccc;
                }
            }
            .task-center-list-card-weal-infos {
                overflow: hidden;
                width: 100%;
                p:nth-of-type(1) {
                    color: @999;
                    float: left;
                    text-align: left;
                    .xtr6(font-size, 12);
                }
                p:nth-of-type(2) {
                    color: @999;
                    float: right;
                    .xtr6(font-size, 12);
                }
            }
        }
    }
    .expand-left {
        color: #586C94;
        .xtr6(font-size, 13);
        .xtr6(line-height, 44);
    }
}
.no-data-div {
    .xtr6(width, 206);
    .xtr6(height, 104);
    position: relative;
    margin: 0 auto;
    .xtr6(margin-top, 55);
    img {
        width: 100%;
        height: 100%;
    }
    p {
        color: @999;
        .xtr6(margin-top, 30);
        .xtr6(font-size, 16);
    }
}
.expand-no-data-bottom {
    border-bottom: none !important;
}
.expand-weal-top-button-weal {
    .xtr6(font-size, 16);
    .xtr6(height, 40);
    .xtr6(line-height, 40);
}
.expander-weal-list-card {
    box-sizing: border-box;
    border-bottom: solid .5px @DA;
    .xtr6(height, 76);
    .xtr6(padding, 15, 15, 16, 0);
    .xtr6(margin-left, 15);
    .expander-weal-list-card-user-infos {
        .xtr6(height, 21);
        .xtr6(line-height, 21);
        .xtr6(margin-bottom, 9);
        img {
            float: left;
            border-radius: 50%;
            display: inline-block;
            .xtr6(width, 21);
            .xtr6(height, 21);
            .xtr6(margin-right, 9);
        }
        span {
            color: @333;
            float: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .xtr6(font-size, 14);
            .xtr6(max-width, 250);
        }
        button {
            outline: none;
            border: none;
            float: right;
            border-radius: 2px;
            .xtr6(width, 50);
            .xtr6(height, 21);
            .xtr6(font-size, 12);
        }
        button.can-fundel {
            opacity: .6;
            color: @fff;
            background-color: @proColor;
        }
        button.cant-fundel {
            color: @fff;
            background-color: @ccc;
        }
    }
    .expander-weal-list-card-weal-infos {
        p:nth-of-type(1) {
            color: @999;
            float: left;
            text-align: left;
            .xtr6(font-size, 12);
        }
        p:nth-of-type(2) {
            color: @999;
            float: right;
            .xtr6(font-size, 12);
        }
    }
}
</style>