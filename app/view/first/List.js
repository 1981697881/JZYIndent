Ext.define('JZYIndent.view.first.List', {
    extend: 'JZYIndent.view.PageList',
    alias: 'widget.firstlist',
    columnLines: true,
    viewModel: {
        type: 'firstlist',
    },
   /* features: [{
        ftype: 'summary',
        dock: 'top'
    }
    ],*/
    loadMask: true,
    tbar: ['-', {
        xtype: 'displayfield',
        fieldLabel: '小计',
        labelWidth: 40,
        fieldStyle:'color:red;',
        //allowBlank: true,
        name: 'subtotal',
        value: 0,
    },'->', {
        text: '录入（F6）', idx: '', handler: function () {
            var me = this
            var grid = me.up('doMain').down("firstlist"),
                sgrid = me.up('doMain').down("secondlist"),
                rstore = grid.getStore(),
                nstore = sgrid.getStore(),
                array = [];
            var count = 0;
            for (var i = 0; i < rstore.getCount(); i++) {
                var number = 0;
                if (rstore.getAt(i).data['realQuantity'] > 0) { /*FTaxRate FTaxAmount*/
                    count = i;
                    // array.push(grid_data);
                    for (var j = 0; j < nstore.getCount(); j++) {
                        console.log(parseInt(rstore.getAt(i).data['realQuantity']) + "," + parseInt(nstore.getAt(j).data["Fauxqty"]))
                        if (rstore.getAt(i).data.FNumber == nstore.getAt(j).data.FNumber) {
                            nstore.getAt(j).set('Fauxqty', floatObj.add(rstore.getAt(i).data.realQuantity,nstore.getAt(j).data.Fauxqty));
                            nstore.getAt(j).set('Fprice', rstore.getAt(i).data.FPlanPrice);
                            nstore.getAt(j).set('Fauxprice', floatObj.add(floatObj.multiply((parseFloat(rstore.getAt(i).data.FTaxRate)/100),nstore.getAt(j).data.Fprice),nstore.getAt(j).data.Fprice));
                            nstore.getAt(j).set('FTaxAmount', floatObj.multiply(floatObj.multiply(nstore.getAt(j).get('Fauxqty'),nstore.getAt(j).get('Fprice')),(parseFloat(nstore.getAt(j).get('FTaxRate'))/100)));
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
                        rstore.getAt(i).set('Fauxprice', floatObj.add(floatObj.multiply((parseFloat(rstore.getAt(i).data.FTaxRate)/100),rstore.getAt(i).data.FPlanPrice),rstore.getAt(i).data.Fprice ));
                        rstore.getAt(i).set('FTaxAmount', floatObj.multiply(floatObj.multiply(rstore.getAt(i).data.realQuantity,rstore.getAt(i).data.Fprice),(parseFloat(rstore.getAt(i).data.FTaxRate)/100)));
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
    }, "-",
    ],
    plugins: [new Ext.grid.plugin.CellEditing({
        clicksToEdit: 1,
        listeners: {
            edit: function (editor, e) {
                var subtotal = e.grid.down('displayfield[name="subtotal"]');
                var data = e.record.data
                /*var cbqj = Ext.ComponentQuery.query('radiogroup[name = "cbqj"]')[0];*/
                if (e.value != e.originalValue) {//realQuantity FCanUseQty
                  /*  if(e.value <= e.record.data['FCanUseQty']){*/
                        var count = 0
                        for (var i = 0; i < e.grid.getStore().getCount(); i++) {
                            if((e.grid.getStore().getAt(i).data['realQuantity']!=null && e.grid.getStore().getAt(i).data['realQuantity'] != undefined)&&e.grid.getStore().getAt(i).data['FPlanPrice']!=null && e.grid.getStore().getAt(i).data['FPlanPrice'] != undefined) {
                                count += parseInt(e.grid.getStore().getAt(i).data['realQuantity'])
                                subtotal.setValue(count)
                                e.record.commit()
                            }
                        }
                   /* }else{
                        Ext.Msg.alert("提示", '实发数量不能大于可下单数量');
                        data["realQuantity"]=data["FCanUseQty"];
                        e.record.commit();
                    }*/

                    /*var data=e.record.data;
                    Ext.Ajax.request({
                        url: Estate.Cfg.server + '/equip/reading/saveSomeMeterReading.do',
                        method: 'POST',
                        scope: this,
                        async: false,
                        withCredentials: true,
                        headers: {'Content-Type': 'application/json'},
                        params: Ext.JSON.encode({
                            meterReadingList:[{
                                fid:data.fid,
                                meterUseId:data.meterUseId,
                                lastReading:data.lastReading,
                                thisReading:data.thisReading,
                                remark:data.remark,
                                receiveTime:[Ext.getCmp(cbqj.getValue().cbqj).getValue()]
                            }]
                        }),
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            Ext.Msg.alert("提示", respText.msg);
                            e.record.commit();
                          // e.grid.getStore().reload();

                        },
                        failure: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            Ext.Msg.alert("提示", respText.msg);
                        },
                        callback: function (opts, success, response) {

                        },
                    });*/
                }
            },
        }
    })],
    columns: [{
        xtype: "rownumberer",
        text: "序号",
        width: 40,
        dataIndex: 'FEntryID',
        align: 'center',
        summaryType: function (records) {
            return "小计";
        }
    },
        {
            text: '',
            dataIndex: 'FItemID',
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
            text: '商品代码',
            dataIndex: 'FNumber',
            align: 'center',
            width: 50,
            filter: 'string'
        },
        {
            text: '商品名称',
            dataIndex: 'FName',
            align: 'center',
            filter: 'string'
        }, {
            text: '规格型号',
            dataIndex: 'FModel',
            align: 'center',
            width: 40,
            filter: 'string'
        },
        {
            text: '申请数量',
            dataIndex: 'realQuantity',
            align: 'center',
            width: 40,
            filter: 'string',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
            },
            summaryType: function (records, value) {
                var total = 0;
                for (var i = 0; i < records.length; i++) {
                    console.log()
                    if(records[i].get("realQuantity") != undefined){
                        total += Number(records[i].get("realQuantity"));
                    }
                }
                return "<font style='color:red;';>" + total + "</font>"
            }
        },
        {
            text: '单价',
            dataIndex: 'FPlanPrice',
            align: 'center',
            width: 40,
            filter: 'string',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
            },
        },
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
