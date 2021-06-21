Ext.define('JZYIndent.view.main.Main', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Ext.layout.container.Border'

    ],
    controller: 'main',
    viewModel: 'main',
    layout: 'border',
    stateful: true,
    xtype: 'doMain',
    id: 'doMain',
    autoEl: {
        tag: 'div',
        tabindex: 0
    },
    stateId: 'kitchensink-viewport',

    initComponent: function () {
        var me = this;
        var within = [];
        var userType = Ext.util.Cookies.get("FUserType");
        console.log(userType)
        if (userType == 'P') {
            Ext.apply(me, {
                items: [
                    {
                        region: 'north',
                        height: '6%',
                        minSize: 75,
                        margins: '5 0 0 0',
                        xtype: 'DForm',
                    },
                    {
                        region: 'center',
                        xtype: 'firstlist',
                        reference: 'contentPanel',
                    },
                    {
                        region: 'south',
                        xtype: 'secondlist',
                        height: '30%',
                        minSize: 75,
                        margins: '5 0 0 0'
                    },
                    {
                        region: 'west',
                        xtype: 'thirdlist',
                        collapsible: false,
                        width: '35%',
                        minWidth: 100,
                        listeners: {
                            afterrender: function () {
                                closeLoading();
                                var me = this;
                                var doMain = me.up('doMain');
                            },

                            itemclick: function (view, rec) {
                                var grid = this.up("doMain").down("firstlist"),
                                    rstore = grid.getStore();
                                if (rec.data.FNumber != null) {
                                    var FNumber = rec.data.FNumber;
                                    var new_params = {
                                        prId: FNumber,
                                    };
                                    Ext.apply(rstore.proxy.extraParams, new_params);
                                }
                                rstore.loadPage(1, {
                                    params: {
                                        start: 0,
                                        pageNum: 1,
                                    }
                                });
                                //rstore.reload();
                            },
                        }
                    }, {

                        xtype: 'navigation-tree',
                    }],
                listeners: {
                    afterRender: function (thisForm, options) {
                        var me = this;
                        this.keyNav = Ext.create('Ext.util.KeyMap', {
                            target: me.getEl(),
                            binding: [{
                                key: 117,
                                fn: function (key, ev) {
                                    var grid = me.down("firstlist"),
                                        sgrid = me.down("secondlist"),
                                        rstore = grid.getStore(),
                                        nstore = sgrid.getStore(),
                                        array = [];
                                    var count = 0;
                                    for (var i = 0; i < rstore.getCount(); i++) {
                                        var number = 0;
                                        if (rstore.getAt(i).data['realQuantity'] > 0) {
                                            count = i;
                                            // array.push(grid_data);
                                            for (var j = 0; j < nstore.getCount(); j++) {
                                                console.log(parseInt(rstore.getAt(i).data['realQuantity']) + "," + parseInt(nstore.getAt(j).data["Fauxqty"]))
                                                if (rstore.getAt(i).data.FNumber == nstore.getAt(j).data.FNumber) {
                                                    nstore.getAt(j).set('Fauxqty', parseInt(rstore.getAt(i).data.realQuantity) + parseInt(nstore.getAt(j).data.Fauxqty));
                                                    nstore.getAt(j).set('Famount', Math.round((parseFloat(nstore.getAt(j).get('Fauxqty')) * parseFloat(nstore.getAt(j).get('Fauxprice'))) * 100) / 100);
                                                    number++;
                                                    break;
                                                }
                                            }
                                            if (number == 0) {
                                                //查询窗口插入数据
                                                rstore.getAt(i).set('Fauxqty', rstore.getAt(i).data.realQuantity);
                                                rstore.getAt(i).set('Fauxprice', rstore.getAt(i).data.FSalePrice);
                                                rstore.getAt(i).set('FEntryID', nstore.getCount() + 1);
                                                rstore.getAt(i).set('Famount', Math.round((parseFloat(rstore.getAt(i).data.realQuantity) * parseFloat(rstore.getAt(i).data.FSalePrice)) * 100) / 100);
                                                sgrid.getStore().insert(nstore.getCount() + 1, rstore.getAt(i).data);
                                            }
                                            grid.down('displayfield[name="subtotal"]').setValue(0)
                                            rstore.getAt(i).set('realQuantity', '')
                                        }
                                    }
                                    if (count > 0) {
                                        grid.getSelectionModel().select(count + 1, true);
                                    }

                                }
                            },
                                {
                                    key: 27,
                                    fn: function (key, ev) {
                                        var _this = new JZYIndent.LoginManager({
                                            session: null,
                                            model: 'User'
                                        });
                                        Ext.MessageBox.confirm('确认注销', '确定注销吗?注销后返回登录页', function (btn, text) {
                                            if (btn != 'yes') {
                                                return false;
                                            }
                                            _this.logout();
                                        });
                                    }
                                }, {
                                    key: 13,
                                    fn: function (key, ev) {
                                        var grid = me.down("thirdlist"),
                                            fgrid = me.down("firstlist"),
                                            name = me.down("thirdlist").query("textfield[name=name]")[0],
                                            rstore = grid.getStore(),
                                            fstore = fgrid.getStore();
                                        var new_params = {
                                            name: name.getValue() + "",
                                        };
                                        Ext.apply(rstore.proxy.extraParams, new_params);
                                        rstore.loadPage(1, {
                                            params: {
                                                start: 0,
                                                pageNum: 1,
                                            },
                                            callback: function (records, operation, success) {
                                                if (success) {
                                                    for (var i = 0; i < rstore.getCount(); i++) {
                                                        console.log(rstore.getAt(i).data.FNumber)
                                                        var new_fparams = {
                                                            prId: rstore.getAt(i).data.FNumber,
                                                        };
                                                        Ext.apply(fstore.proxy.extraParams, new_fparams);
                                                        fstore.loadPage(1, {
                                                            params: {
                                                                start: 0,
                                                                pageNum: 1,
                                                            },
                                                            callback: function (records, operation, success) {
                                                                if (success) {
                                                                    fgrid.focus();
                                                                    fgrid.getSelectionModel().select(0, true);
                                                                }
                                                            }
                                                        });
                                                        break;
                                                    }
                                                }
                                            }
                                        })

                                    }
                                }, {
                                    key: 83,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var form = me.down('DForm').getForm(),
                                            gird = me.down("secondlist"),
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
                                }, {
                                    key: 83,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var form = me.down('DForm').getForm(),
                                            gird = me.down("secondlist"),
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
                                }, {
                                    key: 88,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var grid = me.down("secondlist"),
                                            sm = grid.getSelectionModel();
                                        if (sm.hasSelection()) {
                                            Ext.Msg.confirm('确认删除', '您确定要删除选中项?', function (btn, text) {
                                                if (btn != 'yes') {
                                                    return false;
                                                }
                                                var record = sm.getSelection();
                                                for (var i = 0; i < record.length; i++) {
                                                    grid.getStore().remove(record[i])
                                                }
                                            });
                                        } else {
                                            Ext.Msg.alert("提示", "注意：无选中数据！");
                                        }
                                    }
                                }
                            ],
                            scope: this
                        });
                    }
                }
            });
        } else if (userType == 'C') {
            Ext.apply(me, {
                items: [
                    {
                        region: 'north',
                        height: '11%',
                        minSize: 75,
                        margins: '5 0 0 0',
                        xtype: 'CDForm',
                    },
                    {
                        region: 'center',
                        xtype: 'cfirstlist',
                        reference: 'contentPanel',
                    },
                    {
                        region: 'south',
                        xtype: 'csecondlist',
                        height: '30%',
                        minSize: 75,
                        margins: '5 0 0 0'
                    },
                    {
                        region: 'west',
                        xtype: 'thirdlist',
                        collapsible: false,
                        width: '35%',
                        minWidth: 100,
                        listeners: {
                            afterrender: function () {
                                closeLoading();
                                var me = this;
                                var doMain = me.up('doMain');
                            },

                            itemclick: function (view, rec) {
                                var grid = this.up("doMain").down("cfirstlist"),
                                    rstore = grid.getStore();
                                if (rec.data.FNumber != null) {
                                    var FNumber = rec.data.FNumber;
                                    var new_params = {
                                        prId: FNumber,
                                    };
                                    Ext.apply(rstore.proxy.extraParams, new_params);
                                }
                                rstore.loadPage(1, {
                                    params: {
                                        start: 0,
                                        pageNum: 1,
                                    }
                                });
                                //rstore.reload();
                            },
                        }
                    }, {

                        xtype: 'navigation-tree',
                    }],
                listeners: {
                    afterRender: function (thisForm, options) {
                        var me = this;
                        this.keyNav = Ext.create('Ext.util.KeyMap', {
                            target: me.getEl(),
                            binding: [{
                                key: 117,
                                fn: function (key, ev) {
                                    var grid = me.down("cfirstlist"),
                                        sgrid = me.down("csecondlist"),
                                        rstore = grid.getStore(),
                                        nstore = sgrid.getStore(),
                                        array = [];
                                    var count = 0;
                                    for (var i = 0; i < rstore.getCount(); i++) {
                                        var number = 0;
                                        if (rstore.getAt(i).data['realQuantity'] > 0) {
                                            count = i;
                                            // array.push(grid_data);
                                            for (var j = 0; j < nstore.getCount(); j++) {
                                                console.log(parseInt(rstore.getAt(i).data['realQuantity']) + "," + parseInt(nstore.getAt(j).data["Fauxqty"]))
                                                if (rstore.getAt(i).data.FNumber == nstore.getAt(j).data.FNumber) {
                                                    nstore.getAt(j).set('Fauxqty', parseInt(rstore.getAt(i).data.realQuantity) + parseInt(nstore.getAt(j).data.Fauxqty));
                                                    nstore.getAt(j).set('Famount', Math.round((parseFloat(nstore.getAt(j).get('Fauxqty')) * parseFloat(nstore.getAt(j).get('Fauxprice'))) * 100) / 100);
                                                    number++;
                                                    break;
                                                }
                                            }
                                            if (number == 0) {
                                                //查询窗口插入数据
                                                rstore.getAt(i).set('Fauxqty', rstore.getAt(i).data.realQuantity);
                                                rstore.getAt(i).set('Fauxprice', rstore.getAt(i).data.FSalePrice);
                                                rstore.getAt(i).set('FEntryID', nstore.getCount() + 1);
                                                rstore.getAt(i).set('Famount', Math.round((parseFloat(rstore.getAt(i).data.realQuantity) * parseFloat(rstore.getAt(i).data.FSalePrice)) * 100) / 100);
                                                sgrid.getStore().insert(nstore.getCount() + 1, rstore.getAt(i).data);
                                            }
                                            grid.down('displayfield[name="subtotal"]').setValue(0)
                                            rstore.getAt(i).set('realQuantity', '')
                                        }
                                    }
                                    if (count > 0) {
                                        grid.getSelectionModel().select(count + 1, true);
                                    }

                                }
                            },
                                {
                                    key: 27,
                                    fn: function (key, ev) {
                                        var _this = new JZYIndent.LoginManager({
                                            session: null,
                                            model: 'User'
                                        });
                                        Ext.MessageBox.confirm('确认注销', '确定注销吗?注销后返回登录页', function (btn, text) {
                                            if (btn != 'yes') {
                                                return false;
                                            }
                                            _this.logout();
                                        });
                                    }
                                }, {
                                    key: 13,
                                    fn: function (key, ev) {
                                        var grid = me.down("thirdlist"),
                                            fgrid = me.down("cfirstlist"),
                                            name = me.down("thirdlist").query("textfield[name=name]")[0],
                                            rstore = grid.getStore(),
                                            fstore = fgrid.getStore();
                                        var new_params = {
                                            name: name.getValue() + "",
                                        };
                                        Ext.apply(rstore.proxy.extraParams, new_params);
                                        rstore.loadPage(1, {
                                            params: {
                                                start: 0,
                                                pageNum: 1,
                                            },
                                            callback: function (records, operation, success) {
                                                if (success) {
                                                    for (var i = 0; i < rstore.getCount(); i++) {
                                                        console.log(rstore.getAt(i).data.FNumber)
                                                        var new_fparams = {
                                                            prId: rstore.getAt(i).data.FNumber,
                                                        };
                                                        Ext.apply(fstore.proxy.extraParams, new_fparams);
                                                        fstore.loadPage(1, {
                                                            params: {
                                                                start: 0,
                                                                pageNum: 1,
                                                            },
                                                            callback: function (records, operation, success) {
                                                                if (success) {
                                                                    fgrid.focus();
                                                                    fgrid.getSelectionModel().select(0, true);
                                                                }
                                                            }
                                                        });
                                                        break;
                                                    }
                                                }
                                            }
                                        })

                                    }
                                }, {
                                    key: 83,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var form = me.down('DForm').getForm(),
                                            gird = me.down("csecondlist"),
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
                                }, {
                                    key: 83,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var form = me.down('DForm').getForm(),
                                            gird = me.down("csecondlist"),
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
                                }, {
                                    key: 88,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var grid = me.down("csecondlist"),
                                            sm = grid.getSelectionModel();
                                        if (sm.hasSelection()) {
                                            Ext.Msg.confirm('确认删除', '您确定要删除选中项?', function (btn, text) {
                                                if (btn != 'yes') {
                                                    return false;
                                                }
                                                var record = sm.getSelection();
                                                for (var i = 0; i < record.length; i++) {
                                                    grid.getStore().remove(record[i])
                                                }
                                            });
                                        } else {
                                            Ext.Msg.alert("提示", "注意：无选中数据！");
                                        }
                                    }
                                }
                            ],
                            scope: this
                        });
                    }
                },
            });
        }
        else {
            Ext.apply(me, {
                items: [{
                    xtype: 'navigation-tree',
                }],
            });
            var _this = new JZYIndent.LoginManager({
                session: null,
                model: 'User'
            });
            Ext.MessageBox.confirm('温馨提醒', '该用户暂无权限登录，是否返回登录页？', function (btn, text) {
                if (btn != 'yes') {
                    return false;
                }
                _this.logout();
            });
        }
        me.callParent(arguments);

    }
});
