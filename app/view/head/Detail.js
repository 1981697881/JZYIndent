Ext.define('JZYIndent.view.head.Detail', {
    alias: 'widget.DForm',
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.*',
        'Ext.button.Button',
        'Ext.grid.*',
        'Ext.form.field.Date',
        'Ext.util.*',
        'Ext.layout.container.HBox',
    ],
    plain: true,
    id: 'aHeader',
    tbar: ['->', {
        icon: "resources/images/icons/fam/add.png",
        text: '新增(shift+A)',
        handler: function () {
            var form = this.up('form').getForm(),
                first = this.up('doMain').down("firstlist"),
                gird = this.up('doMain').down("secondlist"),
                sStore = gird.getStore();
            sStore.removeAll();
            first.getStore().load();
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/base/getBillNo',
                method: 'post',
                scope: this,
                async: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    TranType: "70"
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    var data = respText.data;
                    form.findField('FBillNo').setValue(data.billNo)
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {

                },
            });
        }
    }, '-', {
        icon: "resources/images/icons/fam/accept.png",
        text: '保存单据(shift+S)',
        handler: function () {
            var form = this.up('form').getForm(),
                gird = this.up('doMain').down("secondlist"),
                first = this.up('doMain').down("firstlist"),
                sStore = gird.getStore();
            if (!form.isValid()) {
                return false;
            } else {
                var params = form.getValues(),
                    array = [];
                for (var j = 0; j < sStore.getCount(); j++) {
                    if(sStore.getAt(j).get("Fdate") != null ){
                        sStore.getAt(j).set("Fdate", Ext.Date.format(sStore.getAt(j).get("Fdate"), "Y-m-d"));
                    }
                    array.push(sStore.getAt(j).data)
                }
                console.log(array)
                params.item = array
                params.FEmpID = Ext.util.Cookies.get("FEmpID")
                params.fsupplyid = Ext.util.Cookies.get("FEmpNumber")
                params.FTranType = "70"
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/base/SEOrderAdd',
                    method: 'POST',
                    scope: this,
                    async: false,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.JSON.encode(params),
                    withCredentials: true,
                    success: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        if(respText.success){
                            Ext.toast({
                                title: '提示',
                                html: respText.message + ",销售订单：" + respText.data[0].OutFBillNo,
                                align: 't',
                                bodyPadding: 10
                            });
                            sStore.removeAll();
                            first.getStore().load();
                            Ext.Ajax.request({
                                url: JZYIndent.Cfg.server + '/base/getBillNo',
                                method: 'post',
                                scope: this,
                                async: false,
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                params: Ext.JSON.encode({
                                    TranType: "70"
                                }),
                                success: function (results) {
                                    form.findField('FBillNo').setValue(Ext.util.JSON.decode(results.responseText).data.billNo)
                                },
                                failure: function () {
                                    Ext.Msg.alert("提示", "请求失败！");
                                },
                                callback: function (opts, success, response) {

                                },
                            });
                        }else{
                            Ext.toast({
                                title: '提示',
                                html: respText.message,
                                align: 't',
                                bodyPadding: 10
                            });
                        }
                    },
                    failure: function () {
                        Ext.Msg.alert("提示", "保存失败！");
                    }
                });
            }
        }
    }, '-', {
        icon: "resources/images/icons/fam/cross.gif",
        text: '退出(ESC)',
        handler: function () {
            var _this = new JZYIndent.LoginManager({
                session: null,
                model: 'User'
            });
            console.log()
            Ext.MessageBox.confirm('确认注销', '确定注销吗?注销后返回登录页', function (btn, text) {
                if (btn != 'yes') {
                    return false;
                }
                _this.logout();
            });
        }
    }, '-',],
    modal: 'true',
    items: [{
        flex: 2,
        autoScroll: true, //自动创建滚动条
        xtype: 'form',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%',
        },
        fieldDefaults: {
            labelWidth: 80,
            labelAlign: "right",
            flex: 1,
            margin: 1
        },
        buttonAlign: 'center',
        items: [{
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    fieldLabel: '单据日期',
                    allowBlank: false,
                    xtype: 'datefield',
                    name: 'Fdate',
                    //allowBlank: true,
                    format: 'Y-m-d',
                    value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d"),
                    blankText: '不能为空(必填)',
                },
                {
                    fieldLabel: '到货日期',
                    xtype: 'datefield',
                    name: 'arrivalDate',
                    //allowBlank: true,
                    format: 'Y-m-d',
                    value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d"),
                    listeners: {
                        change: function (fld, newValue, oldValue, eOpts) {
                            var me = this,
                                gird = this.up('doMain').down("secondlist"),
                                sStore = gird.getStore();
                            if (newValue != oldValue) {
                                for (var i = 0; i < sStore.getCount() ; i++) {
                                    sStore.getAt(i).set("Fdate", newValue);
                                }
                            }
                        },
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '供应商',
                    allowBlank: false,
                    blankText: '不能为空(必填)',
                    name: 'fsupplyname',
                    readOnly: true,
                    listeners: {
                        afterRender: function (field) {
                            field.setValue(Ext.util.Cookies.get("FEmpName"))
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '单据编号',
                    allowBlank: false,
                    blankText: '不能为空(必填)',
                    name: 'FBillNo',
                    readOnly: true,
                    listeners: {
                        afterRender: function (field) {
                            Ext.Ajax.request({
                                url: JZYIndent.Cfg.server + '/base/getBillNo',
                                method: 'post',
                                scope: this,
                                async: false,
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                params: Ext.JSON.encode({
                                    TranType: "70"
                                }),
                                success: function (result) {
                                    var respText = Ext.util.JSON.decode(result.responseText);
                                    var data = respText.data;
                                    field.setValue(data.billNo)
                                },
                                failure: function () {
                                    Ext.Msg.alert("提示", "请求失败！");
                                },
                                callback: function (opts, success, response) {

                                },
                            });

                        }
                    }
                },

            ]
        }]
    },
    ]
});
