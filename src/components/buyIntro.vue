<template>
    <div class="buy-intro-boss white">
        <img v-lazy="imgUrl" alt="">
        <div class="buy-intro-info-content">
            <p v-html="title"></p>
            <span>{{intro}}</span>
            <span v-if="type !== 'buy'">原价：￥{{oldPrice}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BuyIntro',
    props: {
        imgUrl: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '&nbsp;',
        },
        intro: {
            type: String,
            default: '',
        },
        oldPrice: {
            type: String,
            default: '',
        },
        /*
        * 购买类型
        * buy 购买
        * group 拼团
        */
        type: {
            type: String,
            default: 'group',
        },
    },
};
</script>

<style lang="less" >
    .buy-intro-boss {
        .xtr6(height, 130);
        position: relative;
        box-sizing: border-box;
        .xtr6(padding, 20, 15);
        .xtr6(padding-left, 115);
        .xtr6(margin-bottom, 10);
        img {
            display: block;
            .xtr6(width, 90);
            .xtr6(height, 90);
            position: absolute;
            .xtr6(left, 15);
            .xtr6(top, 20);
        }
        .buy-intro-info-content {
            text-align: left;
            .xtr6(font-size, 13);
            .xtr6(margin-left, 15);
            box-sizing: border-box;
            p {
                color: @222;
                .xtr6(font-size, 17);
                .xtr6(line-height, 24);
                .xtr6(margin-bottom, 8);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            span {
                display: block;
            }
            span:nth-of-type(1) {
                display: inline-block;
                .xtr6(height, 36);
                color: @999;
                .xtr6(line-height, 18);
                .xtr6(margin-bottom, 3);
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            span:nth-of-type(2) {
                text-align: right;
                color: @999;
                .xtr6(line-height, 17);
                text-decoration: line-through;
            }
        }
    }
</style>
