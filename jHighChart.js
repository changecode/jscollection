/**
 * highChart增强插件jHighChart
 * author:chenming
 * date:2014-10-13
 * @param $
 */
(function ($) {
	jQuery.extend({
      jHighChart:function (setting) {
    	  var options = $.extend({
    		  //背景颜色
    		  chart:{chartBgColor:'#FFFFFF',width:"",height:""},
              //需要展示的位置（哪个DOM元素内）
              renderTo: $(document.body),
              //图表类型：bar,line,spline,column,pie,area,areaspline,combine,bubble,scatter
              chartType: "",
              //图表大标题
              title: "",
              //图表小标题
              subtitle: "",
              //X轴名称
              xAxisName: "",
              //X轴列表数据，是一个JSON的LIST对象
              xCategories:{},
              //Y轴设置，可添加多条Y轴， key-Y轴名称，oppositeOption-true/false（true为right, false为left）
              yAxisSetting: [{ key: "",name:"" ,oppositeOption: false}],
              //key-Y轴对应数据，nane-名称，chartType-图形类型，yIndex-每个指标集需要对应的具体Y轴索引
              yAxisColumn: [{ key: "",name:"",chartType: "", yIndex: 0, color: null}],
              //图表数据源，是一个JSON的LIST对象
              series: {},
              //Point MouseOver事件
              mouseOver: function () { },
              //Point mouseOut事件
              mouseOut: function () { },
              //Point click事件:出发下钻方法
              click: function () { },
              //是否开启导出按钮
              exportButton: true,
              //图标容器大小
              containerSize:{width:null,height:null},
              //图例选项:默认不显示：具体的配置请参看API
              legend:{enabled:false,layout:"",align:"",verticalAlign:"",floating:false,x:"",y:"",backgroundColor:"#FFFFFF"},
              //数据点选项
              //showInLegend:是否显示饼图图例,dataEnable:是否显示饼图数据点
              plotOptions:{showInLegend:false,dataEnable:false},
              //基本参数设置：主要用于设置图表高度、宽度
              chart:{width:"",height:""}

          }, setting);
    	  
    	  //基本参数设定
    	  options.renderTo = (typeof options.renderTo == "string" ? $(options.renderTo) : options.renderTo);
    	  var _renderTo = options.renderTo;    //显示容器
          var _chartType = options.chartType.toString().toLowerCase();   //图表类型
          var _title = options.title.toString();   //主标题
          var _subtitle = options.subtitle.toString();   //副标题
          var _xAxisName = options.xAxisName.toString();   //x轴标题
          var  _yAxisSettingSource = options.yAxisSetting;   //y轴
          var  _yAxisColumnSource = options.yAxisColumn;
          var _xCategories = options.xCategories;
          var _series = options.series;    //数据
          var _exportBtn = options.exportButton;    //是否打印
          var _legend = options.legend;   //图例选项
          var _plotOptions = options.plotOptions;  //数据点选项
          var _xAxisCategoryVal = [];     //x轴列表数据
          var _xAxisSettingArr = {};      //x轴选项
          var _yAxisSettingArr = [];      //y轴选项
          var _yAxisColumnVal = [];       //
          var _chartObj = {};    //图表控件对象
          var _toolTipArr = {};  //数据点提示框
          var _width = options.chart.width == "" ? options.containerSize.width:options.chart.width;
          var _height = options.chart.height == "" ? options.containerSize.height:options.chart.height;
          var _rotation = -45;     //X轴倾斜度
          var _chartBgColor = options.chart.chartBgColor;  //图表背景颜色
          //事件控制
          var _mouseOverEvent = options.mouseOver;
          var _mouseOutEvent = options.mouseOut;
          var _clickEvent = options.click;
          
          //基本样式（Y轴，X轴样式）
          var _style = {fontSize: '12px',fontFamily: 'Microsoft YaHei,arial',color:'#606060'};
          
          //设置X轴（维度），Y轴指标列（根据不同图形类型转化成不同X轴，Y轴数据源）
          var getChartSetting = function () {
              //数据点提示框
              _toolTipArr = _chartType == "pie" ?{ 
            	  useHTML: false,
                  formatter: function() {
                        var s = "" + this.key + ": <b>"  + Highcharts.numberFormat(this.y, 0) + "</b><br/>百分比：<b>" + this.percentage.toFixed(2) + "%</b>";                             
                        return s;                                
                    }    
                } :
                { 
                	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                };
              
              
              var _xAxisCategoryArr = [];
              var _yAxisSettings = [];
              var _yAxisColumnArr = [];
              
              //设置X轴数据
              $(_xCategories).each(function (index, item) {
                  _xAxisCategoryArr.push(item.toString());
              });
              _xAxisCategoryVal = _xAxisCategoryArr;
              
             //设置Y轴相关信息:Y轴可能存在多条，如果存在多条需要设定opposite
              $(_yAxisSettingSource).each(function (index, item) {
                  var _tempObj;
                  if (_yAxisSettingSource.length > 1) {
                      _tempObj = { title: { text: item.name}, opposite: item.oppositeOption,min:0 };
                  } else {
                      _tempObj = { title: { text: item.name} ,min:0};
                  }
                  _tempObj.title.style=_style;
                  _tempObj.labels ={style: _style};
                  _yAxisSettings.push(_tempObj);
              });
              
              _yAxisSettingArr = _yAxisSettings;
              _xAxisSettingArr = _getXAxisSettingArr();
              
              //设置Y轴数据
              var _tempObj;
              $(_yAxisColumnSource).each(function (index, item) {
                  if (_chartType == "pie") {    //饼图需要指定类型，且显示数据格式不同
                      if (index < 1) {    //饼图只有一个维度
                          _tempObj = { name: item.name, data: [], type: "pie", allowPointSelect: true, showInLegend: true };
                          var pieModel = {};
                          $(_series).each(function (idx, dataItem) {
                        	  //构建显示数据
                              pieItemName = dataItem.key.toString();     //显示key 
                              var _datas = dataItem.data;
                              $(_datas).each(function(i,value){   //饼图只有维度，只需迭代一次
                        		  var _y = value.y;
                        		  var _name = value.categoryKey;
                        		  var _drilldown = value.drilldown;
                        		  var _params = value.params;
                        		  if(_drilldown){    //存在下钻
                        			  pieModel = {name:_name,y:_y,params:_params,drilldown:_drilldown};
                        		  }
                        		  else{
                        			  pieModel = {name:_name,y:_y};
                        		  }
                        		  if(i == 1 || i == "1"){
                        			  pieModel.sliced = true;
                        			  pieModel.selected = true;
                        		  }
                        		  _tempObj.data.push(pieModel);
                        	  });
                              
                          });
                          _yAxisColumnArr.push(_tempObj);
                      }
                  } else {
                      if (_chartType == "combine" && _yAxisSettingSource.length > 1) {    //复合图，如果存在多条Y轴，则需要设置Y轴的type
                          _tempObj = { name: item.name, data: [], type: item.chartType, yAxis: item.yIndex, color: item.color };
                      } else {
                          _tempObj = { name: item.name, data: [], type: _chartType == "stack" ? "column" : item.chartType, color: item.color };
                      }
                      $(_series).each(function (idx, dataItem) {
                    	  //构建显示数据
                          var _key = dataItem.key;
                          var _datas = dataItem.data;
                          if(_key == item.key){
                        	  $(_datas).each(function(i,value){
                        		  var _value = {};
                        		  var _y = value.y;
                        		  var _drilldown = value.drilldown;
                        		  var _params = value.params;
                        		  if(_drilldown){    //存在下钻
                        			  _value = {y:_y,params:_params,drilldown:_drilldown};
                        		  }
                        		  else{
                        			  _value = {y:_y};
                        		  }
                        		  
                        		  _tempObj.data.push(_value);
                        	  });
                          }
                      });
                      _yAxisColumnArr.push(_tempObj);
                  }
              });
              _yAxisColumnVal = _yAxisColumnArr;
          };
          
          //获取数据图表相应设置,x轴
          var _getXAxisSettingArr = function () {
              var temp = {
                      categories: _xAxisCategoryVal,
                      title: { text: _xAxisName ,style: _style},
                      labels: {
                          rotation: _rotation,    //文字倾斜度，防止X轴过多而导致文字显示乱
                          align: 'right',
                          style: _style
                      }
                  };
              return temp;
          };
          var draw = function () {
              //画图之前转化相应的XY信息
              getChartSetting();
              var chart = new Highcharts.Chart({
                  chart: {
                      renderTo: $(_renderTo).get(0),
                      type: _chartType,
                      width:_width,
                      height:_height,
                      backgroundColor:_chartBgColor
                  },
                  colors:['#0099CC', '#FF9900', '#99CC33', '#FF6666', '#993366', '#009933', '#FF9655', 
                          '#FFF263', '#6AF9C4'],
                  title: {
                      text: _title,
                      style:{color:'#333333',fontSize:'16px',fontFamily:'Microsoft YaHei,arial'}
                  },
                  subtitle: {
                      text: _subtitle,
                      style:{color:'#555555',fontFamily:'Microsoft YaHei,arial'}
                  },
                  tooltip: _toolTipArr,
                  xAxis: _xAxisSettingArr,
                  yAxis: _yAxisSettingArr,
                  legend: _legend,
                  exporting: {
                      enabled:_exportBtn
                  },
                  credits:{
                      enabled:false
                  },
                  plotOptions: {
                      pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                        	  enabled: _plotOptions.dataEnable,
                              color: '#000000',
                              connectorColor: '#000000',
                              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                          },
                          showInLegend: _plotOptions.showInLegend
                      },
                      column: {
                          stacking: _chartType == "stack" ? "normal" : ""
                      },
                      scatter: {
                          marker: {
                              radius: 5,
                              symbol: "circle"
                          }
                      },
                      series: {
                    	  allowPointSelect: true ,
                    	  states: {
                              hover: {
                                  enabled: true,   //显示阴影
                                  halo:{
                                      size:0 //阴影带宽度为0px
                                  }
                              }
                          },
                          point: {
                              events: {
                                  mouseOver: function () {
                                      _mouseOverEvent();
                                  },
                                  mouseOut: function () {
                                      _mouseOutEvent();
                                  },
                                  click: function () {
                                	  //根据是否进入钻取的状态重绘不同的图表
                                	  var drilldown = this.options.drilldown;
                                	  if(drilldown){    //下钻
                                		  _clickEvent(this.options.params); 
                                	  }
                                  }
                              }
                          }
                      }
                  },
                  series: _yAxisColumnVal
              });

              _chartObj = chart;
          };

          //获取图表控件基本设置属性
          this.getChartOptions = function () {
              return options;
          };

          //设置图标控件基本属性
          this.setChartOptions = function (settings) {
              options.title = settings.title;
              options.subtitle = settings.subtitle;
              options.xAxisName = settings.xAxisName;
              options.yAxisSetting = settings.yAxisSetting;
              options.yAxisColumn = settings.yAxisColumn;
          };

          //获取图表控件对象
          this.getChartObject = function () {
              return _chartObj;
          };

          //刷新图表控件
          this.refresh = function () {
              draw();
          };

          //控件初始化事件
          this.create = function () {
              draw();
          };
          return this; 
      }
	});
})(jQuery);

/**
 * 对图表进行类型转换
 * @param type
 * 			待要转换的类型
 * @param jhc
 * 			图表实例(待要转换的图表)
 */
function changeChartType(type,jhc){
	var options = jhc.getChartOptions();
	options.chartType = type;
	var jhc1 = new $.jHighChart(options);
	jhc1.create();
}