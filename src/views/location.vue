<style lang='less'>
	@import url('../lib/less/util.less');
    .location-gsx {
        .mint-indexsection-index {
            text-align: left;
        }
        .mint-indexlist-nav {
            border-left: none;
        }
        .mint-indexlist-content {
            -webkit-overflow-scrolling: touch
        }
        .mint-field-core,
            .mint-cell {
                color: inherit;
                background: #fff;
            }
            .mint-cell:last-child {
                background-image: none;
            }
            .mint-cell-wrapper {
                .xtr6(font-size, 17);
                .xtr6(min-height, 44);
                background-image: none;
                padding: 0;
                line-height: 2.8;
                .xtr6(margin-left, 15);
                border-bottom: 1px solid #e5e5e5;
            }
        .mint-indexsection {
            text-align: left;
        }
        // .search {
            // background: #F6F5F5;
            // box-sizing: border-box;
            // .xtr6(height, 54);
            // background: red;
            input::-webkit-input-placeholder {
                text-align: center;
            }
            .search-input {
                .xtr6(padding, 0, 5);
                .xtr6(width, 345);
                .xtr6(margin, 10, 15);
                outline: none;
                .xtr6(border-radius, 2);
                border: none;
                .xtr6(height, 34);
            }
        // }
        .curr-area {
            box-shadow: border-box;
            .xtr6(padding, 15);
            text-align: left;
            background-color: #fff;
            .curr-ico {
                .xtr6(width, 16); 
                .xtr6(height, 19);
                
            }
            .area {
                .xtr6(font-size, 21);
                color: @proColor;
                .xtr6(margin, 0, 5);
            }
            .GPX {
                color: #ccc;
            }
        }
        .common-use {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            flex-wrap: wrap;
            .xtr6(padding, 15, 15, 0, 15);
            border-top: 1px solid #FFFFFFFF;
            border-bottom: 1px solid #FFFFFFFF;
            .item-area {
                display: inline-block;
                .xtr6(width, 100);
                .xtr6(height, 30);
                .xtr6(line-height, 30);
                text-align: center;
                border-radius:5px;
                border:1px solid #e5e5e5;
                .xtr6(margin-bottom, 15);
            }
        }
        .search-aro {
            .xtr6(padding-left, 15);
            .search-item {
                .xtr6(height,45);
                text-align: left;
                .xtr6(line-height, 45);
                border-bottom: 1px solid #e5e5e5;
            }
        }
    }

</style>
<template>
    <div class="location-gsx">
            <div class="search">
                <input type="search" @input="searchData" placeholder="搜索" v-model="findByName"  class="search-input">
            </div>
            <p class="curr-area" v-if="!findByName">
                <img class="curr-ico" src="../assets/img/curr.png" alt="">
                <span class="area">{{areaC}}</span>
                <span class="GPX">GPS定位</span>
            </p> 
            <mt-index-list v-if="!findByName" :height=600>
                <div class="common-use" v-if="!findByName">
                    <span class="item-area" v-for="item in commonList" @click="goIntroducePage(item)">{{item.name}}</span>
                </div>
                <mt-index-section v-for="(item, index) in allAreaList" :index="allAreaListKey[index]">
                    <mt-cell v-for="item1 in item" :title="item1.name"  @click.native="goIntroducePage(item1)"></mt-cell>
                </mt-index-section>
            </mt-index-list>
            <ul v-if="findByName" class="search-aro">
                <li class="search-item" v-if="!searchList.length">暂无数据</li>
                <li class="search-item" v-for="item in searchList"  @click="goIntroducePage(item)">{{item.name}}</li>
            </ul>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import store from 'store/index.js';
import {wait, waitUntil, } from 'lib/script/util'
import { IndexList, IndexSection, Search, cell } from 'mint-ui';

