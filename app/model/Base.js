Ext.define('JZYIndent.model.Base', {
    extend: 'Ext.data.Model',

    schema: {
        namespace: 'JZYIndent.model',
        proxy:{
        	//type: 'rest',
        	url: '{prefix}/rest/{entityName}'
        }
    },
	//增加id字段
    // fields: [
    //     {name:'id',type:'int'}
    // ],
    randArray:function(i){
    	i++;
    	var rmap=this.rmap||{};
        var flds = this.getFields();
    	var od = [];
    	for(var j=0; j<flds.length; j++){
    		var jm=flds[j];
    		var jtype = jm.getType();
    		var jname = jm.getName();
    		var ra = rmap[jname];
    		if(ra){
    			od.push(ra[i%ra.length]);
    			continue;
    		}
    		if(jtype=='int'){
    			od.push(i);
    		}else if(jtype=='date'){
    			od.push(new Date());
    		}else if(jtype=='auto'){
    			od.push(jname+i);
    		}
    	}
    	return od;
    },
    randData: function(i){
    	i++;
    	var rmap=this.rmap||{};
        var flds = this.getFields();
    	var od = {};
    	for(var j=0; j<flds.length; j++){
    		var jm=flds[j];
    		var jtype = jm.getType();
    		var jname = jm.getName();
    		var ra = rmap[jname];
    		if(ra){
    			od[jname]=ra[i%ra.length];
    			continue;
    		}
    		if(jtype=='int'){
    			od[jname]=i;
    		}else if(jtype=='date'){
    			od[jname]=new Date();
    		}else if(jtype=='auto'){
    			od[jname]=jname+i;
    		}
    	}
    	return od;
    }

});
