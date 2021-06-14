 Ext.define('JZYIndent.model.BasePayfactor', {
    extend: 'JZYIndent.model.Base',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'expressions'},
        {name: 'notes'},
        {name: 'ord', type: 'int'},
        {name: 'payFactor'},
        {name: 'type'}
    ]
});
