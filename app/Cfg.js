Ext.define('JZYIndent.Cfg', {
    singleton: true,
    VISITOR: 0.1,
    //
    APP_NAME: '',
    ABOUT: '<br><font color="blue">2020年10月</font><br>当前版本<font color="red">0.1</font>',
    ROW_HEIGHT: 100,
    SIM_ENM: {
        'User': 2,
        'first': 50,
        'Client': 50,
        'second': 50,
        'third': 50,
    },
    //server: 'http://localhost:5678/allkd',
    server: 'http://test.gzfzdev.com:8081/allkd_barcode_war_exploded',
    usrInfo: null,
    houseInfo:null,
    propertyType: [
        {
            id: '1',
            name: '住宅'
        },{
            id: '2',
            name: '商铺'
        },{
            id: '3',
            name: '写字楼'
        },{
            id: '4',
            name: '车位'
        },{
            id: '5',
            name: '广告位'
        },{
            id: '6',
            name: '场地'
        }],
    systemType: [
        {
            id: '1',
            name: '周期性费用'
        },{
            id: '2',
            name: '临时性费用'
        },{
            id: '3',
            name: '滞纳金费用'
        },{
            id: '4',
            name: '押金类费用'
        }],
    proType: [
        {
            id: '1',
            name: 'A'
        }],
    statusNow: [
        {
            id: '1',
            name: '准备房'
        }],
    tenantType: [
        {
            id: '1',
            name: 'A'
        }],
    unitNameType: [
        {
            id: '1',
            name: '101 102...'
        },
        {
            id: '2',
            name: '1栋101 1栋102...'
        },
        {
            id: '3',
            name: 'A B C...'
        }],

    tenementUse: [
        {
            id: '1',
            name: '住宅物业'
        },
        {
            id: '2',
            name: '出租物业'
        },
        ],
    faceTo: [
        {
            id: '1',
            name: '东北'
        },{
            id: '1',
            name: '西南'
        }],
    feeCategory: [
        {
            id: '1',
            name: '租金'
        }, {
            id: '2',
            name: '管理费'
        }, {
            id: '3',
            name: '水费'
        }, {
            id: '4',
            name: '电费'
        }, {
            id: '5',
            name: '租其他金'
        },{
            id: '6',
            name: '租赁保证金'
        },{
            id: '7',
            name: '押金'
        },],
    currency: [
        {
            id: '1',
            name: '人民币'
        }],
    cost: [
        {
            id: '1',
            name: '物业收入'
        }, {
            id: '2',
            name: '其他收入'
        }, {
            id: '3',
            name: '代收代付'
        }],
    receivableType: [
        {
            id: '1',
            name: '计算一期少于指定时间的费用'
        }, {
            id: '2',
            name: '计算多笔费用到指定日期'
        }],
    banklist: [
        {
            value: 'CDB',
            text: '国家开发银行'
        },
        {
            value: 'ICBC',
            text: '中国工商银行'
        },
        {
            value: 'ABC',
            text: '中国农业银行'
        },
        {
            value: 'BOC',
            text: '中国银行'
        },
        {
            value: 'CCB',
            text: '中国建设银行'
        },
        {
            value: 'PSBC',
            text: '中国邮政储蓄银行'
        },
        {
            value: 'COMM',
            text: '交通银行'
        },
        {
            value: 'CMB',
            text: '招商银行'
        },
        {
            value: 'SPDB',
            text: '上海浦东发展银行'
        },
        {
            value: 'CIB',
            text: '兴业银行'
        },
        {
            value: 'HXBANK',
            text: '华夏银行'
        },
        {
            value: 'GDB',
            text: '广东发展银行'
        },
        {
            value: 'CMBC',
            text: '中国民生银行'
        },
        {
            value: 'CITIC',
            text: '中信银行'
        },
        {
            value: 'CEB',
            text: '中国光大银行'
        },
        {
            value: 'EGBANK',
            text: '恒丰银行'
        },
        {
            value: 'CZBANK',
            text: '浙商银行'
        },
        {
            value: 'BOHAIB',
            text: '渤海银行'
        },
        {
            value: 'SPABANK',
            text: '平安银行'
        },
        {
            value: 'SHRCB',
            text: '上海农村商业银行'
        },
        {
            value: 'YXCCB',
            text: '玉溪市商业银行'
        },
        {
            value: 'YDRCB',
            text: '尧都农商行'
        },
        {
            value: 'BJBANK',
            text: '北京银行'
        },
        {
            value: 'SHBANK',
            text: '上海银行'
        },
        {
            value: 'JSBANK',
            text: '江苏银行'
        },
        {
            value: 'HZCB',
            text: '杭州银行'
        },
        {
            value: 'NJCB',
            text: '南京银行'
        },
        {
            value: 'NBBANK',
            text: '宁波银行'
        },
        {
            value: 'HSBANK',
            text: '徽商银行'
        },
        {
            value: 'CSCB',
            text: '长沙银行'
        },
        {
            value: 'CDCB',
            text: '成都银行'
        },
        {
            value: 'CQBANK',
            text: '重庆银行'
        },
        {
            value: 'DLB',
            text: '大连银行'
        },
        {
            value: 'NCB',
            text: '南昌银行'
        },
        {
            value: 'FJHXBC',
            text: '福建海峡银行'
        },
        {
            value: 'HKB',
            text: '汉口银行'
        },
        {
            value: 'WZCB',
            text: '温州银行'
        },
        {
            value: 'QDCCB',
            text: '青岛银行'
        },
        {
            value: 'TZCB',
            text: '台州银行'
        },
        {
            value: 'JXBANK',
            text: '嘉兴银行'
        },
        {
            value: 'CSRCB',
            text: '常熟农村商业银行'
        },
        {
            value: 'NHB',
            text: '南海农村信用联社'
        },
        {
            value: 'CZRCB',
            text: '常州农村信用联社'
        },
        {
            value: 'H3CB',
            text: '内蒙古银行'
        },
        {
            value: 'SXCB',
            text: '绍兴银行'
        },
        {
            value: 'SDEB',
            text: '顺德农商银行'
        },
        {
            value: 'WJRCB',
            text: '吴江农商银行'
        },
        {
            value: 'ZBCB',
            text: '齐商银行'
        },
        {
            value: 'GYCB',
            text: '贵阳市商业银行'
        },
        {
            value: 'ZYCBANK',
            text: '遵义市商业银行'
        },
        {
            value: 'HZCCB',
            text: '湖州市商业银行'
        },
        {
            value: 'DAQINGB',
            text: '龙江银行'
        },
        {
            value: 'JINCHB',
            text: '晋城银行JCBANK'
        },
        {
            value: 'ZJTLCB',
            text: '浙江泰隆商业银行'
        },
        {
            value: 'GDRCC',
            text: '广东省农村信用社联合社'
        },
        {
            value: 'DRCBCL',
            text: '东莞农村商业银行'
        },
        {
            value: 'MTBANK',
            text: '浙江民泰商业银行'
        },
        {
            value: 'GCB',
            text: '广州银行'
        },
        {
            value: 'LYCB',
            text: '辽阳市商业银行'
        },
        {
            value: 'JSRCU',
            text: '江苏省农村信用联合社'
        },
        {
            value: 'LANGFB',
            text: '廊坊银行'
        },
        {
            value: 'CZCB',
            text: '浙江稠州商业银行'
        },
        {
            value: 'DYCB',
            text: '德阳商业银行'
        },
        {
            value: 'JZBANK',
            text: '晋中市商业银行'
        },
        {
            value: 'BOSZ',
            text: '苏州银行'
        },
        {
            value: 'GLBANK',
            text: '桂林银行'
        },
        {
            value: 'URMQCCB',
            text: '乌鲁木齐市商业银行'
        },
        {
            value: 'CDRCB',
            text: '成都农商银行'
        },
        {
            value: 'ZRCBANK',
            text: '张家港农村商业银行'
        },
        {
            value: 'BOD',
            text: '东莞银行'
        },
        {
            value: 'LSBANK',
            text: '莱商银行'
        },
        {
            value: 'BJRCB',
            text: '北京农村商业银行'
        },
        {
            value: 'TRCB',
            text: '天津农商银行'
        },
        {
            value: 'SRBANK',
            text: '上饶银行'
        },
        {
            value: 'FDB',
            text: '富滇银行'
        },
        {
            value: 'CRCBANK',
            text: '重庆农村商业银行'
        },
        {
            value: 'ASCB',
            text: '鞍山银行'
        },
        {
            value: 'NXBANK',
            text: '宁夏银行'
        },
        {
            value: 'BHB',
            text: '河北银行'
        },
        {
            value: 'HRXJB',
            text: '华融湘江银行'
        },
        {
            value: 'ZGCCB',
            text: '自贡市商业银行'
        },
        {
            value: 'YNRCC',
            text: '云南省农村信用社'
        },
        {
            value: 'JLBANK',
            text: '吉林银行'
        },
        {
            value: 'DYCCB',
            text: '东营市商业银行'
        },
        {
            value: 'KLB',
            text: '昆仑银行'
        },
        {
            value: 'ORBANK',
            text: '鄂尔多斯银行'
        },
        {
            value: 'XTB',
            text: '邢台银行'
        },
        {
            value: 'JSB',
            text: '晋商银行'
        },
        {
            value: 'TCCB',
            text: '天津银行'
        },
        {
            value: 'BOYK',
            text: '营口银行'
        },
        {
            value: 'JLRCU',
            text: '吉林农信'
        },
        {
            value: 'SDRCU',
            text: '山东农信'
        },
        {
            value: 'XABANK',
            text: '西安银行'
        },
        {
            value: 'HBRCU',
            text: '河北省农村信用社'
        },
        {
            value: 'NXRCU',
            text: '宁夏黄河农村商业银行'
        },
        {
            value: 'GZRCU',
            text: '贵州省农村信用社'
        },
        {
            value: 'FXCB',
            text: '阜新银行'
        },
        {
            value: 'HBHSBANK',
            text: '湖北银行黄石分行'
        },
        {
            value: 'ZJNX',
            text: '浙江省农村信用社联合社'
        },
        {
            value: 'XXBANK',
            text: '新乡银行'
        },
        {
            value: 'HBYCBANK',
            text: '湖北银行宜昌分行'
        },
        {
            value: 'LSCCB',
            text: '乐山市商业银行'
        },
        {
            value: 'TCRCB',
            text: '江苏太仓农村商业银行'
        },
        {
            value: 'BZMD',
            text: '驻马店银行'
        },
        {
            value: 'GZB',
            text: '赣州银行'
        },
        {
            value: 'WRCB',
            text: '无锡农村商业银行'
        },
        {
            value: 'BGB',
            text: '广西北部湾银行'
        },
        {
            value: 'GRCB',
            text: '广州农商银行'
        },
        {
            value: 'JRCB',
            text: '江苏江阴农村商业银行'
        },
        {
            value: 'BOP',
            text: '平顶山银行'
        },
        {
            value: 'TACCB',
            text: '泰安市商业银行'
        },
        {
            value: 'CGNB',
            text: '南充市商业银行'
        },
        {
            value: 'CCQTGB',
            text: '重庆三峡银行'
        },
        {
            value: 'XLBANK',
            text: '中山小榄村镇银行'
        },
        {
            value: 'HDBANK',
            text: '邯郸银行'
        },
        {
            value: 'KORLABANK',
            text: '库尔勒市商业银行'
        },
        {
            value: 'BOJZ',
            text: '锦州银行'
        },
        {
            value: 'QLBANK',
            text: '齐鲁银行'
        },
        {
            value: 'BOQH',
            text: '青海银行'
        },
        {
            value: 'YQCCB',
            text: '阳泉银行'
        },
        {
            value: 'SJBANK',
            text: '盛京银行'
        },
        {
            value: 'FSCB',
            text: '抚顺银行'
        },
        {
            value: 'ZZBANK',
            text: '郑州银行'
        },
        {
            value: 'SRCB',
            text: '深圳农村商业银行'
        },
        {
            value: 'BANKWF',
            text: '潍坊银行'
        },
        {
            value: 'JJBANK',
            text: '九江银行'
        },
        {
            value: 'JXRCU',
            text: '江西省农村信用'
        },
        {
            value: 'HNRCU',
            text: '河南省农村信用'
        },
        {
            value: 'GSRCU',
            text: '甘肃省农村信用'
        },
        {
            value: 'SCRCU',
            text: '四川省农村信用'
        },
        {
            value: 'GXRCU',
            text: '广西省农村信用'
        },
        {
            value: 'SXRCCU',
            text: '陕西信合'
        },
        {
            value: 'WHRCB',
            text: '武汉农村商业银行'
        },
        {
            value: 'YBCCB',
            text: '宜宾市商业银行'
        },
        {
            value: 'KSRB',
            text: '昆山农村商业银行'
        },
        {
            value: 'SZSBK',
            text: '石嘴山银行'
        },
        {
            value: 'HSBK',
            text: '衡水银行'
        },
        {
            value: 'XYBANK',
            text: '信阳银行'
        },
        {
            value: 'NBYZ',
            text: '鄞州银行'
        },
        {
            value: 'ZJKCCB',
            text: '张家口市商业银行'
        },
        {
            value: 'XCYH',
            text: '许昌银行'
        },
        {
            value: 'JNBANK',
            text: '济宁银行'
        },
        {
            value: 'CBKF',
            text: '开封市商业银行'
        },
        {
            value: 'WHCCB',
            text: '威海市商业银行'
        },
        {
            value: 'HBC',
            text: '湖北银行'
        },
        {
            value: 'BOCD',
            text: '承德银行'
        },
        {
            value: 'BODD',
            text: '丹东银行'
        },
        {
            value: 'JHBANK',
            text: '金华银行'
        },
        {
            value: 'BOCY',
            text: '朝阳银行'
        },
        {
            value: 'LSBC',
            text: '临商银行'
        },
        {
            value: 'BSB',
            text: '包商银行'
        },
        {
            value: 'LZYH',
            text: '兰州银行'
        },
        {
            value: 'BOZK',
            text: '周口银行'
        },
        {
            value: 'DZBANK',
            text: '德州银行'
        },
        {
            value: 'SCCB',
            text: '三门峡银行'
        },
        {
            value: 'AYCB',
            text: '安阳银行'
        },
        {
            value: 'ARCU',
            text: '安徽省农村信用社'
        },
        {
            value: 'HURCB',
            text: '湖北省农村信用社'
        },
        {
            value: 'HNRCC',
            text: '湖南省农村信用社'
        },
        {
            value: 'NYNB',
            text: '广东南粤银行'
        },
        {
            value: 'LYBANK',
            text: '洛阳银行'
        },
        {
            value: 'NHQS',
            text: '农信银清算中心'
        },
        {
            value: 'CBBQS',
            text: '城市商业银行资金清算中心'
        }
    ],

    OPT_STORES: {},
    getWSURL: function () {
        var wsurl = "ws://" + window.location.host + "/ws/wst.do";
        return wsurl;
    },
    constructor: function (options) {
        this.ADMINISTRATOR = 'kkkkkk';
        this.initConfig(options);
    },
    getRecentDay: function (day_span, fmt) {
        var today = new Date();
        var day_before = new Date();
        day_before.setDate(today.getDate() - day_span);
        return Ext.util.Format.date(day_before, fmt)
    },
    render_workitem: function (value, metaData) {
        var map = {
            'wgfyr': '翻译人',
            'wwscr': '英文审稿人',
            'djr': '登记人',
            'ysr': '初审',
            'esr': '终审'
        };
        return map[value];
    },
    getListStore: function (model_name, entity_name, pn, sort) {
        var storeId = 'ls_' + entity_name + '.' + pn;
        var st = Ext.StoreManager.lookup(storeId);
        if (st)
            return st;
        var cfg = {
            storeId: storeId,
            pageSize: 10,
            model: model_name,
            proxy: {
                type: 'rest',
                url: '/ls/' + entity_name + '/' + pn,
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        };
        if (sort) {
            Ext.applyIf(cfg, {
                sorters: sort,
                //	remoteFilter: true,
                remoteSort: true
            });
        }
        return Ext.create('Ext.data.ArrayStore', cfg);
    },
    getStaticStore: function (data, field) {
        var cfg = {
            fields: field,
            proxy: {
                type: 'memory',
                data: data,
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        };
        console.log(cfg)
        return Ext.create('Ext.data.ArrayStore', cfg);
    },
     getStaticStateStore: function (entity_name, property_name, filters, func_load) {
        var storeId = 'st_.' + property_name;
        var st = Ext.StoreManager.lookup(storeId);
        if (!filters)
            if (st)
                return st;
        var config = {
            storeId: storeId,
            fields: [{name: 'id', type: "int"}, {name: 'name', type: "string"}],
            proxy: {
                type: 'memory',
                data: entity_name,
                reader: {
                    type: 'json',
                    //rootProperty: 'data',
                    totalProperty: 'total'
                }
            },
            //autoLoad: true
        };
        if (func_load) {
            config.listeners = {
                load: func_load
            };
        }
        if (filters) {
            Ext.applyIf(config, {
                filters: filters,
                remoteFilter: true,
                remoteSort: true
            });
        }
        return Ext.create('Ext.data.ArrayStore', config);
    },
    getJsonFile:function (entity_name) {
        var sData=[];
        Ext.Ajax.request( {
            url : entity_name,
            async: false,
            method : 'POSt',
            success : function(response) {
                var respText = Ext.util.JSON.decode(response.responseText);
                for(var i in respText) {
                    var obj={}
                    eval("obj.id" + "='" + i + "'");
                    eval("obj.name" + "='" + respText[i] + "'");
                    sData.push(obj)
                }
            },
            failure : function() {
                Ext.Msg.alert('提示','出现异常!');
            }
        });
        return sData;
    },
    getStaticJsonStore: function (entity_name, property_name, filters, func_load) {
        var storeId = 'st_.' + property_name;
        var st = Ext.StoreManager.lookup(storeId);
        console.log(st)
        if (!filters)
        console.log(entity_name)
        var ndStore=this.getJsonFile(entity_name)
        var config = {
            storeId: storeId,
            fields: [{name: 'id', type: "int"}, {name: 'name', type: "string"}],
            proxy: {
                type: 'memory',
                data: ndStore,
                reader: {
                    type: 'json',
                    //rootProperty: 'data',
                    totalProperty: 'total'
                }
            },
            //autoLoad: true
        };
        if (func_load) {
            config.listeners = {
                load: func_load
            };
        }
        if (filters) {
            Ext.applyIf(config, {
                filters: filters,
                remoteFilter: true,
                remoteSort: true
            });
        }
        return Ext.create('Ext.data.ArrayStore', config);
    },
    getDistinctStore: function (entity_name, property_name, filters, func_load) {
        var storeId = 'st_' + entity_name + '.' + property_name;
        var st = Ext.StoreManager.lookup(storeId);
        if (!filters)
            if (st)
                return st;
        var config = {
            storeId: storeId,
            pageSize: 100,
            fields: [{name:'id', type : "int"},{name:'name',type : "string"}],
            proxy: {
                type: 'rest',
                url: this.server + '/' + entity_name,
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            },
           // autoLoad: true
        };
        if (func_load) {
            config.listeners = {
                load: func_load
            };
        }
        if (filters) {
            Ext.applyIf(config, {
                filters: filters,
                remoteFilter: true,
                remoteSort: true
            });
        }
        return Ext.create('Ext.data.ArrayStore', config);
    },
    //id&name一致时（特殊）
    getChargeStore: function (entity_name, property_name, filters, func_load) {
        var storeId = 'st_' + entity_name + '.' + property_name;
        var st = Ext.StoreManager.lookup(storeId);
        if (!filters)
            if (st)
                return st;
        var config = {
            storeId: storeId,
            pageSize: 100,
            fields: [{name: 'id'}, {name: 'name', type: "string"}],
            proxy: {
                type: 'rest',
                url: this.server + '/' + entity_name,
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            },
            // autoLoad: true
        };
        // if (func_load) {
        //     config.listeners = {
        //         load: func_load
        //     };
        // }
        // if (filters) {
        //     Ext.applyIf(config, {
        //         filters: filters,
        //         remoteFilter: true,
        //         remoteSort: true
        //     });
        // }
        return Ext.create('Ext.data.ArrayStore', config);
    },
    //带参数传递方法
    getExtraParamsStore: function (entity_name, property_name, filters, func_load, Params) {
        var config = {
            fields: ['id', 'name'],
            proxy: {
                type: 'rest',
                url: this.server + '/' + entity_name,
                extraParams: Params,//额外参数
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            },
           // autoLoad: true
        };
        // if (func_load) {
        //     config.listeners = {
        //         load: func_load
        //     };
        // }
        // if (filters) {
        //     Ext.applyIf(config, {
        //         filters: filters,
        //         remoteFilter: true,
        //         remoteSort: true
        //     });
        // }
        return Ext.create('Ext.data.ArrayStore', config);
    },
    getStore: function (str) {
        var st = this.OPT_STORES[str];
        if (st)
            return st;
        var data = [];
        var sa = this.OPTS[str];
        for (var i = 0; i < sa.length; i++) {
            var sv = sa[i];
            data.push({'abbr': sv, 'name': sv});
        }
        st = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data: data
        });
        this.OPT_STORES[str] = st;
        return st;
    },
    addStore: function (str, val) {
        var st = this.OPT_STORES[str];
        if (!st)
            return;
        var rec = st.findRecord('abbr', val);
        if (rec)
            return;
        this.OPTS[str].push(val);
        st.add({'abbr': val, 'name': val});
    },
    addStores: function (sm) {
        for (var x in sm) {
            this.addStore(x, sm[x]);
        }
    },
    bData: function (data) {
        var arr6 = [];
        for (var i in data) {
            var arr7 = [];
            for (var j in data[i]) {
                arr7.push(data[i][j]);
            }
            arr6.push(arr7);
        }
        // console.log(arr6)
        return arr6;
    },
    getUserField: function (filedLabelValue, bindValue) {
        return {
            flex: 2,
            fieldLabel: filedLabelValue,
            bind: bindValue,
            xtype: 'tags',
            anyMatch: true,
            store: JZYIndent.Cfg.getListStore('JZYIndent.model.User',
                'net.bat.entity.User',
                'name', [{
                    property: 'dtModify',
                    direction: 'DESC'
                }]),
            listConfig: {
                getInnerTpl: function () {
                    return '<div>{inf}</div>';
                }
            },
            displayField: 'inf',
            valueField: 'inf',
            listeners: {
                //选中之后更新UUser dt_modify以便默认排序靠前
                select: function (combo, recs, eOpts) {
                    var rec = recs[0];
                    rec.set('dtModify', new Date());
                    rec.save({
                        scope: this,
                        callback: function (records, operation, succes) {
                            //console.log('save ok')
                        }
                    });
                }
            }
        };
    },
    getAuthorField: function (filedLabelValue, bindValue) {
        return {
            flex: 2,
            fieldLabel: filedLabelValue,
            bind: bindValue,
            xtype: 'tags',
            anyMatch: true,
            allowBlank: false,
            store: JZYIndent.Cfg.getListStore('JZYIndent.model.User', 'net.bat.entity.User', 'name'),
            listConfig: {
                getInnerTpl: function () {
                    return '<div>{inf}</div>';
                }
            },
            displayField: 'inf',
            valueField: 'inf'
        };
    },
    getEditorField: function (filedLabelValue, bindValue) {
        return {
            flex: 2,
            fieldLabel: filedLabelValue,
            bind: bindValue,
            xtype: 'displayfield',
            renderer: function (val, fld) {
                var pos = val.lastIndexOf('[');
                if (pos != -1)
                    return val.substring(0, pos);
                else
                    return val;
            }
        };

    },
    parseWord: function (fld, val, opts) {
        if (val.indexOf('.doc') == -1 && val.indexOf('.docx') == -1)
            return false;
        Ext.MessageBox.confirm('确认覆盖', '原始文稿上传成功。<br>需要为您提取并填入纯文本和字数吗？',
            function (btn, text) {
                if (btn != 'yes')
                    return false;
                Ext.Msg.wait('提取', '正在提取纯文本...');
                Ext.Ajax.request({
                    url: '/api/wordtxt',
                    method: 'GET',
                    reader: 'json',
                    headers: {'Content-Type': 'application/json'},
                    params: {'fp': val},
                    success: function (response, opts) {
                        var finf = Ext.decode(response.responseText);
                        var vw = this.up('panel');
                        var fld_txt = vw.down('htmleditor');
                        var fld_cout = vw.down('[name=dcTxtwords]');
                        fld_txt.setValue('<pre>' + finf.txt + '</pre>');
                        fld_cout.setValue(finf.count);
                        Ext.Msg.hide();
                    },
                    failure: function (response, opts) {

                    },
                    scope: fld

                }, this);
            });
    }
});
