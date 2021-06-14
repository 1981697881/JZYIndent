Ext.define('JZYIndent.view.ComboListeners',{
    extend: 'Ext.form.ComboBox',
    alias:'widget.comboListeners',
    queryParam: 'kw',
    valueField: 'id',
    displayField: 'name',
    listeners: {
        change: function (fld, newValue, oldValue, eOpts) {
            var dValue;
            fld.getStore().each(function (r, index) {
                if (r.data[fld.valueField] == newValue) {
                    dValue = r.data[fld.displayField];
                }
            });
            return dValue;
        },
        afterRender: function (combo) {
            combo.getStore().load();
        }
    },
});
