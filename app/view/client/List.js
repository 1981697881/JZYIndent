Ext.define('JZYIndent.view.client.List', {
    extend: 'JZYIndent.view.PageList',
    alias: 'widget.clientlist',
    columnLines: true,
    viewModel: {
        type: 'clientlist',
    },
    listeners: {
        itemdblclick: 'onDblClick',
        // render : function() {
        //     //console.log(this.getStore())
        //     var grid = this.up("clientlist");
        //     var rstore = grid.store;
        //     //if (newValue != oldValue) {
        //         var new_params = {
        //             type:  "",
        //         };
        //         Ext.apply(rstore.proxy.extraParams, new_params);
        //         rstore.loadPage(1, {
        //             params: {
        //                 start: 0,
        //                 pageNum: 1,
        //             }
        //         })
        //         rstore.reload();
        //    // }
        // }
    },
    loadMask: true,
    tbar: ['-', {
        xtype: 'combo',
        fieldLabel: '客户类型',
        labelWidth: 60,
        //allowBlank: true,
        triggerAction: 'all',
        emptyText: '请选择',
        queryParam: 'kw',
        name: 'type',
        editable: false,
        valueField: 'id',
        store: JZYIndent.Cfg.getExtraParamsStore('dict/general/generalFormat.do', 'type', "", "", {
            dictType: '客户类型',
            tableType: '客户表'
        }),
        displayField: 'name',
        publishes: ['value'],
        listeners: {
            change: function (fld, newValue, oldValue, eOpts) {
                var grid = this.up("clientlist");
                var rstore = grid.getStore();
                if (newValue != oldValue) {
                    var new_params = {
                        type: newValue + "",
                    };
                    Ext.apply(rstore.proxy.extraParams, new_params);
                    rstore.loadPage(1, {
                        params: {
                            start: 0,
                            pageNum: 1,
                        }
                    })
                    rstore.reload();
                }
            },
            // afterRender : function(combo) {
            //     combo.getStore().load();
            // }

        }

    }, '-', {
        xtype: 'fieldcontainer',
        fieldLabel: '快速查找',
        labelWidth: 60,
        layout: 'hbox',
        items: [{
            xtype: 'textfield',
            name: 'keyWord',
            queryMode: 'local',
            hideLabel: true,
            width: 100,
            allowBlank: false,
            forceSelection: true,
        }, {
            xtype: "button",
            text: "查询",
            width: 50,
            margin: '-1 0 0 0',
            handler: function () {
                var grid = this.up("clientlist"),
                    keyWord = this.up("clientlist").query("textfield[name=keyWord]")[0],
                    rstore = grid.getStore();
                if (keyWord.getValue() != "") {
                    var new_params = {
                        keyWord: keyWord.getValue() + "",
                    };
                    Ext.apply(rstore.proxy.extraParams, new_params);
                    rstore.loadPage(1, {
                        params: {
                            start: 0,
                            pageNum: 1,
                        }
                    })
                    rstore.reload();
                }
            }
        }],

    },'-',{
        text: '注销微信',
        hidden: true,
        handler: function () {
            var grid = this.up("clientlist");
            var sm = grid.getSelectionModel();
            if (sm.hasSelection()) {
                Ext.MessageBox.confirm('确认删除', '您确定要删除选中项?',
                    function (btn, text) {
                        if (btn != 'yes')
                            return false;
                        // 组织参数
                        var record = sm.getSelection()[0];
                        Ext.Ajax.request({
                            url: JZYIndent.Cfg.server + '/base/cus/logoutWeiXinUser.do',
                            method: 'POST',
                            scope: this,
                            withCredentials: true,
                            //headers: {'Content-Type': 'application/json'},
                            params: {
                                openid: record.data["openid"]
                            },
                            success: function (result) {
                                grid.getSelectionModel().deselectAll();
                                var respText = Ext.util.JSON.decode(result.responseText);
                                Ext.toast({
                                    title: '提示',
                                    html: respText.msg,
                                    align: 't',
                                    bodyPadding: 10
                                });
                                grid.getStore().reload();
                            },
                            failure: function (conn, response, options, eOpts) {

                            }
                        });

                    });
            } else {
                Ext.Msg.alert("提示", "注意：无选中数据！");
            }
        },
    }, '-', {
        text: '刷新',
        hidden:true,
        handler: function () {
            var grid = this.up("clientlist"),
                keyWord = this.up("clientlist").query("textfield[name=keyWord]")[0],
                combo = this.up("clientlist").query("combo[name=type]")[0],
                store = grid.getStore();
            keyWord.reset();
            combo.reset();
            var new_params = {
                keyWord: '',
                type: '',
            };
            Ext.apply(store.proxy.extraParams, new_params);
            store.loadPage(1, {
                params: {
                    start: 0,
                    pageNum: 1,
                }
            })
            store.reload();
        },
    }, '-', {
        text: '导入', idx: '', handler: function () {
            this.window = new JZYIndent.view.window.uploadWindow({
                autoShow: true,
                url: 'excel/import/importCustomer.do',
            });
            var form = this.window.down("form").getForm();
            form.findField("url").setValue(form.findField("url").getStore().getAt(3))
        }
    }, '-',{
        text: '导出',
        hidden:true,
        handler: function () {
            var grid = this.up("clientlist");
            var data = [];
            for (var i = 0; i < grid.getStore().getCount(); i++) {
                var obj = grid.getStore().getAt(i).data;
                data.push(obj)
            }
            console.log()
            var jsonObj = JSON.stringify({data: data})
            console.log(jsonObj)
            if (!Ext.fly('frmClient')) {
                var frm = document.createElement('form');
                frm.id = 'frmClient';
                frm.name = id;
                frm.className = 'x-hidden';
                document.body.appendChild(frm);
            }
            Ext.Ajax.request({
                //将生成的xml发送到服务器端,需特别注意这个页面的地址
                url: JZYIndent.Cfg.server + "/excel/export/exportCustomer.do",
                method: 'POST',
                form: Ext.fly('frmClient'),
                callback: function (o, s, r) {
                    //alert(r.responseText);
                },
                isUpload: true,
                params: {data: jsonObj}
            });
        },
    }, "-", {
        text: '新增',
        hidden:true,
        handler: 'onNew',
    }, "-",
    ],
    columns: [{
        xtype: "rownumberer",
        text: "序号",
        width: 40,
        align: 'center',
    },
        {
            text: '',
            dataIndex: 'fid',
            align: 'center',
            hideable: false,
            hidden: true,
        },
        {
            text: '',
            dataIndex: 'CId',
            align: 'center',
            hideable: false,
            hidden: true,
        },
        {
            text: '客户类别',
            dataIndex: 'type',
            align: 'center',
            hidden: true,
            hideable: false,
            filter: 'string'
        },
        {
            text: '客户类别',
            dataIndex: 'typeName',
            align: 'center',
            filter: 'string'
        },
        {
            text: '客户名称',
            dataIndex: 'name',
            align: 'center',
            filter: 'string'
        },{
            text: '身份证号',
            dataIndex: 'idCard',
            align: 'center',
            filter: 'string'
        },
        {
            text: '联系地址',
            dataIndex: 'address',
            align: 'center',
            filter: 'string'
        },
        {
            text: '联系人',
            dataIndex: 'contact',
            align: 'center',
            filter: 'string'
        },
        {
            text: '联系电话',
            dataIndex: 'phone',
            align: 'center',
            filter: 'string'
        },
        {
            text: '是否黑名单',
            dataIndex: 'isBlack',
            align: 'center',
            filter: 'string',
            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                if (value == "1") {
                    return "是"
                } else if (value == "2") {
                    return "否"
                }
            }
        },
        {
            text: '客户编号',
            dataIndex: 'code',
            align: 'center',
            filter: 'string'
        },

        {
            text: '企业性质',
            dataIndex: 'nature',
            align: 'center',
            filter: 'string'
        },
        {
            text: '注册资本',
            align: 'center',
            dataIndex: 'capital',
            filter: 'number'
        },
        {
            text: '统一社会信用代码',
            dataIndex: 'creditCode',
            align: 'center',
            filter: 'string'
        }, {
            text: '税务识别号',
            dataIndex: 'taxNo',
            align: 'center',
            filter: 'string'
        },  {
            text: '手机号码',
            dataIndex: 'mobPhone',
            align: 'center',
            filter: 'string'
        }, {
            text: '传真号码',
            dataIndex: 'faxNo',
            align: 'center',
            filter: 'string'
        }, {
            text: '电子邮箱',
            dataIndex: 'email',
            align: 'center',
            filter: 'string'
        }, {
            text: '开户银行',
            dataIndex: 'bank',
            align: 'center',
            filter: 'string'
        }, {
            text: '银行账号',
            dataIndex: 'bankNo',
            align: 'center',
            filter: 'string'
        }, {
            text: '经营业态',
            dataIndex: 'status',
            align: 'center',
            filter: 'string'
        }, {
            text: '招牌名称',
            dataIndex: 'signatureName',
            align: 'center',
            filter: 'string'
        }, {
            text: '品牌名称',
            dataIndex: 'brandName',
            align: 'center',
            filter: 'string'
        }, {
            text: '品牌级别',
            dataIndex: 'brandType',
            align: 'center',
            filter: 'string'
        }, {
            text: '附加说明',
            dataIndex: 'remark',
            align: 'center',
            filter: 'string'
        },{
            text: '是否绑定微信',
            dataIndex: 'isBinding',
            align: 'center',
            filter: 'string'
        }
    ],
    // onDestroy: function () {
    //     // do some cleanup
    //     var me = this;
    //     if (me.sel_win) {
    //         //this.sel_win.destroy();
    //         Ext.destroy(me.sel_win);
    //         me.sel_win = null;
    //     }
    //     me.callParent();
    // }
});
