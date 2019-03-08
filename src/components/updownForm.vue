<template>
  	<div class="c-form-gsx1" :class="{'patternTop': patternType=='up','patternBottom':patternType=='below', 'patternUp':patternType=='floating',}">
        <div class="aro" :class="{'placeStyle':patternType=='floating'}">
            <p :class="{'form-title-info':true,'title-info-type':patternType=='floating'}">
                <span class='title-line'></span>
                <span style="vertical-align:middle">{{titleInfo}}</span>
                <span class='title-line'></span>
            </p>
            <div class="item"  :class="{'choose-cont':item.model==2||item.model==3||item.model==4||item.model==5||item.model==7,'formUp':patternType=='floating',}" v-for="(item, index) in dataList" @click="itemClick(item, index)">
                <div v-if="item.model == 2" class="text-aro">
                    <p  :class="{'item-title-style':true,'text-area-up':patternType=='floating'}"><i v-if="item.validate.some(item => item.type == 'notNull')" class="require-t">*</i>{{item.title}}</p>
                    <mt-field  :class="{'text-areaC':true,'text-are-bor':patternType=='floating'}"  :placeholder="item.description" v-model="formValue[item.name]" type="textarea" rows="2"></mt-field>
                </div>
                <!-- <div class="choose-file" v-else-if="item.model == 11">
                    <p class="title">图片添加</p>
                    <div class="img-cont" @click="sheetVisible = true">
                        <span class="choose-img" v-for="(item, index) in localIds" :key="index" >
                            <img :src="item" alt=""  class="img">
                        </span>
                        <span class="choose-img">
                            <img src="../assets/img/Group4.png" alt="" class="img">
                        </span>
                    </div>
                </div> -->
                <div class="pl" v-else :class="{}" >
                    <p :class="{'item-title-style':true, 'co':patternType=='floating'} "><i v-if="item.validate.some(item => item.type == 'notNull')" class="require-t">*</i>{{item.title}}</p>
                    <input v-if="item.model == 1" :class="{'item-style':true, 'item-style-color':patternType=='floating'}" v-model="formValue[item.name]"  :placeholder="item.description" >
                    <span v-else :class="{'choose-cont1': true,'choose-cont1-p':patternType=='floating'}" >
                        <img src="../assets/img/chooseR.png" class="float-right-img" alt="">
                        <span v-html="textF(item)"></span>
                    </span>
                </div>
            </div>
        </div>
        <mt-popup
            class="pop-class"
            v-model="popupVisible"
            position="bottom"
            popup-transition="popup-fade">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="cancelClick">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="okClick">确定</span>
            </div>
            <div class="pop-cont">
                <div class="item-radio" v-if="model==3||model==5" style="color: #000">
                    <p v-for="(item, index) in tempList" :key="index" @click="radioClick(item, index)">
                        {{item.label}}
                        <span class="is-select" v-show="tempV == item.value">
                        </span>
                    </p>
                </div>
                <mt-checklist
                    v-if="model==4"
                    v-model="tempArr"
                    style="color: #000"
                    :options="dataList[this.Index].options">
                </mt-checklist>
            </div>
        </mt-popup>
        <mt-datetime-picker
            type="date"
            ref="picker"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleConfirm"
            :startDate="startDate"
        >
        </mt-datetime-picker>
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet>
        <p :class="{'save-aro': true, 'btnback':patternType=='floating'}">
            <button :class="{'button-large':!isDisable, 'button-disabled':isDisable}"  @click="save">{{saveObject.saveText}}</button>
        </p>
  	</div>
</template>

