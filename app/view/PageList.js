Ext.define('JZYIndent.view.PageList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pagelist',
    xtype:'pagelist',
    requires: [
        'JZYIndent.controller.ListController',
        // 'JZYIndent.ux.GridFilters',
        // 'Ext.overrides.grid.filters.filter.Date'
    ],
    controller: 'list',
    //plugins: ['gfilters'],
    bind: {
        store: '{objs}'
    },
    forceFit: true,
    header:false,
    // selModel: {
    //     selType: 'checkboxmodel',
    //     //showHeaderCheckbox: false
    // },
    // tbar: ['->',{
    //     text: '录入',
    //     handler: 'onNew',
    //     hidden:true
    // },{
    //     text: '克隆',
    //     handler: 'onClone',
    //     hidden:true
    // },{
    //     text: '删除',
    //     handler: 'onRemove',
    //     hidden:true
    // }
    // ],
    bbar: [{
    	xtype: 'pagingtoolbar',
        bind: {
            store: '{objs}'
        },
        name:'pagingbar',
        displayInfo: true,
        displayMsg: '显示第{0}条到{1}条记录，一共{2}条', //只有displayInfo:true时才有效，用来显示有数据的提示信息。
        emptyMsg: "没有记录", //没有数据显示的信息
        items: ['-', '每页显示', {xtype:'pageCombo'}, '条'], //此处是将创建的combobox添加到工具栏中
        doRefresh:function(){
            return false;
        }
    }],


	listeners: {
       // itemdblclick: 'onDblClick',
    	// afterlayout: function(grid,layout, eOpts) {
    	// 	var bbar = grid.down('pagingtoolbar');
    	// 	var st =bbar.getStore();
    	// 	if(!st || st.isEmptyStore)
    	// 		return;
         //    console.log(Math.ceil(parseFloat(grid.getStore().totalCount)/100))
    	// 	var maxRowsPerGrid = Math.floor(grid.getView().getHeight()/JZYIndent.Cfg.ROW_HEIGHT)-1;
         //    console.log(st.getPageSize()!=maxRowsPerGrid)
    	// 	if(st.getPageSize()!=maxRowsPerGrid){
         //        console.log(grid.getStore().totalCount)
        	// 	st.setPageSize(grid.getStore().totalCount);
        	// 	bbar.doRefresh();
    	// 	}
    	// }
    },

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
                if (me.down('button[text="录入"]')) {
                    me.down('button[text="录入"]').setVisible(true);
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
            // me.on('edit', function(editor, e) {
            //     // commit the changes right after editing finished
        		// var rec = e.record;
        		// //rec.commit(true);
        		// rec.save({
            //         scope: this,
            //         callback: function(records,operation,success){
            //         	if(success)
            //         	 Ext.toast({
            //                  title: '保存',
            //                  html: '['+rec.getId()+']保存完成',
            //                  align: 't',
            //                  bodyPadding: 10
            //              });
            //         }
            //     });
            //
            // });

    	}
    }
 });
