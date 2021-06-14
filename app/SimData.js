Ext.define('JZYIndent.EntitySimlet', {
    extend: 'Ext.ux.ajax.JsonSimlet',
    alias: 'simlet.entity',
    // doPost: function(ctx) {
    //     var result = this.callParent(arguments),
    //         o = this.processData(Ext.decode(ctx.xhr.body)),
    //         item = this.getById(this.data, o.id, true),
    //         key;
    //     console.log(this.data+''+ o.id)
    //     console.log(ctx.xhr.body)
    //     for (key in o) {
    //         item[key] = o[key];
    //     }
    //     console.log(item);
    //     result.responseText = Ext.encode(item);
    //     return result;
    // },
    // processData: Ext.identityFn,
    // getData: function (ctx) {
    //     var params = ctx.params;
    //     if ('id' in params) {
    //         return this.getById(this.data, params.id);
    //     }
    //     delete this.currentOrder;
    //     return this.callParent(arguments);
    // },
    //
    // getById: function(data, id) {
    //     var len = data.length,
    //         i, item;
    //     console.log(data)
    //     console.log(id)
    //     for (i = 0; i < len; ++i) {
    //         item = data[i];
    //         if (item.id === id) {
    //             return item;
    //         }else if(id=="-1"){
    //             return item;
    //         }
    //     }
    //     return null;
    // }
});

Ext.define('JZYIndent.SimData', {
    requires: [
        'Ext.ux.ajax.*'
    ],
    singleton: true,
    dateFormat: 'Y-m-d\\TH:i:s\\Z',
    init: function () {
    	function uncapitalize(text) {
            if(!text || typeof text !== "string") {
               return '';
            }

            return text.charAt(0).toLowerCase() + text.substr(1);
        }
        function makeSim (data) {
            return {
                type: 'entity',
                //data: data
            };
        }
     var me = this;
     var enm=JZYIndent.Cfg.SIM_ENM;
     var sim_ens={};
  	for(var l in enm){
    var data = [];
    var en=l;
    var om = Ext.create("JZYIndent.model."+en);
       // console.log(om.randData(1))
    for(var i=0; i<enm[l]; i++){
    	data.push(om.randData(i));
    }
    var url = '/rest/'+en;
    // if(en == 'Client') {
    //     var data1 = [];
    //     Ext.Ajax.request({
    //         url: JZYIndent.Cfg.server+'/base/cus/customerList.do',
    //         method: 'GET',
    //         scope: this,
    //         async:false,
    //         withCredentials : true,
    //         success: function (result) {
    //             var respText = Ext.util.JSON.decode(result.responseText);
    //             console.log(respText)
    //             data1=respText.data.list;
    //         },
    //         failure: function () {
    //             Ext.Msg.alert("提示", "请求失败！");
    //         },
    //         callback: function(opts,success, response){
    //
    //         },
    //     });
    //     sim_ens[url] = Ext.apply({
    //         processFilters: function(filters) {
    //             Ext.each(filters, function (filter, index) {
    //                 if (filter.property == 'CId' ) {
    //                     filters[index] = function (r) {
    //                         return r.objId < filter.value;
    //                     }
    //                 }
    //             });
    //             return this.self.prototype.processFilters.call(this, filters);
    //         }
    //     }, makeSim(data1));
    // } else
    	sim_ens[url]=makeSim("");
   }
  	// var ulist=sim_ens['/rest/User'];
  	// if(ulist){
  	// 	var users = ulist.data;
       //  //console.log(users)
  	// 	sim_ens['/auth']= {
	  //       type: 'json',
	  //       data: function(ctx) {
       //          var userName = ctx.params.username,
       //          user = Ext.Array.findBy(users, function(item) {
       //              return item.name === userName;
       //          }) || users[0];
       //          user.name=userName;
       //          return Ext.apply({}, user);
	  //       }
	  //   }
      //
  	// }


  sim_ens["/ls/net.bat.entity.User/name"]=sim_ens['/rest/User'];
  sim_ens["/distinct/net.bat.entity.User/loginName"]=sim_ens['/rest/User'];
  JZYIndent.Cfg.SM =Ext.ux.ajax.SimManager.init({defaultSimlet:null}).register(sim_ens);
        // console.log(JZYIndent.Cfg.SM)
  }
});