<script>
import {
    mapState,
} from 'vuex';
import store from 'store/index.js';
import { Toast } from 'mint-ui';
import { Radio,Field, Popup, DatetimePicker, Picker, Actionsheet, Button } from 'mint-ui';
import Vue from 'vue'
export default {
    name: 'formC',
    props: {
        titleInfo: {
            type: String,
            default: ''
        },
        patternType: {
            type: String,
            default: '',
        },
        saveObject: {
            type: Object,
            default: {
                saveText: '保存表单',
                successEvent: () => {},
            }
        },
        isDisable: {
            type: Boolean,
            default: false,
        },
        formObj: {
            type: Object,
            require: true,
            default: () => {
                return {}
            }
        },
        isOrder: {
            type: Boolean,
            default: false,
        },
        isEdit: {
            type: Boolean,
            default: false,
        }
        // baseInfo: {
        //     type: Array,
        //     default: () => {
        //         return [
        //             {title: '姓名', key: 'name', description: '请输入姓名'},
        //             {title: '手机号', key: 'tel', description: '请输入手机号'},
        //         ]
        //     }
        // },
    },
  	data() {
    	return {
            formValue: {},
            rdata1: '',
            filePath: '',
            requireList: [],
            localIds: [],
            isCheckList: false,
            tempV: '',
            Index: null,
            dataIndex: '',
            src: '',
            num: 0,
            sheetVisible: false,
            textareaV: '',
            dateTime: '',
            startDate: new Date(),
            model:'',
            dataList: [],
            timeVisible: false,
            pickerVisible: false,
            value: '',
            valueList: [],
            actions: [
                {name: '拍照', method: this.takePhoto},
                {name: '从相册选择', method: this.choosePhoto},
            ],
            popupVisible: false,
            tempList: [],
            tempArr: [],
    	};
    },
    components: {
        Radio,
        Field,
        Popup,
        Picker,
        Actionsheet,
        Button,
        'mt-datetime-picker': DatetimePicker
    },

	computed: {
		...mapState({
            // count: state => state.homePage.count,
             userInfo: state => state.user.userInfo,
		}),
	},
	async created() {
            store.commit('startRequest');

        if (!this.userInfo) await store.dispatch('getUserInfo');
        let obj ={
            id: this.formObj.formId,
        }
        const rdataJson = await store.dispatch('getformDateJson', obj);
        this.dataList = rdataJson.data.data.layout
        if (this.dataList.length) this.isRequire()
        // if (this.isEdit) {
            let obj1 = {
                id: this.userInfo.openid,
            }
            const formV = await store.dispatch('getformDate', obj1);
            if (formV.data.data) {
                this.formValue = formV.data.data
            } else {
                this.handleD()
            }
            store.commit('endRequest');

        //  INPUT:1,
        //  TEXTAREA:2,
        //  RADIO:3,
        //  CHECKBOX:4,
        //  SELECT:5,
        //  DATE:6,
        //  DATETIME:7,
        //  BUTTON:8,
        //  LABEL:9,
        //  LINE:10,
        //  IMG:11,
        //  FILE:12,
        //  PERSON:13,
        //  OFFICE:14,
        //  SELECTION:15,
        //  FORM:16, // 子表单项
        //  FORMSET:17, // 子表单设置项
        // this.dataList = rdata.data.data.layout
        // this.dataList = [
        //     {model: 1, title:'输入框', description: '我是描述', name: 'a',  options: [{label: 'c', value: '1'},{label: 'b', value: '2'},{label: 'd', value: '3'},],},
        //     {model: 2, title: '文本输入', description: '我是描述', name: 'b',  options: [{label: 'c', value: '1'},{label: 'b', value: '2'},{label: 'd', value: '3'},],},
        //     {model: 3, value: '1', title: '单选', description: '我是描述', options: [{label: 'c', value: '1'},{label: 'b', value: '2'},{label: 'd', value: '3'},], name: 'c'},
        //     {model: 4, value: [1,2], title: '多选', description: '我是描述',  options: [{label: 'c', value: '1'},{label: 'b', value: '2'},{label: 'd', value: '3'},], name: 'd'},
        //     // {model: 6, value: '888', title:'时间', name: 'e', options: [{label: 'c', value: '1'},{label: 'b', value: '2'},{label: 'd', value: '3'},],},
        //     {model: 5, title:'选择', description: '我是描述',  options: [{label: 'c', value: '1'},{label: 'b', value: '2'},{label: 'd', value: '3'},], name: 'f'},
        //     {model: 7, value: '1', title:'时间',  time: '2018-01-9', description: '我是描述',  name: 'f'},
        // ]
    },
    
	methods: {
        isRequire() {
            this.dataList.forEach((item, key) => {
                let obj = {
                    key: item.name,
                    require: false,
                }
                if (item.validate instanceof Array) {
                    obj.require = item.validate.some(item => {
                        return item.type == 'notNull'
                    })
                }
                this.requireList.push(obj)
            })
        },
        handleD() {
            if ( this.dataList) {
                this.dataList.forEach(item => {
                    this.formValue[item.name] = ''
                })
            }
        },

        textF(item) {
            let valueText = ''
            if (item.model == 3 || item.model == 5) {
                item.options.forEach((item1) => {
                    if (item1.value == this.formValue[item.name]) {
                        valueText = item1.label
                    }
                })
            }
            if (item.model == 4) { // 多选
                item.options.forEach((item1) => {
                    if (this.formValue[item.name] instanceof Array) {
                        this.formValue[item.name].forEach((item2) => {
                            if (item2 == item1.value) {
                                valueText += item1.label + ' '
                            }
                        })
                    }
                })
            }
            if (item.model == 7) {
                valueText = this.formValue[item.name]
            }

            if (valueText) {
                return `<span class='des-style' style="color:${this.patternType==='floating'?'#ddd':"#000"}">${valueText}</span>`
            } else {
                return `<span class='des-style' style="color:${this.patternType==='floating'?'#b2b2b2':"#ccc"}">${item.description}</span>`
            }

        },
        cancelPhoto() {
            this.sheetVisible = false
        },
        choosePhoto() {
            let _this = this
            wx.chooseImage({
                count: 6, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    _this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                }
            });
        },
        takePhoto() {
            // this.localIds = ['../assets/img/Group4.png', '../assets/img/Group4.png', '../assets/img/Group4.png', '../assets/img/G
            const _this = this
            wx.chooseImage({
                count: 6, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    _this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                }
            });
        },
        radioClick(item, index) {
            this.tempV = item.value
        },
        cancelClick() {
            this.popupVisible = false
            this.tempV = ''
            this.tempArr = []
        },
        okClick() {
            if (this.isCheckList) {
                this.formValue[this.dataIndex] = this.tempArr
            } else {
                this.formValue[this.dataIndex] = this.tempV
            }
            this.popupVisible = false
            this.tempV = ''
            this.tempArr = []
        },
        openPicker () {
            this.$refs.picker.open()
        },
        handleConfirm (data) {
            this.$set(this.formValue, this.dataIndex,  data.format('yyyy-MM-dd'))
            this.dataList.splice(0,0)
        },
        itemClick(item, index) {
            this.dataIndex = item.name
            this.model = item.model
            this.tempV = this.formValue[item.name]
            this.isCheckList = false
            if (item.model == 7) {
                this.openPicker()
                return
            }
            if (item.model ==3 || item.model == 5) {
                this.tempList = item.options
                this.popupVisible = true
            }
            if (item.model == 4) {
                this.Index = index
                this.isCheckList = true
                this.tempArr = this.formValue[item.name]||[]
                this.popupVisible = true
            }
        },

		onclickPerson() {
			this.$router.push({
				name: 'personalCenter',
			});
        },

        save() {
            if (this.isOrder) {
                this.saveOrder()
                return
            }
            this.saveForm()
        },
        // 邀请页面保存
        async saveForm(data={}) {
            if (this.isDisable) return
            let onOff = false
            let tempV = ''
            this.requireList.forEach(item => {
                if (item.require && !this.formValue[item.key]) {
                    if(!onOff) tempV = item.key
                    onOff = true
                }
                if (onOff) return
            })

            if (onOff) {
                let name = this.dataList.filter(item => {
                    return item.name == tempV
                })
                if (!name.length)  return
                Toast(`请输入${name[0].title}`)
                return
            }
            let obj = {
                data: this.formValue,
                formId: this.formObj.formId, // 编号
                itemId: this.formObj.itemId, // 订单编号
                // type: this.formObj.type // wp_order订单  wp_order_pack 拼团
            }
            // this.formId = rdata1.data.data.object.id
            // let obj = {"data":{"lastName":"212","firstName":"212","name1e129236af":"","phone":"212","name1f811e0516":"23212","name10cdf69714":"3212","name1554c89d5c":"","name10e29b91dc":"这是出生地12","name126b545b01":"这是邮编12","name18721e6b8b":"地址12","name1f001a4ba6":"哈迪欧撒后ID撒hi哦花多少活动按时 12"},"id":"6d3ef823ef574bf7b4e20ac3cd6b06b6","redisKey":"com_form_table:c2e4e6630ebb403b99e6a3f5629f6146","token":"214bc234734d102e7b84c191db2408b053b5beda"}
            
            const message = await store.dispatch('saveformDate', obj)
            Toast({
                message: message.data.message,
                position: 'middle',
                duration: 500
            })
            setTimeout(() => {
                  wx.closeWindow();
            }, 1500)
        },
        // 订单保存
        async saveOrder(data={}) {
            if (this.isDisable) return
            let obj =  await this.saveObject.successEvent()
            // if (this.formValue.clientPhone != undefined) {
            //     if (!/^1[34578]\d{9}$/.test(this.formValue.clientPhone)) {
            //         Toast('请输入正确手机号')
            //         return
            //     }
            // }
             let onOff = false
            let tempV = ''
            this.requireList.forEach(item => {
                if (item.require && !this.formValue[item.key]) {
                    if(!onOff) tempV = item.key
                    onOff = true
                }
                if (onOff) return
            })

            if (onOff) {
                let name = this.dataList.filter(item => {
                    return item.name == tempV
                })
                if (!name.length)  return
                Toast(`请输入${name[0].title}`)
                return
            }
            obj = Object.assign(obj, {
                dynamicFormData:{
                    data: this.formValue,
                    formId: this.formObj.formId , // 编号
                    // type: this.formObj.type
                } // wp_order订单  wp_order_pack 拼团
            })
            store.commit('startRequest');
            const rdata = await store.dispatch('saveOrders', obj);
            store.commit('endRequest');
            if (!rdata.data.statusCode) return
            let allData = rdata.data.data
            if (rdata.data.data.hasSubscribe == 1) {
                this.$router.push({
                    name: 'successBuy',
                    query:  {
                        overDate: allData.overDate,
                        name: allData.name,
                        num: allData.num,
                        type: allData.type,
                        id: allData.spreadId,
                    }
                })
            } else {
                this.$router.push({
                    name: 'successBuyNokeep',
                    query: {
                        qrcodeUrl: allData.qrcodeUrl,
                    }
                })
            }
            
            // const message = await store.dispatch('saveformDate', obj)
            // Toast({
            //     message: message.data.message,
            //     position: 'middle',
            //     duration: 500
            // })
            // let obj2 = {
            //     id
            // }
            // const message1 = await store.dispatch('payOrder', obj2)
            // Toast({
            //     message: message1.data.message,
            //     position: 'middle',
            //     duration: 500
            // })
        }
	},
}
</script>

