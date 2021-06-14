Ext.define('JZYIndent.view.ContentPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.VBox',
        'Ext.layout.container.HBox',
        "Ext.chart.interactions.CrossZoom",
        "Ext.chart.axis.Numeric",
        'Ext.chart.CartesianChart',
        "Ext.chart.series.Bar",
        "Ext.chart.axis.Category"
    ],
    xtype: 'contentPanel',
    id: 'content-panel',
    scrollable: false,
    deferredRender: false,
    activeTab: 0,
    split: true,
    resizeTabs: true, // turn on tab resizing
    // minTabWidth: 115,
    // tabWidth: 125,
    enableTabScroll: true,
    layout:'fit',
    header: false,
    rec_detail:null,
    listeners: {
        //tab块关闭事件
        beforeremove:"removeUrl"
    },
    items:[{
        title:'主页',
        //bodyPadding: 10,
        defalts: {
            frame: true,
            //bodyPadding: 10
        },
        items: [
        ]
    }]
});

