Ext.define('JZYIndent.ux.Reste', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.reste',

    constructor: function() {
        var me = this;
        me.callParent(arguments);
/*        me.on('exception',function( proxy, response, operation ){
        	var errtip;
        	if(response.responseText && response.responseText.trim()!=''){
            	try{
                	var error = Ext.decode(response.responseText).error;
                	errtip =error.message;
            	}catch(e){
            		errtip=response.responseText;
            	}
        	}else errtip='服务无响应';
            Ext.MessageBox.show({
                title: '服务出现异常',
                msg: errtip,
                buttons: Ext.MessageBox.OK,
                scope: this,
                icon: Ext.MessageBox.ERROR
            });
    	});
*/    },
    processResponse: function(success, operation, request, response, callback, scope){

/*        if(!success && typeof response.responseText === 'string') { // we could do a regex match here
        	var error = Ext.decode(response.responseText).error;
            Ext.MessageBox.show({
                title: '服务出现异常',
                msg: error.message,
                buttons: Ext.MessageBox.OK,
                scope: this,
                icon: Ext.MessageBox.ERROR
            });
            //this.fireEvent('exception', this, response, operation);
            this.callParent(arguments);
        } else {
            this.callParent(arguments);
        }
*/        this.callParent(arguments);
    }
})
