Ext.define('JZYIndent.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.Navigation',
    constructor: function (config) {
        var me = this,
            queryParams = Ext.Object.fromQueryString(location.search),
            charts = ('charts' in queryParams) && !/0|false|no/i.test(queryParams.charts);
        me.callParent([Ext.apply({
            root: {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: 'resource',
                    expanded: true,
                    text: '资源管理',
                    leaf: false,
                    children: [
                        //     {
                        //     id: 'reliclist',
                        //     text: '楼盘信息',
                        //     leaf: true
                        // },
                        //     {
                        //         id: 'doclist',
                        //         idd: 'docdetail',
                        //         text: '整栋信息',
                        //         leaf: true
                        //     },
                        //     {
                        //         id: 'floorlist',
                        //         text: '楼层信息',
                        //         leaf: true
                        //     },
                        //     {
                        //         id: 'elementlist',
                        //         text: '单元信息',
                        //         leaf: true
                        //     },
                        // {
                        //     id: 'btypelist',
                        //     text: '往来单位',
                        //     leaf: true
                        // },
                        {
                            id: 'houselist',
                            text: '',
                            leaf: true
                        },
                        {
                            id: 'carlist',
                            text: '车位管理',
                            leaf: true
                        },

                    ]
                },
                    {
                        text: '客户管理',
                        id: 'kh',
                        expanded: true,
                        children: [{
                            id: 'clientlist',
                            text: '客户资料',
                            leaf: true
                        },]
                    },
                    {
                        text: '租赁管理',
                        id: 'zp',
                        expanded: true,
                        children: [{
                            id: 'leaselist',
                            text: '租赁合同',
                            leaf: true
                        },
                            {
                                id: 'backlist',
                                text: '返租合同',
                                leaf: true
                            }, {
                                id: 'defaultlist',
                                text: '违约合同',
                                leaf: true
                            },{
                                id: 'retreatlist',
                                text: '退租合同',
                                leaf: true
                            },]
                    },
                    // {
                    //     text: '客户服务',
                    //     id: 'fw',
                    //     expanded: true,
                    //     children: [{
                    //         id: 'maintainlist',
                    //         text: '维修管理',
                    //         leaf: true
                    //     }, {
                    //         id: 'complaintlist',
                    //         text: '投诉管理',
                    //         leaf: true
                    //     },]
                    // },

                    {
                        text: '财务管理',
                        id: 'sz_xx',
                        expanded: true,
                        children: [{
                            id: 'rateslist',
                            text: '收费标准',
                            leaf: true
                        }, {
                            id: 'receivablelist',
                            text: '应收管理',
                            leaf: true
                        },{
                            id: 'remissionlist',
                            text: '减免管理',
                            leaf: true
                        }, {
                            id: 'handlelist',
                            text: '应付管理',
                            leaf: true
                        }, {
                            id: 'receiptlist',
                            text: '收款管理',
                            leaf: true
                        }, {
                            id: 'paylist',
                            text: '付款管理',
                            leaf: true
                        }, {
                            id: 'transfer',
                            text: '转账管理',
                            leaf: true
                        },{
                            id: 'banklist',
                            text: '银行代扣',
                            leaf: true
                        },
                        ]
                    },
                    {
                        text: '设备管理',
                        id: 'sbgl',
                        expanded: true,
                        children: [
                            {
                                id: 'Deviclist',
                                text: '设备台账',
                                leaf: true
                            },
                           /* {
                                id: 'repair',
                                text: '设备维修',
                                leaf: true
                            },*/
                            {
                                id: 'suggest',
                                text: '投诉管理',
                                leaf: true

                            }
                        ]
                    }, {
                        text: '能耗管理',
                        id: 'nhgl',
                        expanded: true,
                        children: [{
                            id: 'chargelist',
                            text: '费表设置',
                            leaf: true
                        }, {

                            //id:'meterreadinglist',
                            text: '用户抄表',
                            leaf: true
                        },{
                            id:'meterreadinglist',
                            text:'抄表管理',
                            leaf:true
                        }]
                    },{
                        text: '库房管理',
                        id: 'kfgl',
                        expanded: true,
                        children: []
                    },{
                        text: '数据分析',
                        id: 'sufx',
                        expanded: true,
                        children: [{
                            id: 'housinglist',
                            text: '不动产明细表',
                            leaf: true
                        },
                            {
                                id: 'rentoutlist',
                                text: '不动产出租明细表',
                                leaf: true
                            },
                            {
                                id: 'receivable',
                                text: '应收明细表',
                                leaf: true
                            },
                            {
                                id: 'uncollected',
                                text: '未收明细表',
                                leaf: true
                            },
                            {
                                id: 'received',
                                text: '实收明细表',
                                leaf: true
                            },{
                                id: 'precollected',
                                text: '预收冲抵明细表',
                                leaf: true
                            },{
                                id: 'recharge',
                                text: '充值明细表',
                                leaf: true
                            },
                        ]
                    }, {
                        text: '设置中心',
                        id: 'szzx',
                        expanded: true,
                        children: [{
                            text: '组织架构',
                            expanded: true,
                            children: [{
                                id: 'department',
                                text: '部门管理',
                                leaf: true
                            }, {
                                id: 'station',
                                text: '岗位管理',
                                leaf: true
                            }, {
                                id: 'users',
                                text: '用户管理',
                                leaf: true
                            }

                            ]
                        }
                        ]
                    },{
                        text: '更多操作',
                        id: 'gdcz',
                        expanded: true,
                        children: [{
                            id: 'dreamSend',
                            text: '短信管理',
                            leaf: true
                        },
                        ]
                    },{
                        text: '人事系统',
                        id: 'rsxt',
                        expanded: true,
                        children: [{
                            id: 'fileslist',
                            text: '人事档案',
                            leaf: true
                        },{
                            id: 'organization',
                            text: '组织架构',
                            leaf: true
                        },
                        ]
                    }

                ]
            }
        }, config)]);
    },
    addIconClasses: function (items) {
        for (var item, i = items.length; i-- > 0;) {
            item = items[i];

            if (!('iconCls' in item)) {
                item.iconCls = 'icon-' + item.id;
            }

            if (!('glyph' in item)) {
                // sets the font-family
                item.glyph = '32@Sencha-Examples';
            }

            if (item.children) {
                this.addIconClasses(item.children);
            }
        }

        return items;
    },
    getNavItems: function () {
        var menus;
//         var cfg_menus = JZYIndent.Cfg.usrInfo.get('menu');
//         console.log(cfg_menus)
//         var perms = JZYIndent.Cfg.usrInfo.get('perms');
//         JZYIndent.Cfg.bView = (perms == '*:view');
//         //用户配置菜单为空显示全部
//         if (!cfg_menus || $.trim(cfg_menus) == '')
//             //this.addIconClasses(menus)
//             return menus;
//         //只显示配置菜单项
//         var user_menus = [];
//         var ums = cfg_menus.split(';');
//         for (var i = 0; i < menus.length; i++) {
//             var mid = menus[i].id;
//             var bfind = false;
//             for (var j = 0; j < ums.length; j++) {
//                 if (ums[j] == mid) {
//                     bfind = true;
//                     break;
//                 }
//             }
//             if (bfind) {
//                 user_menus[user_menus.length] = menus[i];
//             }
//         }
// //this.addIconClasses(user_menus)
//         return user_menus;
    }
});
