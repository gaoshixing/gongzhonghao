import Vue from 'vue';
import func from './until';


Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
Vue.component(Radio.name, Radio);
Vue.component('anchored-heading', {
    props: {
        dataList: {
            type: Array,
            required: true
        }
    },
    render: function (createElement) {
        const _this = this
        if (this.dataList.length) {
            let obj = {
                isVisible: true,
                pickerVisible: true

            }
            return createElement('div', this.dataList.map(function (item) {
               
                if (item.model == 4) {
                    return createElement('div',
                        [   
                            createElement('p',{
                                on: {
                                    click: () => {
                                        obj.isVisible=false
                                        Vue.$apply()
                                    }
                                },
                            },
                            [item.title]
                        ),

                            createElement('mt-popup',{
                                style: {
                                    width: '100%'
                                },
                                props: {
                                    value:  obj.isVisible,
                                    position: 'bottom',
                                },
                                
                            },
                            [createElement('mt-checklist',{
                                    style: {
                                        width: '100%'
                                    },
                                    props: {
                                        title: item.title,
                                        options: item.options,
                                        value: item.value,
                                    },
                                    on: {
                                    },
                                },)]
                        ),
                        ],
                    {
                        on: {
                            // click: func.clickHandler
                        },
                    })
                    // createElement('mt-checklist',{
                    //     props: {
                    //         title: item.title,
                    //         options: item.options,
                    //         value: item.value,
                    //     },
                    //     on: {
                    //         // click: func.clickHandler
                    //     },
                    // },)
                }
                if (item.model == 1) {
                    return createElement('mt-field',{
                        props: {
                            label: item.title,
                            value: item.value
                        },
                        on: {
                            // click: func.clickHandler
                        },
                    },)
                }
                if (item.model == 3) {
                    return createElement('mt-radio',{
                        props: {
                            title: item.title,
                            options: item.options,
                            value: item.value,
                        },
                        on: {
                            click: () => {
                                console.log(obj)
                            }
                        },
                    },)
                }
                if (item.model == 2) {

                    return createElement('div', {
                        on: {
                        },

                    },
                    
                    [
                        createElement('p', {
                            on: {
                                click:() => {
                                    console.log(_this)
                                }
                            },
                        },
                    '年后'),
                        createElement('mt-popup',{
                            props: {
                                // value: true,
                                // modal: true,
                                position: 'bottom',
                            },
                            domProps: {
                                innerHTML: ''
                            },
                        },
                    )
                    ],
                    
                    )
                     
                    // return createElement('mt-datetime-picker',{
                    //     props: {
                    //         value: true,
                    //         yearFormat:"{value} 年",
                    //         monthFormat:"{value} 月",
                    //         dateFormat:"{value} 日",
                    //         type:"date",
                    //     },
                    //     on: {
                    //         // click: func.clickHandler
                    //     },
                    // },)

                  
                }
            }))
        }
    },
    
  })
  