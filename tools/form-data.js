
//Ϊ�ؼ���������
$("input").attr("disabled",true);
$("#updateSku_form select[name=skuClsName").attr("disabled",true);
$("#updateSku_form select[name=sensitiveAttribute").attr("disabled",true);
$("#update_skuImgPath").attr("disabled",true);
$("#btnzhuce").attr({"disabled":"disabled"});
$("#btnzhuce").removeAttr("disabled");//����ť����


//��ʽʾ��
$('.ai-text-error').text("");
$("#addSkuDiv").removeClass("ai-validate-error");
$("input").removeClass("ai-validate-error");
$("select").removeClass("ai-validate-error");


//��ʽ�����ֽ��
function moneyFormat(str) {
    return str.replace(/[^\d\.]|^\./g, '').replace(/\.{2}/g, '.').replace(/^([1-9]\d*|0)(\.\d{1,2})(\.|\d{1})?$/, '$1$2').replace(/^0\d{1}/g, '0');
}

//���ڱȽ�
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
				//��׼ȷ��дʱ��
				layer.alert('��ʼʱ�䲻�ܴ��ڽ���ʱ��');
			}
		}
	});
	
//ɾ��layerӦ��ʾ��
function delRows(btn) {
	layer.confirm( 'ȷ��Ҫɾ����', {
		btn: ['ȷ��','ȡ��'], //��ť
		shade: false //����ʾ����
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
						layer.msg('ɾ��ʧ��!' + backData.return_msg);
					} else {
						layer.msg('ɾ���ɹ�!');
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

//layer ����������
layer :
	icon��1-7
1������
2��X��
3������
4����
5������
6��Ц��
7������
function showErrorMsg(msg,fn){
		var id = layer.open({
			  icon:6, 
			  content:'<div style="font-weight: bold;margin-left: 40px">'+msg+'</div>',
			  title : "<div style='color:black'>��ʾ</div>",
			  closeBtn: 0,
			  yes:function(){
				  if(typeof fn == 'function'){
					  fn();
				  }
				  layer.close(id);
			  }
		});
}