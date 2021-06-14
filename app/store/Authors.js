var om = Ext.create("JZYIndent.model.BaseAuthor");
var data=[];
for(var i=0; i<30; i++){
	data.push(om.randArray(i));
}
Ext.define('JZYIndent.store.Authors', {
    extend: 'Ext.data.ArrayStore',

    alias: 'store.authors',

    model: 'JZYIndent.model.BaseAuthor',

    storeId: 'authors',

    data: data
});
