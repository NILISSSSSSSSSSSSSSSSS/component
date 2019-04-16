<template>
    <div class="line">
        <template v-if="echartData.length!==0">
            <div :id="echartID" style="width: 100%;height: 390px"></div>
        </template>
        <template v-else>
            <div class="noData">
                暂无数据
            </div>
        </template>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            echartData: {
                default: []
            },
            type: {
                default: "orderNum"
            }
        },
        watch: {
            echartData: {
                immediate: true,
                handler(val) {
                    if (val.length !== 0) {
                        this.$nextTick(function () {
                            this.cc()
                        })
                    }
                    else {
                        //销毁echart
                        this.myChart ? this.myChart.dispose() : "";
                    }
                },
            },
            type: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.$nextTick(function () {
                            this.cc()
                        })
                    }
                },
            },
        },
        data() {
            return {
                myChart: '',
                echartID: 'line' + parseInt(Math.random() * 1000),
                xData: [],
                yData1: [],//已完成数据
                yData2: [],//已关闭数据
            }
        },
        methods: {
            cc() {
                let val = this.echartData;
                this.xData = val.map(cc => cc.date);
                this.type == "orderNum" ? [this.yData1, this.yData2, this.name] = [val.map(cc => cc.completelyNum), val.map(cc => cc.closeNum), '订单数量'] : [this.yData1, this.yData2, this.name] = [val.map(cc => cc.completelyTotalMoney), val.map(cc => cc.closeTotalMoney), "订单金额"]
                this.setData();
            },
            setData() {
                let idBox = document.getElementById(this.echartID)
                //如果dom还没加载处理，则返回
                if (idBox == null || !idBox) {
                    return;
                }
                this.myChart = echarts.init(idBox);
                this.options = {

                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['已完成', '已关闭']
                    },
                    //直角坐标系内绘图网格
                    grid: {
                        show: true,
                        top: '35px',
                        left: '60px',
                        right: '50px',
                        bottom: '30px',
                        containLabel: false,
                        borderWidth: 0,
                    },
                    xAxis: {
                        name: '时间',
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#b9c4d6'
                            }
                        },
                        data: this.xData
                    },
                    yAxis: {
                        name: this.name,
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#b9c4d6'
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: '#e8e6f1',
                            }
                        },
                    },
                    backgroundColor: '#ffffff',
                    series: [
                        {
                            smooth: true,
                            name: '已完成',
                            type: 'line',
                            data: this.yData1,
                            // 区域填充样式。
                            areaStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'rgba(59,159,255,.2)' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: 'rgba(59,159,255,0)' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: '#1ca1fe',
                                    width: 1,
                                },
                            },
                            itemStyle: {
                                "normal": {
                                    "color": "#1ca1fe",
                                    "borderColor": "#1ca1fe",
                                    "borderWidth": 4
                                }
                            },

                        },
                        {
                            smooth: true,
                            name: '已关闭',
                            type: 'line',
                            data: this.yData2,
                            // 区域填充样式。
                            areaStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'rgba(59,159,255,.2)' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: 'rgba(59,159,255,0)' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: '#1ca1fe',
                                    width: 1,
                                },
                            },
                            itemStyle: {
                                "normal": {
                                    "color": "#1ca1fe",
                                    "borderColor": "#1ca1fe",
                                    "borderWidth": 4
                                }
                            },

                        }
                    ]
                };
                this.myChart.setOption(this.options);

            }
        },


    }
</script>
<style scoped>
    .noData {
        line-height: 400px;
        text-align: center;
        font-size: 15px;
    }
</style>