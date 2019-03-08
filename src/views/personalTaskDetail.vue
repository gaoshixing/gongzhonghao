<template>
    <div class="personal-task-detail-boss">
        <div class="personal-task-detail-info white">
            <p>{{previewInfo && previewInfo.title}} </p>
            <p>任务领取时间：{{previewInfo && previewInfo.createDate}} </p>
            <p>任务领取方式：{{createType}} </p>
            <span>任务截止时间：{{previewInfo && previewInfo.endTime ? previewInfo.endTime : '长期任务，无截止时间'}} </span>
        </div>
        <ul class="personal-task-detail-ul white">
            <li>
                <p>推广点击量</p>
                <span>{{qs && qs.s || 0}}</span>
            </li>
            <li>
                <p>成功推广数</p>
                <span>{{qs && qs.c || 0}}</span>
            </li>
        </ul>
        <div class="task-infos white">
            <p>成功{{typeName}}用户</p>
            <ul
                v-infinite-scroll="loadMore"
                :infinite-scroll-disabled=false
                infinite-scroll-distance="100"
                style="position: relative;">
                <li class="task-center-list-card white" v-for="item in listPageList" :key="item.id">
                    <div class="task-center-list-card-user-infos">
                            <img :src="item.openAvatarUrl" alt="">
                            <span>{{item.openName}}</span>
                            <button class="can-fundel" v-show="item.status=='pay'">已签单</button>
                    </div>
                    <div class="task-center-list-card-weal-infos">
                        <p>{{typeName}}时间：{{item.inPriceDate}}</p>
                    </div>
                </li>
                <!-- <li class="task-center-list-card white">
                   <div class="task-center-list-card-user-infos">
                        <img :src="userInfo.avatarUrl" alt="">
                        <span>一二三四五六七八九十一二三四五六七八九十</span>
                   </div>
                   <div class="task-center-list-card-weal-infos">
                       <p>拼团时间：2018.7.18 21:04:35</p>
                   </div>
               </li> -->
            </ul>
        </div>
        <div class="transparent-line-through-div" v-if="noMoreData && totalCounts >= 10"><p>没有更多了</p></div>
        <div class="task-detail-through-div"></div>
        <div class="task-fixed-button white fix-iphonex">
            <p @click="onclickShareInfo"><span>生成分享消息</span></p>
            <p @click="onclickToPost"><span>生成海报</span></p>
        </div>
    </div>
</template>

