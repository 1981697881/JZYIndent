Ext.define('JZYIndent.view.head.CDetail', {
    alias: 'widget.CDForm',
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
    id: 'aHeaderC',
    tbar: ['->', {
        icon: "resources/images/icons/fam/add.png",
        text: '新增(shift+A)',
        handler: function () {
            var form = this.up('form').getForm(),
                first = this.up('doMain').down("firstlist"),
                gird = this.up('doMain').down("secondlist"),
                sStore = gird.getStore();
            form.reset()
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
                    TranType: "81"
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
                sStore = gird.getStore();
            if (!form.isValid()) {
                return false;
            } else {
                var params = form.getValues(),
                    array = [];
                console.log(gird.getStore())
                for (var j = 0; j < sStore.getCount(); j++) {
                    array.push(sStore.getAt(j).data)
                }
                params.item = array
                params.FEmpID = Ext.util.Cookies.get("FUserID")
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
                        console.log(respText)
                        Ext.toast({
                            title: '提示',
                            html: respText.message + ",销售订单：" + respText.data[0].OutFBillNo,
                            align: 't',
                            bodyPadding: 10
                        });
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
                    fieldLabel: '购货单位',
                    allowBlank: false,
                    blankText: '不能为空(必填)',
                    name: 'FCustID',
                    xtype: 'combobox',
                    triggerAction: 'all',
                    //editable: false,
                    emptyText: '请选择',
                    valueField: 'FNumber',
                    queryParam: 'kw',
                    displayField: 'FName',
                    store: JZYIndent.Cfg.getDistinctStore('order/custList', 'FCustID'),
                    listeners: {
                        change: function (fld, newValue, oldValue, eOpts) {
                            var dValue,
                                me = this;
                            fld.getStore().each(function (r, index) {
                                if (r.data[fld.valueField] == newValue) {
                                    console.log(r.data)
                                    me.up("form").getForm().findField("FCustClassify").setValue(r.data['FCustName'])
                                    me.up("form").getForm().findField("FReceiver").setValue(r.data['FContact'])
                                    me.up("form").getForm().findField("FPhone").setValue(r.data['FPhone'])
                                    me.up("form").getForm().findField("FShippingAddress").setValue(r.data['FAddress'])
                                    var reg = /.+?(省|市|自治区|自治州|县|区)/g;
                                    var add = r.data['FAddress']==undefined?'':r.data['FAddress'];
                                    me.up("form").getForm().findField("FDistrict").setValue(add.match(reg)!=null?add.match(reg).join('-'):'')
                                    //me.up("form").getForm().findField("FCustCode").setValue(r.data['FNumber'])
                                    //me.up("form").getForm().findField("FCustAddress").setValue(r.data['FAddress'])
                                    me.up("form").getForm().findField("FExplanation").setValue(r.data['FCustNote'])
                                    dValue = r.data[fld.displayField];
                                }
                            });
                            return dValue;
                        },
                        afterRender: function (combo) {
                            combo.getStore().load();
                        },
                        'beforequery': function (e) {
                            var combo = e.combo;
                            combo.getStore().clearFilter();
                            console.log(combo.store.data)
                            if (!e.forceAll) {
                                console.log(1)
                                var input = e.query;
                                // 检索的正则
                                var regExp = new RegExp(".*" + input + ".*");
                                // 执行检索
                                combo.store.filterBy(function (record, id) {
                                    // 得到每个record的项目名称值
                                    var text = record.get(combo.displayField);
                                    // console.log(regExp.test(text))
                                    return regExp.test(text);
                                });
                                combo.expand();
                                return false;
                            }
                        },
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
                                    TranType: "81"
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
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: '收货人',
                    allowBlank: false,
                    blankText: '不能为空(必填)',
                    name: 'FReceiver',
                }, {
                    xtype: 'textfield',
                    fieldLabel: '收货电话',
                    blankText: '不能为空(必填)',
                    allowBlank: false,
                    name: 'FPhone',
                },
                {
                    fieldLabel: '销售方式',
                    allowBlank: false,
                    blankText: '不能为空(必填)',
                    name: 'FSaleStyle',
                    xtype: 'combobox',
                    triggerAction: 'all',
                    editable: false,
                    emptyText: '请选择',
                    valueField: 'FItemID',
                    queryParam: 'kw',
                    displayField: 'FName',
                    store: JZYIndent.Cfg.getDistinctStore('order/saleWay', 'FSaleStyle'),
                    listeners: {
                        afterRender: function (combo) {
                            combo.getStore().load();
                        }
                    }

                },

            ]
        },  {
            xtype: 'container',
            layout: 'hbox',
            items: [

                {
                    xtype: 'textfield',
                    fieldLabel: '买家备注',
                    blankText: '不能为空(必填)',
                    name: 'FExplanation',
                },

            ]
        },]
    },
    ]
});
