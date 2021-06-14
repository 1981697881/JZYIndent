Ext.define('JZYIndent.view.client.Detail', {
    extend: 'JZYIndent.view.Detail',
    alias: 'widget.clientdetail',
    requires: [ 'Ext.form.field.Tag'],
    tbar: ['->',
        // {
//  	text:'>>>显示更多',
//  	handler:'onMore'
        //},
        {
            text: '上一条',
            handler: 'onPrev',
            bind: {
                hidden: '{!showprev}'
            }
        }, {
            text: '下一条',
            handler: 'onNext',
            bind: {
                hidden: '{!shownext}'
            }
        }, {
            text: '保存',
            handler: 'onSaveClick',
            idx:'clientlist',
            iurl: 'base/cus/saveCustomer.do',
            bind: {
                hidden: '{!showsave}'
            }
        }, {
            text: '返回',
            handler: 'onBackClick',
            idx:'clientlist',
            bind: {
                hidden: '{!showreturn}'
            }
        }],
    width: 800,
    uGrid:"clientlist",
    uTree:"",
    componentCls: 'client-detail',
    controller: 'detail',
    items: [{
        xtype: 'Tab',
        tbar: null,
        autoScroll: true,
        // listeners: {
        //     //进入页面执行事件设置高度和宽度
        //     'render': function () {
        //         this.setHeight(parseFloat(this.up("window").maxHeight) - 100);
        //     },
        // },
        items: [{
                margin: '0 0 10 0',
                reference: 'form',
                bodyPadding: 10,
                fieldDefaults: {
                    labelAlign: 'right',
                    labelWidth: 120,
                    padding: 3
                },
                defaults: {
                    anchor: '100%'
                },
                title: "基本信息",
                name:'clientdetail',
                xtype: 'form',
                items: [
                    {
                    xtype: 'container',
                    layout: 'hbox',
                        //hidden:true,
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: [{
                        flex: 1,
                        xtype: 'textfield',
                        name:'fid',
                        hidden:true,
                        fieldLabel: 'fid',
                        bind: '{theObj.fid}',
                        publishes: ['value'],
                        listeners: {
                            change: function (fld, newValue, oldValue, eOpts) {
                                //当下拉框选择改变的时候，也就是原值不等于新值时
                                if (newValue != oldValue) {
                                    var grid = this.up("clientdetail").query('grid[name="auxiliary"]')[0],
                                        reStore=grid.getStore();
                                    var new_params = {customerId: newValue};
                                    //console.log(new_params)
                                    Ext.apply(reStore.proxy.extraParams, new_params);
                                    reStore.reload();
                                }
                            },
                            afterRender: function (combo) {
                                var grid = this.up("clientdetail").query('grid[name="auxiliary"]')[0],
                                    reStore=grid.getStore();
                                reStore.removeAll();
                            }
                        }
                    }]
                },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        //hidden:true,
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [{
                            xtype: 'container',
                            layout: 'hbox',
                            flex: 1,
                            combineErrors: true,
                            defaultType: 'textfield',
                            items: [
                                {
                                    flex: 1,
                                    fieldLabel: '客户类别',
                                    xtype: 'combobox',
                                    name: 'type',
                                    triggerAction: 'all',
                                    //typeAhead: true,
                                    editable: false,
                                    emptyText: '请选择',
                                    queryParam: 'kw',
                                    valueField: 'id',
                                    displayField: 'name',
                                    store: JZYIndent.Cfg.getExtraParamsStore('dict/general/generalFormat.do', 'type', "", "", {
                                        dictType: '客户类型',
                                        tableType: '客户表'
                                    }),
                                    //allowBlank: false,
                                    bind: '{theObj.type}',
                                    listeners: {
                                        change: function (fld, newValue, oldValue, eOpts) {
                                            var dValue;
                                            fld.getStore().each(function (r, index) {
                                                if (r.data[fld.valueField] == newValue) {
                                                    dValue = r.data[fld.displayField];
                                                }
                                            });
                                            return dValue;
                                        },
                                        afterRender: function (combo) {
                                            combo.getStore().load();
                                        }
                                    }
                                }, {
                                    xtype: "button",
                                    width: 30,
                                    icon: "resources/images/icons/fam/cog_edit.png",
                                    style: {
                                        "margin-top": "2px",
                                    },
                                    handler: function () {
                                        this.window = new JZYIndent.view.window.CustomerProfileWin({
                                            autoShow: true,
                                        });
                                    }
                                }
                            ]
                        },
                            //     {
                            //     flex: 1,
                            //     fieldLabel: "租户类型",
                            //     xtype: 'radiogroup',
                            //     // Arrange radio buttons into two columns, distributed vertically
                            //     columns: 2,
                            //     vertical: true,
                            //     //bind: '{theObj.isBlack}',
                            //     value: '{theObj.isLessee}',
                            //     items: [{
                            //         boxLabel: '机构',
                            //         name: 'isLessee',
                            //         padding: "-1 0 0 0",
                            //         inputValue: '1'
                            //     },
                            //         {
                            //             boxLabel: '个人',
                            //             name: 'isLessee',
                            //             padding: "-1 0 0 0",
                            //             inputValue: '2',
                            //             checked: true
                            //         },
                            //     ],
                            // }
                            //     {
                            //     flex: 1,
                            //     fieldLabel: "加入黑名单",
                            //     xtype: 'radiogroup',
                            //     // Arrange radio buttons into two columns, distributed vertically
                            //     columns: 2,
                            //     vertical: true,
                            //     //bind: '{theObj.isBlack}',
                            //     value:'{theObj.isBlack}',
                            //     items: [{
                            //         boxLabel: '是',
                            //         name: 'isBlack',
                            //         padding:"-1 0 0 0",
                            //         inputValue: '1'
                            //     },
                            //         {
                            //             boxLabel: '否',
                            //             name: 'isBlack',
                            //             padding:"-1 0 0 0",
                            //             inputValue: '2',
                            //             checked: true
                            //         },
                            //     ],
                            //
                            // }
                        ]
                    },

                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'code',
                                fieldLabel: '客户编号',
                                bind: '{theObj.code}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'name',
                                fieldLabel: '客户名称',
                                allowBlank: false,
                                bind: '{theObj.name}',
                                publishes: ['value']
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name: 'idCard',
                                fieldLabel: '身份证号',
                                bind: '{theObj.idCard}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name: 'contact',
                                fieldLabel: '联系人',
                                bind: '{theObj.contact}',
                                publishes: ['value']
                            },

                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                fieldLabel: '企业性质',
                                flex: 1,
                                //xtype: 'combobox',
                                name: 'nature',
                                //triggerAction: 'all',
                                //typeAhead: true,
                                // editable:false,
                                //readOnly:true,
                                // emptyText: '请选择',
                                // queryParam: 'kw',
                                // valueField: 'id',
                                // displayField: 'name',
                                ////store: JZYIndent.Cfg.getDistinctStore('com.cl.entity.Relic', 'nature'),
                                allowBlank: true,
                                bind: '{theObj.nature}',
                            }, {
                                flex: 1,
                                xtype: 'textfield',
                                fieldLabel: '注册资本',
                                name:'capital',
                                bind: '{theObj.capital}',
                                publishes: ['value']
                            },

                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                fieldLabel: '企业法人',
                                name: 'legalPerson',
                                bind: '{theObj.legalPerson}',
                                publishes: ['value']
                            },

                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'creditCode',
                                fieldLabel: '统一社会信用代码',
                                bind: '{theObj.creditCode}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'taxNo',
                                fieldLabel: '税务识别号',
                                bind: '{theObj.taxNo}',
                                publishes: ['value']
                            }

                        ]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'phone',
                                fieldLabel: '联系电话',
                                allowBlank: false,
                                bind: '{theObj.phone}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                fieldLabel: '手机号码',
                                name:'mobPhone',
                                bind: '{theObj.mobPhone}',
                                publishes: ['value']
                            }

                        ]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'numberfield',
                                name:'faxNo',
                                fieldLabel: '传真号码',
                                bind: '{theObj.faxNo}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'email',
                                fieldLabel: '电子邮箱',
                                bind: '{theObj.email}',
                                publishes: ['value']
                            }

                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'combobox',
                                triggerAction:'all',
                                typeAhead :true,
                                minChars:1,
                                emptyText :'请选择',
                                queryParam : 'kw',
                                name:'bank',
                               // id:'bank',
                                valueField: 'text',
                                displayField: 'value',
                                store: JZYIndent.Cfg.bData(JZYIndent.Cfg.banklist),
                                fieldLabel: '开户银行',
                                bind: '{theObj.bank}',
                                publishes: ['value'],
                                listeners: {
                                    change: function (fld, newValue, oldValue, eOpts) {
                                        var dValue;
                                        fld.getStore().each(function(r, index) {
                                        if(r.data[fld.valueField] == newValue) {
                                            console.log(r.data[fld.valueField]+","+newValue)
                                            dValue= r.data[fld.displayField];
                                        }
                                    });
                                    return dValue;
                                }
                                }
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'bankNo',
                                fieldLabel: '银行账号',
                                bind: '{theObj.bankNo}',
                                publishes: ['value']
                            }

                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                fieldLabel: '经营业态',
                                name:'status',
                                bind: '{theObj.status}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'signatureName',
                                fieldLabel: '招牌名称',
                                bind: '{theObj.signatureName}',
                                publishes: ['value']
                            }

                        ]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                xtype: 'numberfield',
                                name:'brandName',
                                fieldLabel: '品牌名称',
                                bind: '{theObj.brandName}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name:'brandType',
                                fieldLabel: '品牌级别',
                                bind: '{theObj.brandType}',
                                publishes: ['value']
                            }

                        ]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        combineErrors: true,
                        defaultType: 'textfield',
                        items: [
                            {
                                flex: 1,
                                name:'remark',
                                xtype: 'textfield',
                                fieldLabel: '附加说明',
                                bind: '{theObj.remark}',
                                publishes: ['value']
                            },
                            {
                                flex: 1,
                                name: 'address',
                                xtype: 'textfield',
                                fieldLabel: '联系地址',
                                bind: '{theObj.address}',
                                publishes: ['value']
                            },
                        ]
                    }
                ]
            },
            {
                fieldDefaults: {
                    labelAlign: 'right',
                    labelWidth: 120,
                    padding: 3
                },
                defaults: {
                    anchor: '100%'
                },
                title: "附属联系人",
                xtype: 'form',
                items: [{
                    xtype: 'auxiliaryList',
                    name: 'auxiliary',
                    height:360,
                    autoScroll: true,
                    //tbar: null,
                    bbar: ['->', {
                        text: '新增',
                        icon: "resources/images/icons/fam/add.gif",
                        handler: function () {
                            var grid = this.up("clientdetail").query('grid[name="auxiliary"]')[0],
                                form = this.up("clientdetail").query('form')[0].getForm(),
                                rec = {
                                    fid: '',
                                    customerId: form.findField("fid").getValue(),
                                    relation: '',
                                    name: '',
                                    phone: ''
                                };
                            grid.store.insert(0, rec);
                            //grid.findPlugin('cellediting').startEdit(rec, 0);
                        }
                    }, {
                        text: '删除',
                        icon: "resources/images/icons/fam/delete.gif",
                        handler: function () {
                            var grid = this.up("clientdetail").query('grid[name="auxiliary"]')[0],
                                sm = grid.getSelectionModel();
                            if (sm.hasSelection()) {
                                //grid选中行(获取选中行数据)
                                var record = sm.getSelection()[0];
                                Ext.Ajax.request({
                                    url: JZYIndent.Cfg.server + '/base/cus/deleteContactById.do',
                                    method: 'POST',
                                    scope: this,
                                    async: false,
                                    withCredentials: true,
                                    params: {
                                        fid: record.data["fid"]
                                    },
                                    success: function (result) {
                                        var respText = Ext.util.JSON.decode(result.responseText);
                                        console.log(respText)
                                        grid.getStore().reload();
                                        Ext.Msg.alert("提示", respText.msg);
                                    },
                                    failure: function (result) {
                                        var respText = Ext.util.JSON.decode(result.responseText);
                                        Ext.Msg.alert("提示", respText.msg);
                                    },
                                    callback: function (opts, success, response) {

                                    },
                                });
                            } else {
                                Ext.Msg.alert("提示", "注意：请选择行！");
                            }
                        }
                    }],
                }]
            }
        ]
    }]
});
