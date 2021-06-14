Ext.define('JZYIndent.view.CFirst.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cfirstlist',
    stores: {
        objs: {type:'PageStore',
       		model: 'first',
			pageSize:100,
			proxy: {
				type: 'ajax',
				url: JZYIndent.Cfg.server+'/order/itemList',
				// data: data,
				//callbackKey: 'callback',
				limitParam: "pageSize",
				pageParam: "pageIndex",
				extraParams:{
					pageSize:100,
				},
				reader: { // 使用Ext.data.reader.Json读取服务器数据
					type: 'json',
					rootProperty: 'data',
					totalProperty: 'recordCount'
				},
			},
			autoLoad: true,
	        sorters:[{
	        	property: 'fid',
	            direction: 'DESC'
	        }],

        },
     }
});
