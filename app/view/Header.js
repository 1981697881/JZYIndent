Ext.define('JZYIndent.view.Header', {
    extend: 'Ext.Container',
    xtype: 'appHeader',
    id: 'app-header',
    height: 120,
    layout: {
        type: 'hbox',
        align: 'middle'
    },

    initComponent: function () {
        this.title = JZYIndent.Cfg.APP_NAME;
        document.title = this.title;
        this.items = [
            // {
            //     xtype: 'component',
            //     html: '<img src="resources/images/logo_mk.png"  style="display: inline-block; width: 65px; padding-left: 15px;height: 50px;">'
            // },
            {
                xtype: 'component',
                id: 'app-header-title',
                html: this.title,
                cls: '',
                style: "display: inline-block;font-family: 'Microsoft Yahei', Tahoma, Arial;padding-left: 15px;font-size: 18px;color: #ffffff;text-shadow: 2px 2px 2px #444;",
                flex: 1
            },{
                xtype: 'button',
                text:"服务",
                cls: 'wuye_mian_header_button',
                margin:'0 20 0 0',
                icon: "resources/images/icons/fam/control_rewind.png",
                glyph: null,
            }
            ,  {
                xtype: 'button',
                text:"消息",
                cls:'wuye_mian_header_button',
                margin:'0 20 0 0',
                icon: "resources/images/icons/fam/feed_error.png",
                glyph: null,
                handler:function () {
                   var contentPanel= Ext.ComponentQuery.query('contentPanel')[0];
                    console.log(contentPanel)
                   var window=contentPanel.down("window");
                   console.log(window)
                   window.show();
                }
            }
            , {
                xtype: 'splitbutton',
                name:'splitbutton',
                margin:'0 10 0 0',
                style:"border-style: none !important;",
                icon: "resources/images/icons/fam/user.gif",
                text: JZYIndent.Cfg.usrInfo.data.data["username"] || JZYIndent.Cfg.usrInfo.get('name'),
                cls: 'x-btn-text-icon-transparent',
                menu: {
                    items: [{
                        text: '注销'
                    },{
                        text: '修改密码',
                        handler:function () {
                            this.window = new JZYIndent.view.window.AlterPassword({
                                autoShow: true,
                            });
                            var form = this.window.down("form").getForm();
                            form.findField("fid").setValue(Ext.util.Cookies.get("fid"));
                            form.findField("name").setValue(JZYIndent.Cfg.usrInfo.data.data["username"] || JZYIndent.Cfg.usrInfo.get('name'));

                        }
                    }, {
                        text: '关于'
                    },
                        /*{
                        text: 'Print Label'
                    }*/
                    ]
                }
            }];
        this.callParent();
    }
});
