Ext.define('JZYIndent.data.FileTree', {
        requires: [
            'JZYIndent.data.Init',
            'Ext.ux.ajax.JsonSimlet'
        ],
        tree: [{
            text: 'src',
            children: [{
                "text": "我的合同",
                "expanded": true,
                "status": 1,
                iconCls: 'x-fa fa-home',
                "children": [
                    {
                        "text": "当前合同",
                        "status": 11,
                        iconCls: 'x-fa fa-institution',
                        "children": [{
                            "text": "60天内将到期合同",
                            "leaf": true,
                            iconCls: 'x-fa fa-sliders',
                            "status": 111,
                        }, {
                            "text": "变更过合同",
                            "leaf": true,
                            "status": 112,
                        }, {
                            "text": "已到期未退租合同",
                            "leaf": true,
                            "status": 113,
                        }]
                    },
                    {
                        "text": "待执行合同",
                        "status": 12,
                        "children": []
                    },
                    {
                        "text": "历史合同",
                        "status": 13,
                        "children": [{
                            "text": "已退租合同",
                            "leaf": true,
                            "status": 131,
                        }, {
                            "text": "提起退租合同",
                            "status": 132,
                            "children": [{
                                "text": "已启用",
                                "leaf": true,
                                "status": 1321,
                            }, {
                                "text": "未启用",
                                "leaf": true,
                                "status": 1322,
                            }],
                        }, {
                            "text": "变更前合同",
                            "leaf": true,
                            "status": 133,
                        }]
                    }]
            }]
        }], noteTree: [{
            text: 'src',
            children: [{
                "text": "短信记录",
                "expanded": true,
                "status": 1,
                "children": [
                    {
                        "text": "未发送短信任务",
                        "status": 11,
                        "children": []
                    }, {
                        "text": "已发送短信任务",
                        "status": 11,
                        "children": []
                    },]
            }, {
                "text": "收款使用模版",
                "expanded": true,
                "leaf": true,
                "status": 2,
            }]
        }],
        chargetree: [{
            text: 'src',
            children: [{
                "text": "按抄表状态查看",
                "expanded": true,
                "children": [{
                    "text": "未抄表",
                    "isReading": "-1",
                    "leaf": "true",
                }, {
                    "text": "已抄表",
                    "isReading": "1",
                    "leaf": "true",
                }]
            }]
        }],
        publicListdata: [{
            text: 'src',
            children: [{
                'text': '表具管理',
                'expanded': true,
                'children': [{
                    'text': '按房屋',
                    'isReading': '1',
                    'leaf': 'true',
                    'id': 'anfangwu'
                }, {
                    'text': '公摊表',
                    'isReading': '-1',
                    'leaf': 'true',
                    'id': 'gongtanbiao'
                }],
            }, {
                'text': '抄表管理',
                'expanded': true,
                'children': [{
                    'text': '用户表',
                    'isReading': '-1',
                    'leaf': 'true',
                    'id': 'yonghubiao'
                }, {
                    'text': '公用表',
                    'isReading': '-1',
                    'leaf': 'true',
                    'id': 'gongyongbiao'
                }],
            }]
        }],
        repairTree: [{
            text: 'src',
            children: [{
                "text": "全部工单",
                "expanded": true,
                "children": [
                    {
                        "text": "已登记",
                        "status": 1000,
                        'leaf': 'true'
                    }, {
                        "text": "已受理",
                        "status": 1020,
                        'leaf': 'true'
                    }, {
                        "text": "处理中",
                        "status": 1030,
                        'leaf': 'true'
                    }, {
                        "text": "已完成",
                        "status": 1080,
                        'leaf': 'true'
                    }, {
                        "text": "已回访",
                        "status": 2020,
                        'leaf': 'true'
                    },]
            }]
        }],
        suggestTree: [{
            text: 'src',
            children: [{
                "text": "全部工单",
                "expanded": true,
                "children": [
                    {
                        "text": "未处理",
                        "status": 1000,
                        'leaf': 'true'
                    }, {
                        "text": "已处理",
                        "status": 1080,
                        'leaf': 'true'
                    }, {
                        "text": "已回访",
                        "status": 2020,
                        'leaf': 'true'
                    },]
            }]
        }],
        resignmatterTree: [{
            text: 'src',
            children: [{
                "text": "职员列表",
                "expanded": true,
                "children": [
                    {
                        "text": "未处理",
                        "status": 1000,
                        'leaf': 'true'
                    }, {
                        "text": "已处理",
                        "status": 1080,
                        'leaf': 'true'
                    }, {
                        "text": "已回访",
                        "status": 2020,
                        'leaf': 'true'
                    },]
            }]
        }],
        filesTree: [{
            text: 'src',
            children: [{
                "text": "集团公司",
                "expanded": true,
                "children": [{
                    "text": "物业管理公司",
                    "expanded": true,
                    "children": [{
                        "text": "客服部",
                        "expanded": true,
                        "children": [{
                            "text": "客服一组",
                            'leaf': true
                        }, {
                            "text": "客服二组",
                            'leaf': true
                        },]
                    }, {
                        "text": "工程部",
                        "expanded": false,
                        "children": [{}],
                    }]
                }]
            }],
        }],
        organizationTree: [{
            text: 'src',
            children: [{
                "text": "蓝海集团",
                "expanded": true,
                "children": [{
                    "text": "集团总部",
                    "expanded": true,
                    "children": [{
                        "text": "人力资源部",
                        'leaf': true
                    }, {
                        "text": "财务部",
                        'leaf': true
                    }, {
                        "text": "总裁办",
                        'leaf': true
                    }]
                }, {
                    "text": "蓝海机械有限公司",
                    "expanded": true,
                    "children": [{
                        "text": "人力资源部",
                        'leaf': true
                    }, {
                        "text": "财务部",
                        'leaf': true
                    }, {
                        "text": "总裁办",
                        'leaf': true
                    }]
                }]
            }],
        }],
        brandTree: [{
            text: 'src',
            children: [{
                "text": "百货",
                "expanded": true,
                "children": [{
                    "text": "餐饮",
                    "expanded": true,
                    "children": [{
                        "text": "大型餐饮",
                        'leaf': true
                    }, {
                        "text": "咖啡/茶楼",
                        'leaf': true
                    }, {
                        "text": "轻餐饮",
                        'leaf': true
                    }, {
                        "text": "甜品/面包服",
                        'leaf': true
                    }, {
                        "text": "知名快餐",
                        'leaf': true
                    }, {
                        "text": "中型餐饮",
                        'leaf': true
                    }]
                }, {
                    "text": "超市",
                    "expanded": true,
                    "children": [{
                        "text": "便利店",
                        'leaf': true
                    }, {
                        "text": "大型超市",
                        'leaf': true
                    }, {
                        "text": "精品超市",
                        'leaf': true
                    }, {
                        "text": "中型超市",
                        'leaf': true
                    }]
                }]
            }, {
                "text": "服务及其他",
                "expanded": true,
                "children": [{
                    "text": "大型餐饮",
                    "expanded": true,
                }, {
                    "text": "咖啡/茶楼",
                    'leaf': true
                }, {
                    "text": "轻餐饮",
                    'leaf': true
                }, {
                    "text": "甜品/面包服",
                    'leaf': true
                }, {
                    "text": "知名快餐",
                    'leaf': true
                }, {
                    "text": "中型餐饮",
                    'leaf': true
                }]
            }]
        }],
        equipsTree: [{
            text: 'src',
            children: [{
                "text": "所有设施设备",
                "expanded": true,
                "children": [{
                    "text": "电梯类",
                    "expanded": true,
                    "children": [{
                        "text": "日立电梯类",
                        'leaf': true
                    },]
                }]
            }, {
                "text": "水泵类",
            }]
        }],
        materialslistTree:[{
            text:'src',
            children: [{
                "text": "物品分类",
                "expanded": true,
                "children": [{
                    "text": "办公用品",
                    "expanded": true,
                    "children": []
                },{
                    "text": "工程物品",
                    "expanded": true,
                    "children": []
                }]
            }]
        }],
    },
    function () {
        var chargedata,
            treedata,
            payTreeData,
            Ratesdata,
            leasedata = this.prototype.tree,
            repairdata = this.prototype.repairTree,
            suggestdata = this.prototype.suggestTree,
            resignmatterdata = this.prototype.resignmatterTree,
            noteTree = this.prototype.noteTree,
            publicListdata = this.prototype.chargetree,
            filesdata = this.prototype.filesTree,
            organizationdata = this.prototype.organizationTree,
            branddata = this.prototype.brandTree,
            equipsdata = this.prototype.equipsTree,
            materialslistdata = this.prototype.materialslistTree,
            areadata, checkTree,
            Formuladata;
        Ext.ux.ajax.SimManager.register({
            '/indent/chargelist': {
                type: 'json',
                data: function (ctx) {
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/equip/meter/getMeterItemFormatList.do',
                        method: 'GET',
                        scope: this,
                        async: false,
                        withCredentials: true,
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            chargedata = respText.data;
                        },
                        failure: function () {
                            Ext.Msg.alert("提示", "请求失败！");
                        },
                        callback: function (opts, success, response) {

                        },
                    });
                    return Ext.clone(chargedata);
                },
            }, '/indent/handleItemTree': {
                type: 'json',
                data: function (ctx) {
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/fin/pay/getPayItemTree.do',
                        method: 'GET',
                        scope: this,
                        async: false,
                        withCredentials: true,
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            payTreeData = respText.data;
                        },
                        failure: function () {
                            Ext.Msg.alert("提示", "请求失败！");
                        },
                        callback: function (opts, success, response) {

                        },
                    });
                    return Ext.clone(payTreeData);
                },
            }, '/indent/Rateslist': {
                type: 'json',
                data: function (ctx) {
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/fin/receive/getReceiveItemFormatList.do',
                        method: 'GET',
                        scope: this,
                        async: false,
                        withCredentials: true,
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            Ratesdata = respText.data;
                            console.log(Ratesdata)
                        },
                        failure: function () {
                            Ext.Msg.alert("提示", "请求失败！");
                        },
                        callback: function (opts, success, response) {

                        },
                    });
                    return Ext.clone(Ratesdata);
                },
            }, '/indent/AddCost': {
                type: 'json',
                data: function (ctx) {
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/fin/receive/getReceiveItemFormatList.do',
                        method: 'GET',
                        scope: this,
                        async: false,
                        params: {
                            type: 1,
                        },
                        withCredentials: true,
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            Ratesdata = respText.data;
                            console.log(Ratesdata)
                        },
                        failure: function () {
                            Ext.Msg.alert("提示", "请求失败！");
                        },
                        callback: function (opts, success, response) {

                        },
                    });
                    return Ext.clone(Ratesdata);
                },
            }, '/indent/formula': {
                type: 'json',
                data: function (ctx) {
                    Ext.Ajax.request({
                        url: JZYIndent.Cfg.server + '/equip/meter/meterItemFormatList.do',
                        method: 'GET',
                        scope: this,
                        async: false,
                        withCredentials: true,
                        success: function (result) {
                            var respText = Ext.util.JSON.decode(result.responseText);
                            console.log(respText)
                            Formuladata = respText.data;
                        },
                        failure: function () {
                            Ext.Msg.alert("提示", "请求失败！");
                        },
                        callback: function (opts, success, response) {

                        },
                    });
                    return Ext.clone(Formuladata);
                },

            }, '/indent/lease': {
                type: 'json',
                tree: Ext.clone(leasedata)
            }, '/indent/dreamSend': {
                type: 'json',
                tree: Ext.clone(noteTree)
            }, '/indent/publiclist': {
                type: 'json',
                tree: Ext.clone(publicListdata)
            }, '/indent/Repairlist': {
                type: 'json',
                tree: Ext.clone(repairdata)
            }, '/indent/Suggestlist': {
                type: 'json',
                tree: Ext.clone(suggestdata)
            }, '/indent/ResignMatterlist': {
                type: 'json',
                tree: Ext.clone(resignmatterdata)
            }, '/indent/files': {
                type: 'json',
                tree: Ext.clone(filesdata)
            }, '/indent/organization': {
                type: 'json',
                tree: Ext.clone(organizationdata)
            }, '/indent/brand': {
                type: 'json',
                tree: Ext.clone(branddata)
            }, '/indent/equips': {
                type: 'json',
                tree: Ext.clone(equipsdata)
            }, '/indent/materialslist': {
                type: 'json',
                tree: Ext.clone(materialslistdata)
            }

        });
    });
