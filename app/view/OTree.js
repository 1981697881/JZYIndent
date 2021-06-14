Ext.define('JZYIndent.view.OTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.OTree',
    rootVisible: false,
    lines: false,
    useArrows: true,
    hideHeaders: true,
    collapseFirst: false,
    width: 250,
    minWidth: 100,
    split: true,
    stateful: true,
    collapsible: false,
    bodyStyle : 'overflow-x:hidden; overflow-y:scroll',
    listeners :{
//进入页面执行事件设置高度和宽度
        'render':function(){
            this.setHeight((parseInt(document.body.offsetHeight)-108)/2);
        },
    },
    // tbar: {
    //     xtype: "container",
    //     border: false,
    //     items: [
    //     //     {
    //     //     //tbar第一行工具栏
    //     //     xtype: "toolbar",
    //     //     items: [{
    //     //         xtype: 'textfield',
    //     //         dock: 'top',
    //     //         labelWidth: 60,
    //     //         fieldLabel: '房屋/业主',
    //     //         emptyText: 'Search',
    //     //         enableKeyEvents: true,
    //     //     }]
    //     // },
    //         {
    //         //tbar第二行工具栏
    //         xtype: "toolbar",
    //         items: [{
    //             value: '查找',
    //             flex: 0.5,
    //             width: 10,
    //             labelSeparator: '',
    //             xtype: 'displayfield',
    //             handler: '',
    //         }, {
    //             value: '高级',
    //             flex: 0.5,
    //             width: 10,
    //             labelSeparator: '',
    //             xtype: 'displayfield',
    //             handler: '',
    //         }, {
    //             flex: 0.5,
    //             width: 10,
    //             labelSeparator: '',
    //             value: '刷新',
    //             xtype: 'displayfield',
    //             handler: '',
    //         }, {
    //             fieldLabel: '历史房屋',
    //             flex: 1,
    //             labelWidth: 60,
    //             padding: "-3 0 0 0",
    //             xtype: 'checkbox',
    //             handler: '',
    //         }]
    //     }]
    // },
    //bufferedRenderer: !Ext.microloaderTags.test,
    initComponent: function() {
        var me = this,
            lastFilterValue;
        me.columns = [{
            xtype: 'treecolumn',
            flex: 0.5,
            dataIndex: 'text',
            align:'left',
            scope: me,
            renderer: function(value) {
                var searchString = this.searchField.getValue();
                if (searchString.length > 0) {
                    return this.strMarkRedPlus(searchString, value);
                }

                return value;
            }
        }];
        Ext.apply(me, {
           // store: Ext.StoreMgr.get('navigation'),
            dockedItems : [
                {
                    xtype: 'textfield',
                    dock: 'top',
                    emptyText: '搜索',
                    enableKeyEvents: true,
                    triggers: {
                        clear: {
                            cls: 'x-form-clear-trigger',
                            handler: 'onClearTriggerClick',
                            hidden: true,
                            scope: 'this'
                        },
                        search: {
                            cls: 'x-form-search-trigger',
                            weight: 1,
                            handler: 'onSearchTriggerClick',
                            scope: 'this'

                        }
                    },

                    onClearTriggerClick: function() {
                        this.setValue();
                        var node,tstore;
                        //me.store.clearFilter();
                        var new_params = {
                            // hasRegion:true,
                            //regionId:isNaN(node.raw.regionId) ? 1 : node.raw.regionId,
                            type: 0,
                            keyword: '',
                            prId: 0
                        };
                        Ext.apply(me.getStore().proxy.extraParams, new_params);
                        me.getStore().load();
                        this.getTrigger('clear').hide();
                    },
                    onSearchTriggerClick: function() {
                        me.filterStore(this.getValue());
                    },
                    listeners: {
                        keyup: {
                            fn: function(field, event, eOpts) {
                                var value = field.getValue();

                                // Only filter if they actually changed the field value.
                                // Otherwise the view refreshes and scrolls to top.
                                if (value && value !== lastFilterValue) {
                                    field.getTrigger('clear')[(value.length > 0) ? 'show' : 'hide']();
                                    me.filterStore(value);
                                    lastFilterValue = value;
                                }
                           },
                            buffer: 300
                        },

                        render: function(field) {
                            // console.log(Ext.StoreMgr.get('navigation'))
                            this.searchField = field;
                        },
                        scope: me
                    }
                }
            ]
        });
        if(me.reference=="meterreadingTree"||me.reference=="leaselist"||me.reference=="publicTree"||me.reference=="leaselist"||this.reference=="ratesTree"||me.reference=="repair"||me.reference=="suggest"||me.reference=="property"||me.reference=="houselist"||me.reference=="receiptlist"||me.reference=="receivablelist"){
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        withCredentials: true,
                        url: JZYIndent.Cfg.server+'/base/res/treeList.do',
                        extraParams: {type:'0',keyword:'',userId:Ext.util.Cookies.get("fid")},//额外参数
                        reader: {// 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    },
                    listeners: {
                        beforeload:function () {
                            console.log(123)
                        },
                    },
                    autoLoad: true,

                }),
            });
        };
        me.callParent(arguments);
    },

    filterStore: function(value) {
        var me = this,
            store = me.store,
            searchString = value.toLowerCase(),
            filterFn = function(node) {
                var children = node.childNodes,
                    len      = children && children.length,
                    visible  = v.test(node.get('text')),
                    i;

                // If the current node does NOT match the search condition
                // specified by the user...
                if ( !visible ) {

                    // Check to see if any of the child nodes of this node
                    // match the search condition.  If they do then we will
                    // mark the current node as visible as well.
                    for (i = 0; i < len; i++) {
                        if ( children[i].isLeaf() ) {
                            visible = children[i].get('visible');
                        }
                        else {
                            visible = filterFn(children[i]);
                        }
                        if (visible) {
                            break;
                        }
                    }

                }

                else { // Current node matches the search condition...

                    // Force all of its child nodes to be visible as well so
                    // that the user is able to select an example to display.
                    for (i = 0; i < len; i++) {
                        children[i].set('visible', true );
                    }

                }

                return visible;
            }, v;

        if (searchString.length < 1) {
            store.clearFilter();
        } else {
            v = new RegExp(searchString, 'i');
            Ext.apply(store.proxy.extraParams,{
                keyword:searchString
            });
            store.reload()
           /* store.getFilters().replaceAll({
                filterFn: filterFn
            });*/
        }
    },

    strMarkRedPlus: function (search, subject) {
        return subject.replace(
            new RegExp( '('+search+')', "gi" ),
            "<span style='color: red;'><b>$1</b></span>"
        );
    }
});
