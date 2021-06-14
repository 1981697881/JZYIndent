Ext.define('Ext.ux.MonthField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.monthfield',
    requires: ['Ext.picker.Month'],
    matchFieldWidth: false,
    triggerCls: Ext.baseCSSPrefix + 'form-date-trigger',
    format:'Y年m月',//显示格式
    valueFormat:'Y-m',//值格式
    editable:false,
    initComponent : function(){
        var me = this;
        me.callParent();
    },
    createPicker:function(){
        var me=this,picker = me.picker;
        var monthDefaultConfig={
            ownerCmp: me,
            hidden: true,
            floating: true,
            listeners: {
                scope: me,
                cancelclick: me.onCancelClick,
                okclick: me.onOkClick,
                yeardblclick: me.onOkClick,
                monthdblclick: me.onOkClick,
                el:{
                    mousedown:function(e){
                        e.preventDefault();
                    }
                }
            }
        };
        if (!picker) {
            picker =new Ext.picker.Month(monthDefaultConfig)
        }
        return picker;
    },
    rawToValue: function(rawValue) {
        value = Ext.Date.parse(rawValue,this.format);
        value=Ext.Date.format(value,this.valueFormat);
        return value;
    },
    valueToRaw: function(value) {
        rawValue = Ext.Date.parse(value,this.valueFormat);
        rawValue=Ext.Date.format(rawValue,this.format);
        return rawValue;
    },
    onCancelClick: function () {
        this.collapse();
    },
    onOkClick: function (picker, value) {
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, 1);
        date=this.formatDate(date);
        if(me.fireEvent('beforeselect',me,date)===false){
            return;
        }
        me.setValue(date);
        this.collapse();
        me.fireEvent('select',me,me.getValue());
    },
    onExpand: function() {
        var value = Ext.Date.parse(this.getValue(),this.valueFormat);
        this.picker.setValue(Ext.isDate(value) ? value : new Date());
    },
    formatDate: function(date){
        return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.valueFormat) : date;
    }
});