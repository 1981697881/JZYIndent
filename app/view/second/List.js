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
                // num1,num2 参数，index 保留的位数
                function dealNum(num1,num2,index){
                    var result = 0;
                    // 获得两个小数长度
                    var numa = num1.toString();
                    var numb = num2.toString();
                    // 分别记录两数小数长度
                    var lena = 0;
                    var lenb = 0;
                    // 最长小数的长度
                    var lastLen = 0 ;
                    if(numa.indexOf('.') > 0){
                        lena = numa.split('.')[1].length;
                    }
                    if(numb.indexOf('.') > 0){
                        lenb = numb.split('.')[1].length;
                    }
                    // 去掉小数点
                    numa = numa.replace('.','');
                    numb = numb.replace('.','');
                    if(lena > lenb ){
                        lastLen  = lena;
                    }else{
                        lastLen  = lenb;
                    }
                    // 做相应的加减乘除(这里只做加法运算,其他差不多)
                    result =  Number(numa)/Number(numb);
                    result = result/Math.pow(10,lastLen);
                    return result.toFixed(index);
                }
                e.record.data['FTaxAmount']=Math.floor((parseFloat(Ext.util.Cookies.get("FEmpID"))/100) * ((parseFloat(e.record.data['Fauxprice']) * parseFloat(e.record.data['Fauxqty']))) * 10000) / 10000
                e.record.data['Famount']=Math.floor((parseFloat(e.record.data['Fprice'])*parseInt(e.record.data['Fauxqty']))*10000)/10000
                e.record.data['Fallamount']=Math.floor((parseFloat(e.record.data['Fprice'])*parseInt(e.record.data['Fauxqty']) + parseFloat(e.record.data['FTaxAmount']))*10000)/10000
                /* e.record.data['FTaxAmount']=((parseFloat(e.record.data['Fauxprice'])*100)*parseInt(e.record.data['Fauxqty']))/100-parseFloat(e.record.data['Famount'])*/
               /* e.record.data['FactualPrice']=dealNum(parseFloat(e.record.data['Famount']),parseInt(e.record.data['Fauxqty']),2)*/
                e.record.commit()
               /* if(e.value!=e.originalValue){

                }*/
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

        },
        {
            text: '税额',
            dataIndex: 'FTaxAmount',
            align: 'center',
            filter: 'string',
            summaryType: function (records, value) {
                var total = 0;
                for (var i = 0; i < records.length; i++) {
                    total += Number(records[i].get("FTaxAmount"));
                }
                return "<font style='color:red;';>" + Math.floor(total * 100) / 100 + "</font>"
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
                    total += Number(records[i].get("Famount"));
                }
                return "<font style='color:red;';>" + Math.floor(total * 100) / 100 + "</font>"
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
                    total += Number(records[i].get("Fallamount"));
                }
                return "<font style='color:red;';>" + Math.floor(total * 100) / 100 + "</font>"
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
