Ext.define("JZYIndent.ux.TagField", {
    extend: "Ext.form.field.Tag",

    xtype: 'tags',
    autoSelect:false,
    queryParam : 'kw',
    triggerAction:'all',
    delimiter :';',
    multiSelect:true,
    forceSelection:false,
    minChars:1,
    filterPickList: true,
    listeners:{
    	//tagfield 的 allowBlank + bind似乎存在组合使用问题,不追究,采用冗余处理将bind值设置回record
    	change:function( fld, newValue, oldValue, eOpts ){
    		if(fld.config.allowBlank == undefined)
    			return;
    		var detai_vw = fld.up('detail');
    		if(!detai_vw)
    			return;
    		var rec = detai_vw.getViewModel().get('theObj')
    		var fldname = fld.config.bind;
    		var pos1=fldname.indexOf('.');
    		var pos2=fldname.indexOf('}');
    		fldname=fldname.substring(pos1+1,pos2);
    		rec.set(fldname,newValue);
    	}
    },

    getMultiSelectItemMarkup: function() {
        var me = this,
            cssPrefix = Ext.baseCSSPrefix,
            displayField=me.displayField,
            valueField = me.valueField;

        if (!me.multiSelectItemTpl) {
            if (!me.labelTpl) {
                me.labelTpl = '{' + me.displayField + '}';
            }
            me.labelTpl = me.getTpl('labelTpl');

            me.multiSelectItemTpl = new Ext.XTemplate([
                '<tpl for=".">',
                    '<li data-selectionIndex="{[xindex - 1]}" data-recordId="{internalId}" data-value="{[this.getItemValue(values)]}" class="' + cssPrefix + 'tagfield-item',
                    '<tpl if="this.isSelected(values)">',
                    ' ' + me.tagSelectedCls,
                    '</tpl>',
                    '{%',
                        'values = values.data;',
                    '%}',
                    '" qtip="{' + me.displayField + '}">' ,
                    '<div class="' + cssPrefix + 'tagfield-item-text">{[this.getItemLabel(values)]}</div>',
                    '<div class="' + cssPrefix + 'tagfield-item-close"></div>' ,
                    '</li>' ,
                '</tpl>',
                {
                    isSelected: function(rec) {
                        return me.selectionModel.isSelected(rec);
                    },
                    getItemLabel: function(values) {
                    	var label=values[displayField];
                    	var pos0=label.lastIndexOf('[');
                    	if(pos0!=-1)
                    		label=label.substring(0,pos0);
                        return label;
                    },
                    getItemValue: function(rec) {
                        return rec.get(valueField);
                    },
                    strict: true
                }
            ]);
        }
        if (!me.multiSelectItemTpl.isTemplate) {
            me.multiSelectItemTpl = this.getTpl('multiSelectItemTpl');
        }

        return me.multiSelectItemTpl.apply(me.valueCollection.getRange());
    },
    getValue:function(){
     var me=this;
      var result = me.callParent(arguments);
      if(Ext.isArray(result))
    	  return result.join(me.delimiter);
      else
    	  return result;
    }
});
