<template>
    <div>
        <div v-if="isup">
            <alineForm
                v-if="formObj.id"
                :titleInfo="titleInfo"
                :patternType='patternType'
                :saveObject='saveObject'
                :formObj='formObj'
                :isOrder='isOrder'
                :isDisable='isDisable'
                ></alineForm>
        </div> 
        <div v-else>
            <updownForm
                v-if="formObj.id"
                titleInfo="提交以下信息，加入我们"
                :patternType='patternType'
                :saveObject='saveObject'
                :formObj='formObj'
                :isOrder='isOrder'
                :isDisable='isDisable'
                ></updownForm>
        </div>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex';
import store from 'store/index.js';
import updownForm from './updownForm'
import alineForm from './alineForm'
export default {
    name: 'formC',
    props: {
        titleInfo: {
            type: String,
            default: '提交以下信息，进行确认'
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
    },
  	data() {
    	return {
            isup: null,
    	};
    },
    components: {
        updownForm,
        alineForm,
    },

	computed: {
		...mapState({
             userInfo: state => state.user.userInfo,
		}),
	},
	async created() {
            store.commit('startRequest');

        // if (!this.userInfo) await store.dispatch('getUserInfo');
        let obj ={
            id: this.formObj.formId,
        }
        const rdataJson = await store.dispatch('getformDateJson', obj);
        this.isup = rdataJson.data.data.layout.some(item => item.lay == 0)
        //  console.log(this.isup)
        // if (this.isEdit) {
            // let obj1 = {
            //     id: this.userInfo.openid,
            // }
            // const formV = await store.dispatch('getformDate', obj1);
            // if (formV.data.data) {
            //     this.formValue = formV.data.data
            // } else {
            //     this.handleD()
            // }
            store.commit('endRequest');
    },
    
	methods: {
	},
}
</script>

<style lang="less" >
</style>

