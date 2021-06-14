Ext.define('JZYIndent.view.TreeList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.TreeList',
    requires: [
        'JZYIndent.controller.ListController',
       // 'JZYIndent.ux.GridFilters',
        //'Ext.overrides.grid.filters.filter.Date'
    ],
    anchor: '100%',
    controller: 'list',
    //plugins: ['gfilters'],
    bind: {
        store: '{objs}'
    },
    // listeners: {
    //     itemdblclick: 'onDblClick'
    // },
    initComponent: function(){
        var me=this;
        me.callParent();
        if(JZYIndent.Cfg.bView){
            var detailPanel = me.up('detail');
            if(detailPanel){
                var tbar = me.down('toolbar');
                tbar.hide();
            }
        }else{
            var perms = JZYIndent.Cfg.usrInfo.get('perms')||'update;delete';
            //只读显示
            if(perms.indexOf('update')!=-1){
                if (me.down('button[text="新增"]')) {
                    me.down('button[text="新增"]').setVisible(true);
                }
                if (me.down('button[text="克隆"]')) {
                    me.down('button[text="克隆"]').setVisible(true);
                }
            }
            if(perms.indexOf('delete')!=-1){ //管理员才显示删除按钮
                if (me.down('button[text="删除"]')) {
                    me.down('button[text="删除"]').setVisible(true);
                }
            }
            me.on('edit', function(editor, e) {
                // commit the changes right after editing finished
                var rec = e.record;
                //rec.commit(true);
                rec.save({
                    scope: this,
                    callback: function(records,operation,success){
                        if(success)
                            Ext.toast({
                                title: '保存',
                                html: '['+rec.getId()+']保存完成',
                                align: 't',
                                bodyPadding: 10
                            });
                    }
                });

            });

        }
    }
});
