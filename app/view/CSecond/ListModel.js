Ext.define('JZYIndent.view.csecond.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.csecondlist',
    stores: {
        objs: {type:'PageStore',
       		model: 'second',
			pageSize:100,
			proxy: {
				type: 'jsonp',
				url: JZYIndent.Cfg.server+'/base/cus/customerList.do',
				// data: data,
				callbackKey: 'callback',
				limitParam: "pageSize",
				pageParam: "pageNum",
				extraParams:{
					pageSize:100,
				},
				reader: { // 使用Ext.data.reader.Json读取服务器数据
					type: 'json',
					rootProperty: 'data.list',
					totalProperty: 'data.total'
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
