/**
 * This view is used to present the details of a single Ticket.
 */
Ext.define('JZYIndent.model.User', {
    extend: 'JZYIndent.model.Base',

    fields: [
		{name:'loginName'},
		{name:'name'},
		{name:'plainPassword'},
		{name:'password'},
		{name:'salt'},
		{name:'roles'},
		{name:'registerDate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
    ]
});
