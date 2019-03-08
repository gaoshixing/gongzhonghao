<style lang='less'>
    .aro-gsx {
        position: relative;
        width: 100%;
        img {
            width: 100%; 
            // height: 100%;
        }
        // overflow: hidden;
        .invite-gsx {
            width: 100%;
            // height: 100%;
            // position: absolute;
            // left: 0;
            // top: 0;
        }
        .fl {
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }
    

</style>
<template>
    <div class="aro-gsx">
        <div class="invite-gsx" v-if="patternType=='up'">
            <cform
                v-if="formObj.id"
                titleInfo="提交以下信息，报名讲座"
                :patternType='patternType'
                :saveObject='saveObject'
                :formObj='formObj'
                :isDisable="!isPreview"
            >
            </cform>
        </div>
        <img v-lazy="filePath" alt="">
        <div :class="{'invite-gsx': true, 'fl': patternType=='floating'}" v-if="patternType=='below'||patternType=='floating'">
            <cform
                v-if="formObj.id"
                titleInfo="提交以下信息，报名讲座"
                :patternType='patternType'
                :saveObject='saveObject'
                :formObj='formObj'
                :isDisable="!isPreview"
            >
            </cform>
        </div>
    </div>
    
</template>

<script>
import cform from 'components/cform'
import store from '../store/index.js';
import { registerShare, } from 'lib/script/util.js';

export default {
    props: {
        id: {
            type: String,
            default: '',
            require: true
        },
        isPreview: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isFirst: true,
            onOff: false,
            filePath: '',
            rdata1: {},
            patternType: '',
            saveObject: {
                saveText: '确认',
                successEvent: this.successEvent,
                isEmit: false,
            },
            infoObj: {},
            formObj: {
                id: '',
                formId: '',
                itemId: this.id,
            },
            info: {
                intro: '分享描述', 
                coverUrl: '',
            }
        }
    },

    components: {
        cform,
    },

    watch: {
        rdata1(newV) {
            const pos = newV.data.data.object.formPosition
            this.patternType = pos
            // this.patternType = 'below'
        }  
    },

    async mounted() {
        let obj2 = {
            id: this.id,
        }
        if (this.isPreview) {
            this.rdata1 = await store.dispatch('getInfo', obj2);
        } else {
            this.rdata1 = await store.dispatch('getPreviewInfo', obj2);
        }
        if (this.rdata1.data.data.object.formPosition !='up') this.wResize() 
        this.infoObj = this.rdata1.data.data
        this.formObj.id = this.rdata1.data.data.id
        this.formObj.formId = this.rdata1.data.data.object.formId
        let objImg = {
            id: this.rdata1.data.data.object.attachmentId
        }
        const url = await store.dispatch('getImg', objImg);
        this.filePath = url
    },
    methods: {
        wResize() {
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (!isiOS) return
            document.body.addEventListener('focusout', () => { // 键盘收起来
                setTimeout( () => {
                    if (!this.onOff)  {
                        document.body.scrollTop =  document.body.scrollHeight;
                        this.isFirst = true
                    }
                        this.onOff = false
                    }, 400) 
            })
            document.body.addEventListener('focusin', () => {
                if (!this.isFirst) this.onOff = true
                this.isFirst = false
            })
        },
        successEvent() {
            this.$router.push({
                name: 'confirmInfo'
            })
        },
    }
}
</script>