<style lang="less" >
    @import url('../lib/less/util.less');
    
	.c-form-gsx1 {
        width: 100%;
        background: #F6F5F5;
        color: #000;
        .xtr6(font-size, 17);
        .aro {
            input {
                outline-color: invert ;
                outline-style: none ;
                outline-width: 0px ;
                border: none ;
                border-style: none ;
                text-shadow: none ;
                -webkit-appearance: none ;
                -webkit-user-select: text ;
                outline-color: transparent ;
                box-shadow: none;
                border: none;
                outline: none;
            }
            input::-webkit-input-placeholder {
                .xtr6(font-size, 14);
                color: #ccc;
            }
            textarea::-webkit-input-placeholder{
                color:#ccc;
                .xtr6(font-size, 14);
            }
            textarea:-moz-placeholder{
                color:#ccc;
                .xtr6(font-size, 14);
            }
            textarea::-moz-placeholder{
                color:#ccc;
                .xtr6(font-size, 14);
            }
            textarea:-ms-input-placeholder{
                color:#ccc;
                .xtr6(font-size, 14);
            }
            .require-t {
                font-style: normal;
                .xtr6(margin-right, 5);
                color: #ff3333;
            }
            .mint-field-core,
            .mint-cell {
                color: inherit;
                background: transparent;
                .xtr6(border-radius, 5);
            }
            .mint-cell:last-child {
                background-image: none;
            }
            
            .mint-cell-wrapper {
                .xtr6(font-size, 14);
                padding: 0;
                .xtr6(min-height, 40);
                border: none;
                background-image: none;
            }
        }
        .placeStyle {
            input::-webkit-input-placeholder {
                .xtr6(font-size, 14);
                color: @b2;
            }
            textarea::-webkit-input-placeholder{
                color:@b2;
                .xtr6(font-size, 14);
            }
            textarea:-moz-placeholder{
                color:@b2;
                .xtr6(font-size, 14);
            }
            textarea::-moz-placeholder{
                color:@b2;
                .xtr6(font-size, 14);
            }
            textarea:-ms-input-placeholder{
                color:@b2;
                .xtr6(font-size, 14);
            }
        }
        .form-title-info {
            display: flex;
            justify-content: space-around;
            flex-wrap: nowrap;
            text-align: left;
            color: @888;
            background-color: #fff;
            .xtr6(line-height, 17);
            .xtr6(font-size, 12);
            .xtr6(padding, 10, 0, 5);
            .title-line {
                display: inline-block;
                .xtr6(width, 85);
               .xtr6(line-height, 17);
                .xtr6(height, 8);
                .xtr6(margin, 0, 10);
                border-bottom: 1px solid #E9E9E9;
                vertical-align: bottom;
            }
        }
        .title-info-type {
            background-color: transparent;
            color: #ccc;
        }
        .item {
            background: #fff;
            .xtr6(line-height, 40);
            .xtr6(min-height, 40);
            .xtr6(padding, 0, 20, 5);
            text-align: left;
            overflow: hidden;
            .item-title-style {
                .xtr6(font-size, 12);
                color: @888;
                .xtr6(line-height, 17);
                .xtr6(margin-bottom, 10); 
                .xtr6(margin-top, 10); 
            }
            .co {
                color: #bbb;
            }
            .item-style {
                background: transparent;
                border: none;
                width: 100%;
                .xtr6(line-height, 20);
                .xtr6(font-size, 14);
                .xtr6(padding-left, 10);
                box-sizing: border-box;
                .xtr6(height, 40);
                color: #000;
                outline: none;
                border: 0.5px solid #bbb;
                .xtr6(border-radius, 5);
            }
            .item-style-color {
                color: #fff;
            }
            .item-title {
                display: inline-block;
                .xtr6(width, 105);
            }
            .item-right-float {
                color: #B2B2B2;
                float: right;
                .xtr6(min-height, 40);
                .xtr6(line-height, 40);
                vertical-align: middle;
            }
            .float-right-img {
                float: right;
                .xtr6(margin-right, 10);
                .xtr6(width, 12);
                .xtr6(height, 17);
                .xtr6(margin-top, 12);
                vertical-align: middle;
            }
            .text-aro {
                // .text-area {
                //     .xtr6(font-size, 14);
                //     .xtr6(line-height, 15);
                //     color: @888;
                //     // .xtr6(padding-left, 15);
                //     background: #F6F5F5;
                //     white-space: nowrap;
                //     overflow: hidden;
                // }
                .text-area-up {
                    background: transparent;
                    color: #bbb;
                }
                .text-areaC {
                    .xtr6(padding-left, 10);
                    .xtr6(font-size, 14);
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                }
                .text-are-bor {
                    border: 1px solid #999;
                }
            }
        }
        .pl {
            // .xtr6(padding-right, 15);
            // .xtr6(margin-left, 15);
        }
        .line {
            border-bottom: 1px solid #E5E5E5;
        }
        .choose-line {
            border-bottom: 1px solid #E5E5E5;
        }
        .line-form-up {
            border-bottom: none;
            border-bottom: 1px solid #999;
        }
        .choose-cont1 {
            width: 100%;
            display: inline-block;
            .xtr6(line-height, 40);
            .xtr6(padding-left, 10);
            .xtr6(height, 40);
            outline: none;
            color: #fff;
            border: 0.5px solid #ccc;
            box-sizing: border-box;
            .xtr6(border-radius, 5);
            span {
                .xtr6(font-size, 14);
            }
        }
        .choose-cont1-p {
            border: 0.5px solid #bbb;
        }
        .formUp {
            color: #ddd;
            background: transparent;
            // border-bottom: 1px solid #999;
            margin-bottom: 0;
        }
        .b {
            border-bottom: none;
        }
        .item-radio {
            p {
                text-align: left;
                .xtr6(padding-left, 15);
                .xtr6(padding-right, 15);
                .xtr6(font-size, 17);
                .xtr6(min-height, 40);
                .xtr6(line-height, 40);
                border-bottom: 1px solid #E5E5E5;
            }
            p:last-of-child {
                border-bottom: none;
            }
            .is-select {
                display: inline-block;
                .xtr6(height, 13);
                .xtr6(width, 15);
                .xtr6(margin-top, 15);
                float: right;
                background: url(../assets/img/Fill.png);
                background-size: cover;
            }
        }
        .pop-class {
            width: 100%;
            .pop-cont {
                .xtr6(max-height, 200);
                overflow-y: scroll;
            }
        }
        // .choose-file {
        //     text-align: left;
        //     background-color: transparent;
        //     .title {
        //         .xtr6(padding-left, 15);
        //         .xtr6(font-size, 14);
        //         text-align: left;
        //         color: @888;
        //         .xtr6(line-height, 38);
        //         .xtr6(height, 38);
        //     }
        //     .img-cont {
        //         .xtr6(padding-left, 15);
        //         .xtr6(padding-right, 15);
        //         .xtr6(height, 88);
        //         // background-color: transparent;
        //         background-color: #fff;
        //         .xtr6(padding-top, 15);
        //         box-sizing: border-box;
        //         border-top: 1px solid #E5E5E5;
        //         border-bottom: 1px solid #E5E5E5;
        //         .choose-img {
        //             display: inline-block;
        //             vertical-align: top;
        //             .xtr6(width, 58);
        //             .xtr6(height, 58);
        //             .xtr6(margin-right, 8);
        //             .img {
        //                 .xtr6(width, 58);
        //                 .xtr6(height, 58);
        //             }
        //         }
        //     }
        // }
        .save-aro {
            .xtr6(padding, 15, 20, 15, 20);
            .save-form {
                .xtr6(height, 47);
                width: 100%;
            }
            background-color: #fff;
        }
        .btnback {
            background-color: transparent;
        }
    }
    .patternTop {
        position: static;
    }
    .patternUp {
        bottom: 0;
    }
    .patternBottom {
        position: static;
    }
    .patternUp {
        background: rgba(0, 0, 0, 0.5);
    }
</style>

