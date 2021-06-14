Ext.define('JZYIndent.view.pageCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.pageCombo',
    name: 'pagesize',
    hiddenName: 'pagesize',
    store: new Ext.data.ArrayStore({
        fields: ['text', 'value'],
        data: [
            ['50', 50],
            ['100', 100],
            ['200', 200],
            ['300', 300],
            ['500', 500],
            ['全部', '全部']
        ]
    }),
    editable:false,
    valueField: 'value',
    displayField: 'text',
    emptyText: 50,
    value:100,
    width: 50,
    listeners: {
        select: function(combo, record, index) {
            var pagingToolbar =Ext.ComponentQuery.query('pagingtoolbar[name = "pagingbar"]')[0];
            var store=this.up("pagelist").getStore();
            console.log(store.totalCount)
            if(combo.getValue()=="全部"){
                pagingToolbar.pageSize = parseInt(store.totalCount);
                JZYIndent.Cfg.itemsPerPage = parseInt(store.totalCount); //更改全局变量itemsPerPage
                store.pageSize = parseInt(store.totalCount);; //设置store的pageSize，可以将工具栏与查询的数据同步。
                var new_params = {
                    pageSize:parseInt(store.totalCount),
                };
            }else{
                console.log(combo.getValue())
                pagingToolbar.pageSize = parseInt(combo.getValue());
                JZYIndent.Cfg.itemsPerPage = parseInt(combo.getValue()); //更改全局变量itemsPerPage
                store.pageSize = parseInt(combo.getValue());; //设置store的pageSize，可以将工具栏与查询的数据同步。
                var new_params = {
                    pageSize:parseInt(combo.getValue()),
                };
            }
            Ext.apply(store.proxy.extraParams, new_params);
            store.loadPage(1, {
                params: {
                    start: 0,
                    pageNum: 1,
                }
            })
        },

    }
});
