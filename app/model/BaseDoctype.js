Ext.define('JZYIndent.model.BaseDoctype', {
    extend: 'JZYIndent.model.Base',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name'},
        {name: 'parentid', type: 'int'},
        {name: 'ord', type: 'int'},
        {name: 'nameEnglish'},
        {name: 'nameJapanese'},
        {name:	'pyh'}
    ],
    rmap:{
    	name:['故宫讲坛','学术沙龙','快讯','宫廷人物','工程报道','贵宾接待'],
    	pyh:['ggjt','xssl','kx','gtrw','gcbd','gbjd']
    }
});
