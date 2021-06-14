Ext.define('JZYIndent.view.third.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.thirdlist',
    stores: {
        objs: {type:'PageStore',
       		model: 'third',
			pageSize:100,
			proxy: {
				type: 'ajax',
				url: JZYIndent.Cfg.server+'/order/itemSort',
				// data: data,
				//callbackKey: 'callback',
				//withCredentials: true,
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
	        }]
        },

     }
});
