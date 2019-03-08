<template>
    <div class="group-buy-boss">
         <inv
            v-if="from == 'invite'&&qs.id"
            :id="qs.id"
            :isPreview='false'
        ></inv>
        <BuyIntro
            v-if="from === 'buy'"
            :imgUrl="imgUrl"
            :title="previewInfo && previewInfo.title"
            :intro="previewInfo && previewInfo.object.introduction"
            :oldPrice="previewInfo && previewInfo.object.oriPrice"
            :type="from"
        ></BuyIntro>

        <BuyIntro
            v-if="from === 'group'"
            :imgUrl="imgUrl"
            :title="previewInfo && previewInfo.title"
            :intro="previewInfo && previewInfo.object.goodsList[0].introduction"
            :oldPrice="previewInfo && previewInfo.object.goodsList[0].oriPrice"
            :type="from"
        ></BuyIntro>

        <p class="group-left-tips white" v-if="from === 'group'">
            <img src="../assets/img/groupBuy.png" alt="">
            {{previewInfo.object.memberNum}}人参加即拼团成功！
        </p>
        <div class="group-detail white" v-if="from === 'buy'">
            <p>详情描述</p>
            <div v-html="previewInfo && previewInfo.object.details"></div>
        </div>

        <my-nav :navigations="navs" :nav="nav" @navChanges="navChanges" v-if="from === 'group'" class="group-buy-nav-customize"></my-nav>
        <div class="group-detail white" v-if="nav === '0' && from === 'group' ">
            <p>详情描述</p>
            <div v-html="previewInfo && previewInfo.object.goodsList[0].details"></div>
        </div>
        <div class="group-rule white" v-if="nav === '1' && from === 'group'">
            拼团规则文案待完善
        </div>
        <div 
            v-if="from !== 'invite'"
            class="throw-div"
        ></div>

        <BuyButton
            v-if="from === 'buy'"
            :oldPrice="previewInfo && previewInfo.object.oriPrice"
            :price="previewInfo && previewInfo.object.price"
            :lowStock="previewInfo.object.stockNum === null ? null : Boolean(Number(previewInfo && previewInfo.object.stockNum) <= 10)"
            :buttonText="buttonText"
            @onclickJoin="onclickJoin"
            class="preview-page-buy-button"
            :from="from">
        </BuyButton>

        <BuyButton
            v-if="from === 'group'"
            :oldPrice="previewInfo && previewInfo.object.goodsList[0].oriPrice"
            :price="previewInfo && previewInfo.object.goodsList[0].price"
            :buttonText="buttonText"
            @onclickJoin="onclickJoin"
            class="preview-page-buy-button"
            :from="from">
        </BuyButton>
    </div>
</template>

<script>
import { Popup, Toast, } from 'mint-ui';
import inv from 'components/inv.vue';
import Nav from 'components/nav.vue';
import BuyIntro from 'components/buyIntro.vue';
import BuyButton from 'components/buyButton.vue';
import { mapState, } from 'vuex';
import store from 'store/index.js';
import { CountDown, hideWxOptionMenu, } from 'lib/script/util.js';
import { dealQs, } from 'lib/script/hook.js';
export default {
    name: 'PreviewPage',
    components: {
        BuyIntro,
        'my-nav': Nav,
        BuyButton,
        Popup,
        inv,
    },
    data() {
        return {
            nav: '0',
            navs: [
                { value: '0', text: '详情描述', },
                { value: '1', text: '拼团规则', },
            ],
            popupVisible: false,
            popupTips: false,
            timer: null,
            popUpText: null,
            imgUrl: '',
            groupEndTime: null,
            buttonText: null,
            from: null,
            qs: {},
        };
    },
    computed: {
        ...mapState({
            previewInfo: state => state.TaskDetail.previewInfo,
        }),
    },
    async created() {
        this.qs = dealQs();
        this.from = this.qs.from;

        if(!this.previewInfo) await store.dispatch('getPreviewInfo', { id: this.qs.id });

        let imgId = null;
        if (this.from === 'buy') {
            this.buttonText = '立即购买';
            imgId = this.previewInfo.object.attachmentId;
        } else if (this.from === 'group'){
            this.buttonText = '立即拼团';
            imgId = this.previewInfo.object.goodsList[0].attachmentId;
        }
        if (imgId) this.imgUrl = await store.dispatch('getImg', { id: imgId, });
    },
    mounted() {
        hideWxOptionMenu();
    },
    methods: {
        navChanges(val) {
            this.nav = val;
        },
        onclickJoin() {
            Toast('预览页面无法进行此操作');
        },
    },
};
</script>

<style lang="less">
    .group-buy-boss {
        height: 0;
        .group-left-tips {
            color: @proColor;
            text-align: left;
            .xtr6(height, 40);
            .xtr6(line-height, 40);
            .xtr6(padding-left, 15);
            .xtr6(font-size, 14);
            .xtr6(margin-bottom, 10);
            img {
                float: left;
                display: inline-block;
                .xtr6(width, 15);
                .xtr6(height, 15);
                .xtr6(margin-top, 12);
                .xtr6(margin-right, 10);
            }
        }
        .group-detail {
            .xtr6(padding, 15);
            >p {
                color: @222;
                .xtr6(font-size, 14);
                .xtr6(margin-bottom, 6);
                text-align: left;
            }
            >div {
                color: @999;
                text-align: left;
                .xtr6(font-size, 12);
                .xtr6(line-height, 18);
                p {
                    .xtr6(margin-bottom, 10);
                }
                span {
                    display: inline-block;
                    .xtr6(margin-bottom, 10);
                }
                span:last-child {
                    .xtr6(margin-bottom, 0);
                }
                p:last-child {
                    .xtr6(margin-bottom, 0);
                }
                // video 使用的是 iframe 进行播放; 控制 iframe 的样式; 适配 小屏 及 以下...
                iframe {
                    .xtr6(min-width, 345);
                    max-width: 100%;
                }
            }
        }
        .group-rule {
            .xtr6(padding, 15);
        }
    }
    .confirm-info-button {
        width: 100%;
        border: none;
        outline: none;
        color: @proColor;
        background-color: @fff;
        .xtr6(font-size, 18);
        .xtr6(height, 50);
        border-top: solid 1px @e5;
    }
    .throw-div {
        .xtr6(height, 82);
    }
    .group-buy-nav-customize {
        ul {
            margin-bottom: 0 !important;
            border-bottom: solid .5px @DA;
            p.nav-active {
                color: @proColor !important;
                .xtr6(line-height, 48) !important;
                .xtr6(height, 47) !important;
                border-bottom: solid 3px @proColor !important;
            }
        }
    }
    .preview-page-buy-button {
        button {
            opacity: .5 !important;
            filter: opacity(50) !important;
        }
    }
</style>