export default {
    data() {
        return {
            allAreaList: [],
            allAreaListKey: [],
            findByName: '',
            result: [],
            areaC: '定位中...',
            area: '',
            commonList: [
                {name: '北京', id: '247', pId: '7'},
                {name: '上海', id: "255", pId: '7'},
                {name: '杭州', id: '3154', pId: '257'},
                {name: '广州', id: '3267' , pId: '265'},
                {name: '青岛', id: '3202' , pId: '261' },
                {name: '成都', id: '3362' , pId: '269'},
                {name: '西安', id: '3415', pId: '273' },
                {name: '沈阳', id: '3087' , pId: '252'},
                {name: '深圳', id: '3269' , pId: '265' },
            ], 
            searchList: [],
        }
    },

    components: {
        IndexList,
        IndexSection,
        Search,
        cell
    },

    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            appId: state => state.user.userInfo.appId,
        })
    },

    async created() {
        if (this.$route.query.redirectId) { // 后台重定向
            this.$router.push({
                name: 'introductionPage',
                query: {
                    from: 'pc',
                    formId: this.$route.query.redirectId,
                },
            });
        }
        if (!this.userInfo) await store.dispatch('getUserInfo');
        this.checkWhetherFormSharkLink(this.$route.query.from);
        let obj2 = {
           pids: '6882',
           typeLevel: 4,
        }
        let data = await store.dispatch('allArea', obj2);
        Object.keys(data.data.data).forEach(item => {
            this.allAreaListKey.push(item)
            this.allAreaList.push(data.data.data[item])
        })

        // util.wait
    },

    mounted() {
        waitUntil(()=> {
            return !!store.state.jssdk.jssdkConfig;
        }, () => {
            this.getCurrentA();
        }, 1000, 10);
    },

    watch: {
        area(newV, oldV) {
            let arr = newV.split(',')
            if (arr[0] == arr[1]) {
                this.areaC = arr[0]
            } else {
                this.areaC = `${arr[0]},${arr[1]}`
            }
        }
    },

    methods: {
        async searchData(val) {
            let obj2 = {
               name: this.findByName,
               pids:6882,
               typeLevel:4,
            }
            let data = await store.dispatch('findByNameS', obj2);
            this.searchList = data.data.data  
        },

        async goIntroducePage(item) {
            store.commit('startRequest');
            let obj2 = {
                province: item.pid,
                city: item.id
            }
            let data = await store.dispatch('getCompany', obj2);
            if (!data) {
                store.commit('endRequest');
                this.$router.push({
                    name: 'building',
                })
                store.commit('endRequest');
                return
            }

            let obj3 = {
                companyId: data.data.data.officeId
            }
            let data2 = await store.dispatch('getAppsByOfficeId', obj3);
            if (!data2)  {
                store.commit('endRequest');
                this.$router.push({
                    name: 'building',
                })
                return
            }
            store.commit('endRequest');
            this.$router.push({
                name: 'introductionPage',
                query: {
                    compId: data.data.data.officeId
                }
            })
        },

        getCurrentA() {
            let _this = this
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    _this.getCurr(res)
                },
                // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                // var speed = res.speed; // 速度，以米/每秒计
                // var accuracy = res.accuracy; // 位置精度
            });
        }
        ,
        async getCurr(res) {
            let obj = {
                jwd: `${res.latitude},${res.longitude}`
            }
            let data2 =  await store.dispatch('getCurrArea', obj);
            this.area = JSON.parse(data2.data.data).addrList[0].admName
        },
        /*
        * 判断是否是从分享链接进入
        * from
        *       attention 关注页面的分享
        *       sign 报名页的分享
        */
        checkWhetherFormSharkLink(from) {
            if(from === 'attention') {
                if (this.userInfo.hasSubscribe === '1')  window.location = this.userInfo.bizUrl; // 已关注订阅号
            } else if (from === 'sign') {
                if (this.userInfo.salerFlag === '1') { // 是推广员
                    this.$router.push({
                        name: 'taskCenter',
                    });
                } else if (this.userInfo.hasSubscribe === '1' && this.userInfo.salerFlag !== '1') { // 已经关注公众号
                    this.$router.push({
                        name: 'expanderSignUp',
                    });
                }
            }
        },
    },
}
</script>

