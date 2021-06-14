/**
 * This View Controller is associated with the Login view.
 */
Ext.define('JZYIndent.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    loginText: 'Logging in...',

    onSpecialKey: function(field, e) {
        if (e.getKey() === e.ENTER) {
            this.doLogin();
        }
    },

    onLoginClick: function() {
        this.doLogin();
    },
    doLogin: function() {
        var form = this.lookupReference('form');
        if (form.isValid()) {
            Ext.getBody().mask(this.loginText);
            if (!this.loginManager) {
                this.loginManager = new JZYIndent.LoginManager({
                    session: this.getView().getSession(),
                    model: 'User'
                });
            }
            var fval=form.getValues();
            var data={
            		username:fval.username,
            		password:fval.password
            	};
            if(fval.changepwd){
            	data.pwdnew=fval.pwd1;
            }
            this.loginManager.login({
                data: data,
                scope: this,
                success: 'onLoginSuccess',
                failure: 'onLoginFailure'
            });
        }
    },

    onLoginFailure: function(response) {
        var respText = Ext.util.JSON.decode(response.responseText);
        Ext.Msg.show({
            title:'提示',
            msg: respText.msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR
        });
        // Do something
        Ext.getBody().unmask();
    },
    onLoginSuccess: function(user) {
        console.log(user)
        if(user.getData().message!="成功"){
            var me = this;
            Ext.Msg.show({
                title:'提示',
                msg: '账号密码输入错误',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            return;
        }else{
            Ext.getBody().unmask();
            //var org = this.lookupReference('organization').getSelectedRecord();
            this.fireViewEvent('login', this.getView(), user, this.loginManager);
        }

    },

});
