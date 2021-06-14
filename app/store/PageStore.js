Ext.define('JZYIndent.store.PageStore', {
    extend: 'Ext.data.Store',
    alias: 'store.PageStore',
    listeners:{
    	beforeload:function( store, operation, eOpts ){
    		if(store.pageSize==0)
    			return false;
    	}
    },
    // constructor: function(config) {
    //     var me = this;
    //     var opts={
    //     	model: config.model,
    //         sorters: [{
    //             property: 'id',
    //             direction: 'DESC'
    //         }],
    //         pageSize: 0,
    //         //autoLoad: true,
    //         remoteFilter: true,
    //         remoteSort: true,
    //         proxy : {
    //             type: 'rest',
    //             url:  '/rest/' + config.model,
    //             reader :
    //             {
    //                 type : 'json',
    //                 rootProperty : 'data',
    //                 totalProperty:'total'
    //             }
    //         }
    //     }
    //     me.callParent([Ext.apply(opts,config)]);
    // }

});
