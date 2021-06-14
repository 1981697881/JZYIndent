Ext.define('JZYIndent.ux.FileField', {
	extend :'Ext.form.field.Base',
	xtype: 'fileupload',
	focusable: false,

	setEntity_id:function(val){
		this.entity_id=val;
		//for cc only  <100w 影像53上,不允许编辑
		if(val<JZYIndent.Cfg.ID_START){
			this.setReadOnly(true);
			var val = this.v;
			var path = val.replace(/\\/g,'/');
			var uri_m = JZYIndent.Cfg.WEB_ROOT_CC+'upload'+path;
			this.elink.innerHTML =  '<a target="_blank" href="' + uri_m + '">'+val+'</a>';
	    	var lval=val.toLowerCase();
	    	if(lval.indexOf('.jpg')==-1 && lval.indexOf('.png')==-1){
	    		this.img.parent().setVisible(false);
	    	}else{
	    		this.img.set({src:uri_m});
	    		this.img.parent().setVisible(true);
	    		this.img.show();
	    	}
	    	this.up('panel').updateLayout();
		}
		else
			Ext.DomHelper.append(this.fm,{tag: "input",type: "hidden",name:"entity_id",
				value:val});
	},
    setPlink:function(val){
    	if(!this.elink || !val)
    		return;
    	this.img_val=val;
    	this.elink.innerHTML = '<a target="_blank" href="/fileopen?fp=' + val + '">'+val+'</a>';
    	var lval=val.toLowerCase();
    	if(lval.indexOf('.jpg')==-1 && lval.indexOf('.png')==-1){
    		this.img.parent().setVisible(false);
    	}else{
    		this.img.set({src:'/fileopen?fp='+val+'&size=500&_dc='+new Date().getTime()});
    		this.img.parent().setVisible(true);
    		this.img.show();
    	}
    	this.up('panel').updateLayout();
    },
    getRawValue : function(){
        return this.v;
    },
	setReadOnly:function(readOnly ){
		this.callParent(arguments);
		var div_fm = this.bodyEl.down('form').up('div');
		if(readOnly){
			div_fm.setVisible(false);
		}else{
			div_fm.setVisible(true);
		}
	},
    setRawValue : function(val){
        this.setPlink(val);
        this.v=val;
        //this.callParent(arguments);
    },
    // private
    initComponent: function(){
        this.callParent();
    },
    // private 暂时不支持任何验证
    isValid: function() {
    	return true;
    },
    onRender : function(ct, position){
        var me = this,
            id = me.id,
            bodyEl;

        me.callParent(arguments);
        var iframe_id = "bat_iframehide";
		var frm =document.getElementById(iframe_id);
		//第一次render自行建立用于form提交,避免页面重定向的target iframe
		if(!frm){
			frm = Ext.DomHelper.append(document.body, {
			    tag: 'iframe',
			    id:	iframe_id,
			    name:iframe_id,
			    css: 'display:none;visibility:hidden;height:0px;',
			    frameBorder: 0,
			    width: 0,
			    height: 0
			});
			frm.onload=function(){
				var ifrm = this;
				//debugger
				var content;
				 if (ifrm.contentDocument) {
			        content = ifrm.contentDocument.body.innerHTML;
			    } else if (ifrm.contentWindow) {
			        content = ifrm.contentWindow.document.body.innerHTML;
			    } else if (ifrm.document) {
			        content = ifrm.document.body.innerHTML;
			    }
			    //用于导入影像excel
			    if(content.indexOf('excelImport')==0){
			    	//c4w 8.18
			    	var pos = content.indexOf('起始序号：');
			    	//如果有起始序号则根据它显示导入结果
			    	if(pos!=-1){
			    		var idstart= content.substring(pos+5);
			    		var fld=frm.field;
				 		var vw = fld.up('gridpanel');
				 		var st = vw.getStore();
				 		st.addFilter([{
		 					property:'id',
		                    operator:'ge',
		                    value:parseInt(idstart)
						}] );
				 		st.load();
			    	}
			    	Ext.MessageBox.alert('导入影像',content.replace('excelImport',''));

			    }
			 	else if(content.indexOf('[OK]')==0){
			 		Ext.MessageBox.hide();
			 		var fld=frm.field;
			 		//用于form的单个field
			 		if(!fld.entity_to || fld.entity_id){
			 			var val = $.trim(content.substring(4));
			 			fld.setValue(val);
			 			fld.fireEvent('uploaded',fld,val);
			 		}
			 		else{ //用于附件或影像批量上传
			 			if(fld.entity_rel){
				 			var vw = fld.up('panel').down('dataview');
				 			vw.getStore().load();
			 			}else{
				 			var vw = fld.up('gridpanel');
				 			vw.getStore().load();
			 			}
			 		}
			 	}else{
			 		if(!$.trim(content)=="")
			 			Ext.MessageBox.alert('上传文件失败',content);
			 	}
			};
		}
		me.frm=frm;

        var eo = me.bodyEl.el;
        //在form内作为field单个附件才显示超链接
        var str_a = me.multiple?"":"<a></a>";
        eo.dom.innerHTML="<div><div><div style='float:left;width:49%'><form accept-charset='UTF-8' action='/fileUpload' method='POST' enctype='multipart/form-data' target='"
        	+iframe_id+"'>"
        	+"</form></div><div style='float:left;width:49%'>"
        	+str_a
        	+"</div></div><div style='height:500px;display:none;'><img></img></div>";
		if(me.actionUrl){
			eo.dom.innerHTML="<div><div><div style='float:left;width:49%'><form accept-charset='UTF-8' action='/importExcel' method='POST' enctype='multipart/form-data' target='"
        	+iframe_id+"'>"
        	+"</form></div><div style='float:left;width:49%'>"
        	+str_a
        	+"</div></div><div style='height:500px;display:none;'><img></img></div>";
		}

    	var dh = Ext.DomHelper;
        var fm=eo.query("form",true)[0];
		fm.encoding="multipart/form-data";

		var cfg = {tag: "input",type: "file",name:"files", cls:"x-btn-button"};
		//允许多文件选择
		if(me.multiple){
			cfg.multiple="multiple";
		}
		if(me.accept)
			cfg.accept=me.accept;
        var file=dh.append(fm,cfg);
        me.file = file;
        me.fm=fm;
        //me.inputEl=null;
        //上传到指定的实体类
        if(me.entity_to){
        	dh.append(fm,{tag: "input",type: "hidden",name:"entity_to",
        		value:me.entity_to});
    		var vw = me.up('panel').down('dataview');
            if(me.entity_rel){
            	dh.append(fm,{tag: "input",type: "hidden",name:"entity_rel",
            		value:me.entity_rel});
            	me.ipt_entity_rel_to=dh.append(fm,{tag: "input",type: "hidden",name:"entity_rel_to",
            		value:me.entity_rel_to});
            }
       }
        Ext.get(file).on('change', function(p1,p2,p3){
        	if(!p2.value || p2.value=="")
        		return false;
        	//bind后才能拿到主表 filter
        	if(me.multiple){
	    		var vw = me.up('panel').down('dataview');
	    		var filters=vw.getStore().filters;
	    		if(filters.length>0 && !me.entity_rel){
	    			me.entity_rel_to=filters.items[0]._value;
	    			var property = filters.items[0]._property;
	    			me.entity_rel=property.substring(0, property.length-2).toUpperCase();;
	            	dh.append(fm,{tag: "input",type: "hidden",name:"entity_rel",
	            		value:me.entity_rel});
	            	me.ipt_entity_rel_to=dh.append(fm,{tag: "input",type: "hidden",name:"entity_rel_to",
	            		value:me.entity_rel_to});
	    		}
        	}
        	me.frm.field=me;
			Ext.MessageBox.show({ msg:'正在上传，请稍候...',title:'系统提示',
				modal:false,wait:true,closable:false});
			fm.submit();
        }, this);
        me.img = eo.down("img");
        me.img.parent().setVisibilityMode(Ext.Element.DISPLAY);
        me.elink = eo.query("a",true)[0];
    }

});
