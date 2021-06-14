Ext.define('JZYIndent.model.first', {
    extend: 'JZYIndent.model.Base',
    idProperty: 'CId',
    fields: [
        {name: 'CId'},
        {name: 'fid'},
        {name: 'type',text:'客户类型'},
        {name: 'typeName',text:''},
        {name: 'isBlack',text:'是否黑名单'},
        {name: 'code',text:'客户编码'},
        {name: 'name',text:'客户名称'},
        {name: 'nature',text:'企业性质'},
        {name: 'capital',text:'注册资本'},
        {name: 'creditCode',text:'统一社会信用码'},
        {name: 'pageNum',text:'页码'},
        {name: 'pageSize',text:'页数'},

    ],
    manyToMany:['Image','Thesis','Doc']
});


