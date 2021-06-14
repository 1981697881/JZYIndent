Ext.define('JZYIndent.Application', {
    extend: 'Ext.app.Application',
    name: 'JZYIndent',
    requires: [
    		//'Ext.app.bindinspector.*',
               'Ext.app.*',
               'Ext.state.CookieProvider',
               'Ext.window.MessageBox',
                'Ext.tip.QuickTipManager',
               'JZYIndent.*'
           ],
   controllers: [
         'Global'
     ],
    stores: ['Thumbnails', 'Authors', 'BFS', 'Navigation'],
    // stores: [
    //     // TODO: add global / shared stores here
    // ],

    onBeforeLaunch: function () {
        // All smoke-and-mirrors with data happens in SimData. This is a fake server that
        // runs in-browser and intercepts the various Ajax requests a real app would make
        // to a real server.
        //JZYIndent.SimData.init();
        this.callParent();
    },
    init: function() {
        this.setDefaultToken('all');
        /*Ext.Ajax.on('requestexception', function (conn, response, options) {
        	var errtip;
        	var linestr = '<br>\n';
        	if(response.responseText && $.trim(response.responseText)!=''){
        		var dt =response.getResponseHeader('Date');
        		errtip=dt+linestr+response.responseText;
            	try{
            	    console.log(response)
            		var errinf = Ext.decode(response.responseText);
            		var cause = errinf.error;
            		if(cause){
                    	errtip = dt+linestr;
                    	for(var l=0; l<6;l++){
                    		if(!cause || !cause.message)
                    			break;
                    		errtip+=cause.message+linestr;
                    		cause=cause.cause;
                    	}
            		}
            	}catch(e){
            		errtip=dt+linestr+response.responseText;
            	}
        	}else{
        	    errtip='服务无响应';
                Ext.MessageBox.show({
                    title: '服务出现异常',
                    msg: errtip,
                    buttons: Ext.MessageBox.OK,
                    scope: this,
                    icon: Ext.MessageBox.ERROR
                });
                location.reload();
            }
        });*/
        Ext.setGlyphFontFamily('Pictos');
        Ext.tip.QuickTipManager.init();
        //if (!Ext.microloaderTags.test) {
        //    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
      // }
    }

});
