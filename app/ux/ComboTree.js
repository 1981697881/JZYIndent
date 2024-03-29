Ext.define("JZYIndentux.ComboTree", {
    extend: "Ext.form.field.Picker",
    xtype: 'combotree',
    requires: ["Ext.tree.Panel"],
    initComponent: function() {
        var self = this;
        Ext.apply(self, {
            fieldLabel: self.fieldLabel,
            labelWidth: self.labelWidth
        });



        self.on('change',function(ct,nv,ov,opt){
        	var picker=ct.picker;
        	if($.trim(nv)=="" || !picker)
        		return;
        	var rn = picker.getRootNode();
            var pos=nv.lastIndexOf(';');
            if(pos!=-1)
            	nv=nv.substring(pos+1);
        	var nvl = nv.toLowerCase();
        	/*picker.expandAll();*/
        	rn.findChildBy(function(child){
                var text = child.data.text.toLowerCase();
                if(text.indexOf(nvl)==0){
                    //child.expand();
                	//picker.expandNode(child,true);
                    picker.getSelectionModel().select(child, true);
                }
            },null,true);
        	//console.log(rn.findChildBy);
       });
        self.callParent();

    },
    createPicker: function() {
        var self = this;
        var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: self.storeUrl
            },
            filters:self.filters,
            remoteFilter: true,
            sorters: [{
                property: 'leaf',
                direction: 'ASC'
            },
            {
                property: 'text',
                direction: 'ASC'
            }],
            root: {
                id: self.rootId,
                text: self.rootText
            },
            nodeParameter: self.treeNodeParameter
        });
        self.picker = new Ext.tree.Panel({
            height: 300,
            autoScroll: true,
            floating: true,
            focusOnToFront: false,
            shadow: true,
            ownerCt: this.ownerCt,
            useArrows: true,
            store: store,
            rootVisible: false
        });


        self.picker.on({
        	load: function(tree, records, successful, operation, node, options){
        		//打开时保证树形多选对应类别选中
			    var root = tree.getRootNode();
			    var value = self.getValue();
			    root.cascadeBy(function(node){
			    	//alert(node.get('text'));
			       	if(value.indexOf(node.get('text'))>=0){
		        		node.set('checked', true);
		        	}
		        	else
		        		node.set('checked', false);
			    });
        	},
            checkchange: function(record, checked) {
                var checkModel = self.checkModel;
                if (checkModel == 'double') {
                    var root = self.picker.getRootNode();
                    root.cascadeBy(function(node) {
                        if (node.get('text') != record.get('text')) {
                            node.set('checked', false);
                        }
                    });
                    if (/*record.get('leaf') && */checked) {

                        self.setRawValue(record.get('id')); // 隐藏值

                        var name = record.get('text');
                    	//遍历选中节点的父节点构造#分隔的层次类别
                    	pNode = record.parentNode;
                        for (; pNode.parentNode != null; pNode = pNode.parentNode) {
                        	name = pNode.get('text')+'#'+name;
                        }

                        self.setValue(name); // 显示值
                    } else {
                        record.set('checked', false);
                        self.setRawValue(''); // 隐藏值
                        self.setValue(''); // 显示值
                    }
                } else {
                    var cascade = self.cascade;
                    if (checked == true) {
                        if (cascade == 'both' || cascade == 'child' || cascade == 'parent') {
                            /*//注释掉以避免选中父节点同时选中所有子节点
                            if (cascade == 'child' || cascade == 'both') {
                                if (!record.get("leaf") && checked) record.cascadeBy(function(record) {
                                    record.set('checked', true);
                                });
                            }*/
                            if (cascade == 'parent' || cascade == 'both') {
                                pNode = record.parentNode;
                                for (; pNode != null; pNode = pNode.parentNode) {
                                    pNode.set("checked", true);
                                }
                            }
                        }
                    } else if (checked == false) {
                        if (cascade == 'both' || cascade == 'child' || cascade == 'parent') {
                            if (cascade == 'child' || cascade == 'both') {
                                if (!record.get("leaf") && !checked) record.cascadeBy(function(record) {

                                    record.set('checked', false);

                                });
                            }
                        }
                    }
                    var records = self.picker.getView().getChecked(),
                    names = [],
                    values = [];
                    Ext.Array.each(records,
                    function(rec) {
                    	var name = rec.get('text');
                    	//遍历选中节点的父节点构造#分隔的层次类别
                    	pNode = rec.parentNode;
                        for (; pNode.parentNode != null; pNode = pNode.parentNode) {
                        	name = pNode.get('text')+'#'+name;
                        }

                        names.push(name);
                        values.push(rec.get('id'));
                    });

                    //若已有子节点类别则删除父节点类别，例如不可能存在To Do;To Do#Climb Everest;的情况
                    realNames = [];
                    for(j=0;j<names.length;j++){
                    	name = names[j];
                    	hasChild = false;
                    	for(i=0;i<names.length;i++){
                    		if(i!=j && names[i].indexOf(name+'#')>=0){
                    			hasChild = true;
                    			break;
                    		}
                    	}
                    	if(!hasChild)
                    		realNames.push(name);
                    }

                    self.setRawValue(values.join(';')); // 隐藏值
                    self.setValue(realNames.join(';')); // 显示值
                }

            },
            itemclick: function(tree, record, item, index, e, options) {
                var checkModel = self.checkModel;

                if (checkModel == 'single') {
                    if (record.get('leaf')) {
                        self.setRawValue(record.get('id')); // 隐藏值
                        self.setValue(record.get('text')); // 显示值
                    } else {
                        self.setRawValue(''); // 隐藏值
                        self.setValue(''); // 显示值
                    }
                }

            }
        });
        return self.picker;
    },
    alignPicker: function() {
        var me = this,
        picker, isAbove, aboveSfx = '-above';
        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, "", me.pickerOffset); // ""->tl
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls': 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls': 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    }
});
