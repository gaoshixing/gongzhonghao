<template>
    <div class="img-text-boss white">
        <p class="img-text-title">{{content && content.title}}</p>
        <p class="img-text-article-info"><span>{{content && content.createDate.split(' ')[0]}}</span>
            <a v-if="userInfo && userInfo.hasSubscribe === '1'" :href="userInfo && userInfo.bizUrl">{{userInfo && userInfo.appsName}}</a>
            <span v-if="userInfo && userInfo.hasSubscribe !== '1'" class="user-info-apps-name" @click="onclickGoingToQRPage">{{userInfo && userInfo.appsName}}</span>
        </p>
        <img class="display-img-tag" v-if="type === 'image' && content.coverUrl" :src="content && content.coverUrl" alt="">
        <audio id="domAudio" v-if="type === 'audio'" :controls=true preload  :src="content && content.coverUrl"></audio>
        <div class="audio-control-box white" @click="onclickAudio" v-if="type === 'audio'">
            <div class="audio-control-box-poster white"><img v-if="!audioPlay" src="../assets/img/play.png" alt=""><img v-if="audioPlay" src="../assets/img/stop.png" alt=""></div>
            <p>{{content && content.title}}</p>
        </div>
        <video
            v-if="type === 'video'"
            id="domVideo"
            playsinline="true"
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            airplay="allow"
            loop="loop"
            preload="auto"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portrait"
            controls
            style="object-fit:fill"
            :poster="content && content.imageUrl">
            <source :src="content && content.coverUrl">
        </video>
    </div>
</template>

<script>
import store from 'store/index.js';
import { mapState, } from 'vuex';
import { dealQs, } from 'lib/script/hook.js';
import { registerShare, waitUntil, hideWxOptionMenu, } from 'lib/script/util.js';
export default {
    name: 'ImgAudioVideo',
    data() {
        return {
            type: null,
            title: '',
            content: '',
            isImg: true,
            audioPlay: false,
            qs: {},
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
    },
    async created() {
        wx.showOptionMenu();
        const _this = this;
        this.qs = dealQs();
        let rdata = null;
        this.type = this.qs.type; // news video audio image
        store.commit('startRequest');
        if(this.qs.id) {
            rdata = await store.dispatch('getInfo', { id: this.qs.id, });
        };
        if(this.qs.taskId) {
            rdata = await store.dispatch('getReadTaskPreviewInfo', { id: this.qs.taskId, type: this.qs.type});
        }
        store.commit('endRequest');
        this.content = rdata.data.data.object;
        this.title = this.content.title;
        waitUntil(() => {
            return !!store.state.jssdk.jssdkConfig;
        }, () => {
            /*
            * 分享
            */
            store.commit('addJSSDKReadyCallback', () => {
                const appMessage = {
                    title: _this.title, // 分享标题
                    desc: _this.content.description, // 分享描述
                    link: `${location.protocol}//${location.hostname}${location.pathname}?${location.href.split('/#/')[1].split('?')[1]}/#/${location.href.split('/#/')[1].split('?')[0]}`, // 分享链接
                    imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                };
                registerShare(appMessage);
            });
        });
    },
    mounted() {
        this.dealPageTitle();
        if(this.qs.taskId) hideWxOptionMenu();
    },
    methods: {
        onclickGoingToQRPage() {
            this.$router.push({
                name: 'introductionPage',
                query: {
                    from: 'pc',
                    formId: this.userInfo.appId,
                },
            });
        },
        /*
        * 设置页面标题
        */
        dealPageTitle() {
            window.addEventListener('scroll', this.srollFunction);
        },
        srollFunction() {
            const windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (windowScrollTop <= 50) {
                document.title = '';
            } else {
                document.title = this.title;
            }
        },
        /*
        * 音频
        */
        onclickAudio() {
            const domAudio = document.getElementById('domAudio');
            this.audioPlay = !this.audioPlay;
            this.audioPlay ?  domAudio.play() : domAudio.pause();
        },
        /*
        * 视频
        */
        onclickVideo() {
            const domVideo = document.getElementById('domVideo');
        },
    },
    beforeDestroy() {
        window.removeEventListener('srcoll', this.srollFunction);
    },
};
</script>

<style lang="less" >
    .img-text-boss {
        width: 100%;
        // height: 100vh;
        text-align: left;
        box-sizing: border-box;
        .xtr6(padding, 20, 15, 20, 15);
        .img-text-title {
            color: @000;
            .xtr6(font-size, 24);
            .xtr6(margin-bottom, 8);
        }
        .img-text-article-info {
            color: @888;
            display: inline-block;
            .xtr6(font-size, 15);
            .xtr6(margin-bottom, 30);
            span {
                .xtr6(margin-right, 5);
            }
            a {
                color: #576B95;
                text-decoration: none;
            }
        }
        .img-text-container {
            img {
                width: 100%;
                .xtr6(margin, 20, 0);
            }
            color: @222;
            .xtr6(font-size, 17);
            .xtr6(line-height, 25);
        }
    }
    .no-padding {
        .xtr6(padding, 20, 0, 0, 0);
    }
    .display-img-tag {
        width: 100%;
    }
    #domAudio {
        visibility: hidden;
        position: absolute;
        left: 0;
        top: -1000px;
    }
    #domVideo {
        width: 100%;
        .xtr6(margin-bottom, 50);
    }
    .audio-control-box {
        .xtr6(height, 64);
        .xtr6(padding-left, 74);
        position: relative;
        border: solid 1px #E8E8E8;
        box-sizing: border-box;
        .audio-control-box-poster {
            .xtr6(height, 62);
            .xtr6(width, 62);
            border-top-right-radius: 1px;
            border-bottom-right-radius: 1px;
            position: absolute;
            left: 0;
            top: 0;
            background-color: #613200;
            img {
                .xtr6(height, 38);
                .xtr6(width, 38);
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
        p {
            color: @333;
            .xtr6(font-size, 17);
            .xtr6(line-height, 36);
        }
        span {
            color: @999;
            .xtr6(font-size, 15);
        }
    }
    .user-info-apps-name {
        color: #576B95 !important;
    }
</style>
