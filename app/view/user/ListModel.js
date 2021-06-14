Ext.define('JZYIndent.view.user.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.userlist',
    requires: [
        'JZYIndent.model.User'
    ],

    stores: {
        objs: {type:'BFS',model: 'User'},
        objsel: {type:'BFS',model: 'User'}
     }
});
