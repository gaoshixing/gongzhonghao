<style lang='less'>
    .inv-gsx {
        min-height: 100vh;
    }

</style>
<template>
    <div id="invite" class="inv-gsx">
        <inv
            v-if="qs.id"
            :id="qs.id"
        ></inv>
    </div>
</template>

<script>
import { dealQs, } from 'lib/script/hook.js';
import inv from 'components/inv'
import { registerShare, wResize} from 'lib/script/util.js';
import store from 'store/index.js';
export default {
    data() {
        return {
            qs: {},
            infoObj: {},
            info: {
                intro: '',
                coverUrl: '',
            }
        }
    },

    components: {
        inv,
    },

    watch: {
        // rdata1(newV) {
        //     const pos = newV.data.data.object.formPosition
        //     this.patternType = pos
        // }  
    },

    async created() {
        wx.showOptionMenu();
        this.qs = dealQs();
        let obj2 = {
            id: this.qs.id,
        }
        let rdata1 = await store.dispatch('getInfo', obj2);
        this.infoObj = rdata1.data.data
    },

    mounted() {
        this.page()
         /*
        * 分享
        */
        store.commit('addJSSDKReadyCallback', () => {
            const appMessage = {
                title: this.infoObj.taskName, // 分享标题
                desc: this.info.intro, // 分享描述
                link: `${location.protocol}//${location.hostname}${location.pathname}?${location.href.split('/#/')[1].split('?')[1]}/#/${location.href.split('/#/')[1].split('?')[0]}`, // 分享链接
                imgUrl: this.info.coverUrl, // 分享图标
            };
            registerShare(appMessage);
        });
    },
    methods: {
        page() {
            var hrt = document.documentElement.clientHeight; //获取当前可视区域的高度存到hrt变量
            document.getElementById('invite').style.height= hrt+'px'
        }
    }
}
</script>
