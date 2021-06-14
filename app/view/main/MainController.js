Ext.define('JZYIndent.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    // applyState: function(state) {
    //     var refs = this.getReferences();
    //     if (state.hasTreeNav) {
    //         this.getView().moveBefore(, refs.contentPanel);
    //        // refs.breadcrumb.hide();
    //         refs.contentPanel.header.hidden = false;
    //         //this._hasTreeNav = true;
    //     } else {
    //         this._hasTreeNav = false;
    //     }
    // },
    //
    // getState: function() {
    //     return {
    //         hasTreeNav: this._hasTreeNav
    //     };
    // },
    //
    // showBreadcrumbNav: function() {
    //     var refs = this.getReferences(),
    //         breadcrumbNav = refs.breadcrumb,
    //         treeNav = refs.tree,
    //         selection = treeNav.getSelectionModel().getSelection()[0];
    //     if (breadcrumbNav) {
    //         breadcrumbNav.show();
    //     } else {
    //         refs.contentPanel.addDocked({
    //             xtype: 'navigation-breadcrumb',
    //             selection: selection
    //         });
    //     }
    //
    //     refs['breadcrumb.toolbar'].setSelection(selection || 'root');
    //
    //     treeNav.hide();
    //     refs.contentPanel.getHeader().hide();
    //
    //     this._hasTreeNav = false;
    //     this.getView().saveState();
    // },
    //
    // showTreeNav: function() {
    //     var refs = this.getReferences(),
    //         treeNav = refs.tree,
    //         breadcrumbNav = refs.breadcrumb,
    //         selection = refs['breadcrumb.toolbar'].getSelection();
    //     if (treeNav) {
    //         treeNav.show();
    //     } else {
    //         treeNav = this.getView().moveBefore({
    //             region: 'west',
    //             xtype: 'tabpanel',
    //             reference: 'tabpanel',
    //             //border: false,
    //             collapsible: true,
    //             // defaults: {
    //             //     scrollable: true,
    //             //     closable: true,
    //             //     border: false
    //             // },
    //             split: true,
    //             tabPosition: "left",
    //             tabRotation: "default",
    //             items: [{
    //                 title: '协同办公',
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'OA',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 30));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '项目资料',
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'xmzx',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '楼宇售房',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'lysf',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '资产运营',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'zcyy',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '物业管理',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'wygl',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '中介服务',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'zjfw',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '人事系统',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'HR',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '卡劵中心',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'kjzx',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '社区微信',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'sqwx',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }, {
    //                 title: '系统综合',
    //
    //                 glyph: null,
    //                 items:[{
    //                     reference: 'xtzh',
    //                     //scrollable: true,
    //                     autoScroll: true, //自动创建滚动条
    //                     xtype: 'navigation-tree',
    //                     listeners: {
    //                         //进入页面执行事件设置高度和宽度
    //                         'render': function () {
    //                             this.setHeight((parseInt(document.body.offsetHeight) - 52));
    //                         },
    //                     }
    //                 }]
    //             }]
    //         }, refs.contentPanel);
    //     }
    //
    //     if (selection) {
    //         treeNav.getSelectionModel().select([
    //             selection
    //         ]);
    //
    //         breadcrumbNav.hide();
    //         refs.contentPanel.getHeader().show();
    //
    //         this._hasTreeNav = true;
    //         this.getView().saveState();
    //     }
    //
    // },
    //控制二次打开同一选项
    removeUrl: function (el, a, c) {
        // console.log(a)
        // console.log(c)
        if (a.activeCounter == "0") {
            this.redirectTo("");
            console.log(this.getReferences())
            var tree = Ext.ComponentQuery.query('navigation-tree');
            for (var i = 0; i < tree.length; i++) {
                tree[i].getSelectionModel().deselectAll();
            }

        }
    },
    onAxisRangeChange: function (axis, range) {
        var cAxis = axis.getChart().getAxis('celsius-axis');

        if (cAxis) {
            cAxis.setMinimum((range[0] - 32) / 1.8);
            cAxis.setMaximum((range[1] - 32) / 1.8);
        }
    },

    onAfterRender: function () {
        var chart = this.lookupReference('chart');

        var highSeries = {
                type: 'bar',
                xField: 'month',
                yField: 'highF',
                yAxis: 'fahrenheit-axis',
                style: {
                    minGapWidth: 10,
                    strokeStyle: 'rgb(52, 52, 53)'
                },
                subStyle: {
                    fillStyle: 'url(#rainbow)'
                }
            },
            lowSeries = Ext.apply({}, {
                yField: ['lowF'],
                subStyle: {
                    fillStyle: 'none'
                }
            }, highSeries);

        chart.setSeries([
            highSeries,
            lowSeries
        ]);
    }
});
