Ext.define('JZYIndent.view.second.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.secondlist',
    requires: [
        'Ext.window.*',
    ],
    features: [{
        ftype: 'summary',
        dock: 'top'
    }
    ],
    selModel: {
        selType: 'checkboxmodel',
    },
    columnLines: true,
    loadMask: true,
    forceFit: true,
    tbar: ['->',  {
        text: '移除产品(shift+X)',
        handler: function () {
            var grid = this.up('grid'),
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
    }, "-"
    ],
    plugins: [new Ext.grid.plugin.CellEditing({
        clicksToEdit: 1,
        listeners: {
            edit: function (editor, e) {
                e.record.data['FTaxAmount']=floatObj.multiply(floatObj.multiply(e.record.data['Fauxqty'],e.record.data['Fprice']),floatObj.divide(e.record.data['FTaxRate'],100))
                e.record.data['Fauxprice']=floatObj.add(floatObj.multiply(floatObj.divide(e.record.data['FTaxRate'],100),e.record.data['Fprice']),e.record.data['Fprice'])
                e.record.data['Famount']=floatObj.multiply(e.record.data['Fauxqty'],e.record.data['Fprice'])
                e.record.data['Fallamount']=floatObj.multiply(e.record.data['Fauxqty'],e.record.data['Fauxprice'])
                e.record.commit()

            },
        }
    })],
    store: new Ext.data.Store({
        pageSize: 50,
        fields: ['fid', 'text', 'unitCode', 'buildArea', 'costArea', 'FTaxAmount'],
        proxy: {
            type: 'memory',
            data: '',
            reader: { // 使用Ext.data.reader.Json读取服务器数据
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'total'
            },
        },
        autoLoad: true,
    }),
    columns: [{
        xtype: "rownumberer",
        text: "序号",
        width: 40,
        align: 'center',
        summaryType: function (records) {
            return "合计";
        }
    },
        {
            text: '',
            dataIndex: 'FItemID',
            align: 'center',
            hideable: false,
            hidden: true,
        },{
            text: '',
            dataIndex: 'FEntryID',
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
            text: '产品代码',
            dataIndex: 'FNumber',
            align: 'center',
            filter: 'string'
        },
        {
            text: '产品名称',
            dataIndex: 'FName',
            align: 'center',
            filter: 'string'
        },{
            text: '规格型号',
            dataIndex: 'FModel',
            align: 'center',
            filter: 'string'
        },
        {
            text: '单位',
            dataIndex: 'FUnitName',
            align: 'center',
            filter: 'string'
        }, {
            text: '到货日期',
            dataIndex: 'Fdate',
            format:'Y-m-d',
            align: 'center',
            renderer : Ext.util.Format.dateRenderer('Y-m-d'),
            editor: {
                xtype: 'datefield',
                format: 'Y-m-d',
            },
        },
        {
            text: '申请数量',
            dataIndex: 'Fauxqty',
            align: 'center',
            filter: 'string',
            editor: {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 0,
                minValue: 1,
                allowBlank: false,
            },
            summaryType: function (records, value) {
                var total = 0;
                for (var i = 0; i < records.length; i++) {
                    total += Number(records[i].get("Fauxqty"));
                }
                return "<font style='color:red;';>" + total + "</font>"
            }
        },
        {
            text: '不含税单价',
            dataIndex: 'Fprice',
            align: 'center',
            filter: 'string',
            editor: {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 0,
                allowBlank: false,
            },
        }, {
            text: '含税单价',
            dataIndex: 'Fauxprice',
            align: 'center',
            filter: 'string',
        },
        {
            text: '税率',
            dataIndex: 'FTaxRate',
            align: 'center',
            filter: 'string',
            editor: {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 0,
                allowBlank: false,
            },
        },
        {
            text: '税额',
            dataIndex: 'FTaxAmount',
            align: 'center',
            filter: 'string',
            summaryType: function (records, value) {
                var total = 0;
                for (var i = 0; i < records.length; i++) {
                    total += floatObj.add(total, records[i].get("FTaxAmount"));
                }
                return "<font style='color:red;';>" + total + "</font>"
            }
        },
        {
            text: '不含税金额',
            align: 'center',
            dataIndex: 'Famount',
            filter: 'number',
            /*editor: {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 0,
                allowBlank: false,
            },*/
            summaryType: function (records, value) {
                var total = 0;
                for (var i = 0; i < records.length; i++) {
                    total += floatObj.add(total, records[i].get("Famount"));
                }
                return "<font style='color:red;';>" + total + "</font>"
            }
        },
        {
            text: '含税金额',
            align: 'center',
            dataIndex: 'Fallamount',
            filter: 'number',
            /*editor: {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 0,
                allowBlank: false,
            },*/
            summaryType: function (records, value) {
                var total = 0;
                for (var i = 0; i < records.length; i++) {
                    total += floatObj.add(total, records[i].get("Fallamount"));
                }
                return "<font style='color:red;';>" + total + "</font>"
            }
        },
       /* {
            text: '生产批号',
            dataIndex: '',
            align: 'center',
            filter: 'string'
        }, {
            text: '可导入',
            dataIndex: '',
            align: 'center',
            filter: 'string'
        },*/
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
