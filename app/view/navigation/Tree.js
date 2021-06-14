Ext.define('JZYIndent.view.navigation.Tree', {
    extend: 'Ext.tree.Panel',
    xtype: 'navigation-tree',
    //title: '菜单功能导航',
    rootVisible: false,
    lines: false,
    useArrows: true,
    hideHeaders: true,
    collapseFirst: false,
    width: 180,
    minWidth: 180,
    height: 200,
    split: true,
    hidden: true,
    stateful: true,
    // stateId: 'mainnav.west',
    //collapsible: true,

    // bufferedRenderer: !Ext.microloaderTags.test,

    // tools: [{
    //     type: 'up',
    //     tooltip: 'Switch to Breadcrumb View',
    //     listeners: {
    //         click: 'showBreadcrumbNav'
    //     }
    // }],

    initComponent: function () {
        var me = this,
            lastFilterValue;
        me.columns = [{
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'text',
            scope: me,
            align: "left",
            renderer: function (value) {
                var searchString = this.searchField.getValue();
                if (searchString.length > 0) {
                    return this.strMarkRedPlus(searchString, value);
                }

                return value;
            }
        }];
        var root;
        if (this.reference == "OA") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '首页信息',
                    expanded: true,
                    children: [{
                        id: 'meterReading',
                        text: '公告通知',
                        leaf: true
                    }, {
                        id: '',
                        text: '我的任务',
                        leaf: true
                    }, {
                        id: '',
                        text: '我的审批',
                        leaf: true
                    }, {
                        id: '',
                        text: '业务指标',
                        leaf: true
                    }, {
                        id: '',
                        text: '工作助手',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '办公管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '用印申请',
                        leaf: true
                    }, {
                        id: '',
                        text: '用车申请',
                        leaf: true
                    }, {
                        id: '',
                        text: '物资申购',
                        leaf: true
                    }, {
                        id: '',
                        text: '付款申请',
                        leaf: true
                    }, {
                        id: '',
                        text: '员工请假',
                        leaf: true
                    }, {
                        id: '',
                        text: '离职申请',
                        leaf: true
                    }, {
                        id: '',
                        text: '合同管理',
                        leaf: true
                    },]

                }, {
                    id: '',
                    text: '审批管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '审批任务',
                        leaf: true
                    }, {
                        id: '',
                        text: '未审事务',
                        leaf: true
                    }, {
                        id: '',
                        text: '已审事务',
                        leaf: true
                    }, {
                        id: '',
                        text: '未通过审批',
                        leaf: true
                    }, {
                        id: '',
                        text: '审批超时',
                        leaf: true
                    }, {
                        id: '',
                        text: '审批进度',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '预算管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '预算科目',
                        leaf: true
                    }, {
                        id: '',
                        text: '预算管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '预算统计',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '报销管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '报销科目',
                        leaf: true
                    }, {
                        id: '',
                        text: '报销管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '报销统计',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '固定资产',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '资产台账',
                        leaf: true
                    }, {
                        id: '',
                        text: '资产领用',
                        leaf: true
                    }, {
                        id: '',
                        text: '资产转移',
                        leaf: true
                    }, {
                        id: '',
                        text: '资产折旧',
                        leaf: true
                    }, {
                        id: '',
                        text: '资产报废',
                        leaf: true
                    }, {
                        id: '',
                        text: '资产盘存',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '内部通讯',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '内部聊天',
                        leaf: true
                    }, {
                        id: '',
                        text: '我的草稿',
                        leaf: true
                    }, {
                        id: '',
                        text: '电子邮件',
                        leaf: true
                    },
                    ]
                }
                ]
            }
        } else if (this.reference == "xmzx") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: 'houselist',
                    text: ' 房产信息',
                    leaf: true
                }, {
                    id: 'carlist',
                    text: '车位管理',
                    leaf: true
                },
                    // {
                    //     id: '',
                    //     text: '车辆资料',
                    //     leaf: true
                    // },
                    {
                        id: '',
                        text: '广告位',
                        leaf: true
                    }, {
                        id: 'btypelist',
                        text: '往来单位',
                        leaf: true
                    }, {
                        id: '',
                        text: '场地资料',
                        leaf: true
                    }, {
                        id: '',
                        text: '摊位资料',
                        leaf: true
                    }, {
                        id: 'clientlist',
                        text: '客户资料',
                        leaf: true
                    }, {
                        id: '',
                        text: '房态分析',
                        leaf: true
                    },
                ]
            }
        } else if (this.reference == "lysf") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '项目准备',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '销售计划',
                        leaf: true
                    }, {
                        id: '',
                        text: '折扣管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '付款方案',
                        leaf: true
                    }, {
                        id: '',
                        text: '按揭利率',
                        leaf: true
                    }, {
                        id: '',
                        text: '计算设置',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '市场营销',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '营销规划',
                        leaf: true
                    }, {
                        id: '',
                        text: '营销预算',
                        leaf: true
                    }, {
                        id: '',
                        text: '营销任务',
                        leaf: true
                    }, {
                        id: '',
                        text: '营销问卷',
                        leaf: true
                    }, {
                        id: '',
                        text: '营销活动',
                        leaf: true
                    }, {
                        id: '',
                        text: '竞争分析',
                        leaf: true
                    }, {
                        id: '',
                        text: '媒体投放',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '客户管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '意向客户',
                        leaf: true
                    }, {
                        id: '',
                        text: '跟进任务',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户统计',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户转移',
                        leaf: true
                    }, {
                        id: '',
                        text: '预约看房',
                        leaf: true
                    }, {
                        id: '',
                        text: '摇号管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户摇号',
                        leaf: true
                    }, {
                        id: '',
                        text: '选房试算',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '分销管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '分销商管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '分销合同',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户报备',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户回收',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '销控管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '认筹排号',
                        leaf: true
                    }, {
                        id: '',
                        text: '预留管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '预定管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '选房确认',
                        leaf: true
                    }, {
                        id: '',
                        text: '销控中心',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '售前准备',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '价格管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '售前定价',
                        leaf: true
                    }, {
                        id: '',
                        text: '售前调价',
                        leaf: true
                    }, {
                        id: '',
                        text: '放盘销售',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '交易管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '认购协议',
                        leaf: true
                    }, {
                        id: '',
                        text: '售房合同',
                        leaf: true
                    }, {
                        id: '',
                        text: '合同变更',
                        leaf: true
                    }, {
                        id: '',
                        text: '面积变更',
                        leaf: true
                    }, {
                        id: '',
                        text: '售楼合同审核',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '财务管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '定金管理',
                        leaf: true
                    }, {
                        id: 'receiptlist',
                        text: '收款管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '收款审计',
                        leaf: true
                    }, {
                        id: '',
                        text: '赠劵管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '借款管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '还款管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '佣金管理',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '售后服务',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '业户档案',
                        leaf: true
                    }, {
                        id: '',
                        text: '按揭管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '面积补差',
                        leaf: true
                    }, {
                        id: '',
                        text: '产权管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '交房管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '入伙服务',
                        leaf: true
                    }, {
                        id: '',
                        text: '售后整改',
                        leaf: true
                    },]
                },
                ]
            }

        } else if (this.reference == "zcyy") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '商户管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '商户登记',
                        leaf: true
                    }, {
                        id: '',
                        text: '商户证照',
                        leaf: true
                    }, {
                        id: '',
                        text: '商户巡检',
                        leaf: true
                    }, {
                        id: '',
                        text: '奖罚违规',
                        leaf: true
                    }, {
                        id: '',
                        text: '商户评价',
                        leaf: true
                    },]
                },
                    {
                        id: '',
                        text: '品牌管理',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '品牌资料',
                            leaf: true
                        }, {
                            id: '',
                            text: '品牌竞争',
                            leaf: true
                        },]
                    }, {
                        id: '',
                        text: '招商管理',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '招商规划',
                            leaf: true
                        }, {
                            id: '',
                            text: '意向客户',
                            leaf: true
                        }, {
                            id: '',
                            text: '意向跟进',
                            leaf: true
                        },]
                    }, {
                        id: '',
                        text: '租赁管理',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '合同模版',
                            leaf: true
                        }, {
                            id: '',
                            text: '认租合同',
                            leaf: true
                        }, {
                            id: 'leaselist',
                            text: '租赁合同',
                            leaf: true
                        }, {
                            id: 'retreatlist',
                            text: '退租合同',
                            leaf: true
                        }, {
                            id: 'defaultlist',
                            text: '违约合同',
                            leaf: true
                        }, {
                            id: 'backlist',
                            text: '返租合同',
                            leaf: true
                        }, {
                            id: '',
                            text: '合同审批',
                            leaf: true
                        }, {
                            id: '',
                            text: '合同收款',
                            leaf: true
                        }, {
                            id: '',
                            text: '合同付款',
                            leaf: true
                        },]

                    }, {
                        id: '',
                        text: '运营管理',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '入场管理',
                            leaf: true
                        }, {
                            id: '',
                            text: '装修管理',
                            leaf: true
                        }, {
                            id: '',
                            text: '维修管理',
                            leaf: true
                        }, {
                            id: '',
                            text: '投诉管理',
                            leaf: true
                        },]
                    }, {
                        id: '',
                        text: '集中收银',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '联销资料',
                            leaf: true
                        }, {
                            id: '',
                            text: '营业额录入',
                            leaf: true
                        }, {
                            id: '',
                            text: '收银管理',
                            leaf: true
                        }, {
                            id: '',
                            text: '联销结算',
                            leaf: true
                        },]

                    }, {
                        id: '',
                        text: '电子地图',

                    }, {
                        id: '',
                        text: '资产报表',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '商户报表',
                            leaf: true
                        }, {
                            id: '',
                            text: '招商报表',
                            leaf: true
                        }, {
                            id: '',
                            text: '租赁报表',
                            leaf: true
                        }, {
                            id: '',
                            text: '运营报表',
                            leaf: true
                        }, {
                            id: '',
                            text: '财务报表',
                            leaf: true
                        }, {
                            id: '',
                            text: '联销报表',
                            leaf: true
                        },]
                    }, {
                        id: '',
                        text: '资产KPI',
                        expanded: true,
                        children: [{
                            id: '',
                            text: '电子租控',
                            leaf: true
                        }, {
                            id: '',
                            text: '数字图表',
                            leaf: true
                        },
                        ]
                    },
                ]
            }
        } else if (this.reference == "wygl") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: 'KHGL',
                    text: '客户管理',
                    expanded: true,
                    children: [{
                        id: 'clientlist',
                        text: '客户资料',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '能耗管理',
                    expanded: true,
                    children: [{
                        id: 'chargelist',
                        text: '抄表管理',
                        leaf: true
                    }, {
                        id: 'meterreadinglist',
                        text: '能耗分析',
                        leaf: true
                    },]

                }, {
                    id: '',
                    text: '库房管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '物品台帐',
                        leaf: true
                    }, {
                        id: '',
                        text: '物品出库',
                        leaf: true
                    }, {
                        id: '',
                        text: '物品调拨',
                        leaf: true
                    }, {
                        id: '',
                        text: '物品盘点',
                        leaf: true
                    }, {
                        id: '',
                        text: '物品库存',
                        leaf: true
                    },]

                }, {
                    id: '',
                    text: '设备管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '工程前介',
                        leaf: true
                    }, {
                        id: 'Deviclist',
                        text: '设备台账',
                        leaf: true
                    }, {
                        id: '',
                        text: '设备维保',
                        leaf: true
                    }, /*{

                        id: 'repair',
                        text: '设备维修',
                        leaf: true
                    }, */{
                        id: '',
                        text: '房屋维修',
                        leaf: true
                    }, {
                        id: 'suggest',
                        text: '投诉管理',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '巡检管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '巡检规划',
                        leaf: true
                    }, {
                        id: '',
                        text: '巡检区域',
                        leaf: true
                    }, {
                        id: '',
                        text: '品质巡检',
                        leaf: true
                    }, {
                        id: '',
                        text: '安全巡更',
                        leaf: true
                    }, {
                        id: '',
                        text: '环境巡检',
                        leaf: true
                    }, {
                        id: '',
                        text: '设备巡检',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '物业报表',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '房源报表',
                        leaf: true
                    }, {
                        id: '',
                        text: '财务报表',
                        leaf: true
                    }, {
                        id: '',
                        text: '物料报表',
                        leaf: true
                    }, {
                        id: '',
                        text: '客服报表',
                        leaf: true
                    }, {
                        id: '',
                        text: '设备报表',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '物业KPI',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '工单绩效',
                        leaf: true
                    }, {
                        id: '',
                        text: '经营指标',
                        leaf: true
                    }, {
                        id: '',
                        text: '经营图表',
                        leaf: true
                    },]
                },
                ]
            }
        } else if (this.reference == "zjfw") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '置业管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '置业资料',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '房源管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '新增房源',
                        leaf: true
                    }, {
                        id: '',
                        text: '房源跟进',
                        leaf: true
                    }, {
                        id: '',
                        text: '成交管理',
                        leaf: true
                    }, {
                        id: '',
                        text: '门店招贴',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '客户管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '客户登记',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户跟进',
                        leaf: true
                    }, {
                        id: '',
                        text: '来电来访',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '签约管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '合同样本',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户签约',
                        leaf: true
                    }, {
                        id: '',
                        text: '提成明细',
                        leaf: true
                    }, {
                        id: '',
                        text: '提成汇总',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '统计分析',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '房源查询',
                        leaf: true
                    }, {
                        id: '',
                        text: '置业查询',
                        leaf: true
                    }, {
                        id: '',
                        text: '客户查询',
                        leaf: true
                    }, {
                        id: '',
                        text: '营业查询',
                        leaf: true
                    },]
                },
                ]
            }
        } else if (this.reference == "JSZX") {
            root = {
                text: '全部',
                id: 'all',
                id: '',
                text: '财务管理',
                expanded: true,
                children: [{
                    id: 'rateslist',
                    text: '收费标准',
                    leaf: true
                }, {
                    id: 'receivablelist',
                    text: '应收管理',
                    leaf: true
                }, {
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
                }, {
                    id: 'banklist',
                    text: '银行代扣',
                    leaf: true
                }, {
                    id: '',
                    text: '财务月结',
                    leaf: true
                },]
            }
        } else if (this.reference == "MJXT") {
        } else if (this.reference == "HR") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '招聘管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '招聘规划',
                        leaf: true
                    }, {
                        id: '',
                        text: '招聘发布',
                        leaf: true
                    }, {
                        id: '',
                        text: '招聘记录',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '简历管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '简历模版',
                        leaf: true
                    }, {
                        id: '',
                        text: '未读简历',
                        leaf: true
                    }, {
                        id: '',
                        text: '已读简历',
                        leaf: true
                    }, {
                        id: '',
                        text: '星标简历',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '人事资料',
                    expanded: true,
                    children: [{
                        id: 'fileslist',
                        text: '人事档案',
                        leaf: true
                    }, {
                        id: '',
                        text: '入职办理',
                        leaf: true
                    }, {
                        id: '',
                        text: '人事培训',
                        leaf: true
                    }, {
                        id: '',
                        text: '绩效考核',
                        leaf: true
                    }, {
                        id: '',
                        text: '转正办理',
                        leaf: true
                    }, {
                        id: '',
                        text: '社保办理',
                        leaf: true
                    }, {
                        id: '',
                        text: '人事调动',
                        leaf: true
                    }, {
                        id: '',
                        text: '离职办理',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '人事合同',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '人事合同模版',
                        leaf: true
                    }, {
                        id: '',
                        text: '人事合同签订',
                        leaf: true
                    }, {
                        id: '',
                        text: '人事合同审批',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '人事工资',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '工资科目',
                        leaf: true
                    }, {
                        id: '',
                        text: '工资公式',
                        leaf: true
                    }, {
                        id: '',
                        text: '工资计算',
                        leaf: true
                    }, {
                        id: '',
                        text: '工资结算',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '人事考勤',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '考勤设置',
                        leaf: true
                    }, {
                        id: '',
                        text: '考勤录入',
                        leaf: true
                    }, {
                        id: '',
                        text: '考勤审核',
                        leaf: true
                    }, {
                        id: '',
                        text: '考勤分析',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '人事提醒',
                    leaf: true
                },{
                    id: 'organization',
                    text: '组织架构',
                    leaf: true
                },
                ]
            }
        } else if (this.reference == "kjzx") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '会员管理',
                }, {
                    id: '',
                    text: '优惠劵管理',
                },]

            }
        } else if (this.reference == "sqwx") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
                    text: '移动办公',
                }, {
                    id: '',
                    text: '微信平台',
                }, {
                    id: '',
                    text: '商城平台',
                },]

            }
        } else if (this.reference == "xtzh") {
            root = {
                text: '全部',
                id: 'all',
                expanded: true,
                children: [{
                    id: '',
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
                    },]
                }, {
                    id: '',
                    text: '接口管理',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '财务接口',
                        leaf: true
                    }, {
                        id: '',
                        text: 'OA接口',
                        leaf: true
                    }, {
                        id: '',
                        text: '道闸接口',
                        leaf: true
                    }, {
                        id: '',
                        text: '监控接口',
                        leaf: true
                    }, {
                        id: '',
                        text: '抄表接口',
                        leaf: true
                    }, {
                        id: '',
                        text: '来电盒接口',
                        leaf: true
                    }, {
                        id: '',
                        text: '读卡器接口',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '增值服务',
                    expanded: true,
                    children: [{
                        id: '',
                        text: '支付平台',
                        leaf: true
                    }, {
                        id: '',
                        text: '短信平台',
                        leaf: true
                    },]
                }, {
                    id: '',
                    text: '数据词典',
                    leaf: true
                }, {
                    id: '',
                    text: '操作日志',
                    leaf: true
                }
                ]
            }
        }
        // console.log(me.reference)
