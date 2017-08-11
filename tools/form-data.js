//点击首页内容 跳转到相应的部分页面
//加上对应的标记 class="box1"
<a href="javascript:" class="mnu" onclick="jump('.box2')">使用方法</a>
function jump(item){
	var hei = $(item).offset().top;
	$('html,body').animate({'scrollTop':hei},600);
}

//str to json
strToJson: function(str) {
    var json = eval("(" + str + ")");
    return json
}


//ajax
requestJsonRs: function(url, param, async, callback) {
    if (!param) {
        param = {}
    }
    var jsonObj = null;
    $.ajax({
        type : "post",
        dataType : "html",
        url : url,
        data : param,
        async : (async ? async : false),
        success : function(data) {
            try {
                jsonObj = eval("(" + data + ")")
            } catch (e) {
                jsonObj = null
            }
            if (callback) {
                callback(jsonObj)
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            jsonObj = {
                rtMsg : "Ajax Request Error"
            }
        },
        timeout : 30000
    });
    return jsonObj
}


//时间戳转成时间 
function timeStamp2String(time){  
    var datetime = new Date();  
    datetime.setTime(time);  
    var year = datetime.getFullYear();  
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;  
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();  
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();  
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();  
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();  
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;  
}  


//写入cookie
function setCookie(name, value) {
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
 
///删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
 
//读取cookie
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null)
        return unescape(arr[2]);
    return null;
}


//常见正则判断
//regRule['email'].test(val) 返回true或false
regRuls: {
	email:function(email) {
		var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		return reg.test(email);
	},
	userName:function(str) {
		var reg = /^[a-z0-9_-]{3,16}$/;
		return reg.test(str);
	},
	chineseName:function(str) {
		var reg = /^[\u4E00-\u9FA5]{2,4}$/;
		return reg.test(str);
	},
	mobile:function(str) {
		var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
		return reg.test(str);
	},
	idCard:function(str) {
		var reg = /^([1-9][\d]{0,10}|0)(\.[\d]{1,2})?$/;
		return reg.test(str);
	},
	decimalNumber:function() {
		var reg = /^\d+(\.\d+)+$/; //判断带小数的数字
		return reg.test(new Number(str));
	},
	ip: function(str) {
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
        return reg.test(str);
    }


//刷新当前页面
refresh_current_page:function {
	window.location.href = window.location.href;
} 


//判断身份证号码
identityCodeValid:function(code) {
	var alert_tip = "";
	 var city = {
	 	11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
	};
	var pass = true;
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        alert_tip = "身份证号格式错误";
        pass = false;
    } else if(!city[code.substr(0, 2)]) {
        alert_tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if(code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for(var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]) {
                alert_tip = "校验位错误(X需大写)";
                pass = false;
            }
        }
    }
    if(!pass) {
        alert(alert_tip);
    }
    return pass;
}


//判断是否是汉字，字段中有空格返回false
isChinese:function{
	if(/^([\u4e00-\u9fa5]|[\ufe30-\uffA0])*$/.test(this.trim(str)))
		return true;
}


//为控件设置属性
$("input").attr("disabled",true);
$("#updateSku_form select[name=skuClsName").attr("disabled",true);
$("#updateSku_form select[name=sensitiveAttribute").attr("disabled",true);
$("#update_skuImgPath").attr("disabled",true);
$("#btnzhuce").attr({"disabled":"disabled"});
$("#btnzhuce").removeAttr("disabled");//½«°´Å¥¿ÉÓÃ


//简单样式示例操作
$('.ai-text-error').text("");
$("#addSkuDiv").removeClass("ai-validate-error");
$("input").removeClass("ai-validate-error");
$("select").removeClass("ai-validate-error");


//格式化金额
function moneyFormat(str) {
    return str.replace(/[^\d\.]|^\./g, '').replace(/\.{2}/g, '.').replace(/^([1-9]\d*|0)(\.\d{1,2})(\.|\d{1})?$/, '$1$2').replace(/^0\d{1}/g, '0');
}

//日期比较
$('#startDate,#endDate').datetimepicker({
		minView: "month",
		format : "yyyy-mm-dd",
		todayBtn : "linked",
		language : "zh-CN",
		autoclose : true
	}).on('changeDate', function(ev){
		var $start_date = $("#startDate")
		, $end_date = $("#endDate")
		, start_date = $start_date.val()
		, end_date = $end_date.val()
		, start_time = 0
		, end_time = 0
		if(start_date && end_date) {
			start_time = new Date( start_date ).getTime()
			end_time = new Date( end_date ).getTime()
			if( end_time < start_time ){
				//Çë×¼È·ÌîÐ´Ê±¼ä
				layer.alert('¿ªÊ¼Ê±¼ä²»ÄÜ´óÓÚ½áÊøÊ±¼ä');
			}
		}
	});
	
//擅长layer示例
function delRows(btn) {
	layer.confirm( 'È·ÈÏÒªÉ¾³ýÂð£¿', {
		btn: ['È·ÈÏ','È¡Ïû'], //°´Å¥
		shade: false //²»ÏÔÊ¾ÕÚÕÖ
		}, function(index){
			var rowId = $(btn).attr('data-key');
			var rowObj = $('#sku-grid-table').getRowData(rowId);
			var skuCode = rowObj['skuCode'];
			$.ajax({
				url : "/cbes/commodity/delCommodityData?skuCode="+skuCode,
				type : "POST",
				processData : false,
				contentType : false,
				success : function(backData) {
					if (backData.return_code != 0) {
						layer.msg('É¾³ýÊ§°Ü!' + backData.return_msg);
					} else {
						layer.msg('É¾³ý³É¹¦!');
						//$("#skuManager .icon-double-angle-right").click();
					}
					skuGrid.reload();
				}
			});
		}, function(index){
			layer.close(index);
		}
	);
}	

//字符串常见操作
var strUtil = {
    /*
     * 判断字符串是否为空
     */
    isEmpty:function(str){
        if(str != null && str.length > 0){
            return true;
        }else{
            return false;
        }
    },
    /*
     * 判断两个字符串子否相同
     */
    isEquals:function(str1,str2){
        if(str1==str2){
            return true;
        }else{
            return false;
        }
    },
    /*
     * 忽略大小写判断字符串是否相同
     */
    isEqualsIgnorecase:function(str1,str2){
        if(str1.toUpperCase() == str2.toUpperCase()){
            return true;
        }else{
            return false;
        }
    },
    /**
     * 判断是否是数字
     */
    isNum:function (value){
        if( value != null && value.length>0 && isNaN(value) == false){
            return true;
        }else{
            return false;
        }
    },
    /**
     * 判断是否是中文
     */
    isChine:function(str){
        var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;
        if(reg.test(str)){
            return false;
        }
        return true;
    }
};

//过滤html代码(把<>转换)
filterTag: function(str) {
    str = str.replace(/&/ig, "&amp;");
    str = str.replace(/</ig, "&lt;");
    str = str.replace(/>/ig, "&gt;");
    str = str.replace(" ", "&nbsp;");
    return str;
}

//过滤<script></script>
filterScript:function(str) {
	return str.replace(/(<script)/ig, "&lt;script").replace(/(<script>)/ig, "&lt;script&gt;").replace(/(<\/script>)/ig, "&lt;/script&gt;");
}

//判断非空
isEmpty:function(val) {
	val = $.trim(val);
	if(val == null)
		return true;
	if(val == undefined || val == 'undefined')
		return true;
	if(val == "") 
		return true;
	if(val.length == 0) 
		return true;
	if(!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}
