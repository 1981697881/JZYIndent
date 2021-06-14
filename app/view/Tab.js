Ext.define('JZYIndent.view.Tab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.Tab',
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox',
        'Ext.layout.container.Anchor',
        'Ext.form.field.ComboBox',
        'JZYIndent.model.User'
    ],
    header:false,
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    tbar: ['->',{
        text: '上一条',
        handler: 'onPrev',
        bind: {
            hidden: '{!showprev}'
        }
    },{
        text: '下一条',
        handler: 'onNext',
        bind: {
            hidden: '{!shownext}'
        }
    },{
        text: '保存',
        handler: 'onSaveClick',
        bind: {
            hidden: '{!showsave}'
        }
    },{
        text: '返回',
        handler: 'onBackClick',
        bind: {
            hidden: '{!showreturn}'
        }
    }],

    bodyPadding: 0,
    onscroll:function(top,h0){
        var items_navpos=this.items_navpos;
        var offset=0;
        //var h0 = this.h0;
        for(var i=0; i<items_navpos.length; i++){
            var item_navpos=items_navpos[i];
            var h = item_navpos.getHeight();
            //header落在移动窗口之内,或移动窗口在 两个offset之间都算
            if((offset>=top && (offset<= (top+h0)))
                || (top>=offset && (top+h0) <= offset+h ))
                break;
            offset+=h;
        }
        var item=this.btns_dock[0].items.getAt(i);
        this.nav(item);
    },
    nav:function(item,e){
        if(!item)
            return false;
        if(this.item_last){
            if(this.item_last==item)
                return false;
            this.item_last.removeCls('x-tab-active');
        }
        var pnav = item.pnav;
        if(e){
            pnav.getEl().scrollIntoView(pnav.up().getEl(),false,true);
        }else{
            item.addCls('x-tab-active');
        }
        this.item_last=item;
    },
    refreshNav:function(){
        var items_dock=[];
        var items_navpos=this.query('[cls=nav_pos]');
        var me = this;
        me.item_last=false;
        for(var i=0; i<items_navpos.length; i++){
            var item_navpos=items_navpos[i];
            var item_dock = {
                closable:false,
                text:item_navpos.title,
                pnav:item_navpos,
                handler:me.nav,
                scope: me
            };
            items_dock[items_dock.length]=item_dock;
        }
        this.items_navpos=items_navpos;
        var btns_dock = this.btns_dock;
        if(btns_dock){
            for(var i=0; i<btns_dock.length; i++){
                this.removeDocked(btns_dock[i]);
            }
        }
        // btns_dock = this.addDocked([{
        //     xtype: 'tabbar',
        //     dock: 'top',
        //     activeItem:1,
        //     items: items_dock
        // }]);
        // this.btns_dock=btns_dock;
        // var item0 = btns_dock[0].items.getAt(0);
        //this.nav(item0);
        if(this.masker){
            setTimeout(function(){
                if(me.masker){
                    me.masker.hide();
                    delete me.masker;
                }
            },100);
        }
    },
    afterRender: function() {
        this.refreshNav();
        this.callParent();
    },
    printLabel:function(){
        var flds = this.query('field');
        for(fld in flds){
            var l = fld.getFieldLabel();
            var b = fld.getBind();
            console.log('--------'+b);
        }
    },
    initComponent: function() {
        this.callParent(arguments);
    }

});
