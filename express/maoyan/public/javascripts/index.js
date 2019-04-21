
/* 将json 字符串 转为json 对象 */
function jsontodata(data, moive, score, replace = false) {
    var change = {};
    var name = [];
    var value = []
    // var objs = eval(data);
    for (var i = 0; i < data.length; i++) {

        name.push(data[i][moive]);
        var str = data[i][score];
        if (replace) {
            value.push(str.replace('分', ''));
        } else {
            value.push(str);
        }


    }
    change.name = name;
    change.value = value;
    return change;
}

/* 绘制每个月的电影上映数 */
function drawMonthCount(data) {
    /* 电影票房TOP10)*/
    var app = echarts.init(document.getElementById('tomonthCount'));// 获取图表的位置

    var score = jsontodata(data, 'month', 'num');
    var name = score.name; // 每个月
    var value = score.value;// 电影上映数


    var option = {
        title: {
            text: '2018猫眼电影每月电影上映数量',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: name,
            axisLabel: {
                formatter: '{value} 月'
            },
            splitLine: {
                show: true
            },
            scale: true,


        },
        yAxis: {
            type: 'value',
            // data: value,

            splitLine: {
                show: true
            },
            scale: true,


        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#FCCE10', '#E87C25', '#27727B',
                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },

                    }
                },
                data: value
            },

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
}

/* 绘制每个月的电影票房数 */
function drawMonthBox(data) {
    /* 电影票房TOP10)*/
    var app = echarts.init(document.getElementById('tomonthbox'));// 获取图表的位置

    var score = jsontodata(data, 'month', 'box_office');
    var name = score.name; // 每个月
    var value = score.value;// 电影上映数


    var option = {
        title: {
            text: '2018猫眼电影每个月电影票房（亿元）',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: name,
            axisLabel: {
                formatter: '{value} 月'
            },
            splitLine: {
                show: true
            },
            scale: true,


        },
        yAxis: {
            type: 'value',
            // data: value,

            splitLine: {
                show: true
            },
            scale: true,


        },


        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#8B008B', '#27727B', '#DB7093',
                                '#FF4500', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },

                    }
                },
                data: value
            },

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
}

/* 绘制2018年猫眼电影来自的国家 */
function drawMovieCountry(data) {
    /* 电影票房TOP10)*/
    var app = echarts.init(document.getElementById('toMovieCountry'));// 获取图表的位置

    var score = jsontodata(data, 'location', 'num');
    var name = score.name; // 地区
    var value = score.value;// 电影上映数


    var option = {
        title: {
            text: '2018猫眼电影来源(部）',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: name,
            splitLine: {
                show: false
            },
            scale: false,


        },
        yAxis: {
            type: 'value',
            // data: value,


        },

        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A',
                                '#8B008B', '#27727B', '#DB7093',
                                '#FF4500', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },

                        laber: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: 'block',
                                fontSize: 16
                            }

                        }

                    }
                },
                data: value
            },

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
}

/* 绘制最受欢迎的电影TOP10 */
function drawGreet(data) {
    /* 电影票房TOP10)*/
    var app = echarts.init(document.getElementById('toGreat'));// 获取图表的位置

    var score = jsontodata(data, 'name', 'people');
    var name = score.name.reverse(); // 最受欢迎电影的名字
    var value = score.value.reverse();// 欢迎数


    var option = {
        title: {
            text: '2018猫眼电影最受欢迎的TOP10 电影',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'category',
            data: name,
            // axisLabel: {
            //     formatter: '{value} 月'
            // },
            splitLine: {
                show: true
            },
            scale: true,


        },
        xAxis: {
            type: 'value',
            // data: value,

            splitLine: {
                show: true
            },
            scale: true,


        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#8B008B', '#27727B', '#DB7093',
                                '#FF4500', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },

                        laber: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: 'block',
                                fontSize: 16
                            }

                        }


                    }
                },
                data: value
            },

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
}

/* 绘制中国和其他国家电影票房比例 */
function drawCompare(data) {
    /* 电影票房TOP10)*/
    var app = echarts.init(document.getElementById('toCompare'));// 获取图表的位置


    var option = {
        title: {
            text: '2018年猫眼电影中外电影票房对比',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}:{c}亿元({d}%)"
        },


        series: [
            {
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: data['China'], name: '中国电影' },
                    { value: data['fer'], name: '外国电影' }
                ]
            }

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
}

