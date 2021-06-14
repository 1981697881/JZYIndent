
Ext.define('JZYIndent.view.login.Login', {
    extend: 'Ext.window.Window',
    //extend: 'Ext.panel.Panel',
    requires: [
        'JZYIndent.view.login.LoginController',
        'JZYIndent.view.login.LoginModel',
        'Ext.form.Panel',
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.button.Button',
        'Ext.layout.container.VBox'
    ],
    viewModel: 'login',
    cls: 'auth-locked-window',
    closable: false,
    resizable: false,
    autoShow: true,
    titleAlign: 'center',
    maximized: true,
    modal: true,
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    controller: 'login',
   /* title: "<div class=\"nav\">"+
    "	<ul>"+
    "        <select>"+
    "            <option value=\"\">中文</option>"+
    "            <option value=\"\">繁体</option>"+
    "            <option value=\"\">English</option>"+
    "        </select>"+
    "		<li><a>其他</a></li>"+
    "		<li><a>关于我们</a></li>"+
    "		<li><a>联系我们</a></li>"+
    "		<li><a>首页</a></li>"+
    "	</ul>"+
    "</div>",*/
    bbar: {
        cls:"wuye_bbar",
        xtype: 'statusbar',
        reference: 'wordStatus',
        // These are just the standard toolbar TextItems we created above.  They get
        // custom classes below in the render handler which is what gives them their
        // customized inset appearance.
        items: [{
            reference: 'wordCount',
            xtype: 'tbtext',
            text: 'Words: 0'
        }, ' ', {
            reference: 'charCount',
            xtype: 'tbtext',
            text: 'Chars: 0'
        }, ' ', {
            reference: 'clock',
            xtype: 'tbtext',
            text: Ext.Date.format(new Date(), 'g:i:s A'),
            listeners: {
                //进入页面执行事件设置高度和宽度
                'render': function () {
                    var me=this;
                    var task = {
                        run: function(){
                            me.setText(Ext.Date.format(new Date(), 'g:i:s A'))
                        },
                        interval: 1000 //1秒
                    }
                    Ext.TaskManager.start(task);
                },
            },
        }, ' ']
    },
    // closable: false,
    // cls: 'login',
    items: {
        reference: 'form',
        xtype: 'form',
        //defaultButton : 'loginButton',
        autoComplete: true,
        bodyPadding: '20 20',
        cls: 'wuye-dialog-login',
        header: false,
        width: 415,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults : {
            margin : '5 0',
        },
        items: [{
            xtype: 'component',
            html: [
                '<p style="text-align: center;font-size:18px;text-shadow: 2px 2px 2px #acacac !important;">快速下单</p>',
            ]
        },
            {
            name: 'username',
            //bind: '{username}',
            fieldLabel: '用户名',
    		allowBlank: false,
            xtype: 'textfield',
    	    //xtype: 'combobox',
    	    triggerAction:'all',
    	    typeAhead :true,
    	   	minChars:1,
            emptyText: 'user id',
            labelWidth:60,
            height: 30,
    	   	lazyInit:false,
    	    queryParam : 'kw',
    	    valueField: 'name',
    	    displayField: 'name',
    	    //store: JZYIndent.Cfg.getDistinctStore('net.bat.entity.User','loginName')
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: '密&nbsp;&nbsp;&nbsp;码',
            height: 30,
            emptyText: 'password',
            allowBlank: false,
            labelWidth:60,
            //allowBlank: false,
            enableKeyEvents: true,
            cls: 'password',
            //value:'123456',
            listeners: {
                specialKey: 'onSpecialKey'
            }
        },{
          xtype:'fieldset',
          checkboxName:'changepwd',
          checkboxToggle:true,
          title: '修改我的密码',
          collapsed: true,
          autoHeight:true,
          defaultType: 'textfield',
         // defaults: {width: 300},
          padding:10,
          items :[{
                  fieldLabel: '新密码',
                  name: 'pwd1',
                  inputType: 'password',
                  msgTarget :'side',
               	validator:function(val){
               		var fm=this.up('form');
              		var btn_ok = fm.up('window').down('button[text]');
              		var fld_pwd2 = fm.down('field[name=pwd2]');
             	  	if(fld_pwd2.isValid()){
             	  	 btn_ok.enable();
  	            	  return true;
             	  	}
	            	else{
	            		btn_ok.disable();
	            		return '密码输入不一致';
	            	}
	            }
              },{
                  fieldLabel: '确认新密码',
                  inputType: 'password',
                  msgTarget :'side',
                  name: 'pwd2',
             	validator:function(val){
               		var fm=this.up('form');
              		var btn_ok = fm.up('window').down('button[text]');
              		var fld_pwd1 = fm.down('field[name=pwd1]');
             	  	if(val==fld_pwd1.getValue()){
             	  		fld_pwd1.clearInvalid( )
             	  		 btn_ok.enable();
             	  		return true;
             	  	}
	            	else{
	            		btn_ok.disable();
	            		return '密码输入不一致';
	            	}
	            }
              }
           ]
      },{
            xtype: 'button',
            //reference: 'loginButton',
           // scale: 'large',
            //ui: 'soft-green',
            cls: 'wuye-login-button',
           // iconAlign: 'right',
            text: '<font style=" color: #ffffff ">Login</font>',
            //formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        },]
    },

    // buttons: [{
    //     text: '确定',
    //     listeners: {
    //         click: 'onLoginClick'
    //     }
    // }],

    listeners: {
        afterRender: function(thisForm, options){
            var me = this
            this.keyNav = Ext.create('Ext.util.KeyMap',{
                target: me.getEl(),
                binding: [{
                    key: 13,
                    fn: function (key, ev) {
                        var btn_ok = me.down('button');
                        btn_ok.fireEvent('click',btn_ok);
                        ev.stopEvent();
                    }
                }],
               scope: this
            });
            /*this.keyNav = Ext.create('Ext.util.KeyNav', 'doLogin', {
                enter: function(key, ev) {
                	var btn_ok = this.down('button');
                	btn_ok.fireEvent('click',btn_ok);
                    ev.stopEvent();
                },
                scope: this
            });*/
        }
    },
});
