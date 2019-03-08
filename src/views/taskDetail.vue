<template>
    <div class="task-detail-boss">
        <div class="task-detail-title white">
            <p>{{previewInfo && previewInfo.title}}</p>
            <span>{{(previewInfo && previewInfo.endTime) ? '任务截止时间：' + previewInfo.endTime.split(' ')[0].replace(/-/g, '.') : '长期任务, 无截止日期'}}</span>
            <button class="task-detail-preview" @click="onclickPreview">预览</button>
        </div>
        <div class="task-history white">
            <p>
                <span :class="[num === 0 ? 'task-history-active' : '']" @click="num = 0">任务规则</span>
                <span :class="[num === 1 ? 'task-history-active' : '']" @click="num = 1">推广情况（{{totalCounts}}）</span>
            </p>
            <ul>
                <li>
                    <p>推广点击量</p>
                    <span>{{saleTaskStatistics && saleTaskStatistics.clickNumTotal || 0}}</span>
                </li>
                <li>
                    <p>成功推广数</p>
                    <span>{{saleTaskStatistics && saleTaskStatistics.successNumTotal || 0}}</span>
                </li>
            </ul>
        </div>
        <div class="task-rule white" v-show="num === 0">
            <p>任务规则</p>
            <p>方式一：分享消息</p>
            <span>点击下方“生成分享消息”</span>
            <p>方式二：分享海报</p>
        </div>
        <div class="task-infos white" v-show="num === 1 && Number(totalCounts) >= 1">
            <ul
                class="task-center-ul-container"
                v-infinite-scroll="loadMore"
                :infinite-scroll-disabled=false
                infinite-scroll-distance="100"
                style="position: relative;">
               <li class="task-center-list-card white" v-for="(item, index) in expandDetailList" :key="index" @click="onclickToPersonalTaskDetail(item.id, item.createType, item.successNum, item.clickNum)">
                    <p>领取任务时间：{{item.createDate}}</p>
                    <p>{{item.successNum}}/{{item.clickNum}}<i class="arrow-class"></i></p>
               </li>
            </ul>
        </div>
        <div class="transparent-line-through-div" v-if="noMoreData && num === 1 && totalCounts >= 10"><p>没有更多了</p></div>
        <div class="task-detail-through-div"></div>
        <div class="task-fixed-button white fix-iphonex">
            <p @click="onclickShareInfo"><span>生成分享消息</span></p>
            <p @click="onclickToPost"><span>生成海报</span></p>
        </div>
        <mt-popup
            class="mint-popup-box"
            v-model="popupAttention"
            popup-transition="popup-fade"
            :closeOnClickModal=false>
            <div class="popup-attention">
                <div>
                    <img src="../assets/img/attention.png" alt="">
                    <p>您的推广员账号已停用，</p>
                    <p>您可联系市场老师询问详情！</p>
                </div>
                <button @click="onclickSure">确定</button>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import store from 'store/index.js';
