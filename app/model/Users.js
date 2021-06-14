Ext.define('JZYIndent.model.Users', {
    extend: 'JZYIndent.model.Base',
    idProperty: 'Usersid',
    fields: [
        {name: 'Usersid'},
        {name: 'deptId',text:'部门id'},
        {name: 'deptName',text:'部门名称'},
        {name: 'username',text:'帐号'},
        {name: 'name',text:'姓名'},
        {name: 'postName',text:'岗位'},
        {name: 'phone',text:'联系方式'},
    ],
    manyToMany:['Image','Thesis','Doc']
});
