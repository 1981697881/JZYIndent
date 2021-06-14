Ext.define('JZYIndent.view.DTree', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.data.TreeStore',
    ],
    alias: 'widget.DTree',
    rootVisible: false,
    //autoScroll: true, //自动创建滚动条
    lines: false,
    useArrows: true,
    hideHeaders: true,
    collapseFirst: false,
    width: 250,
    minWidth: 100,
    split: false,
    stateful: true,
    autoHeight:false,
    //stateId: 'mainnav.west',
    collapsible: false,
    initComponent: function() {
        // this.columns = [{
        //     xtype: 'treecolumn',
        //     flex: 1,
        //     align: 'left',
        //     dataIndex: 'text',
        // }];
        if (this.reference == "chargelist") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/chargelist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "repair") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/Repairlist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "suggest") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/Suggestlist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "resignMatter") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/ResignMatterlist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: { resignMatter
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "rateslist") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/Rateslist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "ratesCost") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/AddCost'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "remissionlist" || this.reference == "houselist" || this.reference == "receivablelist" || this.reference == "receiptlist" || this.reference == "handlelist" || this.reference == "paylist" || this.reference == "houseArea" || this.reference == "equipsHouse") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    //type: 'tree',
                    // defaultRootId:'',
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        withCredentials: true,
                        //callbackKey: 'callback',
                        url: JZYIndent.Cfg.server + '/base/res/treeList.do',
                        extraParams: {
                            type: '0',
                            keyword:'',
                            userId: Ext.util.Cookies.get("fid")
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        //autoLoad: true,
        else if (this.reference == "department" || this.reference == "station" || this.reference == "Users") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'prId',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/system/dept/deptTree.do',
                        extraParams: {
                            prId: '-1'
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
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
                    // children: [{
                    //     text: "我的合同",
                    //     expanded: true,
                    //     status: 1
                    // }]
                    listeners: {
                        beforeload: function() {
                            console.log(123);
                        }
                    }
                })
            });
        }
        // autoLoad: true,
        else if (this.reference == "formula") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/formula'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == 'brandlist') {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    //type: 'tree',
                    // defaultRootId:'',
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        //callbackKey: 'callback',
                        url: JZYIndent.Cfg.server + '/mer/brand/brandTree.do',
                        extraParams: {
                            type: '0'
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }else if (this.reference == "equipsTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/equips'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    },
                }),
            })
        }else if(this.reference == "materialslist"){
            Ext.apply(this, {
                /*store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/materialslist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    },
                }),*/
                store: new Ext.data.TreeStore({
                    //type: 'tree',
                    // defaultRootId:'',
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        //callbackKey: 'callback',
                        url: JZYIndent.Cfg.server + '/warehouse/goodsTree.do',
                        extraParams: {
                            type: '0'
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            })
        }
        // Ext.apply(this, {
        //     store: new Ext.data.TreeStore({
        //         proxy: {
        //             type: 'ajax',
        //             url: '/JZYIndent/brand'
        //         },
        //         root: {
        //             text: 'Ext JS',
        //             id: 'src',
        //             expanded: true
        //         },
        //     }),
        // })
        else if (this.reference == 'fileslist') {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/files'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        } else if (this.reference == "organization") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/organization'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        } else if (this.reference == "leaselist" || this.reference == "property") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/lease'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "dreamSendlist") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/dreamSend'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        // viewConfig: {
        //     plugins: {
        //         ptype: 'treeviewdragdrop',
        //         containerScroll: true
        //     }
        // },
        else if (this.reference == "meterreadinglist" || this.reference == "publiclist") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/publiclist'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        else if (this.reference == "checkTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        //callbackKey: 'callback',
                        withCredentials: true,
                        url: JZYIndent.Cfg.server + '/base/res/treeList.do',
                        extraParams: {
                            check: 2,
                            type: '0',
                          keyword:'',
                            userId: Ext.util.Cookies.get("fid")
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // autoLoad: true,
        else if (this.reference == "handleItemTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: '/JZYIndent/handleItemTree'
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        // folderSort: true,
        // sorters: [{
        //     property: 'text',
        //     direction: 'ASC'
        // }]
        else if (this.reference == "SetAccessTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/system/jur/getJurisdictionTree.do',
                        // extraParams: {postId: '1'},//额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        //autoLoad: true,
        else if (this.reference == "gobalBuyerTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/system/user/getUserJurisdictionByUserId.do',
                        extraParams: {
                            sysUserId: this.up("window").sysUserId
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
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
                        'load': function() {
                            console.log(this);
                        }
                    }
                })
            });
        }
        //autoLoad: true,
        else if (this.reference == "stationGobalBuyerTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/system/jur/post/getPostJurisdictionByPostId.do',
                        extraParams: {
                            postId: this.up("window").postId
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        //autoLoad: true,
        else if (this.reference == "ratesTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/sms/houseFunTree.do',
                        //extraParams: {type:'0'},//额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src'
                    }
                })
            });
        }
        //expanded: true
        // autoLoad: true,
        else if (this.reference == "ReceiveTimeTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/report/getReceiveTime.do',
                        //extraParams: {type:'0'},//额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src'
                    }
                })
            });
        }
        //expanded: true
        // autoLoad: true,
        else if (this.reference == "ReceiveItemIdTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/sms/receiveItemTree.do',
                        //extraParams: {type:'0'},//额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src'
                    }
                })
            });
        }
        //expanded: true
        // autoLoad: true,
        else if (this.reference == "carlist") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/park/treeList.do',
                        extraParams: {
                            type: '0',
                            userId: Ext.util.Cookies.get("fid")
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        } else if (this.reference == "buildTree") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/system/aut/buildTree.do',
                        extraParams: {
                            type: '0',
                            userId: this.up("window").userId
                        },
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }else if (this.reference == "deposit") {
            Ext.apply(this, {
                store: new Ext.data.TreeStore({
                    nodeParam: 'type',
                    proxy: {
                        type: 'ajax',
                        url: JZYIndent.Cfg.server + '/fin/deposit/depositList.do',
                        //额外参数
                        reader: {
                            // 使用Ext.data.reader.Json读取服务器数据
                            type: 'json',
                            rootProperty: 'data',
                            totalProperty: 'totalCount'
                        }
                    },
                    root: {
                        text: 'Ext JS',
                        id: 'src',
                        expanded: true
                    }
                })
            });
        }
        this.callParent();
    }
});