//Ext.StoreMgr.get('navigation')
        Ext.apply(me, {
            //root: root,
            dockedItems: [
                {
                    xtype: 'textfield',
                    dock: 'top',
                    emptyText: 'Search',
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

                    onClearTriggerClick: function () {
                        this.setValue();
                        me.store.clearFilter();
                        this.getTrigger('clear').hide();
                    },

                    onSearchTriggerClick: function () {
                        me.filterStore(this.getValue());
                    },

                    listeners: {
                        keyup: {
                            fn: function (field, event, eOpts) {
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

                        render: function (field) {
                            //console.log(Ext.StoreMgr.get('navigation'))
                            this.searchField = field;
                        },

                        scope: me
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    filterStore: function (value) {
        var me = this,
            store = me.store,
            searchString = value.toLowerCase(),
            filterFn = function (node) {
                var children = node.childNodes,
                    len = children && children.length,
                    visible = v.test(node.get('text')),
                    i;

                // If the current node does NOT match the search condition
                // specified by the user...
                if (!visible) {

                    // Check to see if any of the child nodes of this node
                    // match the search condition.  If they do then we will
                    // mark the current node as visible as well.
                    for (i = 0; i < len; i++) {
                        if (children[i].isLeaf()) {
                            visible = children[i].get('visible');
                        } else {
                            visible = filterFn(children[i]);
                        }
                        if (visible) {
                            break;
                        }
                    }

                } else { // Current node matches the search condition...

                    // Force all of its child nodes to be visible as well so
                    // that the user is able to select an example to display.
                    for (i = 0; i < len; i++) {
                        children[i].set('visible', true);
                    }

                }

                return visible;
            }, v;

        if (searchString.length < 1) {
            store.clearFilter();
        } else {
            v = new RegExp(searchString, 'i');
            store.getFilters().replaceAll({
                filterFn: filterFn
            });
        }
    },

    strMarkRedPlus: function (search, subject) {
        return subject.replace(
            new RegExp('(' + search + ')', "gi"),
            "<span style='color: red;'><b>$1</b></span>"
        );
    }
});
