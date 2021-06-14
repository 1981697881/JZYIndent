Ext.define('JZYIndent.view.third.List', {
    extend: 'JZYIndent.view.PageList',
    alias: 'widget.thirdlist',
    columnLines: true,
    viewModel: {
        type: 'thirdlist',
    },
    loadMask: true,
    tbar: [ '-', {
        xtype: 'fieldcontainer',
        fieldLabel: '关键字',
        labelWidth: 50,
        layout: 'hbox',
        items: [{
            xtype: 'textfield',
            name: 'name',
            queryMode: 'local',
            hideLabel: true,
            width: 150,
            emptyText: '请选择',
            allowBlank: false,
            forceSelection: true,
        }, {
            xtype: "button",
            text: "查询",
            margin: '1 0 0 0 ',
            width: 50,
            handler: function () {
                var grid = this.up("thirdlist"),
                    fgrid = this.up("doMain").down("firstlist"),
                    name = this.up("thirdlist").query("textfield[name=name]")[0],
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
                    }
                })
                rstore.reload();
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
                        }
                    });
                    break;
                }
            }
        }],
    }
    ],
    columns: [{
        xtype: "rownumberer",
        text: "序号",
        width: 40,
        align: 'center',
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
            width: 30,
            filter: 'string'
        },
        {
            text: '商品名称',
            dataIndex: 'FName',
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
})
;
