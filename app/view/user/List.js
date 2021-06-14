Ext.define('JZYIndent.view.user.List', {
    extend: 'JZYIndent.view.List',
    alias: 'widget.Userlist',

    viewModel: {
        type: 'userlist'
    },
    tbar: ['->',{
        text: '录入',
        handler: 'onNew',
        hidden:true
    },{
        text: '删除',
        handler: 'onRemove',
        hidden:true
    }
    ],

    columns: [
      	{text:'id',dataIndex:'id',filter:'number'},
		{text:'loginName',dataIndex:'loginName',filter:'string'},
		{text:'name',dataIndex:'name',filter:'string'},
		{text:'plainPassword',dataIndex:'plainPassword',filter:'string'},
		{text:'password',dataIndex:'password',filter:'string'},
		{text:'salt',dataIndex:'salt',filter:'string'},
		{text:'roles',dataIndex:'roles',filter:'string'},
		{text:'registerDate',dataIndex:'registerDate', xtype: 'datecolumn',filter:true}
    ],
    onDestroy: function () {
        // do some cleanup
    	var me=this;
    	if(me.sel_win){
    		//this.sel_win.destroy();
    		Ext.destroy(me.sel_win);
    		me.sel_win=null;
    	}
    	me.callParent();
    }
 });
