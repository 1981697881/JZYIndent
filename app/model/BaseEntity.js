/**
 * 资源实体base model
 */
 Ext.define('JZYIndent.model.BaseEntity',{
 	extend:'JZYIndent.model.Base',
 	fields:[
        {name:'dcEditor1'},
        {name:'dcEditor2'},
        {name:'dcEditor0'},
        {name:'dcState'},
        {name: 'dcCreate', type: 'date',  dateFormat: 'n/j h:ia'},
        {name: 'lastUpdate', type: 'date',  dateFormat: 'n/j h:ia'}
 	]
 } );
