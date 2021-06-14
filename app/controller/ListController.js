var LODOP; //声明为全局变量
Ext.define('JZYIndent.controller.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.list',
    getSelectedItem: function () {
        return this.getView().getSelectionModel().getSelection()[0] || false;
    },
    onTab: function (item) {
        /*var me = this.getView(),
            nd = item.idx,
            view = me.down('[name="' + nd + '"]');
        var grid = me.down(view);
        var obj = grid.getView().getStore().getModel().create();
        console.log(view)
        grid.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW');*/

        var me = this;
        console.log(me)
        var grid = me.getView().down('grid')
        var nd =  me.getView().down('container[name="list"]').idx;
        var obj = grid.getStore().getModel().create();
        //me.fireViewEvent('openobj', me.getView(), obj, 'ACTION_NEW');
        this.fireViewEvent('openobj', me.getView(), obj, 'ACTION_NEW', nd, item.nl);
    },
    onNew: function () {
        var me = this;
        console.log(this)
        var obj = me.getView().getStore().getModel().create();
        me.fireViewEvent('openobj', me.getView(), obj, 'ACTION_NEW');
    },
    /*    	obj.save({
         success:function(rec) {
         me.fireViewEvent('openobj', me.getView(), rec,'ACTION_NEW');
         }});
         */
    onClone: function () {
        var vw = this.getView();
        var rec = vw.getSelectionModel().getSelection()[0];
        if (!rec) {
            Ext.MessageBox.alert('操作提示', '请先选择待克隆的条目');
            return;
        }
        var rec2 = rec.copy(null);
        rec2.save({
            success: function (rec) {
                vw.getStore().load();
            }
        });
    },
    onEdit: function (view, rec) {
        var vw = this.getView();
        if (!vw.isXType('grid')) {
            vw = vw.down('dataview');
        }
        var rec = vw.getSelectionModel().getSelection()[0];
        if (!rec) {
            Ext.MessageBox.alert('操作提示', '请先选择待编辑的条目');
            return;
        }
        this.fireViewEvent('editobj', vw, rec);
    },
    //增强双击处理，对于处于detail中的list，默认为onEdit
    onDblClick: function (view, rec) {
        var vw = this.getView();
        var detailPanel = vw.up('listdetail');
        if (detailPanel) {
            this.onEdit(view, rec);
        } else {
            console.log(rec);
            console.log(vw);
            this.fireViewEvent('openobj', this.getView(), rec, 'ACTION_UPDATE');
        }
    },
    //收款单详情
    onDblDetailClick: function (view, rec) {
        Ext.Ajax.request({
            url: JZYIndent.Cfg.server + '/fin/receive/getReceiveBillDetail.do',
            method: 'POST',
            scope: this,
            withCredentials: true,
            params: {
                fid: rec.data["fid"]
            },
            success: function (result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                this.window = new JZYIndent.view.window.synthesizeReceiptDetail({
                    autoShow: true
                });
                console.log(respText);
                var form = this.window.down("form");
                var grid = this.window.down("grid");
                //获取费用合计框
                var receiveAmount = this.window.query('textfield[name="receiveAmount"]')[0];
                var receivableAmount = this.window.query('textfield[name="receivableAmount"]')[0];
                receiveAmount.setValue(respText.data.receiveBill.receiveAmount);
                receivableAmount.setValue(respText.data.receiveBill.actualAmount);
                //初始化
                var formdata = Ext.create('abc', respText.data.receiveBill);
                //重置
                form.reset();
                //传递数据
                form.loadRecord(formdata);
                form.form.findField("receiveId").setValue(respText.data.receiveBill['fid'])
                form.getForm().findField("customerId").setValue(respText.data.receiveBill.currentOwner);
                grid.getStore().loadData(respText.data.receiveBillDetail);
            },
            failure: function (conn, response, options, eOpts) {
            }
        });
    },
    //双击（审核状态）
    onAuditClick: function (view, rec) {
        var vw = this.getView();
        var detailPanel = vw.up('listdetail');
        if (detailPanel) {
            this.onEdit(view, rec);
        } else {
            if (rec.data['audit'] == "1") {
                //Ext.Msg.alert("提示", "注意：该项已审核！");
                rec.bView=true;
                this.fireViewEvent('openobj', this.getView(), rec, 'ACTION_UPDATE');
                console.log(rec)
            } else {
                this.fireViewEvent('openobj', this.getView(), rec, 'ACTION_UPDATE');
            }
        }
    },
    //单击
    onChange: function (view, rec) {
        var vw = this.getView();
        var form = vw.up("receiptlist").down('form');
        var grid = vw.up("receiptlist").down('receiptlistlist');
        var count = 0;
        var ndt = form.form.findField("contont").getValue();
        for (var i = 0; i < rec.length; i++) {
            if (ndt == "" || ndt == null) {
                count += parseInt(rec[i].data["receiveAmount"]);
                form.form.findField("contont").setValue(form.form.findField("contont").getValue() + "\r\n" + rec[i].data["feeName"] + ":" + rec[i].data["receiveAmount"]);
            }
            var fx = form.form.findField("contont").getValue().split("\r\n");
            for (var j = 0; j < fx.length; j++) {
                form.form.findField("contont").setValue("");
                if (rec[i].data["feeName"].trim() == fx[j].split(":")[0].trim()) {
                    form.form.findField("contont").setValue(form.form.findField("contont").getValue() + "\r\n" + rec[i].data["feeName"] + ":" + count);
                } else {
                    form.form.findField("contont").setValue(form.form.findField("contont").getValue() + "\r\n" + rec[i].data["feeName"] + ":" + rec[i].data["receiveAmount"]);
                }
            }
        }
    },
    onRefreshClick: function () {
        this.getView().getStore().load();
    },
    //删除
    onRemove: function (item) {
        var vw = this.getView(),
            grid = vw.down('receivablelistlist');
        //获取grid
        //for dataview
        if (!grid.isXType('grid')) {
            grid = vw.down('dataview');
        }
        var sm = grid.getSelectionModel();
        var sels = sm.getSelection();
        if (sm.hasSelection()) {
            Ext.MessageBox.confirm('确认删除', '您确定要删除选中的[' + sels.length + ']项?', function (btn, text) {
                if (btn != 'yes') {
                    return false;
                }

                // 组织参数
                var record = sm.getSelection();
                //定义数组存放选择行id
                var mycars = new Array();
                //遍历
                for (var i = 0; i < record.length; i++) {
                    mycars[i] = record[i].data["fid"];
                }
                console.log(mycars);
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + item.iurl,
                    method: 'POST',
                    scope: this,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.JSON.encode({
                        ids: mycars
                    }),
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
    onRelAdd: function (btn, e) {
        var vw = this.getView();
        var sels = vw.getSelectionModel().getSelection();
        if (sels.length == 0) {
            Ext.MessageBox.alert('操作提示', '请先选择待关联的条目', null, this);
            return;
        }
        // 获取参数
        var id = vw.ds.filters.items[0]._value;
        var property = vw.ds.filters.items[0]._property;
        var entity = property.substring(0, property.length - 2).toUpperCase();
        var relId = [];
        for (var i = 0; i < sels.length; i++) {
            relId[i] = sels[i].get(sels[i].idProperty);
        }
        var relEntity = sels[0].entityName.toUpperCase();
        var win = btn.up('window');
        // 调用增加关联接口
        Ext.Ajax.request({
            url: '/rel/add',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            params: Ext.JSON.encode({
                'id1': id,
                'entity1': entity,
                'id2': relId,
                'entity2': relEntity
            }),
            success: function (conn, response, options, eOpts) {
                vw.ds.load();
                win.close();
            },
            failure: function (conn, response, options, eOpts) {
                win.close();
            }
        });
    },
    onRelDel: function () {
        var vw = this.getView();
        var sels = vw.getSelectionModel().getSelection();
        if (sels.length == 0) {
            Ext.MessageBox.alert('操作提示', '请先选择待删除的条目', null, this);
            return;
        } else {
            Ext.MessageBox.confirm('确认删除', '您确定要删除选中的[' + sels.length + ']项?', function (btn, text) {
                if (btn != 'yes') {
                    return false;
                }

                // 调用删除关联接口
                var id = vw.getStore().filters.items[0]._value;
                var property = vw.getStore().filters.items[0]._property;
                var entity = property.substring(0, property.length - 2).toUpperCase();
                var relId = [];
                for (var i = 0; i < sels.length; i++) {
                    relId[i] = sels[i].get(sels[i].idProperty);
                }
                var relEntity = sels[0].entityName.toUpperCase();
                // 调用删除关联接口
                Ext.Ajax.request({
                    url: '/rel/delete',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.JSON.encode({
                        'id1': id,
                        'entity1': entity,
                        'id2': relId,
                        'entity2': relEntity
                    }),
                    success: function (conn, response, options, eOpts) {
                        vw.getStore().load();
                    },
                    failure: function (conn, response, options, eOpts) {
                    }
                });
            }, this);
        }
    },
    onRelList: function () {
        var vw = this.getView();
        var vtype;
        //for dataview
        if (!vw.isXType('grid')) {
            vw = vw.down('dataview');
            vtype = vw.xtype.replace('view', 'list');
        } else {
            vtype = vw.xtype;
        }
        var ds = vw.getStore();
        var vm = this.getViewModel();
        var title = this.getView().up('[cls=nav_pos]').title;
        var sel_win = vw.sel_win;
        if (!sel_win) {
            sel_win = new Ext.window.Window({
                closeAction: 'hide',
                width: document.body.clientWidth - 150,
                height: document.body.clientHeight - 150,
                layout: 'fit',
                modal: true,
                //viewModel: vm,
                items: [
                    {
                        ds: ds,
                        xtype: vtype,
                        bind: {
                            store: '{objsel}'
                        },
                        tbar: [
                            '->',
                            {
                                text: '增加关联',
                                handler: 'onRelAdd'
                            }
                        ]
                    }
                ],
                plain: true,
                headerPosition: 'bottom'
            });
            vw.sel_win = sel_win;
        }
        sel_win.show();
    },
    onAddMenu: function (nd, eOpts, tree) {
        //nd-树的name
        //item-树按钮
        //tree-树
        var myMask = new Ext.LoadMask({
            msg: '正在打开',
            target: this.getView()
        });
        var nl = eOpts.nl;
        var action = nl.split('detail')[0];
        if (action == "add") {
        } else if (action == "edit") {
        }
       /* nd = nd.replace('list', 'detail');
        if (nd.indexOf("list") == -1) {
            nd = nd + 'detail';
        }*/
        console.log(nd)
        this.fireViewEvent('openobj', tree.getView(), tree, 'ACTION_NEW', nl, nd);
        myMask.hide();
    },
    //新增传递
    onAdd: function (nd, item, view) {
        var myMask = new Ext.LoadMask({
            msg: '正在打开',
            target: this.getView()
        });
        var me = this.getView(),
            obj;
        var grid = me.down(view);
        //list获取
        //楼盘
        if (nd == "houselist" && item.type != '0') {
            //楼栋 判断是否批量
            if (item.nl == 'docdetail') {
                var tree = me.down(item.tree),
                    selected = tree.getSelectionModel().getSelection()[0];
                console.log(item);
                //判断自定义字段（单个或批量）
                if (item.onChose == "batch") {
                    //获取楼盘信息
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/base/res/getBuildById.do',
                        method: 'POST',
                        scope: this,
                        withCredentials: true,
                        params: {
                            fid: selected.data.fid
                        },
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            console.log(respText);
                            obj = grid.getView().getStore().getModel().create();
                            var data = obj.data;
                            eval("data.prId" + "='" + selected.data.fid + "'");
                            eval("data.number" + "='" + respText.data["code"] + "'");
                            eval("data.batch" + "=" + false);
                            eval("data.single" + "=" + true);
                            console.log(obj);
                            this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
                        },
                        failure: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            Ext.Msg.alert("提示", respText.msg);
                        },
                        callback: function (opts, success, response) {
                        }
                    });
                } else //单个
                {
                    var tree = me.down(item.tree),
                        selected = tree.getSelectionModel().getSelection()[0];
                    //console.log(selected.data.fid)
                    obj = grid.getView().getStore().getModel().create();
                    var data = obj.data;
                    eval("data.prId" + "='" + selected.data.fid + "'");
                    eval("data.batch" + "=" + true);
                    eval("data.single" + "=" + false);
                    this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
                }
            } else if (item.nl == 'floordetail') {
                var tree = me.down(item.tree),
                    selected = tree.getSelectionModel().getSelection()[0];
                console.log(item);
                //判断自定义字段（单个或批量）
                if (item.onChose == "batch") {
                    //获取楼盘信息
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/base/res/getTowerById.do',
                        method: 'POST',
                        scope: this,
                        withCredentials: true,
                        params: {
                            fid: selected.data.fid
                        },
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            console.log(respText);
                            obj = grid.getView().getStore().getModel().create();
                            var data = obj.data;
                            eval("data.prId" + "='" + selected.data.fid + "'");
                            eval("data.number" + "='" + respText.data["code"] + "'");
                            eval("data.batch" + "=" + false);
                            eval("data.single" + "=" + true);
                            console.log(obj);
                            this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
                        },
                        failure: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            Ext.Msg.alert("提示", respText.msg);
                        },
                        callback: function (opts, success, response) {
                        }
                    });
                } else //单个
                {
                    var tree = me.down(item.tree),
                        selected = tree.getSelectionModel().getSelection()[0];
                    //console.log(selected.data.fid)
                    obj = grid.getView().getStore().getModel().create();
                    var data = obj.data;
                    eval("data.prId" + "='" + selected.data.fid + "'");
                    eval("data.batch" + "=" + true);
                    eval("data.single" + "=" + false);
                    this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
                }
            } else {
                var tree = me.down(item.tree),
                    selected = tree.getSelectionModel().getSelection()[0];
                //console.log(selected.data.fid)
                obj = grid.getView().getStore().getModel().create();
                var data = obj.data;
                eval("data.prId" + "='" + selected.data.fid + "'");
                this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
            }
        }
        //收费标准
        else if (item.nl == 'rateslistdetail') {
            var tree = me.down(item.tree),
                selected = tree.getSelectionModel().getSelection()[0];
            //console.log(selected.data.fid)
            obj = grid.getView().getStore().getModel().create();
            var data = obj.data;
            eval("data.projectId" + "='" + selected.data.fid + "'");
            this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
        } else // else if (nd == "treelist") {
        //     var obj = grid.getView().getStore().getModel().create();
        //
        // }
        {
            obj = grid.getView().getStore().getModel().create();
            console.log(obj);
            console.log(grid)
            this.fireViewEvent('openobj', grid.getView(), obj, 'ACTION_NEW', nd, item.nl);
        }
        myMask.hide();
    },
    //修改传递
    onAlter: function (nd, nl, rec, view) {
        var myMask = new Ext.LoadMask({
            msg: '正在打开',
            target: this.getView()
        });
        var me = this.getView();
        var grid = me.down(view);
        if (nl == "relicdetail") {
            console.log(123)
            var data = rec.data;
            var key = "XChange";
            var value = true;
            data[key] = value;
            console.log(rec)
            this.fireViewEvent('openobj', grid.getView(), rec, 'ACTION_UPDATE', nd, nl);
        } else {
            //console.log(rec)
            this.fireViewEvent('openobj', grid.getView(), rec, 'ACTION_UPDATE', nd, nl);
        }
        myMask.hide();
    },
    //新增
    // onNewHouses: function () {
    //    this.onAdd(this.onHouse, "relicdetail");
    // },
    //批量/单个新增选择
    onCheckSingle: function (item) {
        var me = this;
        Ext.MessageBox.confirm('新增', '是否批量' + item.text + '?', function (btn, text) {
            if (btn == 'yes') {
                item.onChose = "batch";
                me.onNewHouses(item);
            } else {
                item.onChose = "single";
                me.onNewHouses(item);
            }
        });
    },
    //新增其他
    onNewHouses: function (item, e) {
        var me = this.getView(),
            tree = me.down(item.tree),
            //获取tree
            nd = me.down('container[name="list"]').idx,
            //获取idx
            view = me.down('container[name="list"]').view,
            selected = tree.getSelectionModel().selected.items;
        //获取选中项
        if (selected.length != 0) {
            //判断是否选中
            if (selected[0].data.type == item.type || item.type == "0") {
                this.onAdd(nd, item, view);
            } else {
                Ext.Msg.show({
                    title: '错误',
                    msg: '请选择正确' + item.text,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        } else {
            //无需选中项
            if (item.type == "0") {
                this.onAdd(nd, item, view);
            } else {
                Ext.Msg.show({
                    title: '注意',
                    msg: '请选择正确' + item.text,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        }
    },
    //新增节点
    onNewMenu: function (item, e, owner, eOpts) {
        console.log(this)
        console.log(item)
            console.log(e)
        console.log(owner)
        console.log(eOpts.nl)

        var me = this.getView(),
            tree = me.down(item.tree),
            //获取tree
            nd = eOpts.nl
            selected = tree.getSelectionModel().selected.items;
        //获取选中项

        this.onAddMenu(nd, eOpts, tree);
    },
    //费项应用
    onSelectionChange: function () {
        var form = this.getView().down("form"),
            window = form.up("window"),
            list = Ext.ComponentQuery.query('rateslist')[0],
            rgird = Ext.ComponentQuery.query('rateslistlist')[0],
            grid = list.query('spreadsheet')[0],
            combo = list.query('combo[name = "building"]')[0],
            tree = list.query('DTree')[0],
            //selected = tree.getSelectionModel().selected.items,
            sm = rgird.getSelectionModel(),
            record = sm.getSelection()[0],
            selection = grid.getSelectionModel().getSelected(),
            message = '??',
            firstRowIndex, firstColumnIndex, lastRowIndex,
            dBuilding = [],
            //多个楼栋
            IBuilding = [],
            //单个楼栋
            lastColumnIndex;
        if (form.getForm().isValid()) {
            if (!selection) {
                Ext.Msg.alert("提示", "未选择楼栋或单元");
                return;
            } else if (selection.isCells) {
                firstRowIndex = selection.getFirstRowIndex();
                firstColumnIndex = selection.getFirstColumnIndex();
                lastRowIndex = selection.getLastRowIndex();
                lastColumnIndex = selection.getLastColumnIndex() , message = (lastColumnIndex - firstColumnIndex + 1) + 'x' + (lastRowIndex - firstRowIndex + 1) + ' at (' + firstColumnIndex + ',' + firstRowIndex + ')';
                for (var j = firstRowIndex; j < (((lastRowIndex - firstRowIndex) + 1) + firstRowIndex); j++) {
                    if (parseInt(lastColumnIndex - firstColumnIndex) + firstColumnIndex == parseInt(firstColumnIndex)) {
                        for (var i = firstColumnIndex; i < (lastColumnIndex - firstColumnIndex + 1) + firstColumnIndex; i++) {
                            var IBuobj = {};
                            console.log(combo);
                            //楼栋
                            if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                                dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                            } else //楼层
                            {
                                if (grid.getStore().getAt(j).data["unitId" + (parseInt(i) / 2 - 1)] != undefined) {
                                    eval("IBuobj.unitId" + "='" + grid.getStore().getAt(j).data["unitId" + (parseInt(i) / 2 - 1)] + "'");
                                    eval("IBuobj.receiveUseId" + "='" + grid.getStore().getAt(j).data["receiveUseId" + (parseInt(i) / 2 - 1)] + "'");
                                    // console.log(grid.getStore().getAt(j).data["unitId" + parseInt(i - 2)])
                                    // console.log(grid.getStore().getAt(j).data["receiveUseId" + parseInt(i - 2)])
                                    IBuilding.push(IBuobj);
                                }
                            }
                        }
                    } else {
                        for (var i = firstColumnIndex / 2 - 1; i < lastColumnIndex / 2; i++) {
                            var IBuobj = {};
                            //楼栋
                            if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                                dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                            } else //楼层
                            {
                                if (grid.getStore().getAt(j).data["unitId" + parseInt(i)] != undefined) {
                                    console.log(parseInt(i));
                                    eval("IBuobj.unitId" + "='" + grid.getStore().getAt(j).data["unitId" + parseInt(i)] + "'");
                                    eval("IBuobj.receiveUseId" + "='" + grid.getStore().getAt(j).data["receiveUseId" + parseInt(i)] + "'");
                                    IBuilding.push(IBuobj);
                                }
                            }
                        }
                    }
                }
            } else if (selection.isRows) {
                message = selection.getCount();
                console.log(selection);
                for (var i = 0; i < selection.getCount(); i++) {
                    var selectedRecords = selection.selectedRecords.getAt(i).data;
                    var arr = Object.keys(selection.selectedRecords.getAt(i).data);
                    //楼栋
                    if (Object.keys(selectedRecords).length <= 3 && combo.getValue() == null) {
                        dBuilding.push(Object.values(selectedRecords["fid"]));
                    } else //楼层
                    {
                        console.log(arr);
                        for (var a = 0; a < (arr.length - 3) / 3; a++) {
                            var IBuobj = {};
                            console.log(selectedRecords["unitId" + a]);
                            var value = selectedRecords["unitId" + a];
                            var receive = selectedRecords["receiveUseId" + a];
                            if (value != undefined) {
                                eval("IBuobj.unitId" + "='" + value + "'");
                                eval("IBuobj.receiveUseId" + "='" + receive + "'");
                            }
                            IBuilding.push(IBuobj);
                        }
                    }
                }
            } else if (selection.isColumns) {
                message = selection.getCount();
                console.log(1);
                for (var a = 0; a < grid.getStore().getCount(); a++) {
                    for (var i = 0; i < selection.getCount(); i++) {
                        var IBuobj = {};
                        //console.log(selection.selectedColumns[i].fullColumnIndex)
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(a).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(a).data)[parseInt(selection.selectedColumns[0].fullColumnIndex - 1)]);
                        } else //楼层
                        {
                            var value = grid.getStore().getAt(a).data["unitId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                            var receive = grid.getStore().getAt(a).data["receiveUseId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                            //console.log(grid.getStore().getAt(a).data)
                            if (value != undefined) {
                                eval("IBuobj.unitId" + "='" + value + "'");
                                eval("IBuobj.receiveUseId" + "='" + receive + "'");
                                IBuilding.push(IBuobj);
                            }
                        }
                    }
                }
            }
            console.log(grid.getStore());
            console.log({
                receiveItemId: record.data.fid,
                billingStartTime: form.getForm().getValues()["time"] + "",
                towerIds: dBuilding
            });
            console.log({
                receiveItemId: record.data.fid,
                billingStartTime: form.getForm().getValues()["time"] + "",
                unitList: IBuilding
            });
            Ext.MessageBox.show({
                title: '请稍等',
                msg: '正在加载...',
                progressText: '',
                width: 300,
                progress: true,
                closable: false,
                animEl: 'loding'
            });
            //控制进度速度
            var f = function (v) {
                return function () {
                    var i = v / 128;
                    Ext.MessageBox.updateProgress(i, '');
                };
            };
            for (var i = 1; i < 130; i++) {
                setTimeout(f(i), i * 150);
            }
            //多个楼栋
            console.log(record);
            var rselect = rgird.getSelection();
            if (rselect.length === 0) {
                Ext.Msg.alert("提示", '请先选择费项');
                return;
            }
            if (combo.getValue() == null) {
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + "fin/receive/saveTowerSomeFinReceiveUse.do",
                    method: 'POST',
                    scope: this,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.JSON.encode({
                        receiveItemId: rgird.getSelection()[0].data.fid,
                        //selected[0].data.fid,
                        billingStartTime: form.getForm().getValues()["time"] + "",
                        towerIds: dBuilding
                    }),
                    success: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        window.hide();
                        Ext.MessageBox.hide();
                        Ext.Msg.alert("提示", respText.msg);
                        grid.getStore().load();
                    },
                    failure: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        Ext.Msg.alert("提示", respText.msg);
                    },
                    callback: function (opts, success, response) {
                    }
                });
            } else //单个楼栋
            {
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + "fin/receive/saveSomeFinReceiveUse.do",
                    method: 'POST',
                    scope: this,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.JSON.encode({
                        receiveItemId: rgird.getSelection()[0].data.fid,
                        //selected[0].data.fid,
                        billingStartTime: form.getForm().getValues()["time"] + "",
                        unitList: IBuilding
                    }),
                    success: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        window.hide();
                        Ext.MessageBox.hide();
                        Ext.Msg.alert("提示", respText.msg);
                        grid.getStore().load();
                    },
                    failure: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        Ext.Msg.alert("提示", respText.msg);
                    },
                    callback: function (opts, success, response) {
                    }
                });
            }
        }
    },
    //表应用应用
    onChargeChange: function (item) {
        item.setDisabled(true);
        var me = this.getView(),
            list = Ext.ComponentQuery.query('chargelist')[0],
            grid = list.query('spreadsheet')[0],
            combo = list.query('combo[name = "tbuilding"]')[0],
            tree = list.query('DTree')[0],
            selected = tree.getSelectionModel().selected.items,
            selection = grid.getSelectionModel().getSelected(),
            message = '??',
            firstRowIndex, firstColumnIndex, lastRowIndex,
            dBuilding = [],
            //多个楼栋
            IBuilding = [],
            //单个楼栋
            lastColumnIndex;
        if (!selection) {
            Ext.Msg.alert("提示", "未选择楼栋或单元");
            return;
        } else if (selection.isCells) {
            firstRowIndex = selection.getFirstRowIndex();
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = selection.getLastRowIndex();
            lastColumnIndex = selection.getLastColumnIndex() , message = (lastColumnIndex - firstColumnIndex + 1) + 'x' + (lastRowIndex - firstRowIndex + 1) + ' at (' + firstColumnIndex + ',' + firstRowIndex + ')';
            for (var j = firstRowIndex; j < (((lastRowIndex - firstRowIndex) + 1) + firstRowIndex); j++) {
                if (parseInt(lastColumnIndex - firstColumnIndex) + firstColumnIndex == parseInt(firstColumnIndex)) {
                    for (var i = firstColumnIndex; i < (lastColumnIndex - firstColumnIndex + 1) + firstColumnIndex; i++) {
                        var IBuobj = {};
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                        } else //楼层
                        {
                            if (grid.getStore().getAt(j).data["unitId" + (parseInt(i) / 2 - 1)] != undefined) {
                                eval("IBuobj.unitId" + "='" + grid.getStore().getAt(j).data["unitId" + (parseInt(i) / 2 - 1)] + "'");
                                eval("IBuobj.meterUseId" + "='" + grid.getStore().getAt(j).data["meterUseId" + (parseInt(i) / 2 - 1)] + "'");
                                IBuilding.push(IBuobj);
                            }
                        }
                    }
                } else {
                    for (var i = firstColumnIndex / 2 - 1; i < lastColumnIndex / 2; i++) {
                        var IBuobj = {};
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                        } else //楼层
                        {
                            if (grid.getStore().getAt(j).data["unitId" + parseInt(i)] != undefined) {
                                eval("IBuobj.unitId" + "='" + grid.getStore().getAt(j).data["unitId" + parseInt(i)] + "'");
                                eval("IBuobj.meterUseId" + "='" + grid.getStore().getAt(j).data["meterUseId" + parseInt(i)] + "'");
                                IBuilding.push(IBuobj);
                            }
                        }
                    }
                }
            }
        } else if (selection.isRows) {
            message = selection.getCount();
            console.log(selection);
            for (var i = 0; i < selection.getCount(); i++) {
                var selectedRecords = selection.selectedRecords.getAt(i).data;
                var arr = Object.keys(selection.selectedRecords.getAt(i).data);
                //楼栋
                if (Object.keys(selectedRecords).length <= 3 && combo.getValue() == null) {
                    dBuilding.push(Object.values(selectedRecords["fid"]));
                } else //楼层
                {
                    console.log(arr);
                    for (var a = 0; a < (arr.length - 3) / 3; a++) {
                        var IBuobj = {};
                        var value = selectedRecords["unitId" + a];
                        var receive = selectedRecords["meterUseId" + a];
                        if (value != undefined) {
                            eval("IBuobj.unitId" + "='" + value + "'");
                            eval("IBuobj.meterUseId" + "='" + receive + "'");
                        }
                        IBuilding.push(IBuobj);
                    }
                }
            }
        } else if (selection.isColumns) {
            message = selection.getCount();
            for (var a = 0; a < grid.getStore().getCount(); a++) {
                for (var i = 0; i < selection.getCount(); i++) {
                    var IBuobj = {};
                    //console.log(selection.selectedColumns[i].fullColumnIndex)
                    //楼栋
                    if (Object.keys(grid.getStore().getAt(a).data).length <= 3 && combo.getValue() == null) {
                        dBuilding.push(Object.values(grid.getStore().getAt(a).data)[parseInt(selection.selectedColumns[0].fullColumnIndex - 1)]);
                    } else //楼层
                    {
                        var value = grid.getStore().getAt(a).data["unitId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                        var receive = grid.getStore().getAt(a).data["meterUseId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                        if (value != undefined) {
                            eval("IBuobj.unitId" + "='" + value + "'");
                            eval("IBuobj.meterUseId" + "='" + receive + "'");
                            IBuilding.push(IBuobj);
                        }
                    }
                }
            }
        }
        Ext.MessageBox.show({
            title: '请稍等',
            msg: '正在加载...',
            progressText: '',
            width: 300,
            progress: true,
            closable: false,
            animEl: 'loding'
        });
        //控制进度速度
        var f = function (v) {
            return function () {
                if (v == 12) {
                    Ext.MessageBox.hide();
                } else {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i, '');
                }
            };
        };
        for (var i = 1; i < 13; i++) {
            setTimeout(f(i), i * 150);
        }
        console.log({
            meterItemId: selected[0].data.fid,
            towerIds: dBuilding
        });
        console.log({
            meterItemId: selected[0].data.fid,
            unitList: IBuilding
        });
        //多个楼栋
        if (combo.getValue() == null) {
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + "equip/meter/saveTowerSomeEquipMeterUse.do",
                method: 'POST',
                scope: this,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    meterItemId: selected[0].data.fid,
                    towerIds: dBuilding
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                    grid.getStore().reload();
                },
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        } else //单个楼栋
        {
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + "equip/meter/saveSomeEquipMeterUse.do",
                method: 'POST',
                scope: this,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    meterItemId: selected[0].data.fid,
                    unitMeterUseList: IBuilding
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    Ext.Msg.alert("提示", respText.msg);
                    grid.getStore().reload();
                },
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        }
        item.setDisabled(false);
    },
    //删除应用(费用)
    onDeleteRates: function (item) {
        item.setDisabled(true);
        var form = this.getView().down("form"),
            list = Ext.ComponentQuery.query('rateslist')[0],
            grid = list.query('spreadsheet')[0],
            combo = list.query('combo[name = "building"]')[0],
            tree = list.query('DTree')[0],
            selected = tree.getSelectionModel().selected.items,
            selection = grid.getSelectionModel().getSelected(),
            message = '??',
            firstRowIndex, firstColumnIndex, lastRowIndex,
            dBuilding = [],
            //多个楼栋
            IBuilding = [],
            //单个楼栋
            lastColumnIndex;
        if (!selection) {
            Ext.Msg.alert("提示", "未选择楼栋或单元");
            return;
        } else if (selection.isCells) {
            firstRowIndex = selection.getFirstRowIndex();
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = selection.getLastRowIndex();
            lastColumnIndex = selection.getLastColumnIndex() , message = (lastColumnIndex - firstColumnIndex + 1) + 'x' + (lastRowIndex - firstRowIndex + 1) + ' at (' + firstColumnIndex + ',' + firstRowIndex + ')';
            for (var j = firstRowIndex; j < (((lastRowIndex - firstRowIndex) + 1) + firstRowIndex); j++) {
                if (parseInt(lastColumnIndex - firstColumnIndex) + firstColumnIndex == parseInt(firstColumnIndex)) {
                    console.log(1);
                    for (var i = firstColumnIndex; i < (lastColumnIndex - firstColumnIndex + 1) + firstColumnIndex; i++) {
                        var IBuobj = {};
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                            console.log();
                        } else //楼层
                        {
                            if (grid.getStore().getAt(j).data["unitId" + (parseInt(i) / 2 - 1)] != undefined) {
                                IBuilding.push(grid.getStore().getAt(j).data["receiveUseId" + (parseInt(i) / 2 - 1)]);
                            }
                        }
                    }
                } else {
                    for (var i = firstColumnIndex / 2 - 1; i < lastColumnIndex / 2; i++) {
                        var IBuobj = {};
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                        } else //楼层
                        {
                            if (grid.getStore().getAt(j).data["unitId" + parseInt(i)] != undefined) {
                                IBuilding.push(grid.getStore().getAt(j).data["receiveUseId" + parseInt(i)]);
                            }
                        }
                    }
                }
            }
        } else if (selection.isRows) {
            message = selection.getCount();
            for (var i = 0; i < selection.getCount(); i++) {
                var selectedRecords = selection.selectedRecords.getAt(i).data;
                var arr = Object.keys(selection.selectedRecords.getAt(i).data);
                //楼栋
                if (Object.keys(selectedRecords).length <= 3 && combo.getValue() == null) {
                    //dBuilding.push(Object.values(selectedRecords["fid"]))
                    return;
                } else //楼层
                {
                    for (var a = 0; a < (arr.length - 3) / 3; a++) {
                        var IBuobj = {};
                        var value = selectedRecords["unitId" + a];
                        var receive = selectedRecords["receiveUseId" + a];
                        if (value != undefined) {
                            // eval("IBuobj.unitId" + "='" + value + "'");
                            // eval("IBuobj.receiveUseId" + "='" + receive + "'");
                            IBuilding.push(receive);
                        }
                    }
                }
            }
        } else if (selection.isColumns) {
            message = selection.getCount();
            for (var a = 0; a < grid.getStore().getCount(); a++) {
                for (var i = 0; i < selection.getCount(); i++) {
                    var IBuobj = {};
                    //console.log(selection.selectedColumns[i].fullColumnIndex)
                    //楼栋
                    if (Object.keys(grid.getStore().getAt(a).data).length <= 3 && combo.getValue() == null) {
                        return;
                    } else //dBuilding.push(Object.values(grid.getStore().getAt(a).data)[parseInt(selection.selectedColumns[0].fullColumnIndex - 1)])
                    //楼层
                    {
                        var value = grid.getStore().getAt(a).data["unitId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                        var receive = grid.getStore().getAt(a).data["receiveUseId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                        if (value != undefined) {
                            // eval("IBuobj.unitId" + "='" + value + "'");
                            // eval("IBuobj.receiveUseId" + "='" + receive + "'");
                            IBuilding.push(receive);
                        }
                    }
                }
            }
        }
        console.log(IBuilding);
        //多个楼栋
        if (combo.getValue() == null) {
            Ext.Msg.alert("提示", "操作错误");
        } else //单个楼栋
        {
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + "fin/receive/deleteReceiveUseByIds.do",
                method: 'POST',
                scope: this,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    ids: IBuilding
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    Ext.Msg.alert("提示", respText.msg);
                    grid.getStore().reload();
                },
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        }
        item.setDisabled(false);
    },
    //删除应用（表）
    onDeleteCharge: function (item, e) {
        item.setDisabled(true);
        var me = this.getView(),
            list = Ext.ComponentQuery.query('chargelist')[0],
            grid = list.query('spreadsheet')[0],
            combo = list.query('combo[name = "tbuilding"]')[0],
            tree = list.query('DTree')[0],
            selected = tree.getSelectionModel().selected.items,
            selection = grid.getSelectionModel().getSelected(),
            message = '??',
            firstRowIndex, firstColumnIndex, lastRowIndex,
            dBuilding = [],
            //多个楼栋
            IBuilding = [],
            //单个楼栋
            lastColumnIndex;
        if (!selection) {
            Ext.Msg.alert("提示", "未选择楼栋或单元");
            return;
        } else if (selection.isCells) {
            firstRowIndex = selection.getFirstRowIndex();
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = selection.getLastRowIndex();
            lastColumnIndex = selection.getLastColumnIndex() , message = (lastColumnIndex - firstColumnIndex + 1) + 'x' + (lastRowIndex - firstRowIndex + 1) + ' at (' + firstColumnIndex + ',' + firstRowIndex + ')';
            for (var j = firstRowIndex; j < (((lastRowIndex - firstRowIndex) + 1) + firstRowIndex); j++) {
                if (parseInt(lastColumnIndex - firstColumnIndex) + firstColumnIndex == parseInt(firstColumnIndex)) {
                    for (var i = firstColumnIndex; i < (lastColumnIndex - firstColumnIndex + 1) + firstColumnIndex; i++) {
                        var IBuobj = {};
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                        } else //楼层
                        {
                            if (grid.getStore().getAt(j).data["unitId" + (parseInt(i) / 2 - 1)] != undefined) {
                                IBuilding.push(grid.getStore().getAt(j).data["meterUseId" + (parseInt(i) / 2 - 1)]);
                            }
                        }
                    }
                } else {
                    for (var i = firstColumnIndex / 2 - 1; i < lastColumnIndex / 2; i++) {
                        var IBuobj = {};
                        //楼栋
                        if (Object.keys(grid.getStore().getAt(j).data).length <= 3 && combo.getValue() == null) {
                            dBuilding.push(Object.values(grid.getStore().getAt(j).data)[parseInt(firstColumnIndex - 1)]);
                        } else //楼层
                        {
                            if (grid.getStore().getAt(j).data["unitId" + parseInt(i)] != undefined) {
                                IBuilding.push(grid.getStore().getAt(j).data["meterUseId" + parseInt(i)]);
                            }
                        }
                    }
                }
            }
        } else if (selection.isRows) {
            message = selection.getCount();
            for (var i = 0; i < selection.getCount(); i++) {
                var selectedRecords = selection.selectedRecords.getAt(i).data;
                var arr = Object.keys(selection.selectedRecords.getAt(i).data);
                //楼栋
                if (Object.keys(selectedRecords).length <= 3 && combo.getValue() == null) {
                    //dBuilding.push(Object.values(selectedRecords["fid"]))
                    return;
                } else //楼层
                {
                    for (var a = 0; a < (arr.length - 3) / 3; a++) {
                        var IBuobj = {};
                        var value = selectedRecords["unitId" + a];
                        var receive = selectedRecords["meterUseId" + a];
                        if (value != undefined) {
                            // eval("IBuobj.unitId" + "='" + value + "'");
                            // eval("IBuobj.receiveUseId" + "='" + receive + "'");
                            IBuilding.push(receive);
                        }
                    }
                }
            }
        } else if (selection.isColumns) {
            message = selection.getCount();
            for (var a = 0; a < grid.getStore().getCount(); a++) {
                for (var i = 0; i < selection.getCount(); i++) {
                    var IBuobj = {};
                    //console.log(selection.selectedColumns[i].fullColumnIndex)
                    //楼栋
                    if (Object.keys(grid.getStore().getAt(a).data).length <= 3 && combo.getValue() == null) {
                        return;
                    } else //dBuilding.push(Object.values(grid.getStore().getAt(a).data)[parseInt(selection.selectedColumns[0].fullColumnIndex - 1)])
                    //楼层
                    {
                        var value = grid.getStore().getAt(a).data["unitId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                        var receive = grid.getStore().getAt(a).data["meterUseId" + parseInt(selection.selectedColumns[i].fullColumnIndex / 2 - 1)];
                        if (value != undefined) {
                            // eval("IBuobj.unitId" + "='" + value + "'");
                            // eval("IBuobj.meterUseId" + "='" + receive + "'");
                            IBuilding.push(receive);
                        }
                    }
                }
            }
        }
        // console.log({meterItemId:selected[0].data.fid,towerIds:dBuilding})
        // console.log({meterItemId:selected[0].data.fid,unitList:IBuilding})
        console.log(IBuilding);
        //多个楼栋
        if (combo.getValue() == null) {
            Ext.Msg.alert("提示", "操作错误");
        } else //单个楼栋
        {
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + "equip/meter/deleteEquipMeterUseByIds.do",
                method: 'POST',
                scope: this,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    ids: IBuilding
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    Ext.Msg.alert("提示", respText.msg);
                    grid.getStore().reload();
                },
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        }
        item.setDisabled(false);
    },
    //修改房产
    onAlterHouses: function (item, e) {
        var me = this.getView(),
            tree = me.down(item.tree),
            data,
            nd = me.down('container[name="list"]').idx,
            //获取idx
            view = me.down('container[name="list"]').view,
            selected = tree.getSelectionModel().selected.items;
        if (selected.length != 0) {
            if ((parseInt(selected[0].data.type) == item.type && (selected[0].data.type != undefined)) || item.type == "0") {
                console.log(selected[0].data);
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + item.iurl,
                    method: 'GET',
                    scope: this,
                    async: false,
                    withCredentials: true,
                    params: {
                        fid: selected[0].data.fid
                    },
                    success: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        data = respText.data;
                        //防止楼栋
                        eval("data.batch" + "=" + true);
                        eval("data.single" + "=" + false);
                    },
                    failure: function () {
                        Ext.Msg.alert("提示", "请求失败！");
                    },
                    callback: function (opts, success, response) {
                    }
                });
                var grid = me.down(view);
                var obj = grid.getView().getStore().getModel().create();
                obj.data = data;
                obj.raw = data;
                obj.phantom = false;
                // console.log(nd + "" + item.nl + "" + view)
                this.onAlter(nd, item.nl, obj, view);
            } else {
                Ext.Msg.show({
                    title: '错误',
                    msg: '请选择正确' + item.text,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        } else {
            Ext.Msg.show({
                title: '注意',
                msg: '请选中需要修改项',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }
    },
    //修改
    onAlterOther: function (item, e) {
        var me = this.getView(),
            tree = me.down('DTree'),
            nd = me.down('container[name="list"]').idx,
            //获取idx
            view = me.down('container[name="list"]').view,
            selected = tree.getSelectionModel().selected.items;
        if (selected.length != 0) {
            if (selected[0].data.fid != undefined) {
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + item.iurl,
                    method: 'GET',
                    scope: this,
                    withCredentials: true,
                    params: {
                        fid: selected[0].data.fid
                    },
                    success: function (result) {
                        var grid = me.down(view);
                        var obj = grid.getView().getStore().getModel().create();
                        obj.data = Ext.util.JSON.decode(result.responseText).data;
                        obj.raw = Ext.util.JSON.decode(result.responseText).data;
                        obj.phantom = false;
                        // console.log(nd + "" + item.nl + "" + view)
                        this.onAlter(nd, item.nl, obj, view);
                    },
                    failure: function () {
                        Ext.Msg.alert("提示", "请求失败！");
                    },
                    callback: function (opts, success, response) {
                    }
                });
            } else {
                Ext.Msg.show({
                    title: '错误',
                    msg: '请选择正确' + item.text,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        } else {
            Ext.Msg.show({
                title: '注意',
                msg: '请选中需要修改项',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }
    },
    //修改
    onAlterGrid: function (item, e) {
        var me = this.getView(),
            nd = item.idx,
            //获取idx
            view = item.view,
            grid = me.down(view),
            sm = grid.getSelectionModel();
        //获取选中项
        if (sm.hasSelection()) {
            var record = sm.getSelection()[0];
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + item.iurl,
                method: 'GET',
                scope: this,
                withCredentials: true,
                params: {
                    fid: record.data.fid
                },
                success: function (result) {
                    var grid = me.down(view);
                    var obj = grid.getView().getStore().getModel().create();
                    console.log(Ext.util.JSON.decode(result.responseText).data)
                    obj.data = Ext.util.JSON.decode(result.responseText).data;
                    obj.raw = Ext.util.JSON.decode(result.responseText).data;
                    obj.phantom = false;
                    // console.log(nd + "" + item.nl + "" + view)
                    this.onAlter(nd, item.nl, obj, view);
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.show({
                title: '注意',
                msg: '请选中需要修改项',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }
    },
    //应用费用(弹窗)
    adhibition: function (a) {
        var grid = a.up("grid"),
            sm = grid.getSelectionModel();
        //获取选中项
        if (sm.hasSelection()) {
            //selection = grid.getSelectionNode().getSelectedCell();
            this.window = new JZYIndent.view.window.BasicWindow({
                autoShow: true
            });
        } else {
            Ext.Msg.alert("提示", "注意：无选中数据！");
        }
    },
    //费项设置(弹窗)
    onWinClick: function (view, rec) {
        var vw = this.getView(),
            grid = this.lookupReference("ratesgrid"),
            combo = this.lookupReference("building"),
            tree = this.lookupReference('rateslist'),
            selected = tree.getSelectionModel().selected.items,
            selection = grid.getSelectionModel().getSelected(),
            message = '??',
            firstRowIndex, firstColumnIndex, lastRowIndex, unitId, receiveUseId, lastColumnIndex;
        if (!selection) {
            Ext.Msg.alert("提示", "未选择楼栋或单元");
            return;
        } else if (selection.isCells) {
            firstRowIndex = selection.getFirstRowIndex();
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = selection.getLastRowIndex();
            lastColumnIndex = selection.getLastColumnIndex();
            //判断是否选中并且选中项已应用费项
            if (Object.values(grid.getStore().getAt(firstRowIndex).data)[parseInt(firstColumnIndex / 2 - 1)] != null && grid.getStore().getAt(firstRowIndex).data["receiveUseId" + parseInt(firstColumnIndex / 2 - 1)] != "-1" && grid.getStore().getAt(firstRowIndex).data["receiveUseId" + parseInt(firstColumnIndex / 2 - 1)] != undefined) {
                this.window = new JZYIndent.view.window.RateWindow({
                    autoShow: true
                });
                var form2 = this.window.query("form")[1],
                    form3 = this.window.query("form")[2],
                    form = this.window.query("form")[0];
                unitId = grid.getStore().getAt(firstRowIndex).data["unitId" + parseInt(firstColumnIndex / 2 - 1)];
                console.log(unitId);
                receiveUseId = grid.getStore().getAt(firstRowIndex).data["receiveUseId" + parseInt(firstColumnIndex / 2 - 1)];
                //请求点击单元格表单数据
                console.log(receiveUseId);
                console.log(unitId);
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/fin/receive/getReceiveUseById.do',
                    method: 'POST',
                    scope: this,
                    async: false,
                    withCredentials: true,
                    params: {
                        receiveUseId: receiveUseId
                    },
                    success: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        console.log(respText);
                        var formdata = Ext.create('abc', respText.data);
                        form2.getForm().loadRecord(formdata);
                        form3.getForm().loadRecord(formdata);
                    },
                    failure: function () {
                        Ext.Msg.alert("提示", "请求失败！");
                    },
                    callback: function (opts, success, response) {
                    }
                });
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/base/res/getUnitById.do',
                    method: 'POST',
                    scope: this,
                    async: false,
                    withCredentials: true,
                    params: {
                        fid: unitId
                    },
                    success: function (result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        console.log(respText);
                        var formdata = Ext.create('abc', respText.data);
                        form.getForm().loadRecord(formdata);
                    },
                    failure: function () {
                        Ext.Msg.alert("提示", "请求失败！");
                    },
                    callback: function (opts, success, response) {
                    }
                });
            } else {
                Ext.Msg.alert("提示", "当前选中项信息为空");
            }
        }
    },
    //费表设置(弹窗)
    onChargeClick: function (view, rec) {
        this.window = new JZYIndent.view.window.parentChargeWin({
            autoShow: true
        });
        var vw = this.getView(),
            form = this.window.down("form"),
            grid = this.lookupReference("chargegrid"),
            combo = this.lookupReference("tbuilding"),
            tree = this.lookupReference('chargeDTree'),
            selected = tree.getSelectionModel().selected.items,
            selection = grid.getSelectionModel().getSelected(),
            message = '??',
            firstRowIndex, firstColumnIndex, lastRowIndex, unitId, meterUseId, lastColumnIndex;
        if (!selection) {
            Ext.Msg.alert("提示", "未选择楼栋或单元");
            return;
        } else if (selection.isCells) {
            firstRowIndex = selection.getFirstRowIndex();
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = selection.getLastRowIndex();
            lastColumnIndex = selection.getLastColumnIndex();
            console.log(grid.getStore());
            console.log(firstColumnIndex);
            if (Object.values(grid.getStore().getAt(firstRowIndex).data)[parseInt(firstColumnIndex - 1)] != null) {
                unitId = grid.getStore().getAt(firstRowIndex).data["unitId" + parseInt(firstColumnIndex - 1)];
                meterUseId = grid.getStore().getAt(firstRowIndex).data["meterUseId" + parseInt(firstColumnIndex - 1)];
            } else //请求点击单元格表单数据
            // Ext.Ajax.request({
            //     url: JZYIndent.Cfg.server + '/' + "fin/receive/getReceiveUseById.do",
            //     method: 'POST',
            //     scope: this,
            //     async: false,
            //     withCredentials: true,
            //     params: {meterUseId: meterUseId},
            //     success: function (result) {
            //         var respText = Ext.util.JSON.decode(result.responseText);
            //         console.log(respText)
            //         //form.loadRecord(respText.data);
            //     },
            //     failure: function () {
            //         Ext.Msg.alert("提示", "请求失败！");
            //     },
            //     callback: function (opts, success, response) {
            //
            //     },
            // })
            {
                Ext.Msg.alert("提示", "当前选中项信息为空");
            }
        }
    },
    //应付费用设置(弹窗)
    setW: function (a) {
        this.window = new JZYIndent.view.window.SetWindow({
            autoShow: true
        });
    },
    //添加应付(弹窗)
    addW: function () {
        this.window = new JZYIndent.view.window.AddWindow({
            autoShow: true
        });
    },
    //计算器点击项目
    btnTreeClick: function (view, record, item, index, e, eOpts) {
        var expression = Ext.ComponentQuery.query('textareafield[name = "expression"]')[0];
        //取得id为expression的组件
        var oldValue = expression.getValue();
        //得到输入的值
        oldValue += record.data.text;
        expression.setValue(oldValue);
    },
    //计算器点击键盘
    btnClick: function (btn) {
        var expression = Ext.ComponentQuery.query('textareafield[name = "expression"]')[0];
        //取得id为expression的组件
        var oldValue = expression.getValue();
        //得到输入的值
        var re = /^[0-9]+.?[0-9]*$/;
        if (btn.symbol == 'back') {
            //如果选择后退键
            oldValue = oldValue.substr(0, oldValue.length - 1);
        } else if (btn.symbol == 'clear') {
            //如果选择呢清除键
            oldValue = '';
        } else // else   if (btn.symbol ==  '=' ){ //如果选择等于键
        //     calculate();
        // }
        //         else   if (btn.symbol ==  '.' ){ //如果选择小数点
        //
        //         if (re.test(oldValue[0])){
        //             oldValue += btn.symbol;
        //         }else{
        // return;
        //         }
        //         }
        {
            oldValue += btn.symbol;
        }
        expression.setValue(oldValue);
    },
    //审核/反审核
    audit: function (item, e) {
        var me = this.getView(),
            grid = me.down('receivablelistlist'),
            //获取grid
            sm = grid.getSelectionModel();
        if (sm.hasSelection()) {
            var record = sm.getSelection()[0];
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + item.iurl,
                method: 'POST',
                scope: this,
                withCredentials: true,
                //headers: { 'Content-Type': 'application/json' },
                params: {
                    fid: record.data['fid']
                },
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.toast({
                        title: '提示',
                        html: record.data["feeName"] + '审核成功',
                        align: 't',
                        bodyPadding: 10
                    });
                    grid.getStore().reload();
                },
                // record.data["status"] == "1" ? record.set("status", '2') : record.set("status", '1');
                // record.commit();
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：无选中数据！");
        }
    },
    //付款单
    PayPreview: function () {
        var grid = this.lookupReference('payorder');
        var sm = grid.getSelectionModel();
        //通过获取选中行数据，展示至AlterForm表单
        if (sm.hasSelection()) {
            //grid选中行(获取选中行数据)
            var record = sm.getSelection();
            //定义数组存放选择行id
            var mycars = new Array();
            //遍历
            for (var i = 0; i < record.length; i++) {
                mycars[i] = record[i].data.fid;
            }
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/fin/pay/getPayBillByIds.do',
                method: 'POST',
                scope: this,
                async: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    ids: mycars
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    this.AddPrintPay(respText.data);
                    LODOP.PREVIEW();
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：请选择付款单！");
        }
    },
    //打印付款单
    AddPrintPay: function (data) {
        var whichOne = 'jx';
        var fenyeSize = 0;
        var printNum;
        //序号
        LODOP.PRINT_INITA(0, 0, 1800, 1460, "套打EMS的模板");
        if (whichOne == "bz" || whichOne == "hn") {
            LODOP.SET_PRINT_PAGESIZE(0, 0, 0, "A4");
            fenyeSize = 1070;
        } else if (whichOne == "jx") {
            LODOP.SET_PRINT_PAGESIZE(1, '210mm', '140mm', "A4");
            //一开始用的是像素，后来都改成用mm为单位
            fenyeSize = 140;
        }
        if (whichOne == "zj") {
            LODOP.PRINT_INITA(100, 11, 800, 1460, "套打EMS的模板");
            fenyeSize = 470;
            LODOP.SET_PRINT_PAGESIZE(0, 1900, 1300, "A4");
            LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Width:80%;Height:80%");
        }
        for (var i = 0; i < data.length; i++) {
            var lastheght = 2;
            //左边栏
            // LODOP.ADD_PRINT_TEXT("8mm", "0mm", "202mm", "12mm", "付款单");
            // // LODOP.SET_PRINT_STYLEA(0, "TextFrame", 8);
            // // LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
            // LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
            // LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            // LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
            LODOP.ADD_PRINT_TEXT("4mm", "0mm", "202mm", "12mm", data[i]['confName']);
            LODOP.SET_PRINT_STYLEA(0, "TextFrame", 8);
            LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
            LODOP.ADD_PRINT_TEXT("12mm", "0mm", "202mm", "12mm", "付款单");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            var size = 10;
            var extendSize = 0;
            var table_hegth = (size + 1) * 25;
            var fonsize = 4;
            //上面的信息
            LODOP.SET_PRINT_STYLE("FontSize", 13);
            LODOP.ADD_PRINT_TEXT("25.29mm", "12.54mm", "60.13mm", "7.37mm", "单元名称：" + data[i]['buildName']);
            LODOP.ADD_PRINT_TEXT("25.29mm", "116.54mm", "60.13mm", "7.37mm", "业户名称：" + data[i]['customerName']);
            LODOP.ADD_PRINT_TEXT("33.11mm", "12.54mm", "60.13mm", "7.37mm", "填票日期：" + data[i]['payDate']);
            LODOP.ADD_PRINT_TEXT("33.11mm", "116.54mm", "60.13mm", "7.37mm", "No：" + data[i]['payNum']);
            //标题等
            LODOP.ADD_PRINT_TEXT("42.15mm", "13.72mm", "47.55mm", "5.37mm", "付款项目");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("42.15mm", "60.85mm", "30.52mm", "5.37mm", "付款年月");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("42.15mm", "90.65mm", "30.55mm", "5.37mm", "付款方式");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("42.15mm", "120.5mm", "30.55mm", "5.37mm", "实付金额");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("42.15mm", "150.82mm", "39.81mm", "5.37mm", "备注");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            //表格线
            LODOP.ADD_PRINT_LINE("41.31mm", "13mm", "41.31mm", "193.00mm", 0, 1);
            // 最上条标题横线
            LODOP.ADD_PRINT_LINE("47.31mm", "13mm", "47.31mm", "193.00mm", 0, 1);
            // 标题下横线
            LODOP.ADD_PRINT_LINE("41.31mm", "13mm", "47.11mm", "13mm", 0, 1);
            // 最左竖线
            LODOP.ADD_PRINT_LINE("41.31mm", "60mm", "47.11mm", "60mm", 0, 1);
            // 付款项目后竖线
            LODOP.ADD_PRINT_LINE("41.31mm", "90mm", "47.11mm", "90mm", 0, 1);
            // 付款年月后竖线
            LODOP.ADD_PRINT_LINE("41.31mm", "120mm", "47.11mm", "120mm", 0, 1);
            // 付款方式后竖线
            //LODOP.ADD_PRINT_LINE("41.31mm", "140mm", "47.11mm", "140mm", 0, 1);// 实付金额后竖线
            LODOP.ADD_PRINT_LINE("41.31mm", "150mm", "47.11mm", "150mm", 0, 1);
            // 备注后竖线
            LODOP.ADD_PRINT_LINE("41.31mm", "193mm", "47.11mm", "193mm", 0, 1);
            // 最右竖线
            //动态列表信息
            var trheight = 47.31;
            //用于每个竖线距离上面的固定长度
            var thHeight = 48.5;
            //用于每行距离上面的固定长度47.98
            var newHeight = 0;
            //用于动态增加一行的长度
            var lastSize = 0;
            //分页前的那个下标
            var allProductNumber = 0;
            var aaa = "1234567890";
            var bbb = "1234567890";
            var ccc = "1234567";
            for (var k = 0; k < 6; k++) {
                newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
                var SizeTmpt = parseInt(this.getByteLen(aaa) / 35);
                if (parseInt(this.getByteLen(bbb) / 16) > SizeTmpt) {
                    SizeTmpt = parseInt(this.getByteLen(bbb) / 16);
                }
                if (parseInt(this.getByteLen(ccc) / 17) > SizeTmpt) {
                    SizeTmpt = parseInt(this.getByteLen(ccc) / 17);
                }
                //判断是否有数据
                if (k < data[i].details.length) {
                    LODOP.SET_PRINT_STYLE("FontSize", 10);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13.72mm", "47.55mm", "5.37mm", data[i].details[k]['feeName']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "59.85mm", "30.52mm", 5.3 + SizeTmpt * fonsize + "mm", data[i].details[k]['payableDeadline']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "89.65mm", "30.55mm", 5.3 + SizeTmpt * fonsize + "mm", data[i]['payMethod']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "119.5mm", "30.55mm", 5.3 + SizeTmpt * fonsize + "mm", data[i].details[k]['paidAmount']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "150.82mm", "39.81mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                } else {
                    LODOP.SET_PRINT_STYLE("FontSize", 10);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13.72mm", "47.55mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "59.85mm", "30.52mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "89.65mm", "30.55mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "119.5mm", "30.55mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "150.82mm", "39.81mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                }
                extendSize += SizeTmpt;
                newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
                if (k == lastSize + 1 && k != 1) {
                    LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", 0, 1);
                }
                //每条数据后加一横线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight + 5.37 + "mm", "13mm", 0, 1);
                //最左竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "60mm", trheight + newHeight + 5.37 + "mm", "60mm", 0, 1);
                //付款项目后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "90mm", trheight + newHeight + 5.37 + "mm", "90mm", 0, 1);
                //付款年月后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "120mm", trheight + newHeight + 5.37 + "mm", '120mm', 0, 1);
                //付款方式后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "150mm", trheight + newHeight + 5.37 + "mm", "150mm", 0, 1);
                //实付金额后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", trheight + newHeight + 5.37 + "mm", "193mm", 0, 1);
                //最右竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight + 5.57 + "mm", "13mm", trheight + newHeight + 5.57 + "mm", "193mm", 0, 1);
                //每条数据后加一横线
                if ((trheight + newHeight + 5.57) % fenyeSize <= fenyeSize && (trheight + 5.57 + newHeight) % fenyeSize >= (fenyeSize - 15)) {
                    LODOP.NewPage();
                    thHeight = 0.67;
                    lastSize = k;
                    trheight = 0;
                    extendSize = 0;
                }
            }
            table_hegth = trheight + newHeight + 5.57;
            if (whichOne == "hn" || whichOne == "jx") {
                lastheght += 5.4;
                LODOP.SET_PRINT_STYLE("FontSize", 13);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "13mm", "47.55mm", "7.37mm", "合计人民币(大写)");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "60.85mm", "60mm", "7.37mm", data[i]['payTotalCN']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "120.56mm", "29.55mm", "7.37mm", "小写金额");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "150.82mm", "39.81mm", "7.37mm", data[i]['payTotal']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_LINE(5.8 + table_hegth + "mm", "13mm", 5.8 + table_hegth + "mm", "193mm", 0, 1);
                //备注上横线
                //LODOP.ADD_PRINT_LINE(9.4+table_hegth+"mm","13mm",9.4+table_hegth+"mm","193mm",0,1);//最后一横线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "13mm", table_hegth + 5.8 + "mm", "13mm", 0, 1);
                // 最左竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "60mm", table_hegth + 5.8 + "mm", "60mm", 0, 1);
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "120mm", 5.8 + table_hegth + "mm", "120mm", 0, 1);
                // 单价后竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "150mm", 5.8 + table_hegth + "mm", "150mm", 0, 1);
                // 数量后竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "193mm", table_hegth + 5.8 + "mm", "193mm", 0, 1);
                // 最右竖线
                if ((trheight + 9.4 + newHeight) % fenyeSize <= fenyeSize && (trheight + newHeight + 9.4) % fenyeSize >= (fenyeSize - 6)) {
                    LODOP.NewPage();
                    lastheght = 0;
                    table_hegth = 0;
                }
            }
            // 最下显示订单信息
            var moneyWeight = 0;
            if ((lastheght + table_hegth + 5) % fenyeSize <= fenyeSize && (lastheght + table_hegth + 5) % fenyeSize >= (fenyeSize - 6)) {
                LODOP.NewPage();
                lastheght = 0;
                table_hegth = 0;
            }
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "12.54mm", "60.81mm", "5.37mm", "会计：");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "82.54mm", "60.81mm", "5.37mm", "出纳：");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "142.54mm", "60.81mm", "5.37mm", "领款人：");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
            LODOP.NewPage();
        }
    },
    ReceiptPreview: function () {
        var grid = this.lookupReference('receiptorder');
        var sm = grid.getSelectionModel();
        //通过获取选中行数据，展示至AlterForm表单
        if (sm.hasSelection()) {
            //grid选中行(获取选中行数据)
            var record = sm.getSelection();
            //定义数组存放选择行id
            var mycars = new Array();
            //遍历
            for (var i = 0; i < record.length; i++) {
                mycars[i] = record[i].data.fid;
            }
            console.log(mycars);
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/fin/receive/printReceiveBill.do',
                method: 'POST',
                scope: this,
                async: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    ids: mycars
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText.data)
                    this.AddPrintReceipt(respText.data);
                    LODOP.PREVIEW();
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：请选择收款单！");
        }
    },
    getStatusValue: function(job){//根据job代码，获取是否打印成功
        var self=this;
        LODOP.On_Return=function(TaskID,Value){
            console.log("TaskID:"+TaskID);
            console.log("打印成功状态:"+Value);//打印成功状态
            self.printStatus=Value;
        };
        LODOP.GET_VALUE("PRINT_STATUS_OK",job);
    },
    ReceiptWinPreview: function () {
        var text = this.lookupReference('receiveId'),
            receiveId = text.getValue();
        if (receiveId != null || receiveId != undefined) {
            var mycars = new Array();
            mycars.push(parseInt(receiveId));
            console.log(mycars);
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/fin/receive/printReceiveBill.do',
                method: 'POST',
                scope: this,
                async: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    ids: mycars
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText.data)
                    this.AddPrintReceipt(respText.data);
                    LODOP.PREVIEW();
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：没有收款单ID！");
        }
    },
    //打印收款单
    AddPrintReceipt: function (data) {
        var whichOne = 'jx';
        var fenyeSize = 0;
        var printNum;
        //序号
        LODOP.SET_PRINT_PAGESIZE(1, '210mm', '95mm', "A4");
        //一开始用的是像素，后来都改成用mm为单位
        fenyeSize = 140;

        for (var i = 0; i < data.length; i++) {
            var lastheght = 2;
            //左边栏
            //LODOP.ADD_PRINT_TEXT("4mm", "0mm", "202mm", "12mm", data[i].header['confName']);
            LODOP.SET_PRINT_STYLEA(0, "TextFrame", 8);
            LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
            LODOP.ADD_PRINT_TEXT("2mm", "0mm", "202mm", "2mm", data[i].header['confName'].replace("管理有限公司","")+"收款收据");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            var size = 10;
            var extendSize = 0;
            var table_hegth = (size + 1) * 25;
            var fonsize = 4;
            //上面的信息
            if (whichOne == "hn" || whichOne == "jx") {
                LODOP.SET_PRINT_STYLE("FontSize", 13);
                LODOP.ADD_PRINT_TEXT("10.29mm", "12.54mm", "202mm", "7.37mm", "单元名称：" + data[i].header['unitName']);
                LODOP.ADD_PRINT_TEXT("18.11mm", "12.54mm", "60.13mm", "7.37mm", "业户名称：" + data[i].header['currentOwner']);
                LODOP.ADD_PRINT_TEXT("18.11mm", "69.54mm", "60.13mm", "7.37mm", "填票日期：" + data[i].header['createTime']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT("18.11mm", "126.54mm", "60.13mm", "7.37mm", "No：" + data[i].header['receiveNum']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            }
            //标题等
            LODOP.ADD_PRINT_TEXT("26.15mm", "13.72mm", "27.55mm", "5.37mm", "收款项目");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "40.85mm", "20.52mm", "5.37mm", "起始日期");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "60.65mm", "20.55mm", "5.37mm", "终止日期");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "80.5mm", "20.55mm", "5.37mm", "上次读数");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "100.57mm", "20.55mm", "5.37mm", "本次读数");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            //LODOP.ADD_PRINT_TEXT("26.15mm", "120.56mm", "16.55mm", "5.37mm", "面积");
            LODOP.ADD_PRINT_TEXT("26.15mm", "120.56mm", "16.55mm", "5.37mm", "用量");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "136.56mm", "16.55mm", "5.37mm", "单价");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "152.56mm", "18.55mm", "5.37mm", "金额");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.15mm", "170.82mm", "19.81mm", "5.37mm", "备注");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            //表格线
            LODOP.ADD_PRINT_LINE("25.31mm", "13mm", "25.31mm", "193.00mm", 0, 1);
            // 最上条标题横线
            LODOP.ADD_PRINT_LINE("31.31mm", "13mm", "31.31mm", "193.00mm", 0, 1);
            // 标题下横线
            LODOP.ADD_PRINT_LINE("25.31mm", "13mm", "31.11mm", "13mm", 0, 1);
            // 最左竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "40mm", "31.11mm", "40mm", 0, 1);
            // 收款后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "60mm", "31.11mm", "60mm", 0, 1);
            // 起始日期后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "80mm", "31.11mm", "80mm", 0, 1);
            // 终止日期后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "100mm", "31.11mm", "100mm", 0, 1);
            // 上次读数后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "120mm", "31.11mm", "120mm", 0, 1);
            // 本次读数后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "136mm", "31.11mm", "136mm", 0, 1);
            // 用量后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "152mm", "31.11mm", "152mm", 0, 1);
            // 单价后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "170mm", "31.11mm", "170mm", 0, 1);
            // 后后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "193mm", "31.11mm", "193mm", 0, 1);
            // 最右竖线
            //动态列表信息
            var trheight = 31.31;
            //用于每个竖线距离上面的固定长度
            var thHeight = 32.5;
            //用于每行距离上面的固定长度47.98
            var newHeight = 0;
            //用于动态增加一行的长度
            var lastSize = 0;
            //分页前的那个下标
            var allProductNumber = 0;
            var aaa = "1234567890";
            var bbb = "1234567890";
            var ccc = "1234567";
            for (var k = 0; k < 6; k++) {
                newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
                var SizeTmpt = parseInt(this.getByteLen(aaa) / 35);
                if (parseInt(this.getByteLen(bbb) / 16) > SizeTmpt) {
                    SizeTmpt = parseInt(this.getByteLen(bbb) / 16);
                }
                if (parseInt(this.getByteLen(ccc) / 17) > SizeTmpt) {
                    SizeTmpt = parseInt(this.getByteLen(ccc) / 17);
                }
                //判断是否有数据
                if (k < data[i].details.length) {
                    LODOP.SET_PRINT_STYLE("FontSize", 10);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13.72mm", "27.55mm", "5.37mm", data[i].details[k]['feeName']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "39.85mm", "22.52mm", 5.3 + SizeTmpt * fonsize + "mm", data[i].details[k]['billingStartTime']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "59.65mm", "22.55mm", 5.3 + SizeTmpt * fonsize + "mm", data[i].details[k]['billingEndTime']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "79.5mm", "22.55mm", 5.3 + SizeTmpt * fonsize + "mm", data[i].details[k]['lastDosage']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "99.57mm", "22.55mm", "5.37mm", data[i].details[k]['currentDosage']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "120.56mm", "16.55mm", "5.37mm", data[i].details[k]['dosage']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "136.56mm", "16.55mm", "5.37mm", data[i].details[k]['price']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "152.56mm", "18.55mm", "5.37mm", data[i].details[k]['receiveAmount']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "170.82mm", "19.81mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                } else {
                    LODOP.SET_PRINT_STYLE("FontSize", 10);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13.72mm", "27.55mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "39.85mm", "22.52mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "59.65mm", "22.55mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "79.5mm", "22.55mm", 5.3 + SizeTmpt * fonsize + "mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "99.57mm", "22.55mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "120.56mm", "16.55mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "136.56mm", "16.55mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "152.56mm", "18.55mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "170.82mm", "19.81mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                }
                extendSize += SizeTmpt;
                newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
                if (k == lastSize + 1 && k != 1) {
                    LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", 0, 1);
                }
                //每条数据后加一横线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight + 5.37 + "mm", "13mm", 0, 1);
                //最左竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "40mm", trheight + newHeight + 5.37 + "mm", "40mm", 0, 1);
                //行号后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "60mm", trheight + newHeight + 5.37 + "mm", "60mm", 0, 1);
                //供货商后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "80mm", trheight + newHeight + 5.37 + "mm", '80mm', 0, 1);
                //型号后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "100mm", trheight + newHeight + 5.37 + "mm", "100mm", 0, 1);
                //颜色后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "120mm", trheight + newHeight + 5.37 + "mm", "120mm", 0, 1);
                //单价后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "136mm", trheight + newHeight + 5.37 + "mm", "136mm", 0, 1);
                //单价后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "152mm", trheight + newHeight + 5.37 + "mm", "152mm", 0, 1);
                //单价后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "170mm", trheight + newHeight + 5.37 + "mm", "170mm", 0, 1);
                //数量后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", trheight + newHeight + 5.37 + "mm", "193mm", 0, 1);
                //最右竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight + 5.57 + "mm", "13mm", trheight + newHeight + 5.57 + "mm", "193mm", 0, 1);
                //每条数据后加一横线
                if ((trheight + newHeight + 5.57) % fenyeSize <= fenyeSize && (trheight + 5.57 + newHeight) % fenyeSize >= (fenyeSize - 15)) {
                    LODOP.NewPage();
                    thHeight = 0.67;
                    lastSize = k;
                    trheight = 0;
                    extendSize = 0;
                }
            }
            table_hegth = trheight + newHeight + 5.57;
            if (whichOne == "hn" || whichOne == "jx") {
                lastheght += 5.4;
                LODOP.SET_PRINT_STYLE("FontSize", 13);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "13mm", "47.55mm", "7.37mm", "合计人民币(大写)");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "40.85mm", "112mm", "7.37mm", data[i].header['receiveAmountCN']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "152.56mm", "18.55mm", "7.37mm", data[i].header['receiveAmount']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "170.82mm", "19.81mm", "7.37mm", '');
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_LINE(5.8 + table_hegth + "mm", "13mm", 5.8 + table_hegth + "mm", "193mm", 0, 1);
                //备注上横线
                //LODOP.ADD_PRINT_LINE(9.4+table_hegth+"mm","13mm",9.4+table_hegth+"mm","193mm",0,1);//最后一横线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "13mm", table_hegth + 5.8 + "mm", "13mm", 0, 1);
                // 最左竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "60mm", table_hegth + 5.8 + "mm", "60mm", 0, 1);
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "152mm", 5.8 + table_hegth + "mm", "152mm", 0, 1);
                // 单价后竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "170mm", 5.8 + table_hegth + "mm", "170mm", 0, 1);
                // 数量后竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "193mm", table_hegth + 5.8 + "mm", "193mm", 0, 1);
                // 最右竖线
                if ((trheight + 9.4 + newHeight) % fenyeSize <= fenyeSize && (trheight + newHeight + 9.4) % fenyeSize >= (fenyeSize - 6)) {
                    LODOP.NewPage();
                    lastheght = 0;
                    table_hegth = 0;
                }
            }
            // 最下显示订单信息
            var moneyWeight = 0;
            if ((lastheght + table_hegth + 5) % fenyeSize <= fenyeSize && (lastheght + table_hegth + 5) % fenyeSize >= (fenyeSize - 6)) {
                LODOP.NewPage();
                lastheght = 0;
                table_hegth = 0;
            }
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "12.54mm", "60.81mm", "5.37mm", "第一联：存根");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "82.54mm", "60.81mm", "5.37mm", "第二联：客户");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "142.54mm", "60.81mm", "5.37mm", "第三联：财务");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 5 + "mm", "15.54mm", "120.13mm", "5.37mm", "说明：本收据收款单位签章方为有效，本收据手写无效。");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 5 + "mm", "150.54mm", "50.13mm", "5.37mm", "收款单位：（盖章）");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 5 + "mm", "202mm", "1.13mm", "5.37mm", "");
            console.log(lastheght + table_hegth + 5 )
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
            LODOP.NewPage();
        }
       /* var self=this;
        LODOP=getLodop();
        LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);//执行该语句之后，PRINT指令不再返回那个所谓“打印成功”
        if (LODOP.CVERSION) {//判断c_lodop是否存在，安装了c-lodop就会存在
            LODOP.On_Return=function(TaskID,Value){
                console.log("TaskID:"+TaskID);
                console.log("Value:"+Value);//job代码
                self.jobCode=Value;
                var timer = setInterval(function(){
                   /!* console.log(strResult)
                    console.log("每次轮询的状态："+self.printStatus);*!/
                    if(self.printStatus!=0||self.printStatus!=false){
                        clearInterval(timer);
                        return;
                    }
                    console.log(123)
                    self.getStatusValue(Value);
                },300);
            };
        } else{
            console.log("c-lodop出错了");
        }*/



    },
    SuggestWinPreview: function () {
        var grid = Ext.ComponentQuery.query('suggestlist')[0],
            sm = grid.getSelectionModel();
        if (sm.getSelection().length !== 1) {
            return Ext.Msg.alert("操作提示", "请选择最多一行数据");
        }
        var fid = sm.getSelection()[0].data.fid;
        if (fid != null || fid != undefined) {
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/workOrder/printWorkOrder.do',
                method: 'GET',
                scope: this,
                async: false,
                params: {
                    workOrderId: fid
                },
                // 在使用跨源资源共享时，此字段是必要的。
                // 默认为:false
                withCredentials: true,
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText.data);
                    this.AddPrintSuggest(respText.data);
                    LODOP.PREVIEW();
                },
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：没有收款单ID！");
        }
    },
    AddPrintSuggest: function (data) {
        var whichOne = 'jx';
        var fenyeSize = 0;
        var printNum;
        //序号
        // LODOP.PRINT_INITA(0, 0, 1800, 1460, "套打EMS的模板");
        if (whichOne == "bz" || whichOne == "hn") {
            LODOP.SET_PRINT_PAGESIZE(3, 0, 0, "A4");
            fenyeSize = 1070;
        } else if (whichOne == "jx") {
            LODOP.SET_PRINT_PAGESIZE(3, '210mm', '140mm', "A4");
            //一开始用的是像素，后来都改成用mm为单位
            fenyeSize = 140;
        }
        if (whichOne == "zj") {
            LODOP.PRINT_INITA(100, 11, 800, 1460, "套打EMS的模板");
            fenyeSize = 470;
            LODOP.SET_PRINT_PAGESIZE(3, 1900, 1300, "A4");
            LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Width:80%;Height:80%");
        }
        var lastheght = 2;
        var size = 10;
        var extendSize = 0;
        var table_hegth = (size + 1) * 25;
        var fonsize = 4;
        //上面的信息
        if (whichOne == "hn" || whichOne == "jx") {
            LODOP.SET_PRINT_STYLE("FontSize", 13);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            /*  LODOP.ADD_PRINT_TEXT("25.29mm", "12.54mm", "60.13mm", "7.37mm", "客户姓名：" + data.workOrder.name);
              LODOP.ADD_PRINT_RECT("23.79mm", "11.04mm", "125.54mm", "8.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("25.29mm", "126.54mm", "60.13mm", "7.37mm", "客户电话：" + data.workOrder.phone);
              LODOP.ADD_PRINT_RECT("23.79mm", "125.04mm", "60.13mm", "8.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("33.11mm", "12.54mm", "100.13mm", "7.37mm", "工单时间：" + data.workOrder.workOrderTime);
              LODOP.ADD_PRINT_RECT("31.61mm", "11.04mm", "100.13mm", "8.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("33.11mm", "126.54mm", "60.13mm", "7.37mm", "工单编号：" + data.workOrder.workOrderNum);
              LODOP.ADD_PRINT_RECT("31.61mm", "125.04mm", "60.13mm", "8.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("40.93mm", "12.54mm", "60.13mm", "7.37mm", "工单来源："+data.workOrder.source);
              LODOP.ADD_PRINT_RECT("39.43mm", "11.04mm", "60.13mm", "7.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("40.93mm", "69.54mm", "60.13mm", "7.37mm", "投诉类型："+data.workOrder.type);
              LODOP.ADD_PRINT_RECT("39.43mm", "68.04mm", "60.13mm", "7.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("40.93mm", "126.54mm", "60.13mm", "7.37mm", "投诉方式："+data.workOrder.complaintsWay);
              LODOP.ADD_PRINT_RECT("39.43mm", "125.04mm", "60.13mm", "7.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("48.75mm", "12.54mm", "100.13mm", "7.37mm", "房间地址："+data.workOrder.address);
              LODOP.ADD_PRINT_RECT("47.25mm", "11.04mm", "100.13mm", "7.37mm",0,1);
              LODOP.ADD_PRINT_TEXT("56.57mm", "12.54mm", "202mm", "7.37mm", "工单内容："+data.workOrder.content);
              LODOP.ADD_PRINT_RECT("55.07mm", "11.04mm", "202mm", "7.37mm",0,1);*/
            var strStyle = "<style type=\"text/css\">\n" + "    .trLeft {\n" + "        border-top-width: 0px;\n" + "        border-right-width: 1px;\n" + "        border-bottom-width: 1px;\n" + "        border-left-width: 1px;\n" + "        border-top-style: solid;\n" + "        border-right-style: solid;\n" + "        border-bottom-style: solid;\n" + "        border-left-style: solid;\n" + "        border-top-color: #000000;\n" + "        border-right-color: #000000;\n" + "        border-bottom-color: #000000;\n" + "        border-left-color: #000000;\n" + "        text-align: center;\n" + "    }\n" + "\n" + "    .trRight {\n" + "        border-top-width: 0px;\n" + "        border-right-width: 1px;\n" + "        border-bottom-width: 1px;\n" + "        border-left-width: 0px;\n" + "        border-top-style: solid;\n" + "        border-right-style: solid;\n" + "        border-bottom-style: solid;\n" + "        border-left-style: solid;\n" + "        border-top-color: #000000;\n" + "        border-right-color: #000000;\n" + "        border-bottom-color: #000000;\n" + "        border-left-color: #000000;\n" + "        text-align: center;\n" + "    }\n" + "\n" + "    .trTop {\n" + "        border-top-width: 1px;\n" + "        border-right-width: 0px;\n" + "        border-bottom-width: 0px;\n" + "        border-left-width: 0px;\n" + "        border-top-style: solid;\n" + "        border-right-style: solid;\n" + "        border-bottom-style: solid;\n" + "        border-left-style: solid;\n" + "        border-top-color: #000000;\n" + "        border-right-color: #000000;\n" + "        border-bottom-color: #000000;\n" + "        border-left-color: #000000;\n" + "    }\n" + "\n" + "    .tdAll {\n" + "        border-top-width: 1px;\n" + "        border-right-width: 1px;\n" + "        border-bottom-width: 1px;\n" + "        border-left-width: 1px;\n" + "        border-top-style: solid;\n" + "        border-right-style: solid;\n" + "        border-bottom-style: solid;\n" + "        border-left-style: solid;\n" + "        border-top-color: #000000;\n" + "        border-right-color: #000000;\n" + "        border-bottom-color: #000000;\n" + "        border-left-color: #000000;\n" + "    }\n" + "\n" + "    .trButtom {\n" + "        border-top-width: 0px;\n" + "        border-right-width: 0px;\n" + "        border-bottom-width: 1px;\n" + "        border-left-width: 0px;\n" + "        border-top-style: solid;\n" + "        border-right-style: solid;\n" + "        border-bottom-style: solid;\n" + "        border-left-style: solid;\n" + "        border-top-color: #000000;\n" + "        border-right-color: #000000;\n" + "        border-bottom-color: #000000;\n" + "        border-left-color: #000000;\n" + "        text-align: left;\n" + "    }\n" + "\n" + "    .tdh {\n" + "        height: 30px;\n" + "        line-height: 30px;\n" + "        text-align: center;\n" + "        vertical-align: middle;\n" + "        font-size: 18px;\n" + "    }\n" + "\n" + "    .xt {\n" + "        border-collapse: collapse;\n" + "        /* 关键属性：合并表格内外边框(其实表格边框有2px，外面1px，里面还有1px哦) */\n" + "        border: 1px solid #000;\n" + "        /* 设置边框属性；样式(solid=实线)、颜色(#999=灰) */\n" + "        font-size: 13px;\n" + "    }\n" + "\n" + "    td{\n" + "    }\n" + "\n" + "    @media Print {\n" + "        .Noprn {\n" + "            display: none;\n" + "        }\n" + "    }\n" + "</style>",
                strHtml = strStyle + "<body><div algin=\"center\" style=\"font-size: 13px;\">\n" + "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"700\">\n" + "        <tbody>\n" + "            <tr>\n" + "                <td align=\"center\" class=\" tdAll\" height=\"50\" colspan=\"10\" style=\"font-size: 18px;\" valign=\"middle\">\n" + "                    <strong>工单单据</strong></td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"40\" width=\"100\">客户姓名：</td>\n" + "                <td class=\"trRight\" colspan=\"3\" width=\"100\">" + data.workOrder.name + "</td>\n" + "                <td class=\"trRight\" width=\"100\">客户电话：</td>\n" + "                <td class=\"trRight\" colspan=\"3\" width=\"120\">" + data.workOrder.phone + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"40\">工单时间：</td>\n" + "                <td class=\"trRight\" colspan=\"3\">" + data.workOrder.workOrderTime + "</td>\n" + "                <td class=\"trRight\" width=\"100\">工单编号：</td>\n" + "                <td class=\"trRight\" colspan=\"3\">" + data.workOrder.workOrderNum + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"40\">工单来源：</td>\n" + "                <td class=\"trRight\" colspan=\"1\" width=\"120\">" + data.workOrder.source + "</td>\n" + "                <td class=\"trRight\" colspan=\"2\" height=\"25\">投诉类型：</td>\n" + "                <td class=\"trRight\" colspan=\"1\">" + data.workOrder.type + "</td>\n" + "                <td class=\"trRight\" colspan=\"1\" height=\"25\">投诉方式：</td>\n" + "                <td class=\"trRight\" colspan=\"1\" width=\"120\">" + data.workOrder.complaintsWay + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"40\">房间地址：</td>\n" + "                <td class=\"trRight\" colspan=\"8\">" + data.workOrder.houseName + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"125\">工单内容：</td>\n" + "                <td class=\"trRight\" colspan=\"8\">" + data.workOrder.content + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"40\" width=\"100\">受理人：</td>\n" + "                <td class=\"trRight\" colspan=\"3\" width=\"100\">" + data.workOrder.dispose + "</td>\n" + "                <td class=\"trRight\" width=\"100\">受理时间：</td>\n" + "                <td class=\"trRight\" colspan=\"3\" width=\"120\">" + data.workOrder.disposeTime + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"40\" width=\"100\">工单状态：</td>\n" + "                <td class=\"trRight\" colspan=\"3\" width=\"100\">" + data.workOrder.status + "</td>\n" + "                <td class=\"trRight\" width=\"100\">状态时间：</td>\n" + "                <td class=\"trRight\" colspan=\"3\" width=\"120\">" + data.workOrder.arrivalTime + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" colspan=\"2\" height=\"125\">状态内容：</td>\n" + "                <td class=\"trRight\" colspan=\"8\">" + data.workOrder.returncontent + "</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td align=\"left\" class=\"trLeft trRight \" height=\"50\" colspan=\"10\" style=\"text-align:left; text-indent: 1em;border-left:1px #000000 solid;font-size: 18px;\" valign=\"middle\">\n" + "                    <strong>工单材料</strong></td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td class=\"trLeft\" height=\"40\">序号</td>\n" + "                <td class=\"trRight\" colspan=\"1\">借用单号</td>\n" + "                <td class=\"trRight\">出库类别</td>\n" + "                <td class=\"trRight\" colspan=\"2\">物品名称</td>\n" + "                <td class=\"trRight\">规格型号</td>\n" + "                <td class=\"trRight\">成本价格</td>\n" + "                <td class=\"trRight\">有偿价格</td>\n" + "            </tr>\n";
            var strGrid = "";
            for (var i = 0; i < data.materialList.length; i++) {
                strGrid = "            <tr>\n" + "                <td class=\"trLeft\" height=\"40\"></td>\n" + "                <td class=\"trRight\" colspan=\"1\">" + data.materialList[i].outboundNum + "</td>\n" + "                <td class=\"trRight\">" + data.materialList[i].outboundType + "</td>\n" + "                <td class=\"trRight\" colspan=\"2\">" + data.materialList[i].articleName + "</td>\n" + "                <td class=\"trRight\">" + data.materialList[i].specifications + "</td>\n" + "                <td class=\"trRight\">" + data.materialList[i].costPrice + "</td>\n" + "                <td class=\"trRight\">" + data.materialList[i].paidPrice + "</td>\n" + "            </tr>\n";
            }
            LODOP.ADD_PRINT_HTM(88, 50, 300, 200, strHtml + strGrid + "        </tbody>\n" + "    </table>\n" + "</div></body>");
        }
        LODOP.NewPage();
    },
    //转账单
    TransferVouchersPreview: function () {
        var grid = this.lookupReference('transferlist');
        var sm = grid.getSelectionModel();
        //通过获取选中行数据，展示至AlterForm表单
        if (sm.hasSelection()) {
            //grid选中行(获取选中行数据)
            var record = sm.getSelection();
            //定义数组存放选择行id
            var turnBillDetailIds = new Array();
            //遍历
            for (var i = 0; i < record.length; i++) {
                turnBillDetailIds[i] = record[i].data.turnBillDetailId;
            }
            var turnBillId = sm.getSelection()[0].data["turnBillId"];
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/fin/turn/printTurnBill.do',
                method: 'POST',
                scope: this,
                async: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    turnBillId: turnBillId,
                    turnBillDetailIds: turnBillDetailIds
                }),
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    this.AddPrintTransferVouchers(respText.data);
                    LODOP.PREVIEW();
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：请选择收款单！");
        }
    },
    //收款w
    ReceiptCreditNote: function () {
        var grid = this.lookupReference('creditNotelist'),
            sm = grid.getSelectionModel();
        if (sm.hasSelection()) {
            var record = sm.getSelection();
            //定义数组存放选择行id
            var mycars = new Array();
            //遍历
            for (var i = 0; i < record.length; i++) {
                delete record[i].data.id;
                mycars[i] = record[i].data;
            }
            console.log(mycars);
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/fin/receive/printReceiveManage.do',
                method: 'POST',
                scope: this,
                async: false,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    data: mycars
                }),
                withCredentials: true,
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    this.AddPrintCreditNote(respText.data);
                    LODOP.PREVIEW();
                },
                failure: function () {
                    Ext.Msg.alert("提示", "请求失败！");
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：无选中数据！");
        }
    },
    //打印转账单
    AddPrintTransferVouchers: function (data) {
        var whichOne = 'jx';
        var fenyeSize = 0;
        var printNum;
        //序号
        // LODOP.PRINT_INITA(0, 0, 1800, 1460, "套打EMS的模板");
        if (whichOne == "bz" || whichOne == "hn") {
            LODOP.SET_PRINT_PAGESIZE(3, 0, 0, "A4");
            fenyeSize = 1070;
        } else if (whichOne == "jx") {
            LODOP.SET_PRINT_PAGESIZE(3, '210mm', '140mm', "A4");
            //一开始用的是像素，后来都改成用mm为单位
            fenyeSize = 140;
        }
        if (whichOne == "zj") {
            LODOP.PRINT_INITA(100, 11, 800, 1460, "套打EMS的模板");
            fenyeSize = 470;
            LODOP.SET_PRINT_PAGESIZE(3, 1900, 1300, "A4");
            LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Width:80%;Height:80%");
        }
        console.log(data);
        //for (var i = 0; i < data.length; i++) {
        console.log(i);
        var lastheght = 2;
        //左边栏
        LODOP.ADD_PRINT_TEXT("4mm", "0mm", "202mm", "12mm", data.turnBill['confName']);
        LODOP.SET_PRINT_STYLEA(0, "TextFrame", 8);
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT("12mm", "0mm", "202mm", "12mm", "转账单明细表");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        var size = 10;
        var extendSize = 0;
        var table_hegth = (size + 1) * 25;
        var fonsize = 4;
        //上面的信息
        if (whichOne == "hn" || whichOne == "jx") {
            LODOP.SET_PRINT_STYLE("FontSize", 10);
            LODOP.ADD_PRINT_TEXT("25.29mm", "12.54mm", "60.13mm", "7.37mm", "客户名称：" + data.turnBill['customerName']);
            LODOP.ADD_PRINT_TEXT("25.29mm", "126.54mm", "60.13mm", "7.37mm", "单元名称：" + data.turnBill['unitName']);
            //LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("33.11mm", "12.54mm", "60.13mm", "7.37mm", "预收总金额：" + data.turnBill['receiveAmount']);
            LODOP.ADD_PRINT_TEXT("33.11mm", "126.54mm", "60.13mm", "7.37mm", "余额：" + data.turnBill['balanceAmount']);
        }
        //LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        //标题等
        LODOP.ADD_PRINT_TEXT("42.55mm", "13.72mm", "20.55mm", "5.37mm", "冲抵费项");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "33.5mm", "25.52mm", "5.37mm", "计费起始日期");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "58.5mm", "25.55mm", "5.37mm", "计费终止日期");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "83.5mm", "20.55mm", "5.37mm", "单价");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "103.57mm", "20.55mm", "5.37mm", "上次行度");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "123.56mm", "16.55mm", "5.37mm", "本次行度");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "139.56mm", "16.55mm", "5.37mm", "行度");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "155.56mm", "18.55mm", "5.37mm", "冲抵金额");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("42.55mm", "173.82mm", "19.81mm", "5.37mm", "备注");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        //表格线
        LODOP.ADD_PRINT_LINE("41.31mm", "13mm", "41.31mm", "193.00mm", 0, 1);
        // 最上条标题横线
        LODOP.ADD_PRINT_LINE("47.31mm", "13mm", "47.31mm", "193.00mm", 0, 1);
        // 标题下横线
        LODOP.ADD_PRINT_LINE("41.31mm", "13mm", "47.11mm", "13mm", 0, 1);
        // 最左竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "33mm", "47.11mm", "33mm", 0, 1);
        // 收款后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "58mm", "47.11mm", "58mm", 0, 1);
        // 起始日期后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "83mm", "47.11mm", "83mm", 0, 1);
        // 终止日期后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "103mm", "47.11mm", "103mm", 0, 1);
        // 上次读数后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "123mm", "47.11mm", "123mm", 0, 1);
        // 本次读数后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "139mm", "47.11mm", "139mm", 0, 1);
        // 用量后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "155mm", "47.11mm", "155mm", 0, 1);
        // 单价后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "173mm", "47.11mm", "173mm", 0, 1);
        // 后后竖线
        LODOP.ADD_PRINT_LINE("41.31mm", "193mm", "47.11mm", "193mm", 0, 1);
        // 最右竖线
        //动态列表信息
        var trheight = 47.31;
        //用于每个竖线距离上面的固定长度
        var thHeight = 48.5;
        //用于每行距离上面的固定长度47.98
        var newHeight = 0;
        //用于动态增加一行的长度
        var lastSize = 0;
        //分页前的那个下标
        var allProductNumber = 0;
        var aaa = "1234567890";
        var bbb = "1234567890";
        var ccc = "1234567";
        for (var k = 0; k < 6; k++) {
            newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
            var SizeTmpt = parseInt(this.getByteLen(aaa) / 35);
            if (parseInt(this.getByteLen(bbb) / 16) > SizeTmpt) {
                SizeTmpt = parseInt(this.getByteLen(bbb) / 16);
            }
            if (parseInt(this.getByteLen(ccc) / 17) > SizeTmpt) {
                SizeTmpt = parseInt(this.getByteLen(ccc) / 17);
            }
            //判断是否有数据
            if (k < data.turnBill["turnBillDetailList"].length) {
                LODOP.SET_PRINT_STYLE("FontSize", 10);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13.72mm", "20.55mm", "5.37mm", data.turnBill.turnBillDetailList[k]['feeName']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "32.85mm", "25.52mm", 5.3 + SizeTmpt * fonsize + "mm", data.turnBill.turnBillDetailList[k]['billingStartTime']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "57.65mm", "25.55mm", 5.3 + SizeTmpt * fonsize + "mm", data.turnBill.turnBillDetailList[k]['billingEndTime']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "83.5mm", "20.55mm", 5.3 + SizeTmpt * fonsize + "mm", data.turnBill.turnBillDetailList[k]['price']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "102.57mm", "20.55mm", "5.37mm", data.turnBill.turnBillDetailList[k]['thisReading']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "122.56mm", "16.55mm", "5.37mm", data.turnBill.turnBillDetailList[k]['lastReading']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "138.56mm", "16.55mm", "5.37mm", data.turnBill.turnBillDetailList[k]['dosage']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "154.56mm", "18.55mm", "5.37mm", data.turnBill.turnBillDetailList[k]['turnAmount']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "172.82mm", "19.81mm", "5.37mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            } else {
                LODOP.SET_PRINT_STYLE("FontSize", 10);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13.72mm", "20.55mm", "5.37mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "32.85mm", "25.52mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "57.65mm", "25.55mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "83.5mm", "20.55mm", 5.3 + SizeTmpt * fonsize + "mm", '');
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "102.57mm", "20.55mm", "5.37mm", '');
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "122.56mm", "16.55mm", "5.37mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "138.56mm", "16.55mm", "5.37mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "154.56mm", "18.55mm", "5.37mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "172.82mm", "19.81mm", "5.37mm", '');
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            }
            extendSize += SizeTmpt;
            newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
            if (k == lastSize + 1 && k != 1) {
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", 0, 1);
            }
            //每条数据后加一横线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight + 5.37 + "mm", "13mm", 0, 1);
            //最左竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "33mm", trheight + newHeight + 5.37 + "mm", "33mm", 0, 1);
            //行号后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "58mm", trheight + newHeight + 5.37 + "mm", "58mm", 0, 1);
            //供货商后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "83mm", trheight + newHeight + 5.37 + "mm", '83mm', 0, 1);
            //型号后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "103mm", trheight + newHeight + 5.37 + "mm", "103mm", 0, 1);
            //颜色后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "123mm", trheight + newHeight + 5.37 + "mm", "123mm", 0, 1);
            //单价后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "139mm", trheight + newHeight + 5.37 + "mm", "139mm", 0, 1);
            //单价后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "155mm", trheight + newHeight + 5.37 + "mm", "155mm", 0, 1);
            //单价后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "173mm", trheight + newHeight + 5.37 + "mm", "173mm", 0, 1);
            //数量后竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", trheight + newHeight + 5.37 + "mm", "193mm", 0, 1);
            //最右竖线
            LODOP.ADD_PRINT_LINE(trheight + newHeight + 5.57 + "mm", "13mm", trheight + newHeight + 5.57 + "mm", "193mm", 0, 1);
            //每条数据后加一横线
            if ((trheight + newHeight + 5.57) % fenyeSize <= fenyeSize && (trheight + 5.57 + newHeight) % fenyeSize >= (fenyeSize - 15)) {
                LODOP.NewPage();
                thHeight = 0.67;
                lastSize = k;
                trheight = 0;
                extendSize = 0;
            }
        }
        table_hegth = trheight + newHeight + 5.57;
        if (whichOne == "hn" || whichOne == "jx") {
            lastheght += 5.4;
            LODOP.SET_PRINT_STYLE("FontSize", 13);
            LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "13mm", "20.55mm", "7.37mm", "大写");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "33.85mm", "112mm", "7.37mm", data.turnBill['totalAmountCN']);
            //LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "155.56mm", "18.55mm", "7.37mm", "小写");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "173.82mm", "19.81mm", "7.37mm", data.turnBill['totalAmount']);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_LINE(5.8 + table_hegth + "mm", "13mm", 5.8 + table_hegth + "mm", "193mm", 0, 1);
            //备注上横线
            //LODOP.ADD_PRINT_LINE(9.4+table_hegth+"mm","13mm",9.4+table_hegth+"mm","193mm",0,1);//最后一横线
            LODOP.ADD_PRINT_LINE(table_hegth + "mm", "13mm", table_hegth + 5.8 + "mm", "13mm", 0, 1);
            // 最左竖线
            LODOP.ADD_PRINT_LINE(table_hegth + "mm", "33mm", table_hegth + 5.8 + "mm", "33mm", 0, 1);
            LODOP.ADD_PRINT_LINE(table_hegth + "mm", "155mm", 5.8 + table_hegth + "mm", "155mm", 0, 1);
            // 单价后竖线
            LODOP.ADD_PRINT_LINE(table_hegth + "mm", "173mm", 5.8 + table_hegth + "mm", "173mm", 0, 1);
            // 数量后竖线
            LODOP.ADD_PRINT_LINE(table_hegth + "mm", "193mm", table_hegth + 5.8 + "mm", "193mm", 0, 1);
            // 最右竖线
            if ((trheight + 9.4 + newHeight) % fenyeSize <= fenyeSize && (trheight + newHeight + 9.4) % fenyeSize >= (fenyeSize - 6)) {
                LODOP.NewPage();
                lastheght = 0;
                table_hegth = 0;
            }
        }
        // 最下显示订单信息
        var moneyWeight = 0;
        if ((lastheght + table_hegth + 5) % fenyeSize <= fenyeSize && (lastheght + table_hegth + 5) % fenyeSize >= (fenyeSize - 6)) {
            LODOP.NewPage();
            lastheght = 0;
            table_hegth = 0;
        }
        // LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "12.54mm", "60.81mm", "5.37mm", "第一联：存根");
        // LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "82.54mm", "60.81mm", "5.37mm", "第二联：客户");
        // LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + "mm", "142.54mm", "60.81mm", "5.37mm", "第三联：财务");
        // LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 8 + "mm", "15.54mm", "120.13mm", "7.37mm", "说明：本收据收款单位签章方为有效，本收据手写无效。");
        // LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 8 + "mm", "150.54mm", "50.13mm", "7.37mm", "收款单位：（盖章）");
        // LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
        LODOP.NewPage();
    },
    //}
    //打印收款通知单
    AddPrintCreditNote: function (data) {
        var whichOne = 'jx';
        var fenyeSize = 0;
        var printNum;
        //序号
        // LODOP.PRINT_INITA(0, 0, 1800, 1460, "套打EMS的模板");
        if (whichOne == "bz" || whichOne == "hn") {
            LODOP.SET_PRINT_PAGESIZE(3, 0, 0, "A4");
            fenyeSize = 1070;
        } else if (whichOne == "jx") {
            LODOP.SET_PRINT_PAGESIZE(3, '210mm', '140mm', "A4");
            //一开始用的是像素，后来都改成用mm为单位
            fenyeSize = 140;
        }
        if (whichOne == "zj") {
            LODOP.PRINT_INITA(100, 11, 800, 1460, "套打EMS的模板");
            fenyeSize = 470;
            LODOP.SET_PRINT_PAGESIZE(3, 1900, 1300, "A4");
            LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Width:80%;Height:80%");
        }
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            console.log(i);
            var lastheght = 2;
            //左边栏
            // LODOP.ADD_PRINT_TEXT("4mm", "0mm", "202mm", "12mm", "通知单");
            // LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
            // LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            // LODOP.SET_PRINT_STYLEA(0, "TextFrame", 8);
            // LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
            // LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
            LODOP.ADD_PRINT_TEXT("4mm", "0mm", "202mm", "12mm", data[i]['confName']);
            LODOP.SET_PRINT_STYLEA(0, "TextFrame", 8);
            LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
            LODOP.ADD_PRINT_TEXT("12mm", "0mm", "202mm", "12mm", "通知单");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            var size = 10;
            var extendSize = 0;
            var table_hegth = (size + 1) * 25;
            var fonsize = 4;
            //上面的信息
            if (whichOne == "hn" || whichOne == "jx") {
                LODOP.SET_PRINT_STYLE("FontSize", 10);
                LODOP.ADD_PRINT_TEXT("20.29mm", "12.54mm", "70.13mm", "7.37mm", "尊敬的业主：" + data[i].resManage.detailList[0]['unitCode'] + "  " + data[i].resManage.detailList[0]['customerName']);
                LODOP.ADD_PRINT_TEXT("20.29mm", "70.54mm", "60.13mm", "7.37mm", "计费面积：" + data[i].resManage['buildArea']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT("20.29mm", "136.54mm", "60.13mm", "7.37mm", "打印日期：" + Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d"));
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            }
            //标题等
            LODOP.ADD_PRINT_TEXT("26.55mm", "13mm", "25mm", "5.37mm", "房号");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "38mm", "35mm", "5.37mm", "费项名称");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "73mm", "35mm", "5.37mm", "摘要");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "108mm", "18mm", "5.37mm", "上期读数");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "126mm", "18mm", "5.37mm", "本期读数");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "144mm", "16mm", "5.37mm", "用量");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "160mm", "16mm", "5.37mm", "单价");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TEXT("26.55mm", "176mm", "19mm", "5.37mm", "应计金额");
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            //表格线
            LODOP.ADD_PRINT_LINE("25.31mm", "13mm", "25.31mm", "193.00mm", 0, 1);
            // 最上条标题横线
            LODOP.ADD_PRINT_LINE("31.31mm", "13mm", "31.31mm", "193.00mm", 0, 1);
            // 标题下横线
            LODOP.ADD_PRINT_LINE("25.31mm", "13mm", "31.11mm", "13mm", 0, 1);
            // 最左竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "38mm", "31.11mm", "38mm", 0, 1);
            // 收款后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "73mm", "31.11mm", "73mm", 0, 1);
            // 起始日期后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "108mm", "31.11mm", "108mm", 0, 1);
            // 终止日期后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "126mm", "31.11mm", "126mm", 0, 1);
            // 上次读数后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "144mm", "31.11mm", "144mm", 0, 1);
            // 本次读数后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "160mm", "31.11mm", "160mm", 0, 1);
            // 用量后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "176mm", "31.11mm", "176mm", 0, 1);
            // 后后竖线
            LODOP.ADD_PRINT_LINE("25.31mm", "193mm", "31.11mm", "193mm", 0, 1);
            // 最右竖线
            //动态列表信息
            var trheight = 31.31;
            //用于每个竖线距离上面的固定长度
            var thHeight = 32.58;
            //用于每行距离上面的固定长度47.98
            var newHeight = 0;
            //用于动态增加一行的长度
            var lastSize = 0;
            //分页前的那个下标
            var allProductNumber = 0;
            var aaa = "1234567890";
            var bbb = "1234567890";
            var ccc = "1234567";
            for (var k = 0; k < 6; k++) {
                newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
                var SizeTmpt = parseInt(this.getByteLen(aaa) / 35);
                if (parseInt(this.getByteLen(bbb) / 16) > SizeTmpt) {
                    SizeTmpt = parseInt(this.getByteLen(bbb) / 16);
                }
                if (parseInt(this.getByteLen(ccc) / 17) > SizeTmpt) {
                    SizeTmpt = parseInt(this.getByteLen(ccc) / 17);
                }
                //判断是否有数据
                if (k < data[i].resManage.detailList.length) {
                    LODOP.SET_PRINT_STYLE("FontSize", 9);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13mm", "25mm", "5.37mm", data[i].resManage.detailList[k]['unitCode']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "38mm", "35mm", 5.3 + SizeTmpt * fonsize + "mm", data[i].resManage.detailList[k]['feeName']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "73mm", "35mm", 5.3 + SizeTmpt * fonsize + "mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "108mm", "18mm", 5.3 + SizeTmpt * fonsize + "mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "126mm", "18mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "144mm", "16mm", "5.37mm", data[i].resManage.detailList[k]['dosage']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "160mm", "16mm", "5.37mm", data[i].resManage.detailList[k]['price']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "176mm", "19mm", "5.37mm", data[i].resManage.detailList[k]['receiveAmount']);
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                } else {
                    LODOP.SET_PRINT_STYLE("FontSize", 10);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "13mm", "25mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "38mm", "35mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "73mm", "35mm", 5.3 + SizeTmpt * fonsize + "mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "108mm", "18mm", 5.3 + SizeTmpt * fonsize + "mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "126mm", "18mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "144mm", "16mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "160mm", "16mm", "5.37mm", "");
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                    LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", "176mm", "19mm", "5.37mm", '');
                    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                }
                extendSize += SizeTmpt;
                newHeight = (k - lastSize) * 5.37 + extendSize * fonsize;
                if (k == lastSize + 1 && k != 1) {
                    LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", 0, 1);
                }
                //每条数据后加一横线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "13mm", trheight + newHeight + 5.37 + "mm", "13mm", 0, 1);
                //最左竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "38mm", trheight + newHeight + 5.37 + "mm", "38mm", 0, 1);
                //行号后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "73mm", trheight + newHeight + 5.37 + "mm", "73mm", 0, 1);
                //供货商后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "108mm", trheight + newHeight + 5.37 + "mm", '108mm', 0, 1);
                //型号后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "126mm", trheight + newHeight + 5.37 + "mm", "126mm", 0, 1);
                //颜色后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "144mm", trheight + newHeight + 5.37 + "mm", "144mm", 0, 1);
                //单价后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "160mm", trheight + newHeight + 5.37 + "mm", "160mm", 0, 1);
                //单价后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "176mm", trheight + newHeight + 5.37 + "mm", "176mm", 0, 1);
                //数量后竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight - SizeTmpt * fonsize + "mm", "193mm", trheight + newHeight + 5.37 + "mm", "193mm", 0, 1);
                //最右竖线
                LODOP.ADD_PRINT_LINE(trheight + newHeight + 5.57 + "mm", "13mm", trheight + newHeight + 5.57 + "mm", "193mm", 0, 1);
                //每条数据后加一横线
                if ((trheight + newHeight + 5.57) % fenyeSize <= fenyeSize && (trheight + 5.57 + newHeight) % fenyeSize >= (fenyeSize - 15)) {
                    LODOP.NewPage();
                    thHeight = 0.67;
                    lastSize = k;
                    trheight = 0;
                    extendSize = 0;
                }
            }
            table_hegth = trheight + newHeight + 5.57;
            if (whichOne == "hn" || whichOne == "jx") {
                lastheght += 5.4;
                LODOP.SET_PRINT_STYLE("FontSize", 10);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "13mm", "25mm", "7.37mm", "");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "38mm", "35mm", "7.37mm", "合计:");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "73mm", "71mm", "7.37mm", data[i].resManage['totalAmountCN']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "144mm", "32.55mm", "7.37mm", "小写");
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TEXT(1 + table_hegth + "mm", "176mm", "17.81mm", "7.37mm", data[i].resManage['totalAmount']);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_LINE(5.8 + table_hegth + "mm", "13mm", 5.8 + table_hegth + "mm", "193mm", 0, 1);
                //备注上横线
                //LODOP.ADD_PRINT_LINE(9.4+table_hegth+"mm","13mm",9.4+table_hegth+"mm","193mm",0,1);//最后一横线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "13mm", table_hegth + 5.8 + "mm", "13mm", 0, 1);
                // 最左竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "38mm", table_hegth + 5.8 + "mm", "38mm", 0, 1);
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "73mm", table_hegth + 5.8 + "mm", "73mm", 0, 1);
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "144mm", 5.8 + table_hegth + "mm", "144mm", 0, 1);
                // 单价后竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "176mm", 5.8 + table_hegth + "mm", "176mm", 0, 1);
                // 数量后竖线
                LODOP.ADD_PRINT_LINE(table_hegth + "mm", "193mm", table_hegth + 5.8 + "mm", "193mm", 0, 1);
                // 最右竖线
                if ((trheight + 9.4 + newHeight) % fenyeSize <= fenyeSize && (trheight + newHeight + 9.4) % fenyeSize >= (fenyeSize - 6)) {
                    LODOP.NewPage();
                    lastheght = 0;
                    table_hegth = 0;
                }
            }
            // 最下显示订单信息
            var moneyWeight = 0;
            if ((lastheght + table_hegth + 5) % fenyeSize <= fenyeSize && (lastheght + table_hegth + 5) % fenyeSize >= (fenyeSize - 6)) {
                LODOP.NewPage();
                lastheght = 0;
                table_hegth = 0;
            }
            /*  LODOP.SET_PRINT_STYLE("FontSize", 10);
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth  + "mm", "12.54mm", "120.13mm", "7.37mm", "开户银行：  中国工商银行广州科学城支行");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 4 + "mm", "12.54mm", "120.13mm", "7.37mm", "银行账号：  3602090709200211967");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 8 + "mm", "12.54mm", "120.13mm", "7.37mm", "户    名：  广州东英置业投资有限公司");
            LODOP.SET_PRINT_STYLE("FontSize", 11);
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 12 + "mm", "12.54mm", "120.13mm", "7.37mm", "客户专线：89852688");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 17 + "mm", "12.54mm", "120.13mm", "7.37mm", "财务专线：82382850");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 22 + "mm", "12.54mm", "120.13mm", "7.37mm", "收费清单查询：82286610");
            LODOP.SET_PRINT_STYLE("FontSize", 10);
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 27 + "mm", "12.54mm", "180.13mm", "7.37mm", "注:请于每月五日前（遇节假日顺延）付款，逾期支付，滞纳金按欠费金额每日的千分之三计算");*/
            LODOP.SET_PRINT_STYLE("FontSize", 10);
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 4 + "mm", "12.54mm", "120.13mm", "7.37mm", "1、水电表每月抄表时间为:25-30日.");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 8 + "mm", "12.54mm", "120.13mm", "7.37mm", "2、本收费通知单费用按月计费,当月5日和15日由银行统一自动扣款.");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 12 + "mm", "12.54mm", "120.13mm", "7.37mm", "3、银行扣款后,客户可凭此单于当月30日到服务中心开具发票.");
            LODOP.ADD_PRINT_TEXT(lastheght + table_hegth + 16 + "mm", "12.54mm", "120.13mm", "7.37mm", "4、如您对费用方面有疑问,可致电服务中心进行咨询.");
            LODOP.NewPage();
        }
    },
    //收款单选中
    receiptSelect: function (me, record, index, eOpts) {
        record.set("actualAmount", parseFloat(record.data["balanceAmount"]));
        record.set("balanceAmount", 0);
        // record.set("balanceAmount", parseInt(record.data["receiveAmount"]) - parseInt(record.data["balanceAmount"]));
        // record.set("actualAmount", record.data["receiveAmount"]);
        record.commit();
        var form = Ext.ComponentQuery.query('form[name = "receiptCollect"]')[0];
        var grid = Ext.ComponentQuery.query('receiptlistlist')[0];
        var sm = grid.getSelectionModel();
        //grid选中行(获取选中行数据)
        var rec = sm.getSelection();
        var receiptArray = [];
        for (var i = 0; i < rec.length; i++) {
            var obj = {};
            eval("obj.key" + "='" + rec[i].data["feeName"] + "'");
            eval("obj.value" + "='" + rec[i].data["actualAmount"] + "'");
            receiptArray.push(obj);
        }
        var count = 0;
        var myProductList = this.combineObjectInList(receiptArray, "key", [
            0,
            "value"
        ]);
        form.form.findField("contont").setValue("");
        for (var j = 0; j < myProductList.length; j++) {
            form.form.findField("contont").setValue(form.form.findField("contont").getValue() + (myProductList[j].key) + ":" + (myProductList[j].value) + "\r\n");
            count = count + parseFloat(myProductList[j].value);
            form.form.findField("summation").setValue(count.toFixed(2));
            form.form.findField("receivableNum").setValue(count.toFixed(2));
        }
    },
    //  console.log(result)
    //收款单取消选中
    receiptUnSelect: function (me, record, index, eOpts) {
        //record.set("balanceAmount", record.data["receiveAmount"]);
        record.set("balanceAmount", parseFloat(record.data["actualAmount"]));
        record.set("actualAmount", 0);
        // record.set("actualAmount", parseInt(record.data["receiveAmount"]) - parseInt(record.data["actualAmount"]));
        record.commit();
        var form = Ext.ComponentQuery.query('form[name = "receiptCollect"]')[0];
        var grid = Ext.ComponentQuery.query('receiptlistlist')[0];
        var sm = grid.getSelectionModel();
        //grid选中行(获取选中行数据)
        var rec = sm.getSelection();
        var receiptArray = [];
        for (var i = 0; i < rec.length; i++) {
            var obj = {};
            eval("obj.key" + "='" + rec[i].data["feeName"] + "'");
            eval("obj.value" + "='" + rec[i].data["actualAmount"] + "'");
            receiptArray.push(obj);
        }
        var count = 0;
        var myProductList = this.combineObjectInList(receiptArray, "key", [
            0,
            "value"
        ]);
        form.form.findField("contont").setValue("");
        form.form.findField("summation").setValue("");
        form.form.findField("receivableNum").setValue("");
        for (var j = 0; j < myProductList.length; j++) {
            form.form.findField("contont").setValue(form.form.findField("contont").getValue() + (myProductList[j].key) + ":" + (myProductList[j].value) + "\r\n");
            count = count + parseFloat(myProductList[j].value);
            form.form.findField("summation").setValue(count.toFixed(2));
            form.form.findField("receivableNum").setValue(count.toFixed(2));
        }
    },
    //付款单选中
    paySelect: function (me, record, index, eOpts) {
        var paidAmount = record.data["paidAmount"],
            unpaidAmount = record.data["unpaidAmount"],
            payableAmount = record.data["payableAmount"];
        //已付
        record.set("paidAmount", parseInt(paidAmount) + (parseInt(payableAmount) - parseInt(paidAmount)));
        //余额
        record.set("unpaidAmount", parseInt(unpaidAmount) - (parseInt(payableAmount) - parseInt(paidAmount)));
        //抵消
        record.set("offsetAmount", parseInt(unpaidAmount) - (parseInt(paidAmount)));
        record.commit();
        var form = Ext.ComponentQuery.query('form[name = "payCollect"]')[0];
        var grid = Ext.ComponentQuery.query('paylistlist')[0];
        var sm = grid.getSelectionModel();
        //grid选中行(获取选中行数据)
        var rec = sm.getSelection();
        var payArray = [];
        for (var i = 0; i < rec.length; i++) {
            var obj = {};
            eval("obj.key" + "='" + rec[i].data["feeName"] + "'");
            eval("obj.value" + "='" + rec[i].data["payableAmount"] + "'");
            payArray.push(obj);
        }
        var count = 0;
        var myProductList = this.combineObjectInList(payArray, "key", [
            0,
            "value"
        ]);
        form.form.findField("contont").setValue("");
        for (var j = 0; j < myProductList.length; j++) {
            form.form.findField("contont").setValue(form.form.findField("contont").getValue() + (myProductList[j].key) + ":" + (myProductList[j].value) + "\r\n");
            count = count + parseFloat(myProductList[j].value);
            form.form.findField("summation").setValue(count.toFixed(2));
            form.form.findField("payNum").setValue(count.toFixed(2));
        }
    },
    //  console.log(result)
    //付款单取消选中
    payUnSelect: function (me, record, index, eOpts) {
        var paidAmount = record.data["paidAmount"],
            unpaidAmount = record.data["unpaidAmount"],
            offsetAmount = record.data["offsetAmount"],
            payableAmount = record.data["payableAmount"];
        //已付
        record.set("paidAmount", parseInt(payableAmount) - parseInt(offsetAmount));
        //余额
        record.set("unpaidAmount", parseInt(payableAmount) - parseInt(paidAmount) + parseInt(offsetAmount));
        //抵消
        record.set("offsetAmount", parseInt(paidAmount) - (parseInt(offsetAmount)));
        record.commit();
        var form = Ext.ComponentQuery.query('form[name = "payCollect"]')[0];
        var grid = Ext.ComponentQuery.query('paylistlist')[0];
        var sm = grid.getSelectionModel();
        //grid选中行(获取选中行数据)
        var rec = sm.getSelection();
        var payArray = [];
        for (var i = 0; i < rec.length; i++) {
            var obj = {};
            eval("obj.key" + "='" + rec[i].data["feeName"] + "'");
            eval("obj.value" + "='" + rec[i].data["payableAmount"] + "'");
            payArray.push(obj);
        }
        var count = 0;
        var myProductList = this.combineObjectInList(payArray, "key", [
            0,
            "value"
        ]);
        form.form.findField("contont").setValue("");
        for (var j = 0; j < myProductList.length; j++) {
            form.form.findField("contont").setValue(form.form.findField("contont").getValue() + (myProductList[j].key) + ":" + (myProductList[j].value) + "\r\n");
            count = count + parseFloat(myProductList[j].value);
            form.form.findField("summation").setValue(count.toFixed(2));
            form.form.findField("payNum").setValue(count.toFixed(2));
        }
    },
    combineObjectInList: function (arr, item, list) {
        var obj = {};
        var a = [];
        for (var i in arr) {
            if (!obj[arr[i][item]]) {
                obj[arr[i][item]] = this.copyObj(arr[i]);
            }
            //数组克隆
            else if (!!obj[arr[i][item]]) {
                for (var j in list) {
                    obj[arr[i][item]][list[j]] = (parseFloat(obj[arr[i][item]][list[j]]) + parseFloat(arr[i][list[j]])).toFixed(2);
                }
            }
        }
        for (var k in obj) {
            a.push(obj[k]);
        }
        return a;
    },
    copyObj: function (obj) {
        if (obj.constructor == Array) {
            var a = [];
            for (var i in obj) {
                a.push(obj[i]);
            }
            return a;
        } else {
            var o = {};
            for (var i in obj) {
                o[i] = obj[i];
            }
            return o;
        }
    },
    getByteLen: function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null) {
                //全角
                len += 2;
            } else {
                len += 1;
            }

        }
        return len;
    },
    //废票
    devilReceive: function () {
        var grid = Ext.ComponentQuery.query('receiptorder')[0],
            grid2 = Ext.ComponentQuery.query('CANreceiptorder')[0];
        var sm = grid.getSelectionModel();
        if (sm.hasSelection()) {
            var record = sm.getSelection()[0];
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/fin/receive/devilReceiveBill.do',
                method: 'POST',
                scope: this,
                async: false,
                withCredentials: true,
                params: {
                    fid: record.data["fid"]
                },
                success: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    Ext.Msg.alert("提示", respText.msg);
                    grid.getStore().reload();
                    grid2.getStore().reload();
                },
                failure: function (result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", result.data.msg);
                },
                callback: function (opts, success, response) {
                }
            });
        } else {
            Ext.Msg.alert("提示", "注意：无选中数据！");
        }
    }
});
