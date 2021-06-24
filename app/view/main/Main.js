var floatObj = function () {

    /*
     * 判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }

    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {times: 1, num: 0};
        if (isInteger(floatNum)) {
            ret.num = floatNum;
            return ret
        }
        var strfi = floatNum + '';
        var dotPos = strfi.indexOf('.');
        var len = strfi.substr(dotPos + 1).length;
        var times = Math.pow(10, len);
        var intNum = parseInt(floatNum * times + 0.5, 10);
        ret.times = times;
        ret.num = intNum;
        return ret
    }

    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, op) {
        var o1 = toInteger(a);
        var o2 = toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;
        var t1 = o1.times;
        var t2 = o2.times;
        var max = t1 > t2 ? t1 : t2;
        var result = null;
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max;
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max;
            case 'multiply':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'divide':
                result = (n1 / n2) * (t2 / t1);
                return result
        }
    }

    // 加减乘除的四个接口
    function add(a, b) {
        return operation(a, b, 'add')
    }

    function subtract(a, b) {
        return operation(a, b, 'subtract')
    }

    function multiply(a, b) {
        return operation(a, b, 'multiply')
    }

    function divide(a, b) {
        return operation(a, b, 'divide')
    }

    // exports
    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide
    }
}();
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
                        height: '7%',
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
                                    grid.focus(true, 100)
                                    var count = 0;
                                    for (var i = 0; i < rstore.getCount(); i++) {
                                        var number = 0;
                                        if (rstore.getAt(i).data['realQuantity'] > 0) {
                                            count = i;
                                            // array.push(grid_data);
                                            for (var j = 0; j < nstore.getCount(); j++) {
                                                if (rstore.getAt(i).data.FNumber == nstore.getAt(j).data.FNumber) {
                                                    nstore.getAt(j).set('Fauxqty', floatObj.add(rstore.getAt(i).data.realQuantity,nstore.getAt(j).data.Fauxqty));
                                                    nstore.getAt(j).set('Fprice', rstore.getAt(i).data.FPlanPrice);
                                                    nstore.getAt(j).set('Fauxprice', floatObj.add(floatObj.multiply(floatObj.divide(nstore.getAt(j).get('FTaxRate'),100),nstore.getAt(j).data.Fprice),nstore.getAt(j).data.Fprice));
                                                    nstore.getAt(j).set('FTaxAmount', floatObj.multiply(floatObj.multiply(nstore.getAt(j).get('Fauxqty'),nstore.getAt(j).get('Fprice')),floatObj.divide(nstore.getAt(j).get('FTaxRate'),100)));
                                                    nstore.getAt(j).set('Famount',  floatObj.multiply(nstore.getAt(j).get('Fauxqty'),nstore.getAt(j).get('Fprice')));
                                                    nstore.getAt(j).set('Fallamount', floatObj.multiply(nstore.getAt(j).get('Fauxqty'),nstore.getAt(j).get('Fauxprice')));
                                                    number++;
                                                    break;
                                                }
                                            }
                                            if (number == 0) {
                                                //查询窗口插入数据
                                                rstore.getAt(i).set('Fauxqty', rstore.getAt(i).data.realQuantity);
                                                rstore.getAt(i).set('Fprice', rstore.getAt(i).data.FPlanPrice);
                                                rstore.getAt(i).set('FTaxRate', Ext.util.Cookies.get("FEmpID"));
                                                rstore.getAt(i).set('Fauxprice', floatObj.add(floatObj.multiply(floatObj.divide(rstore.getAt(i).data.FTaxRate,100),rstore.getAt(i).data.FPlanPrice),rstore.getAt(i).data.Fprice ));
                                                rstore.getAt(i).set('FTaxAmount', floatObj.multiply(floatObj.multiply(rstore.getAt(i).data.realQuantity,rstore.getAt(i).data.Fprice),floatObj.divide(rstore.getAt(i).data.FTaxRate,100)));
                                                rstore.getAt(i).set('FEntryID', nstore.getCount() + 1);
                                                rstore.getAt(i).set('Famount',floatObj.multiply(rstore.getAt(i).data.realQuantity,rstore.getAt(i).data.Fprice));
                                                rstore.getAt(i).set('Fallamount', floatObj.multiply(rstore.getAt(i).data.realQuantity,rstore.getAt(i).data.Fauxprice));
                                                sgrid.getStore().insert(nstore.getCount() + 1, rstore.getAt(i).data);
                                            }
                                            rstore.getAt(i).set('realQuantity', '')
                                            rstore.getAt(i).set('FPlanPrice', '')
                                            grid.down('displayfield[name="subtotal"]').setValue(0)
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
                                    key: 65,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var form = me.down('form').getForm(),
                                            first = me.down("firstlist"),
                                            gird = me.down("secondlist"),
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
                                }, {
                                    key: 83,
                                    shift: true,
                                    fn: function (key, ev) {
                                        var form = me.down('form').getForm(),
                                            gird = me.down("secondlist"),
                                            first = me.down("firstlist"),
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
