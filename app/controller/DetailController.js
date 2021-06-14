Ext.define('JZYIndent.controller.DetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.detail',
    requires: [
        //'Ext.window.Toast'
    ],
    config: {
        control: {
            'button[text=插入]': {
                click: 'onInsert'
            }
        }
    },
    onMore: function(btn, e) {
        var vw = this.getView();
        var ct = vw.items.items[0];
        if (btn.getText().indexOf('>>>') != -1) {
            if (!this.mitems) {
                ct.on('add', this.refreshNav, this);
                ct.on('remove', this.refreshNav, this);
                this.mitems = ct.add(vw.moreItems);
            } else {
                ct.add(this.mitems);
            }
            btn.setText('<<<隐藏更多');
        } else {
            for (var i = 0; i < this.mitems.length; i++) {
                ct.remove(this.mitems[i], false);
            }
            btn.setText('>>>显示更多');
        }
    },
    refreshNav: function() {
        var me = this;
        if (me.timer_add) {
            clearTimeout(me.timer_add);
        }
        me.timer_add = setTimeout(function() {
            me.getView().refreshNav();
        }, 300);
    },
    onInsert: function(btn, e) {
        //return;
        var vw = this.getView();
        var he = vw.down('htmleditor');
        var dv = btn.up('panel').down('dataview');
        var sels = dv.getSelectionModel().getSelection();
        var text = "";
        for (var i = 0; i < sels.length; i++) {
            var url = sels[i].get('uri');
            if (url && url.indexOf('.jpg') != -1 || url.indexOf('.png') != -1)  {
                text += '<img style="float:left;margin:5px;" src="' + url + '"/>';
            }
            else  {
                text += '<a href="' + url + '">' + sels[i].get('name') + '</a>';
            }

        }
        he.insertAtCursor(text);
        he.focus();
    },
    //常规-返回
    onBackClick: function() {
        var rec = this.getViewModel().get('theObj');
        rec.reject(true);
        var nd = this.getView().getXType().replace('detail', 'list');
        console.log(nd);
        this.redirectTo(nd);
    },
    //常规-保存
    onSaveClick: function(item) {
        var title = this.getView().title;
        var form = this.lookupReference('form'),
            rec;
        if (!form.isValid()) {
            return false;
        }
        rec = this.getViewModel().get('theObj');
        Ext.Ajax.request({
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            scope: this,
            async: false,
            params: form.getForm().getValues(),
            withCredentials: true,
            success: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                if (respText.status == 0) {
                    rec.save({
                        scope: this,
                        callback: this.onComplete
                    });
                } else {
                    Ext.Msg.alert("提示", respText.msg);
                }
            },
            failure: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                console.log(respText);
                Ext.Msg.alert("提示", respText.msg);
            }
        });
    },
    //其他-返回
    onTBackClick: function(item, e) {
        var rec = this.getViewModel().get('theObj');
        console.log(item);
        rec.reject(true);
        var nd = item.idx;
        this.redirectTo(nd);
    },
    //其他-保存
    onTSaveClick: function(item, e) {
        var title = this.getView().title;
        var form = this.lookupReference('form'),
            rec;
        if (!form.isValid()) {
            return false;
        }
        rec = this.getViewModel().get('theObj');
        // var formdata = Ext.create('JZYIndent.model.'+rec.store.config.model, form.getForm().getValues());
        // var formObj=formdata.data;
        // console.log(formObj)
        Ext.Ajax.request({
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            scope: this,
            async: false,
            params: form.getForm().getValues(),
            withCredentials: true,
            success: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                rec.save({
                    scope: this,
                    result: respText.msg,
                    callback: this.onCompletet
                });
            },
            failure: function() {
                Ext.Msg.alert("提示", "保存失败！");
            }
        });
    },
    //品牌-保存
    onBrandSaveClick: function(item, e) {
        var title = this.getView().title;
        var form = this.lookupReference('form'),
            rec;
        if (!form.isValid()) {
            return false;
        }
        rec = this.getViewModel().get('theObj');
        // var formdata = Ext.create('JZYIndent.model.'+rec.store.config.model, form.getForm().getValues());
        // var formObj=formdata.data;
        // console.log(formObj)
        console.log(form.getForm().getValues())
        form.getForm().submit({
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            params: form.getForm().getValues(),
            waitMsg: '请稍等,正在保存',
            success: function (form, action) {
                console.log()
               /*  var respText = Ext.util.JSON.decode(result.responseText);
                 console.log(respText)
                 rec.save({
                     scope: this,
                     result: respText.msg,
                     callback: this.onCompletet
                 });*/
            },
            failure: function (form, action) {
                console.log(action)
               /* var respText = Ext.util.JSON.decode(result.responseText);
                console.log(respText)
                Ext.Msg.alert("提示", "保存失败！");*/
            }
        });
    },
    //楼栋批量保存
    onBatchSaveClick: function(item, e) {
        var title = this.getView().title;
        var form1 = this.lookupReference('form'),
            form2 = this.lookupReference('form2'),
            grid = this.lookupReference('grid'),
            rec;
        rec = this.getViewModel().get('theObj');
        console.log();
        if (form1.isHidden()) {
            if (!form2.isValid()) {
                return false;
            } else {
                var data = [];
                for (var i = 0; i < grid.getStore().getCount(); i++) {
                    var grid_data = grid.getStore().getAt(i).data;
                    data.push(grid_data);
                }
                console.log({
                    fid: form1.getForm().getValues()["prId"],
                    list: data
                });
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + item.iurl2,
                    method: 'POST',
                    scope: this,
                    async: false,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.JSON.encode({
                        fid: form1.getForm().getValues()["prId"],
                        list: data
                    }),
                    withCredentials: true,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        rec.save({
                            scope: this,
                            result: respText.msg,
                            callback: this.onCompletet
                        });
                    },
                    failure: function() {
                        Ext.Msg.alert("提示", "保存失败！");
                    }
                });
            }
        } else {
            if (!form1.isValid()) {
                return false;
            } else {
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/' + item.iurl1,
                    method: 'POST',
                    scope: this,
                    async: false,
                    params: form1.getForm().getValues(),
                    withCredentials: true,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        rec.save({
                            scope: this,
                            result: respText.msg,
                            callback: this.onCompletet
                        });
                    },
                    failure: function() {
                        Ext.Msg.alert("提示", "保存失败！");
                    }
                });
            }
        }
    },
    //单元保存（业主，租户）
    onElSaveClick: function(item, e) {
        var title = this.getView().title;
        var form = this.lookupReference('form'),
            form2 = this.lookupReference('form2'),
            form3 = this.lookupReference('form3'),
            rec;
        if (!form.isValid()) {
            return false;
        }
        rec = this.getViewModel().get('theObj');
        // var formdata = Ext.create('JZYIndent.model.'+rec.store.config.model, form.getForm().getValues());
        // var formObj=formdata.data;
        // console.log(formObj)
        var formValue1 = form.getForm().getValues();
        var request = {
            url: JZYIndent.Cfg.server + '/base/cus/saveCustomer.do',
            method: 'POST',
            scope: this,
            async: false,
            withCredentials: true,
            failure: function() {
                Ext.Msg.alert("提示", "请求失败！");
            },
            callback: function(opts, success, response) {}
        };
        if (form2.getForm().isValid() && form3.getForm().isValid()) {
            if (form2.getForm().getValues()["currentOwnerId"] != "") {
                var NObj = form2.getForm().getValues();
                var key = "fid";
                var value = form2.getForm().getValues()["currentOwnerId"];
                NObj[key] = value;
                var nameKey = "name";
                var nameValue = form2.getForm().getValues()["currentOwner"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        var currentOwnerIdkey = "currentOwnerId";
                        var currentOwnerId = form2.getForm().getValues()["currentOwnerId"];
                        formValue1[currentOwnerIdkey] = currentOwnerId;
                        var currentOwnerkey = "currentOwner";
                        var currentOwner = form2.getForm().getValues()["currentOwner"];
                        formValue1[currentOwnerkey] = currentOwner;
                        var ownerCodeIdkey = "ownerCode";
                        var ownerCode = form2.getForm().getValues()["ownerCode"];
                        formValue1[ownerCodeIdkey] = ownerCode;
                    }
                });
            } else {
                var NObj = form2.getForm().getValues();
                var nameKey = "name";
                var nameValue = form2.getForm().getValues()["currentOwner"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        console.log(respText);
                        form2.getForm().findField("currentOwnerId").setValue(respText.data);
                        var currentOwnerIdkey = "currentOwnerId";
                        var currentOwnerId = form2.getForm().getValues()["currentOwnerId"];
                        formValue1[currentOwnerIdkey] = currentOwnerId;
                        var currentOwnerkey = "currentOwner";
                        var currentOwner = form2.getForm().getValues()["currentOwner"];
                        formValue1[currentOwnerkey] = currentOwner;
                        var ownerCodeIdkey = "ownerCode";
                        var ownerCode = form2.getForm().getValues()["ownerCode"];
                        formValue1[ownerCodeIdkey] = ownerCode;
                    }
                });
            }
            Ext.Ajax.request(request);
            if (form3.getForm().getValues()["currentTenantId"] != "") {
                var NObj = form3.getForm().getValues();
                var key = "fid";
                var value = form3.getForm().getValues()["currentTenantId"];
                NObj[key] = value;
                var nameKey = "name";
                var nameValue = form3.getForm().getValues()["currentTenant"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        var currentTenantIdkey = "currentTenantId";
                        var currentTenantId = form3.getForm().getValues()["currentTenantId"];
                        formValue1[currentTenantIdkey] = currentTenantId;
                        var currentTenantkey = "currentTenant";
                        var currentTenant = form3.getForm().getValues()["currentTenant"];
                        formValue1[currentTenantkey] = currentTenant;
                        var tennantCodekey = "tennantCode";
                        var tennantCode = form3.getForm().getValues()["tennantCode"];
                        formValue1[tennantCodekey] = tennantCode;
                    }
                });
            } else {
                var NObj = form3.getForm().getValues();
                var nameKey = "name";
                var nameValue = form3.getForm().getValues()["currentTenant"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        console.log(respText);
                        form3.getForm().findField("currentTenantId").setValue(respText.data);
                        var currentTenantIdkey = "currentTenantId";
                        var currentTenantId = form3.getForm().getValues()["currentTenantId"];
                        formValue1[currentTenantIdkey] = currentTenantId;
                        var currentTenantkey = "currentTenant";
                        var currentTenant = form3.getForm().getValues()["currentTenant"];
                        formValue1[currentTenantkey] = currentTenant;
                        var tennantCodekey = "tennantCode";
                        var tennantCode = form3.getForm().getValues()["tennantCode"];
                        formValue1[tennantCodekey] = tennantCode;
                    }
                });
            }
            Ext.Ajax.request(request);
            this.SaveElement(item, formValue1);
        } else if (form3.getForm().isValid() && !form2.getForm().isValid()) {
            if (form3.getForm().getValues()["currentTenantId"] != "") {
                var NObj = form3.getForm().getValues();
                var key = "fid";
                var value = form3.getForm().getValues()["currentTenantId"];
                NObj[key] = value;
                var nameKey = "name";
                var nameValue = form3.getForm().getValues()["currentTenant"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        var currentTenantIdkey = "currentTenantId";
                        var currentTenantId = form3.getForm().getValues()["currentTenantId"];
                        formValue1[currentTenantIdkey] = currentTenantId;
                        var currentTenantkey = "currentTenant";
                        var currentTenant = form3.getForm().getValues()["currentTenant"];
                        formValue1[currentTenantkey] = currentTenant;
                        var tennantCodekey = "tennantCode";
                        var tennantCode = form3.getForm().getValues()["tennantCode"];
                        formValue1[tennantCodekey] = tennantCode;
                        this.SaveElement(item, formValue1);
                    }
                });
            } else {
                var NObj = form3.getForm().getValues();
                var nameKey = "name";
                var nameValue = form3.getForm().getValues()["currentTenant"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        console.log(respText);
                        form3.getForm().findField("currentTenantId").setValue(respText.data);
                        var currentTenantIdkey = "currentTenantId";
                        var currentTenantId = form3.getForm().getValues()["currentTenantId"];
                        formValue1[currentTenantIdkey] = currentTenantId;
                        var currentTenantkey = "currentTenant";
                        var currentTenant = form3.getForm().getValues()["currentTenant"];
                        formValue1[currentTenantkey] = currentTenant;
                        var tennantCodekey = "tennantCode";
                        var tennantCode = form3.getForm().getValues()["tennantCode"];
                        formValue1[tennantCodekey] = tennantCode;
                        this.SaveElement(item, formValue1);
                    }
                });
            }
            console.log(request);
            Ext.Ajax.request(request);
        } else if (form2.getForm().isValid() && !form3.getForm().isValid()) {
            if (form2.getForm().getValues()["currentOwnerId"] != "") {
                var NObj = form2.getForm().getValues();
                var key = "fid";
                var value = form2.getForm().getValues()["currentOwnerId"];
                NObj[key] = value;
                var nameKey = "name";
                var nameValue = form2.getForm().getValues()["currentOwner"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        var currentOwnerIdkey = "currentOwnerId";
                        var currentOwnerId = form2.getForm().getValues()["currentOwnerId"];
                        formValue1[currentOwnerIdkey] = currentOwnerId;
                        var currentOwnerkey = "currentOwner";
                        var currentOwner = form2.getForm().getValues()["currentOwner"];
                        formValue1[currentOwnerkey] = currentOwner;
                        var ownerCodeIdkey = "ownerCode";
                        var ownerCode = form2.getForm().getValues()["ownerCode"];
                        formValue1[ownerCodeIdkey] = ownerCode;
                        this.SaveElement(item, formValue1);
                    }
                });
            } else {
                var NObj = form2.getForm().getValues();
                var nameKey = "name";
                var nameValue = form2.getForm().getValues()["currentOwner"];
                NObj[nameKey] = nameValue;
                Ext.apply(request, {
                    params: NObj,
                    success: function(result) {
                        var respText = Ext.util.JSON.decode(result.responseText);
                        console.log(respText);
                        form2.getForm().findField("currentOwnerId").setValue(respText.data);
                        var currentOwnerIdkey = "currentOwnerId";
                        var currentOwnerId = form2.getForm().getValues()["currentOwnerId"];
                        formValue1[currentOwnerIdkey] = currentOwnerId;
                        var currentOwnerkey = "currentOwner";
                        var currentOwner = form2.getForm().getValues()["currentOwner"];
                        formValue1[currentOwnerkey] = currentOwner;
                        var ownerCodeIdkey = "ownerCode";
                        var ownerCode = form2.getForm().getValues()["ownerCode"];
                        formValue1[ownerCodeIdkey] = ownerCode;
                        this.SaveElement(item, formValue1);
                    }
                });
            }
            Ext.Ajax.request(request);
        } else {
            this.SaveElement(item, formValue1);
        }
    },
    SaveElement: function(item, data) {
        Ext.Ajax.request({
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            scope: this,
            async: false,
            params: data,
            withCredentials: true,
            success: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                console.log(respText);
                Ext.Msg.hide();
                Ext.toast({
                    title: '保存',
                    html: respText.msg,
                    align: 't',
                    bodyPadding: 10
                });
            },
            // rec.save({
            //     scope: this,
            //     callback: this.onCompletet
            // });
            failure: function() {
                Ext.Msg.alert("提示", "保存失败！");
            }
        });
    },
    //合同保存
    onSaveLease: function(item, e) {
        var title = this.getView().title;
        var form1 = this.lookupReference('form1'),
            form5 = this.lookupReference('form5'),
            grid1 = this.lookupReference('grid1'),
            rec;
        if (!form1.isValid()) {
            return false;
        } else {
            var obj = Object.assign(form1.getForm().getValues()),
                rentUnitList = [];
            rec = this.getViewModel().get('theObj');
            console.log(rec);
            console.log( grid1.getStore().getCount())
            for (var i = 0; i < grid1.getStore().getCount(); i++) {
                var fbj = {};
                eval("fbj.unitId" + "=" + parseInt(grid1.getStore().getAt(i).get('fid')));
                eval("fbj.way" + "=" + 1);
                rentUnitList.push(fbj);
            }
            var key = "rentUnitList";
            var value = rentUnitList;
            obj[key] = value;
            eval("obj.customerId" + "=" + form5.getForm().getValues()["customerId"]);
            console.log(obj);
            //  var formdata = Ext.create('JZYIndent.model.lease', obj);
            // var formObj=formdata.data;
            // delete formObj.leaseid;
            //console.log(formObj)
            //console.log(JSON.stringify(formObj))
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + item.iurl,
                method: 'POST',
                scope: this,
                async: false,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode(obj),
                withCredentials: true,
                success: function(result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    form1.form.findField("fid").setValue(respText.data);
                    Ext.Msg.alert("提示", respText.msg);
                },
                // rec.save({
                //     scope: this,
                //     callback: this.onCompletet
                // });
                failure: function(result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                }
            });
        }
    },
    //其他(楼盘-批量)-保存
    onBatchSave: function(item, e) {
        var title = this.getView().title;
        var form = this.lookupReference('form'),
            grid = this.lookupReference('grid'),
            rec,
            data = [],
            obj = form.getForm().getValues();
        if (!form.isValid()) {
            return false;
        }
        rec = this.getViewModel().get('theObj');
        var request = {
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            scope: this,
            async: false,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                rec.save({
                    scope: this,
                    result: respText.msg,
                    callback: this.onCompletet
                });
            },
            failure: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                Ext.Msg.alert("提示", respText.msg);
            }
        };
        for (var i = 0; i < grid.getStore().data.items.length; i++) {
            data.push(grid.getStore().data.items[i].data);
        }
        if (form.getForm().getValues()['selfmotion'] == 1) {
            var key = "list";
            var value = data;
            obj[key] = value;
            console.log(JSON.stringify(obj));
            Ext.applyIf(request, {
                params: Ext.JSON.encode(obj)
            });
            Ext.Ajax.request(request);
        } else {
            delete obj.selfmotion;
            delete obj.buildingNum;
            delete obj.floorNum;
            delete obj.unitNum;
            delete obj.propertyType;
            delete obj.tenementUse;
            var key = "list";
            var value = [];
            obj[key] = value;
            console.log(JSON.stringify(obj));
            Ext.applyIf(request, {
                params: Ext.JSON.encode(obj)
            });
            Ext.Ajax.request(request);
        }
    },
    //JSON提交-保存
    onJSONSaveClick: function(item) {
        var title = this.getView().title;
        var form = this.lookupReference('form'),
            rec;
        if (!form.isValid()) {
            return false;
        }
        rec = this.getViewModel().get('theObj');
        Ext.Ajax.request({
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            scope: this,
            async: false,
            headers: {
                'Content-Type': 'application/json'
            },
            params: Ext.JSON.encode({
                merchants:form.getForm().getValues()
            }),
            withCredentials: true,
            success: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                if (respText.status == 0) {
                    rec.save({
                        scope: this,
                        callback: this.onComplete
                    });
                } else {
                    Ext.Msg.alert("提示", respText.msg);
                }
            },
            failure: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                console.log(respText);
                Ext.Msg.alert("提示", respText.msg);
            }
        });
    },
    //多表单-保存
    onTFormClick: function(item, e) {
        var title = this.getView().title,
            form1 = this.lookupReference('form1'),
            form2 = this.lookupReference('form2'),
            form3 = this.lookupReference('form3'),
            rec, obj;
        if (!form1.isValid()) {
            return false;
        }
        obj = Object.assign(form1.getForm().getValues(), form2.getForm().getValues(), form3.getForm().getValues());
        if (form2.form.findField("isPay").getValue() == false) {
            delete obj.payPercentage;
            delete obj.payItemId;
        }
        console.log(obj);
        rec = this.getViewModel().get('theObj');
        Ext.Ajax.request({
            url: JZYIndent.Cfg.server + '/' + item.iurl,
            method: 'POST',
            scope: this,
            async: false,
            withCredentials: true,
            //headers: {'Content-Type': 'application/json'},
            params: obj,
            success: function(result) {
                var respText = Ext.util.JSON.decode(result.responseText);
                rec.save({
                    scope: this,
                    result: respText.msg,
                    callback: this.onCompletet
                });
            },
            failure: function() {
                Ext.Msg.alert("提示", "保存失败！");
            }
        });
    },
    //计费-保存
    onBillingSaveClick: function(item, e) {
        var title = this.getView().title;
        var grid = this.lookupReference('result'),
            rec,
            arr = [];
        rec = this.getViewModel().get('theObj');
        for (var i = 0; i < grid.getStore().getCount(); i++) {
            var obj = {};
            eval("obj.buildUnitId" + "=" + grid.getStore().getAt(i).data.buildUnitId + "");
            eval("obj.receiveUseId" + "=" + grid.getStore().getAt(i).data.receiveUseId + "");
            eval("obj.meterReadingId" + "=" + grid.getStore().getAt(i).data.meterReadingId + "");
            eval("obj.dosage" + "=" + grid.getStore().getAt(i).data.dosage + "");
            eval("obj.receiveAmount" + "=" + grid.getStore().getAt(i).data.receiveAmount + "");
            eval("obj.receiveTime" + "='" + grid.getStore().getAt(i).data.receiveTime + "'");
            eval("obj.billingStartTime" + "='" + grid.getStore().getAt(i).data.billingStartTime + "'");
            eval("obj.billingEndTime" + "='" + grid.getStore().getAt(i).data.billingEndTime + "'");
            eval("obj.billTime" + "='" + grid.getStore().getAt(i).data.billTime + "'");
            eval("obj.receiveEndTime" + "='" + grid.getStore().getAt(i).data.receiveEndTime + "'");
            eval("obj.naginTime" + "='" + grid.getStore().getAt(i).data.naginTime + "'");
            arr.push(obj);
        }
        console.log({
            list: arr
        });
        if (arr.length != 0) {
            Ext.Ajax.request({
                url: JZYIndent.Cfg.server + '/' + item.iurl,
                method: 'POST',
                scope: this,
                async: false,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: Ext.JSON.encode({
                    list: arr
                }),
                success: function(result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    console.log(respText);
                    Ext.Msg.alert("提示", respText.msg);
                    rec.save({
                        scope: this,
                        callback: this.onCompletet
                    });
                },
                failure: function(result) {
                    var respText = Ext.util.JSON.decode(result.responseText);
                    Ext.Msg.alert("提示", respText.msg);
                },
                callback: function(opts, success, response) {}
            });
        } else {
            Ext.Msg.alert("提示", "没有应收数据！");
        }
    },
    //常规-回调函数
    onComplete: function(records, operation, success) {
        if (!success)  {
            return;
        }

        var vw = this.getView();
        var title = vw.title;
        Ext.Msg.hide();
        Ext.toast({
            title: '保存',
            html: '保存完成',
            align: 't',
            bodyPadding: 10
        });
        //判断,有返回按钮才返回
        var btn_return = vw.down('button[text=返回]');
        if (!btn_return.isHidden())  {
            this.onBackClick();
        }
        else {
            var grid = Ext.ComponentQuery.query(vw.uGrid)[0];
            console.log(vw)
            if (vw.uTree != "") {
                var tree = Ext.ComponentQuery.query(vw.fatherTree+'[name="' + vw.uTree + '"]')[0];
                tree.getStore().reload();
            }
            grid.getStore().reload();
            vw.close();
        }
    },
    //vw.up('window').close();
    //其他-回调函数
    onCompletet: function(records, operation, success) {
        console.log(operation);
        if (!success)  {
            return;
        }

        var vw = this.getView();
        var title = vw.title;
        Ext.Msg.hide();
        Ext.toast({
            title: '保存',
            html: operation.result,
            align: 't',
            bodyPadding: 10
        });
        //判断,有返回按钮才返回
        var btn_return = vw.down('button[text=返回]');
        if (!btn_return.isHidden()) {
            this.onTBackClick(btn_return);
        } else {
                    var grid = Ext.ComponentQuery.query(vw.uGrid)[0];
                    if (vw.uTree != "") {
                        var tree = Ext.ComponentQuery.query(vw.fatherTree+'[name="' + vw.uTree + '"]')[0];
                        var sm = tree.getSelectionModel(),
                            node, tstore;
                        if (sm.hasSelection()) {
                            node = tree.selection;
                            tstore = tree.store;
                            tstore.load({
                                node: tstore.getNodeById(node.id)
                            });
                            node.collapse();
                            node.expand();
                        } else //tree.getStore().reload();
                        {
                            //tree.getStore().reload();
                            console.log(tree.getStore().proxy.extraParams.type);
                    if (tree.getStore().proxy.extraParams.type != "0") {
                        node = tree.getStore().root.childNodes[0];
                        node.collapse();
                        node.expand();
                        tstore = tree.store;
                        tstore.load({
                            node: tstore.getNodeById(node.id)
                        });
                    } else {
                        var new_params = {
                            // hasRegion:true,
                            //regionId:isNaN(node.raw.regionId) ? 1 : node.raw.regionId,
                            type: 0,
                            prId: 0
                        };
                        Ext.apply(tree.store.proxy.extraParams, new_params);
                        tree.getStore().load();
                    }
                }
            }
            grid.getStore().reload();
            vw.close();
        }
    },
    //vw.up('window').close();
    //获得仿真数据总数
    getEntityCount: function() {
        var vm = this.getViewModel();
        var cn = Ext.getClassName(vm.data.theObj);
        var pos = cn.lastIndexOf('.');
        return JZYIndent.Cfg.SIM_ENM[cn.substring(pos + 1)];
    },
    onNext: function() {
        this.fireViewEvent('objnext');
    },
    onPrev: function() {
        this.fireViewEvent('objprev');
    }
});
