Ext.define('JZYIndent.view.computers', {
    extend: 'Ext.panel.Panel',
    xtype: 'computers',
    alias: 'widget.computers',
    // title: 'TreeList',
    controller: 'list',
    header:false,
    loadMask: true,
    bodyPadding:5, //设置间隔
    closable:true,//定义面板的关闭按钮，默认是false
    layout:{
        type: 'table' ,
        columns:5 //设置表格布局默认列数为4列
    },
    frame: true ,
    tbar:[
        '公式：' ,
        new  Ext.form.field.TextArea({
            name: 'expression' ,
            readOnly: true ,
            width:340,
            style: 'text-align:right'
        }),
    ],
    defaultType: 'button' ,
    defaults:{
        minWidth:60,
        handler:'btnClick'
    },
    items:[  //定义按钮
        {text: '1' ,symbol: '1' },
        {text: '2' ,symbol: '2' },
        {text: '3' ,symbol: '3' },
        {text: '(' ,symbol: '(' },
        {text: ')' ,symbol: ')' },
        {text: '4' ,symbol: '4' },
        {text: '5' ,symbol: '5' },
        {text: '6' ,symbol: '6' },
        {text: '+' ,symbol: '+' },
        {text: '-' ,symbol: '-' },
        {text: '7' ,symbol: '7' },
        {text: '8' ,symbol: '8' },
        {text: '9' ,symbol: '9' },
        {text: '*' ,symbol: '*' },
        {text: '/' ,symbol: '/' },
        {text: '0' ,symbol: '0' },
        {text: '.' ,symbol: '.' },
        //{text: '=' ,symbol: '=' },
        {text: 'C' ,symbol: 'clear' },
        {text: 'back' ,symbol: 'back' },

    ]
})
;
