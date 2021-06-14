Ext.define('JZYIndent.view.client.auxiliaryList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.auxiliaryList',
    columnLines: true,
    loadMask: true,
    store: new Ext.data.Store({
        fields: ['customerId', 'fid', 'relation', 'name', 'phone'],
        proxy: {
            type: 'jsonp',
            url: JZYIndent.Cfg.server + '/base/cus/contactList.do',
            callbackKey: 'callback',
            limitParam: "pageSize",
            pageParam: "pageNum",
            extraParams:{
                pageSize:100,
            },
            reader: { // 使用Ext.data.reader.Json读取服务器数据
                type: 'json',
                rootProperty: 'data.list',
                totalProperty: 'data.total'
            },
        },
        //autoLoad: true
    }),
    forceFit: true,
    columns: [
        {
            xtype: "rownumberer",
            text: "序号",
            width: 40,
            align: 'center',
        },
        {
            text: '',
            dataIndex: 'fid',
            align: 'center',
            hidden:true,
            hideable: false,
        },
        {
            text: '',
            dataIndex: 'customerId',
            align: 'center',
            hidden:true,
            hideable: false,
        },
        {
            text: '关系',
            dataIndex: 'relation',
            align: 'center',
            editor: {
                xtype: 'textfield',

            },
        },
        {
            text: '姓名',
            dataIndex: 'name',
            align: 'center',
            editor: {
                xtype: 'textfield',

            },
        },
        {
            text: '电话',
            dataIndex: 'phone',
            align: 'center',
            filter: 'string',
            editor: {
                xtype: 'textfield',

            },
        },
    ],
    initComponent: function(){
        var me=this;
        Ext.apply(me, {
            plugins: [new Ext.grid.plugin.RowEditing({
                clicksToEdit: 2,
                saveBtnText: '确定',
                cancelBtnText: "取消",
                scope: this,
                autoCancel: false,
                listeners: {
                    //编辑后保存
                    edit: function (editor, e) {
                        var form=me.up("window").query("form")[0].getForm();
                        if(form.findField("fid").getValue()!=undefined){
                            //if(e.record.data['fid']==null||e.record.data['fid']==""){
                            console.log(e.record.data)
                            Ext.Ajax.request({
                                url: JZYIndent.Cfg.server + '/base/cus/saveContact.do',
                                method: 'POST',
                                scope: this,
                                async: false,
                                withCredentials: true,
                                params:e.record.data,
                                success: function (result) {
                                    var respText = Ext.util.JSON.decode(result.responseText);
                                    console.log(respText)
                                    e.record.commit();
                                    e.grid.getStore().reload();
                                    Ext.Msg.alert("提示", respText.msg);
                                },
                                failure: function (result) {
                                    var respText = Ext.util.JSON.decode(result.responseText);
                                    Ext.Msg.alert("提示", respText.msg);
                                },
                                callback: function (opts, success, response) {

                                },
                            });
                        }else{
                            Ext.Msg.alert("提示", "找不到相关客户信息！");
                        }
                    },
                }
            })],
        });
        me.callParent();
    }
});
