<template>
    <div class="post-detail-boss">
        <p>图片已生成</p>
        <span>下载图片分享给好友</span>
        <div id="post-img-container" style="position: absolute; top: -4000px;">
            <img id="post-img" :src="url" alt="">
            <div id="qrcode" ref="qrcode" :style="{left: previewInfo && previewInfo.axisX, top: previewInfo && previewInfo.axisY, }"></div>
        </div>
        <div id="post-img-container">
            <img id="post-img" :src="dataUrl" alt="" v-if="dataUrl">
        </div>
        <p class="post-detail-tips">长按图片，即可保存</p>
        <!-- <button class="button-large button-post-detail fix-iphonex" @click="onclickDownloadImg">下载图片</button> -->
        <!-- <a :href="dataUrl" download="宣传海报" style="display:none;" id="aTag"></a> -->
    </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';
import store from 'store/index.js';
import { mapState, } from 'vuex';
import { wait, hideWxOptionMenu, } from 'lib/script/util.js';
import { Toast, } from 'mint-ui';
import { dealQs, } from 'lib/script/hook.js';
export default {
    name: 'PostDetail',
    data() {
        return {
            url: null,
            dataUrl: null,
            qs: {},
        };
    },
    computed: {
        ...mapState({
            previewInfo: state => state.TaskDetail.previewInfo,
            expandId: state => state.TaskDetail.expandId,
            userInfo: state => state.user.userInfo,
        }),
    },
    async created() {
        this.qs = dealQs();
        store.commit('startRequest');
        if (!this.previewInfo) await store.dispatch('getPreviewInfo', {id: this.qs.id});
        store.commit('endRequest');
        this.dealImgs();
    },
    mounted() {
        const _this = this;
        document.getElementById('post-img').onload = () => {
            _this.drawImg();
        };
        hideWxOptionMenu();
    },
    methods: {
        drawQr() {
            let link = `${location.protocol}//${location.hostname}${location.pathname}`;
            switch(this.previewInfo.objectType) {
                case 'goods': link += `?id=${this.qs.expandId}&type=goods/#/buy`; break;
                case 'pack': link += `?id=${this.qs.expandId}&type=pack/#/groupBuy`; break;
                case 'invite': link += `?id=${this.qs.expandId}&type=invite/#/invite`; break;
                case 'news': link += `?id=${this.qs.expandId}&type=news/#/imgText`; break;
                case 'image': link += `?id=${this.qs.expandId}&type=imageimgAudioVideo/#/imgAudioVideo`; break;
                case 'audio': link += `?id=${this.qs.expandId}&type=audio/#/imgAudioVideo`; break;
                case 'video': link += `?id=${this.qs.expandId}&type=image/#/imgAudioVideo`; break;
            };
            const qrcode = new QRCode('qrcode',{
                width: 80, // 设置宽度，单位像素
                height: 80, // 设置高度，单位像素
                text: link,   // 设置二维码内容或跳转地址
            });
        },
        drawImg() {
            const container = document.getElementById('post-img-container');
            html2canvas(container).then(async (canvas) => {
                const res = await canvas.toDataURL();
                this.dataUrl = res;
                store.commit('endRequest');
            });
        },
        async dealImgs() {
            store.commit('startRequest');
            this.url = await store.dispatch('getImg', { id: this.previewInfo.imageId });
            this.drawQr();
            document.getElementById('post-img').addEventListener('load', () => this.drawImg());
        },
    },
};
</script>

<style lang="less" >
    .post-detail-boss {
        box-sizing: border-box;
        .xtr6(padding, 25, 20, 20, 20);
        p {
            color: @333;
            .xtr6(font-size, 18);
            .xtr6(margin-bottom, 5);
        }
        span {
            color: @888;
            .xtr6(font-size, 14);
        }
        #post-img-container {
            display: block;
            position: relative;
            .xtr6(width, 310);
            .xtr6(height, 413);
            margin: 0 auto;
            .xtr6(margin-top, 25);
            .xtr6(margin-bottom, 25);
            img {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }
            #qrcode {
                z-index: 999;
                position: absolute;
                .xtr6(width, 80);
                .xtr6(height, 80);
            }
        }
        .post-detail-tips {
            color: @666;
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            .xtr6(bottom, 15);
            .xtr6(font-size, 16);
        }
    }
</style>

