<template>
    <div class="task-card-boss white clearfix" @click="onclickTaskCard">
        <div>
            <p>{{title}}</p>
            <span v-if="endTime">截止时间: {{endTime | timeSplit}}</span>
            <span v-else>长期任务, 无截止日期</span>
        </div>
        <div>查看任务</div>
    </div>
</template>

<script>
import { timeSplit, } from 'lib/script/util.js';
export default {
    name: 'TaskCard',
    props: {
        title: {
            type: String,
            required: true,
        },
        endTime: {
            default: '',
        },
    },
    filters: {
        timeSplit,
    },
    methods: {
        onclickTaskCard() {
            this.$emit('onclickTaskCard');
        },
    },
};
</script>

<style lang="less" >
    .task-card-boss {
        width: 100%;
        .xtr6(min-height, 88);
        .xtr6(max-height, 113);
        .xtr6(margin-bottom, 10);
        .xtr6(padding, 18, 15);
        position: relative;
        box-sizing: border-box;
        p {
            color: #222;
            .xtr6(font-size, 17);
            .xtr6(line-height, 24);
            .xtr6(margin-bottom, 10);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        span {
            color: #999;
            .xtr6(font-size, 13);
            .xtr6(line-height, 20);
        }
        div:nth-of-type(1) {
            float: left;
            .xtr6(width, 220);
            text-align: left;
        }
        div:nth-of-type(2) {
            color:@proColor;
            position: absolute;
            .xtr6(right, 15);
            top: 50%;
            transform: translateY(-50%);
            .xtr6(width, 86);
            .xtr6(height, 30);
            .xtr6(line-height, 30);
            .xtr6(font-size, 13);
            border: solid 1px @proColor;
            border-radius: 5px;
            box-sizing: border-box;
        }
    }
</style>

