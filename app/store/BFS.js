Ext.define('JZYIndent.store.BFS', {
    extend: 'Ext.data.BufferedStore',
    alias: 'store.BFS',

    contains: function(record) {
        return this.indexOf(record) > -1;
    },
    listeners:{
    	beforeload:function(store, records, successful, eOpts ){
    		//console.log('beforeload');
    	},
    	update:function( store, record, operation, modifiedFieldNames, details, eOpts ){
    		//console.log('bsfstore update');
    	}
    },
	//读取数据
    constructor: function(config){
        var me = this;
        var opts={
        	autoSync:true,
    		leadingBufferZone: 40,
    		pageSize: 20,
    	    model: config.model,
    	    autoLoad: false,
    	    remoteFilter: true,
    	    proxy : {
    	    	type: 'rest',
    	    	url: '/rest/' + config.model,
    	    	reader :
    	        {
    				type : 'json',
    				rootProperty : 'data',
    				totalProperty:'total'
    	        }
    	    }
        }
        me.callParent([Ext.apply(opts,config)]);
    }

});
