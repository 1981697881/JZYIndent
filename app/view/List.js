Ext.define('JZYIndent.view.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.list',

    requires: [
        'JZYIndent.controller.ListController',
        'JZYIndent.ux.GridFilters',
        'Ext.overrides.grid.filters.filter.Date'
    ],

    controller: 'list',
    plugins: ['gfilters'],
    bind: {
        store: '{objs}'
    },
    header:false,

   // selType: 'checkboxmodel',
    selModel: {
        selType: 'checkboxmodel',
        showHeaderCheckbox: false
    },
    tbar: ['->',{
        text: '新增',
        handler: 'onNew',
        hidden:true
    },{
        text: '修改',
        handler: 'onClone',
        hidden:true
    },{
        text: '禁/启',
        handler: 'onRemove',
        hidden:true
    }
    ],
    initComponent: function(){
    	var me=this;
    	me.callParent();
    	if(JZYIndent.Cfg.bView){
    		var detailPanel = me.up('detail');
    		if(detailPanel){
    			var tbar = me.down('toolbar');
    			tbar.hide();
    		}
    	}else{
        	var perms = JZYIndent.Cfg.usrInfo.get('perms')||'update;delete';
        	//只读显示
        	if(perms.indexOf('update')!=-1){
                if (me.down('button[text="新增"]')) {
                    me.down('button[text="新增"]').setVisible(true);
                }
                if (me.down('button[text="克隆"]')) {
                    me.down('button[text="克隆"]').setVisible(true);
                }
        	}
        	if(perms.indexOf('delete')!=-1){ //管理员才显示删除按钮
                if (me.down('button[text="删除"]')) {
                    me.down('button[text="删除"]').setVisible(true);
                }
        	}
            me.on('edit', function(editor, e) {
                // commit the changes right after editing finished
        		var rec = e.record;
        		//rec.commit(true);
        		rec.save({
                    scope: this,
                    callback: function(records,operation,success){
                    	if(success)
                         Ext.toast({
                             title: '保存',
                             html: '['+rec.getId()+']保存完成',
                             align: 't',
                             bodyPadding: 10
                         });
                    }
                });

            });

    	}
        me.getView().on({'beforerefresh':function(view,opts){
    		//console.log('beforerefresh');
    		if(view.getScrollY()!=0){
    			view.scrollTo(0,0);
    			setTimeout(function(){
    	        	view.refresh();
    	        },100);
    			return false;
    		}
			var tbar = me.down('toolbar');
			if(!tbar)
				return;
    		var total = view.getStore().getTotalCount();
    		if(!isNaN(total)){
        		var cpt_total=tbar.down('component[name=cpt_total]');
        		if(cpt_total)
        			cpt_total.update('共<b>'+total+'</b>条');
    		}
     	}});
    }
 });
