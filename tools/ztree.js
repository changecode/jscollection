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
			$("#zt_text").html("<p>�����С���</p>");
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
		
		//����ͼƬ����ʵ��С����������༭�������������
		var resizePicWidth = function(selector, pic_width){
			$(selector + " img").each(function(){
				var img = $(this);
		        var realWidth;	//��ʵ�Ŀ��
		        var realHeight;		//��ʵ�ĸ߶�
		   		//��������˵����$("<img/>")�����Ǵ���һ����ʱ��img��ǩ������js����һ��new Image()����
		   		$("<img/>").attr("src", $(img).attr("src")).load(function() {
		        	/*
		              ���Ҫ��ȡͼƬ����ʵ�Ŀ�Ⱥ͸߶����������ע��
		              1����Ҫ����һ��image�����������$("<img/>")
		              2��ָ��ͼƬ��src·��
		              3��һ��Ҫ��ͼƬ������ɺ�ִ����.load()������ִ��
		             */
		            realWidth = this.width;
		            realHeight = this.height;
		           	//�����ʵ�Ŀ�ȴ��ڹ涨�Ŀ�ȾͰ���100%��ʾ
		            if(realWidth>=pic_width){
		            	$(img).css("width", (pic_width) + "px");
		           	} else{//���С��������Ŀ�Ȱ���ԭ�ߴ���ʾ
		            	$(img).css("width",realWidth+'px');
		          	}
		        });
			});
		};
		
		var resizePicF = function(){
			var cw = $("#zt_text")[0].clientWidth - 50;
			resizePicWidth("#zt_text", cw);
		}