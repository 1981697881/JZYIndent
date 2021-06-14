Ext.define('JZYIndent.view.user.Detail', {
    extend: 'JZYIndent.view.Detail',
    alias: 'widget.Userdetail',

    bind: {
        title: '用户 - 【{theObj.id}】'
    },

    componentCls: 'user-detail',
    bodyPadding: 0,

    controller: 'detail',

    afterRender: function(ct, position) {
    	this.callParent();
    },
    items: [{
    	listeners: {
		  render: function(p){
			p = p.getEl();
			var me= this.up();
			me.h0=p.getHeight();
		    p.on('scroll', function(e, t){
		    	me.onscroll(t.scrollTop,t.clientHeight);
		    }, p);
		  }
		},
    	title: 'Panel 0',
        flex: 2,
        frame: false,
        xtype: 'container',
        layout: 'anchor',
        style: {
            overflow: 'auto'
        },

items: [
	{
		title : '用户信息',
		margin : '0 0 10 0',
		cls : 'nav_pos',
		reference : 'form',
		bodyPadding : 10,
		fieldDefaults : {
			labelAlign : 'right',
			labelWidth : 100,
			padding : 3
		},
		defaults : {
			anchor : '100%'
		},
		xtype: 'form',
        items: [{
	xtype: 'container',
	layout: 'hbox',
	defaultType: 'textfield',
	items:[
	{
	flex: 1,
	fieldLabel: 'loginName',
	bind: '{theObj.loginName}',
	//allowBlank: false,
	//远端重复验证
	validator:function(val,fld){
		if(!val || val=='')
			return false;
		var fld = this;
		Ext.Ajax.request({
            params:{pn:'loginName',pv:val},
            method:"GET",
            //async:false,
            url:'/exists/User',
            success:function(response,options){
                if(response.responseText=='true'){//服务器端的返回值为'false'
                	fld.markInvalid("该用户名已经被占用!");
                    return false;
                }else{
                	fld.clearInvalid();
                	return true;
                }
            }
        });
		return true;
	}
	},	{
	flex: 1,
	fieldLabel: 'name',
	bind: '{theObj.name}',
	allowBlank: false
	}	]
},
{
	xtype: 'container',
	layout: 'hbox',
	defaultType: 'textfield',
	items:[{
		flex: 1,
		fieldLabel: 'plainPassword',
		bind: '{theObj.plainPassword}'
		},
		{
	flex: 1,
	fieldLabel: 'password',
	xtype:'displayfield',
	bind: '{theObj.password}',
	allowBlank: false
	}]
},
{
	xtype: 'container',
	layout: 'hbox',
	defaultType: 'textfield',
	items:[
	   	{
			flex: 1,
			fieldLabel: 'roles',
			bind: '{theObj.roles}',
			allowBlank: false,
		    xtype: 'combobox',
		    triggerAction:'all',
		    typeAhead :true,
		   	minChars:1,
		   	lazyInit:false,
		    queryParam : 'kw',
		   	typeAhead :true,
		    valueField: 'name',
		    displayField: 'name',
		    //store: JZYIndent.Cfg.getDistinctStore('net.bat.entity.User','roles')
		},	{
	flex: 1,
	fieldLabel: 'salt',
	xtype:'displayfield',
	bind: '{theObj.salt}'
	}]
},
{
	xtype: 'container',
	layout: 'hbox',
	defaultType: 'textfield',
	items:[
	{
	flex: 1,
	fieldLabel: 'registerDate',
	xtype:'displayfield',
	bind: '{theObj.registerDate}'
	}	]
}]}]


    }],
    initComponent: function() {
    	var rec = this.getViewModel().get('theObj');
		var item = this.items[0].items[0].items[0].items[0];
    	//修改user，非add
    	if(rec.get('id')>0){
    		item.xtype='displayfield';
    	}else{
    		item.xtype='textfield';
    	}
        this.callParent(arguments);
    }
});
