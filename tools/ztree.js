var setting = {
			view: {
				selectedMulti: false
			},
			callback: {
				beforeClick: beforeClick,
				onClick: onClick
			}
		};

		function beforeClick(treeId, treeNode, clickFlag) {
			if (treeNode.isParent) {
				zTree.expandNode(treeNode);
				return false;
			}else if(!treeNode.isText){
				return false;
			}
			return true;
		}

		function onClick(event, treeId, treeNode, clickFlag) {
			if (!treeNode.isParent) {
				if(treeNode.isText){
					loadText(treeNode.id);
				}
			}
		}
		
		function loadText(id){
			$("#zt_text").html("<p>加载中……</p>");
			var host = window.location.host;
			var domain = "http://ccbpm.mydoc.io?v=5404";
			if(host.indexOf("doc.oschina.")==0){
				domain = "http://doc.oschina.net/ccbpm?v=5404";
			}
			$("#zt_text").load(domain + "&p=text&t="+id, function(){
				resizePicF();
			});
		}
		var zTree;
		$(document).ready(function(){
			$.ajax({
				url: "/action/document/node_list?vId=5404&id=0",
				dataType: "json",
				success: function(data){
					var zNodes = data.nodes;
					zTree = $.fn.zTree.init($("#zt_navi_tree"), setting, zNodes);
											var currentId = data.firstId;
										loadText(currentId);
					var node = zTree.getNodeByParam("id", currentId);
					zTree.selectNode(node);
				}
			});
		});
		
		//计算图片的真实大小，如果超过编辑区域，则进行限制
		var resizePicWidth = function(selector, pic_width){
			$(selector + " img").each(function(){
				var img = $(this);
		        var realWidth;	//真实的宽度
		        var realHeight;		//真实的高度
		   		//这里做下说明，$("<img/>")这里是创建一个临时的img标签，类似js创建一个new Image()对象！
		   		$("<img/>").attr("src", $(img).attr("src")).load(function() {
		        	/*
		              如果要获取图片的真实的宽度和高度有三点必须注意
		              1、需要创建一个image对象：如这里的$("<img/>")
		              2、指定图片的src路径
		              3、一定要在图片加载完成后执行如.load()函数里执行
		             */
		            realWidth = this.width;
		            realHeight = this.height;
		           	//如果真实的宽度大于规定的宽度就按照100%显示
		            if(realWidth>=pic_width){
		            	$(img).css("width", (pic_width) + "px");
		           	} else{//如果小于浏览器的宽度按照原尺寸显示
		            	$(img).css("width",realWidth+'px');
		          	}
		        });
			});
		};
		
		var resizePicF = function(){
			var cw = $("#zt_text")[0].clientWidth - 50;
			resizePicWidth("#zt_text", cw);
		}