<script>
import store from 'store/index.js';
import { Toast, } from 'mint-ui';
import { mapState, } from 'vuex';
import { dealQs, } from 'lib/script/hook.js';
import { registerShare, waitUntil, } from 'lib/script/util.js';
export default {
    name: 'PersonalTaskDetail',
    data() {
        return {
            qs: null,
            type: null,
            createType : '',
            requesting: false,
            listPageList: [],
            localPageNo: 1,
            pageSize: 10,
            pageCount: 1,
            totalCounts: 11,
            noMoreData: false,
        };
    },
    computed: {
        ...mapState({
            previewInfo: state => state.TaskDetail.previewInfo,
            userInfo: state => state.user.userInfo,
        }),
        typeName: function(){
            let name =''
            if(this.qs.from == '0'){
                name = '购买';
            } else if(this.qs.from == '1'){
                name = '拼团';
            } else if(this.qs.from == '2'){
                name = '报名';
            } else if(this.qs.from == '3'){
                name = '阅读';
            }
            return name;
        }
    },
    async created() {
        this.qs = dealQs();
        this.createType = this.$route.query.createType === '0' ? '生成链接' : '生成海报';
        if (!this.userInfo) await store.dispatch('getUserInfo');
        if (!this.previewInfo) await store.dispatch('getPreviewInfo', {id: this.qs.taskId});
        await this.getListPage(this.localPageNo);
        console.log('++++', this.previewInfo);
    },
    methods: {
        /*
        * 生成分享消息
        */
        async onclickShareInfo() {
            const _this = this;
            store.commit('startRequest');
            await store.dispatch('saveTask', {
                appId: this.userInfo.appId,
                clickNum: "0",
                createType: "0", // 0 链接 1 海报
                id: "",
                openId: this.userInfo.openid,
                status: "0",
                successNum: "0",
                taskId: this.previewInfo.id,
                type: this.type,
                userType: "1", // 0 市场 1 推广
            });
            store.commit('endRequest');
            wx.showOptionMenu();
            store.commit('setPopupGlobal', true);
            waitUntil(() => {
                return !!store.state.jssdk.jssdkConfig;
            }, () => {
                let link = `${location.protocol}//${location.hostname}${location.pathname}?`;
                let desc = _this.previewInfo.objectDescribe;
                const from = _this.qs.from;
                const type = _this.previewInfo.objectType;
                switch (type) {
                    case 'goods': link+= `id=${_this.expandId}&type=goods/#/buy`; break;
                    case 'pack': link+= `id=${_this.expandId}&type=pack/#/groupBuy`; break;
                    case 'invite': link+= `id=${_this.expandId}&type=invite/#/invite`; break;
                    case 'news': link+= `id=${_this.expandId}&type=news/#/imgText`; break;
                    case 'audio': link+= `id=${_this.expandId}&type=audio/#/imgAudioVideo`; break;
                    case 'video': link+= `id=${_this.expandId}&type=video/#/imgAudioVideo`; break;
                    case 'image': link+= `id=${_this.expandId}&type=image/#/imgAudioVideo?`; break;
                }
                /*
                * 分享
                */
                store.commit('addJSSDKReadyCallback', () => {
                    const appMessage = {
                        title: _this.previewInfo.title, // 分享标题
                        desc, // 分享描述
                        link, // 分享链接
                        imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                    };
                    registerShare(appMessage);
                });
            });
        },
        /*
        * 生成海报
        */
        async onclickToPost() {
            if (!this.previewInfo.imageId) {
                Toast('当前任务未设置宣传海报,暂无法生成宣传海报');
                return;
            }
            store.commit('startRequest');
            const rdata = await store.dispatch('saveTask', {
                appId: this.userInfo.appId,
                clickNum: "0",
                createType: "1", // 0 链接 1 海报
                id: "",
                openId: this.userInfo.openid,
                status: "0",
                successNum: "0",
                taskId: this.previewInfo.id,
                type: this.type,
                userType: "1", // 0 市场 1 推广
            });
            store.commit('endRequest');
            this.$router.push({
                name: 'postDetail',
                query: {
                    id: this.qs.id,
                    expandId: this.expandId,
                },
            });
        },
        getType() {
            switch(this.qs.from) {
                case '0': this.type = "goods"; this.pathName = 'buy'; this.shareType = 'goods'; break;
                case '1': this.type = "pack"; this.pathName = 'groupBuy';  this.shareType = 'pack'; break;
                case '2': this.type = "invite"; this.pathName = 'invite';  this.shareType = 'invite'; break;
                case '3':
                    switch(this.previewInfo.objectType) {
                        case 'news': this.pathName = 'imgText';  this.shareType = 'news'; this.type = 'news'; break;
                        case 'image': this.pathName = 'imgAudioVideo';  this.shareType = 'image'; this.type = 'image'; break;
                        case 'audio': this.pathName = 'imgAudioVideo';  this.shareType = 'audio'; this.type = 'audio'; break;
                        case 'video': this.pathName = 'imgAudioVideo';  this.shareType = 'video'; this.type = 'video';break;
                    }
                break;
            };
        },
        /*
        * 列表获取
        */
        async getListPage(index) {
            this.requesting = true;
            store.commit('startRequest');
            const rdata = await store.dispatch('getSuccessExpandListPage', {
                pageNo: index,
                pageSize: 10,
                spreadId: this.$route.query.id,
                status: 'pay',
            });
            store.commit('endRequest');
            this.listPageList.push(...rdata.data.page.list);
            this.requesting = false;
            console.log('rdata of listPage', rdata);
        },
        loadMore() {
            if (this.requesting) return;
            if (this.pageCount === this.localPageNo) {
                this.noMoreData = true;
                return;
            } 
        },
    },
};
</script>

<style lang="less">
    .personal-task-detail-boss {
        .personal-task-detail-info {
            text-align: left;
            box-sizing: border-box;
            .xtr6(height, 145);
            .xtr6(font-size, 13);
            .xtr6(padding, 18, 15);
            .xtr6(margin-bottom, 20);
            p {
                .xtr6(margin-bottom, 10);
            }
            p:nth-of-type(1) {
                color: @222;
                .xtr6(font-size, 17);
                .xtr6(line-height, 24);
            }
            p:nth-of-type(2) {
                color: @333;
                .xtr6(line-height, 19);
            }
            p:nth-of-type(3) {
                color: @333;
                .xtr6(line-height, 19);
            }
            >span {
                color: @999;
                .xtr6(line-height, 19);
            }
        }
        .task-infos {
            text-align: left;
            box-sizing: border-box;
            .xtr6(padding-left, 15);
            .xtr6(margin-top, 10);
            >p {
                color: @999;
                border-bottom: solid .5px @DA;
                .xtr6(font-size, 13);
                .xtr6(height, 45);
                .xtr6(line-height, 45);
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
        .task-fixed-button {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            .xtr6(height, 50);
            .xtr6(padding, 8, 15);
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            border-top: solid .5px #DADADA;
            p {
                float: left;
                width: 49%;
                color: #fff;
                .xtr6(height, 33);
                background-color: @proColor;
                border-radius: 3px;
                position: relative;
                span {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    .xtr6(font-size, 16);
                    display: inline-block;
                    width: 100%;
                }
            }
        }
        .task-detail-through-div {
            .xtr6(height, 60);
        }
    }
    .personal-task-detail-ul {
        .xtr6(height, 60);
        .xtr6(padding, 0, 15);
        li {
            float: left;
            width: 50%;
            .xtr6(height, 60);
            .xtr6(padding-top, 5);
            box-sizing: border-box;
            p {
                color: @999;
                .xtr6(font-size, 12);
                .xtr6(line-height, 20);
            }
            span {
                color: @proColor;
                .xtr6(font-size, 24);
                .xtr6(line-height, 35);
            }
        }
        li:last-child {
            border-left: solid 1px #eee;
        }
    }
</style>
