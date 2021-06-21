/**
 * This class manages the login process.
 */
Ext.define('JZYIndent.LoginManager', {
    config: {
        /**
         * @cfg {Class} model
         * The model class from which to create the "user" record from the login.
         */
        model: null,

        /**
         * @cfg {Ext.data.Session} session
         */
        session: null
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    applyModel: function(model) {
        return model && Ext.data.schema.Schema.lookupEntity(model);
    },
    logout:function(){
        var accessToken = Ext.util.Cookies.get("username")
        Ext.util.Cookies.clear("username");
        Ext.util.Cookies.clear("FUserID");
        Ext.util.Cookies.clear("password");
        if(accessToken!=null&&accessToken.indexOf("ST")>=0) {
            var rstr = response.responseText;
            //去掉多余的"
            location.assign(rstr.substring(1,rstr.length-1));
        }else{
            window.location.reload();
        }
    },
    login: function(options) {
    	//for simdata
    	var req = {
            url: JZYIndent.Cfg.server+'/base/login',
            //url: '/auth',
            async:false,
            withCredentials : true,
            method: 'POST',
            params: options.data,
            scope: this,
            callback: this.onLoginReturn,
            original: options
        };
    	if(!JZYIndent.Cfg.SIM_ENM['User']){
    		Ext.apply(req,{
    			method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                params : Ext.JSON.encode(options.data)
    		});
    	}
        console.log(req)
        Ext.Ajax.request(req);
    },
    onLoginReturn: function(options, success, response) {
        var respText = Ext.util.JSON.decode(response.responseText);
        console.log(respText)
        // if(respText.status=="0"){
        //     var me = this;
        //     me.window = new JZYIndent.view.register.Register({
        //         autoShow: true,
        //     });
        // }else{
            //开始组装数据
            JZYIndent.SimData.init();
            options = options.original;
            var session =this.getSession(),
                resultSet;

            if (success) {
                resultSet = this.getModel().getProxy().getReader().read(response, {
                    recordCreator: session ? session.recordCreator : null
                });
                if (resultSet) {

                    var user = resultSet.getRecords()[0];
                    JZYIndent.Cfg.usrInfo = user;
                    // && user.data.token!=null
                    if(user.data!=null) {
                        console.log(user.data.data)
                        Ext.util.Cookies.set("FUserID", user.data.data[0].FUserID);
                        Ext.util.Cookies.set("FEmpID", user.data.data[0].FEmpID);
                        Ext.util.Cookies.set("FUserType", user.data.data[0].FUserType);
                        Ext.util.Cookies.set("FEmpName", user.data.data[0].FEmpName);
                        Ext.util.Cookies.set("FEmpNumber", user.data.data[0].FEmpNumber);
                        Ext.util.Cookies.set("username", options.data.username);
                        Ext.util.Cookies.set("password", options.data.password);
                    }
                    Ext.callback(options.success, options.scope, [resultSet.getRecords()[0]]);
                    return;
                }
            //}

            Ext.callback(options.failure, options.scope, [response, resultSet]);
        }

    }
});