import { Toast, Popup } from 'mint-ui';
import { mapState, } from 'vuex';
import { dealQs, } from 'lib/script/hook.js';
import { registerShare, waitUntil, hideWxOptionMenu, } from 'lib/script/util.js';
export default {
    name: 'TaskDetail',
    components: {
        'mt-popup': Popup,
    },
    data() {
        return {
            popupAttention: false,
            taskId: null,
            type: null,
            pathName: null, // 分享链接的pathName
            shareType: null, // 分享链接的type
            qs: null,
            num: 0,
            requesting: false,
            noMoreData: false,
            expandDetailList: [],
            totalCounts: 0,
            localPageNo: 1,
            pageSize: 20,
            pageCount: 1,
        };
    },
    computed: {
        ...mapState({
            previewInfo: state => state.TaskDetail.previewInfo,
            expandId: state => state.TaskDetail.expandId,
            userInfo: state => state.user.userInfo,
            saleTaskStatistics: state => state.TaskDetail.saleTaskStatistics,
        }),
    },
    async created() {
        this.qs = dealQs();
        this.taskId = this.qs.id ? this.qs.id : null;
        store.commit('startRequest');
        await store.dispatch('getPreviewInfo', {id: this.qs.id});
        store.commit('endRequest');
        this.getType();
        await this.getExpandListPage(this.localPageNo);
    },
    mounted() {
        hideWxOptionMenu();
    },
    methods: {
        /*
        * 点击确认
        */
        onclickSure() {
            this.popupAttention = false;
            wx.closeWindow();
        },
        /*
        * 任务页面预览
        */
        async onclickPreview() {
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
            if(rdata){ //被暂停推广员后打开提示框
                const from = this.qs.from;
                switch(from) {
                    case '0': this.$router.push({ name: 'previewPage', query: { from: 'buy', id: this.qs.id, } }); break;
                    case '1':  this.$router.push({ name: 'previewPage', query: { from: 'group', id: this.qs.id, } }); break;
                    case '2': this.$router.push({ name: 'previewPage', query: { from: 'invite', id: this.qs.id, } }); break;
                    case '3':
                        if (this.previewInfo.objectType === 'news') {
                            this.$router.push({ name: 'imgText', query: { type: this.previewInfo.objectType, taskId: this.previewInfo.object.id, } });
                        } else {
                            this.$router.push({ name: 'ImgAudioVideo', query: { type: this.previewInfo.objectType, taskId: this.previewInfo.object.id, } });
                        }
                    break;

                };
            } else {
                this.popupAttention = true
            }
        },
        /*
        * 生成分享消息
        */
        async onclickShareInfo() {
            const _this = this;
            store.commit('startRequest');
            const rdata = await store.dispatch('saveTask', {
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
            if(rdata){ //被暂停推广员后打开提示框
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
            } else {
                this.popupAttention = true
            }
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
            if(rdata){ //被暂停推广员后打开提示框
                this.$router.push({
                    name: 'postDetail',
                    query: {
                        id: this.qs.id,
                        expandId: this.expandId,
                    },
                });
            } else {
                this.popupAttention = true 
            }
        },
        /*
        * 获取类型等信息
        */
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
        * 推广情况列表获取
        */
        async getExpandListPage(index) {
            this.requesting = true;
            store.commit('startRequest');
            const rdata = await store.dispatch('getExpandDetailExpandList', {
                pageNo: index,
                pageSize: this.pageSize,
                taskId: this.qs.id,
                openId: this.userInfo.openid,
            });
            store.commit('endRequest');
            this.requesting = false;
            this.totalCounts = rdata.data.count;
            this.expandDetailList.push(...rdata.data.list);
            this.localPageNo = rdata.data.pageNo;
            this.pageCount = rdata.data.pageCount;
        },
        loadMore() {
            if(this.requesting) return;
            if (this.localPageNo === this.pageCount) {
                this.noMoreData = true;
                return;
            }
            this.getExpandListPage(this.localPageNo + 1);
        },
        onclickToPersonalTaskDetail(id, type,sNum, cNum) {
            this.$router.push({
                name: 'personalTaskDetail',
                query: {
                    id,
                    taskId: this.qs.id,
                    createType: type,
                    from: this.qs.from,
                    s: sNum,
                    c: cNum,
                },
            });
        },
    },
    async beforeRouteEnter(to, from, next) {
        await Promise.all([
            store.dispatch('getExpandeNum', { taskId: to.query.id, openId: to.query.openid, }),
        ]),
        next();
    },
};
</script>

<style lang="less">
    .mint-popup-box {
        border-radius: 5px;
        .popup-attention {
            .xtr6(width, 270);
            .xtr6(height, 240);
            > div {
                box-sizing: border-box;
                .xtr6(padding, 20, 20, 0, 20);
                img {
                    .xtr6(width, 84);
                    .xtr6(height, 84);
                    .xtr6(margin-bottom, 22);
                }
                p {
                    color: @888;
                    display: inline-block;
                    width: 100%;
                    .xtr6(font-size, 15);
                    .xtr6(line-height, 23);
                    text-align: center;
                }
            }
            button {
                border: none;
                outline: none;
                color: @proColor;
                background-color: @fff;
                .xtr6(font-size, 18);
                .xtr6(height, 50);
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
            }
        }
    }
    .task-detail-boss {
        height: 0;
        .task-detail-title {
            .xtr6(min-height, 88);
            .xtr6(max-height, 113);
            .xtr6(margin-bottom, 20);
            .xtr6(padding, 18, 15);
            text-align: left;
            box-sizing: border-box;
            position: relative;            
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            p {
                color: @222;
                .xtr6(width, 270);
                .xtr6(line-height, 25);
                .xtr6(font-size, 17);
                .xtr6(margin-bottom, 10);
            }
            span {
                color: @999;
                .xtr6(line-height, 19);
                .xtr6(font-size, 13);
            }
            .task-detail-preview {
                .xtr6(right, 15);
                top: 50%;
                transform: translateY(-50%);
                position: absolute;
                color: @proColor;
                .xtr6(width, 60);
                .xtr6(height, 30);
                .xtr6(font-size, 13);
                border: solid 1px @proColor;
                border-radius: 5px;
                background-color: @fff;
                outline: none;
            }
        }
        .task-history {
            .xtr6(padding, 0, 0, 16, 0);
            .xtr6(margin-bottom, 10);
            >p {
                color: @333;
                display: block;
                .xtr6(height, 40);
                .xtr6(line-height, 40);
                .xtr6(font-size, 14);
                .xtr6(margin-bottom, 18);
                span {
                    float: left;
                    width: 50%;
                    display: block;
                    border-bottom: solid 2px @fff;
                }
                span.task-history-active {
                    color: @proColor;
                    border-bottom: solid 2px @proColor;
                }
            }
            ul {
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
        }
        .task-rule {
            text-align: left;
            box-sizing: border-box;
            .xtr6(height, 147);
            .xtr6(padding, 16, 15);
            >p:nth-of-type(1) {
                color: @999;
                .xtr6(font-size, 13);
                .xtr6(margin-bottom, 15);
            }
            >p:nth-of-type(n+2) {
                color: @222;
                .xtr6(font-size, 14);
                .xtr6(line-height, 25);
                .xtr6(margin-bottom, 6);
            }
            span {
                color: @999;
                display: inline-block;
                .xtr6(font-size, 12);
                .xtr6(margin-bottom, 16);
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
    }
    .task-center-ul-container {
        border-top: solid .5px @DA;
        border-bottom: solid .5px @DA;
        .xtr6(padding-left, 15);
        .task-center-list-card {
            .xtr6(height, 44);
            .xtr6(padding-right, 15);
            box-sizing: border-box;
            border-bottom: solid .5px @DA;
            p {
                display: inline-block;
                .xtr6(font-size, 14);
                .xtr6(line-height, 44);
            }
            p:nth-of-type(1) {
                float: left;
                color: @333;
            }
            p:nth-of-type(2) {
                float: right;
                color: @proColor;
                position: relative;
                .xtr6(padding-right, 15);
                i {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    .xtr6(right, 0);
                }
            }
        }
        li:last-child {
            border-bottom: none;
        }
    }
    .task-detail-through-div {
        .xtr6(height, 60);
    }
</style>

