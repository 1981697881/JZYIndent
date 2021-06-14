Ext.define('JZYIndent.model.Client', {
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
        {name: 'taxNo',text:'税务识别号'},
        {name: 'phone',text:'联系电话'},
        {name: 'mobPhone',text:'移动电话'},
        {name: 'faxNo',text:'传真号'},
        {name: 'email',text:'电子邮箱'},
        {name: 'bank',text:'开户行'},
        {name: 'bankNo',text:'银行账号'},
        {name: 'status',text:'经营状态'},
        {name: 'signatureName',text:'招牌名称'},
        {name: 'brandName',text:'品牌名称'},
        {name: 'brandType',text:'品牌级别'},
        {name: 'remark',text:'附加说明'},
        {name: 'crateor',text:''},
        {name: 'createTime',text:''},
        {name: 'editor',text:''},
        {name: 'updateTime',text:''},
        {name: 'pageNum',text:'页码'},
        {name: 'pageSize',text:'页数'},

    ],
    manyToMany:['Image','Thesis','Doc']
});


