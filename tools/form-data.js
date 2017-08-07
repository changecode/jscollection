
//为控件设置属性
$("input").attr("disabled",true);
$("#updateSku_form select[name=skuClsName").attr("disabled",true);
$("#updateSku_form select[name=sensitiveAttribute").attr("disabled",true);
$("#update_skuImgPath").attr("disabled",true);
$("#btnzhuce").attr({"disabled":"disabled"});
$("#btnzhuce").removeAttr("disabled");//将按钮可用


//样式示例
$('.ai-text-error').text("");
$("#addSkuDiv").removeClass("ai-validate-error");
$("input").removeClass("ai-validate-error");
$("select").removeClass("ai-validate-error");


//格式化数字金额
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
				//请准确填写时间
				layer.alert('开始时间不能大于结束时间');
			}
		}
	});
	
//删除layer应用示例
function delRows(btn) {
	layer.confirm( '确认要删除吗？', {
		btn: ['确认','取消'], //按钮
		shade: false //不显示遮罩
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
						layer.msg('删除失败!' + backData.return_msg);
					} else {
						layer.msg('删除成功!');
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

//layer 弹出框标表情
layer :
	icon：1-7
1：勾号
2：X号
3：？号
4：锁
5：哭脸
6：笑脸
7：！号
function showErrorMsg(msg,fn){
		var id = layer.open({
			  icon:6, 
			  content:'<div style="font-weight: bold;margin-left: 40px">'+msg+'</div>',
			  title : "<div style='color:black'>提示</div>",
			  closeBtn: 0,
			  yes:function(){
				  if(typeof fn == 'function'){
					  fn();
				  }
				  layer.close(id);
			  }
		});
}