/* 绘制电影类型表格，形成词云 */
function drawWordCloud(data) {
    var app = echarts.init(document.getElementById('toStyle'));// 获取图表的位置
    var score = jsontodata(data, 'style', 'num');
    var name = score.name; // 电影类型
    var value = score.value;// 电影类型对应的数量
    var font = 100;
    var option = {
        title: {
            text: '2018猫眼电影类型词云',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            // show: true
        },


        series: [{
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [14, 100],
            rotationRange: [-90, 90],
            shape: 'pentagon',
            width: 600,
            height: 400,
            drawOutOfBound: true,
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: [
                {
                    name: name[0],
                    value: value[0],
                    textStyle: {
                        normal: {
                            color: 'black'
                        },
                        emphasis: {
                            color: 'red'
                        }
                    }
                },
                {
                    name: name[1],
                    value: value[1],
                    font
                },
                {
                    name: name[2],
                    value: value[2],

                },
                {
                    name: name[3],
                    value: value[3],

                },
                {
                    name: name[4],
                    value: value[4],

                },
                {
                    name: name[5],
                    value: value[5],

                },
                {
                    name: name[6],
                    value: value[6],

                },
                {
                    name: name[7],
                    value: value[7],

                },
                {
                    name: name[8],
                    value: value[8],

                },
                {
                    name: name[9],
                    value: value[9],

                }
            ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
    window.onresize = app.resize;
}

/* 绘制票房TOP10 */
function drawBox(data) {
    /* 电影票房TOP10)*/
    var app = echarts.init(document.getElementById('toBox'));// 获取图表的位置

    var score = jsontodata(data, 'name', 'box_office');
    var name = score.name.reverse(); // 电影名字反序
    var value = score.value.reverse();// 电影票房反序


    var option = {
        title: {
            text: '2018猫眼电影票房（亿元）Top10',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top'

        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: true
            },
            scale: true,


        },
        yAxis: {
            type: 'category',
            data: name,


        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#FCCE10', '#E87C25', '#27727B',
                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },

                        laber: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: 'block',
                                fontSize: 16
                            }

                        }

                    }
                },
                data: value
            },

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);
}

/* 绘制评分TOP10 */
function drawScore(data) {
    /* 作 电影评分Top10 表 */

    var app = echarts.init(document.getElementById('toscore'));// 获取图表的位置

    var score = jsontodata(data, 'name', 'score', true);
    var name = score.name.reverse(); // 电影名字反序
    var value = score.value.reverse();// 电影评分反序


    var option = {
        title: {
            text: '2018猫眼电影评分Top10',
            subtext: '数据来自猫眼电影',
            x: 'center',
            y: 'top',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: true
            },
            scale: true,
        },
        yAxis: {
            type: 'category',
            data: name
        },
        series: [
            {
                type: 'bar',
                data: value
            },

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    app.setOption(option);

}

//  删除所有li
function del(){
    var li = document.getElementById('content');
    while(li.hasChildNodes()){
        li.removeChild(li.firstChild);
    }
}

 /**
  *  动态添加Li元素
  */
function addLi(data){
    /* */
    del();
    var li = document.createElement("li");
    addSpan(li,data['movietime']);
    document.getElementById('content').appendChild(li);

    var li = document.createElement("li");
    addSpan(li,data['suggestion']);
    document.getElementById('content').appendChild(li);

    var li = document.createElement("li");
    addSpan(li,data['desc']+':');
    document.getElementById('content').appendChild(li);

    //  处理返回的电影字符串
    content = data['contect'].replace(/', '/g,'#').replace('[\'','').replace('\']','').split('#');
    console.log(content);
    for(var i =0 ;i<content.length;i++){
        var li = document.createElement("li");
        addSpan(li,(i+1)+'.'+content[i]);
        document.getElementById('content').appendChild(li);
    }

   
}

function addSpan(li,text){
    var span = document.createElement("span");
    span.innerHTML = text;
    li.appendChild(span);
}
/* 用户推荐处理，ajax 处理 */

function query(){
    $.ajax({
        url:'/process',
        type:'post',
        dataType:'json',
        data:$('#movie').serialize(),
        success:function(result){
            
            addLi(result);
        },
        error:function(data){
            var desc='推荐电影失败，请换个电影试一试';
            var li = document.createElement("li");
            addSpan(li,desc);
            document.getElementById('content').appendChild(li);
            
        }
    })
}


/* 向服务器发送请求，然后服务器响应请求，并将请求的数据进行返回 */
window.onload = function (event) {
    event.preventDefault();
    $.ajax({
        url: '/ajax',
        type: 'post',
        dataType: 'json',
        success: function (data) {

            drawScore(data['score']); // 制作电影评分TOP10
            drawBox(data['box']);
            drawMonthCount(data['monthCount']);
            drawMonthBox(data['monthbox']);
            drawMovieCountry(data['movice_country']);
            drawGreet(data['people']);
            drawCompare(data['style_country']);
            drawWordCloud(data['style_count']);

        },
        error: function (data) {
            alert('errot');
        }
    });

}

