
Ext.define('JZYIndent.model.BaseAuthor', {
    extend: 'JZYIndent.model.Base',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name'},
        {name: 'title'},
        {name: 'sex'},
        {name: 'corp'},
        {name: 'telephone'},
        {name: 'censorFlag'},
        {name: 'editFlag'},
        {name: 'tranFlag'},
        {name: 'FCensorFlag'},
        {name: 'FCollateFlag'},
        {name: 'note'},
        {name: 'docFlag'},
        {name: 'thesisFlag'},
        {name: 'personnum', type: 'int'},

        {name: 'nameEnglish'},
        {name: 'nameJapanese'},
        {name: 'identityCard'}
    ],
    rmap:{
    		'sex':['男','女'],
    		'name':['欧阳锋','陈刚','杨燕丽','李南书','刘盈','刘茵','林舒'],
    		'nameJapanese':['oyf','cg','yyl','lns','ly','ly','ls'],
    		'corp':['第一历史档案馆','国家文物局','北京社科院','敦煌研究院','鲁迅博物馆'],
    		'title':['副教授','教授','副研究馆员','研究馆员','馆员']
    	}

});
