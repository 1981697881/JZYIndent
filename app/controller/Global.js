Ext.define('JZYIndent.controller.Global', {
    extend: 'Ext.app.Controller',
    requires: [
        'JZYIndent.view.*',
        'Ext.window.*',
        'Ext.data.TreeStore'
    ],
    loadingText: 'Loading...',
    config: {
        control: {
            '#app-header menuitem[text=关于]': {
                click: 'onAbout'
            },
            '#aHeader button[text=退出]': {
                click: 'onLogoutClick'
            },
            '#aHeaderC button[text=退出]': {
                click: 'onLogoutClick'
            },
            '#app-header menuitem[text=Print Label]': {
                click: 'onPrintLabel'
            },
            'navigation-tree': {
                selectionchange: 'onTreeNavSelectionChange'
            },
            'navigation-breadcrumb breadcrumb': {
                selectionchange: 'onBreadcrumbNavSelectionChange'
            },
            'thumbnails': {
                itemclick: 'onThumbnailClick',
                itemdblclick: 'onThumbnailClick'
            },
            'tool[regionTool]': {
                click: 'onSetRegion'
            },
        },
        refs: {
            viewport: 'viewport',
            navigationTree: 'navigation-tree',
            DTree: 'DTree',
            navigationBreadcrumb: 'navigation-breadcrumb',
            contentPanel: 'contentPanel',
            main: 'doMain',
            descriptionPanel: 'descriptionPanel',
            thumbnails: {
                selector: 'thumbnails',
                xtype: 'thumbnails',
                autoCreate: true
            }
        },
        routes: {
            ':id': {
                action: 'handleRoute',
                before: 'beforeHandleRoute'
            },
            '(:en)detail/:id': {
                action: 'showDetail',
                conditions111: {
                    ':id': '([0-9]+)'
                }
            }
        }
    },
    onPrintLabel: function (item, e, opts) {
        var me = this;
        var navigationTree = me.getNavigationTree(),
            // store = Ext.StoreMgr.get('navigation'),
            store = navigationTree.getStore(),
            st = store.getNodeById(id);
        //var st = Ext.StoreMgr.get('navigation');
        if (isNaN(st)) {
            var func_print = function (obj) {
                var items = obj.items;
                if (items) {
                    for (var i = 0; i < items.length; i++) {
                        func_print(items[i]);
                    }
                } else {
                    if (obj.fieldLabel) {
                        console.log(obj.fieldLabel + ':' + obj.bind);
                    }
                }
            };
            st.each(function (rec) {
                var nl = rec.id;
                if (nl.indexOf('list') == -1) {
                    return;
                }

                var nd = nl.replace('list', 'detail');
                var className = Ext.ClassManager.getNameByAlias('widget.' + nd);
                var ViewClass = Ext.ClassManager.get(className);
                if (!ViewClass) {
                    return;
                }

                console.group('-----------' + rec.get('text') + '[' + Ext.String.capitalize(nl.substring(0, nl.length - 4)) + ']' + '-------------');
                func_print(ViewClass.prototype);
                console.groupEnd();
            }, this);
        }
    },
    onLogoutClick: function (item, e, opts) {
        var me = this;
        Ext.MessageBox.confirm('确认注销', '确定注销吗?注销后返回登录页', function (btn, text) {
            if (btn != 'yes') {
                return false;
            }

            me.loginManager.logout();
        });
    },
    onAbout: function (item, e) {
        Ext.MessageBox.show({
            title: '关于',
            icon: Ext.MessageBox.INFO,
            animEl: item,
            msg: '<p align=\'center\'>' + JZYIndent.Cfg.APP_NAME + JZYIndent.Cfg.ABOUT + '</p>',
            buttons: Ext.MessageBox.OK,
            width: 220
        });
    },
    setOrigUri: function (uri) {
        this.ouri = uri;
    },
    getOrigUri: function () {
        return this.ouri;
    },
    showDetail: function (p1, p2, p3) {
        //console.log('showDetail:'+p1+":"+p3);
        var me = this;
        if (me.open_info) {
            return me.openObj();
        }
        var pdetail = p1 + 'detail';
        if (!JZYIndent.Cfg.usrInfo) {
            me.setOrigUri(pdetail + '/' + p3);
            return me.showLogin();
        }
        var className = 'JZYIndent.model.' + Ext.String.capitalize(p1);
        var modelClass = Ext.ClassManager.get(className);
        //不符合detail命名规则的走VIP通道
        if (!modelClass) {
            modelClass = Ext.ClassManager.get('JZYIndent.model.' + detailCMap[p1]);
        }
        if (!modelClass) {
            return false;
        }

        var pm = {};
        pm[modelClass.idProperty || 'id'] = parseInt(p3);
        var obj = modelClass.create(pm);
        var me = this;
        //Uses the configured RestProxy to make a GET request to /users/123
        obj.load({
            scope: this,
            success: function (rec) {
                me.viewObj(rec, p3, pdetail);
            }
        });
    },
    onEditObj: function (vw, rec) {
        var vm = vw.getViewModel();
        var nd = vm.type.replace('list', 'detail');
        var ds = vw.getStore();
        var className = Ext.ClassManager.getNameByAlias('widget.' + nd);
        var ViewClass = Ext.ClassManager.get(className);
        var cmp = new ViewClass({
            viewModel: {
                data: {
                    theObj: rec,
                    showprev: false,
                    shownext: false,
                    showsave: true && !JZYIndent.Cfg.bView,
                    showpayCalculate: true && !JZYIndent.Cfg.bView,
                    showreturn: false
                }
            }
        });
        var dlg = Ext.create('Ext.window.Window', {
            scrollable: true,
            maximized: true,
            //layout: 'fit',
            items: [
                cmp
            ],
            listeners: {
                close: function (win, eopts) {
                    vw.detail_open = false;
                }
            }
        });
        dlg.show();
        vw.detail_open = true;
    },
    //正常打开
    onOpenObj: function (vw, rec, action) {
        //var vm = vw.getViewModel();
        //var nd = this.getView().getXType().replace('detail','list');
        console.log(vw);
        console.log(rec);
        console.log(action);
        var nl = vw.getXType();
        var nd = nl.replace('list', 'detail');
        if (nl.indexOf("listlist") != -1) {
            //xxxlistlist取名
            nd = nl.replace('listlist', 'listdetail');
        }
        var ds = vw.getStore();
        var pos = ds.indexOf(rec);
        if (pos == -1) {
            rec.set('id', -1);
        }
        console.log(nd)
        this.open_info = {
            list: vw,
            rec: rec,
            nd: nd,
            nl: nl,
            rec_prev: ds.getAt(pos - 1),
            rec_next: ds.getAt(pos + 1),
            scroll_y: vw.getView().getScrollY(),
            action: action
        };
        this.redirectTo(nd + '/' + rec.id);
    },
    //打开其他窗口
    onOpenOtherObj: function (vw, rec, action) {
        //var vm = vw.getViewModel();
        //var nd = this.getView().getXType().replace('detail','list');
        var nl = vw.getXType();
        var nd = nl.replace('listlist', 'listdetail');
        var ds = vw.getStore();
        var pos = ds.indexOf(rec);
        if (pos == -1) {
            rec.set('id', -1);
        }
        // console.log(vm)
        this.open_info = {
            list: vw,
            rec: rec,
            nd: nd,
            nl: nl,
            rec_prev: ds.getAt(pos - 1),
            rec_next: ds.getAt(pos + 1),
            scroll_y: vw.getView().getScrollY(),
            action: action
        };
        console.log(nd);
        console.log(rec.id);
        this.redirectTo(nd + '/' + rec.id);
    },
    //第三种打开方式
    onTreeOpenObj: function (field, vw, rec, action, nl, nd) {
        // var nl = vw.getX Type();
        // var nd = nl.replace('list', 'detail');
        var ds = vw.getStore();
        var pos = ds.indexOf(rec);
        if (pos == -1) {
            rec.set('id', -1);
        }
        this.open_info = {
            list: vw,
            rec: rec,
            nd: nd,
            nl: nl,
            rec_prev: ds.getAt(pos - 1),
            rec_next: ds.getAt(pos + 1),
            scroll_y: vw.getScrollY(),
            action: action
        };
        this.redirectTo(nd + '/' + rec.id);
    },
    //第四种打开方式
    onOpenTreeObj: function (field, vw, rec, action, nl, nd) {
        var ds = vw.getStore();
        var pos = ds.indexOf(rec);
        this.open_info = {
            list: vw,
            rec: rec,
            nd: nd,
            nl: nl,
            rec_prev: ds.getAt(pos - 1),
            rec_next: ds.getAt(pos + 1),
            scroll_y: vw.getScrollY(),
            action: action
        };
        this.redirectTo(nd + '/' + rec.id);
    },
    // 第五种打开方式:
    onTabOpenObj:function(wt,vw,rec,action, nl, nd){
        console.log(vw);
        console.log(rec);
        console.log(action);
        var ds = vw.getStore();
        var pos = ds.indexOf(rec);
        this.open_info = {
            list: vw,
            rec: rec,
            nd: nd,
            nl: nl,
            rec_prev: ds.getAt(pos - 1),
            rec_next: ds.getAt(pos + 1),
            scroll_y: vw.getScrollY(),
            action: action
        };
        this.redirectTo(nd + '/' + rec.id);
    },
    objNext: function () {
        //destroy current detail panel
        var contentPanel = this.getContentPanel();
        //从主页面获取window 关闭
        var detail = contentPanel.down("detail");
        // contentPanel.removeAll(true);
        console.log(detail);
        detail.close();
        var inf = this.open_info;
        var ds = inf.list.getStore();
        var rec = inf.rec_next;
        var pos = ds.indexOf(rec);
        inf.rec_prev = inf.rec;
        inf.rec = inf.rec_next;
        inf.rec_next = ds.getAt(pos + 1);
        //console.log(inf.rec)
        this.redirectTo(inf.nd + '/' + rec.id);
    },
    objPrev: function () {
        //destroy current detail panel
        var contentPanel = this.getContentPanel();
        //从主页面获取window 关闭
        var detail = contentPanel.down("detail");
        // contentPanel.removeAll(true);
        detail.close();
        var inf = this.open_info;
        var ds = inf.list.getStore();
        var rec = inf.rec_prev;
        var pos = ds.indexOf(rec);
        inf.rec_next = inf.rec;
        inf.rec = inf.rec_prev;
        inf.rec_prev = ds.getAt(pos - 1);
        this.redirectTo(inf.nd + '/' + rec.id);
    },
    //打开页面加载数据
    viewObj: function (rec, id, detail_type) {
        var contentPanel = this.getContentPanel();
        var myMask = new Ext.LoadMask({
            msg: '正在打开',
            target: contentPanel
        });
        myMask.show();
        contentPanel.removeAll(true);
        var className = Ext.ClassManager.getNameByAlias('widget.' + detail_type);
        var ViewClass = Ext.ClassManager.get(className);
        var cmp = new ViewClass({
            viewModel: {
                data: {
                    theObj: rec,
                    showprev: false,
                    shownext: false,
                    showsave: false,
                    showpayCalculate: false,
                    showreturn: false
                }
            }
        });
        cmp.masker = myMask;
        contentPanel.add(cmp);
        Ext.resumeLayouts(true);
    },
    openObj: function () {
        var contentPanel = this.getContentPanel();
        var myMask = new Ext.LoadMask({
            msg: '正在打开',
            target: contentPanel
        });
        myMask.show();
        //从主页面获取window 关闭
        var detail = contentPanel.down("detail");
        contentPanel.remove(detail);
        //删除自身布局，为新界面留空间
        //this.grid_hides = contentPanel.removeAll(false);
        var list = this.open_info.list;
        var cmp = list.detail;
        if (!cmp) {
            console.log(this.open_info.nd);
            var className = Ext.ClassManager.getNameByAlias('widget.' + this.open_info.nd);
            var ViewClass = Ext.ClassManager.get(className);
            if (this.open_info.rec.data != null && this.open_info.rec.data.id != undefined) {
                cmp = new ViewClass({
                    viewModel: {
                        data: {
                            theObj: this.open_info.rec,
                            showprev: false,
                            shownext: false,
                            showsave: true && !this.open_info.rec.bView,
                            showpayCalculate: true && !JZYIndent.Cfg.bView,
                            showreturn: false
                        }
                    }
                });
            } else {
                cmp = new ViewClass({
                    viewModel: {
                        data: {
                            theObj: this.open_info.rec,
                            showprev: Boolean(this.open_info.rec_prev),
                            shownext: Boolean(this.open_info.rec_next),
                            showsave: true && !this.open_info.rec.bView,
                            showpayCalculate: true && !JZYIndent.Cfg.bView,
                            showreturn: false
                        }
                    }
                });
            }
        } else // list.detail=cmp;
        {
            cmp.getViewModel().bind({
                data: {
                    theObj: this.open_info.rec
                }
            }, function (d) {
            });
            //console.log(d);
            cmp.updateLayout();
        }
        //建立list与对应detail的双向指向，以支持detail的返回 下一条，detail的直接复用。
        cmp.masker = myMask;
        //标题
        var title = contentPanel.title;
        //title.split("-")[1] + "-" +
        cmp.setTitle("编辑");
        //建立list与对应detail弹窗的双向指向
        // console.log(cmp)
        cmp.show();
        contentPanel.add(cmp);
    },
    beforeHandleRoute: function (id, action) {
        var me = this;
        if (!me.user) {
            me.setOrigUri(id);
            me.showLogin();
            return false;
        }
        var navigationTree = me.getNavigationTree(),
            store = navigationTree.getStore(),
            mystore = Ext.create('Ext.data.TreeStore', {
                pageSize: 50,
                proxy: {
                    type: 'memory',
                    data: me.getMain().nData,
                    reader: {
                        // 使用Ext.data.reader.Json读取服务器数据
                        type: 'json'
                    }
                },
                root: {
                    text: 'Ext JS',
                    id: 'all',
                    expanded: true
                }
            }),
            node = mystore.getNodeById(id);
        if (isNaN(node)) {
            //resume action
            action.resume();
            //me.setDefaultToken('all');
        } else {
            Ext.Msg.alert('Route Failure', 'The view for ' + id + ' could not be found. You will be taken to the application\'s start', function () {
                me.redirectTo(me.getApplication().getDefaultToken());
            });
            //stop action
            action.stop();
        }
    },
    //路由
    handleRoute: function (id) {
        console.log(id)
        var me = this;
        var navigationTree = me.getNavigationTree(),
            navigationBreadcrumb = me.getNavigationBreadcrumb(),
            //store = Ext.StoreMgr.get('navigation'),
            mystore = Ext.create('Ext.data.TreeStore', {
                pageSize: 50,
                proxy: {
                    type: 'memory',
                    data: me.getMain().nData,
                    reader: {
                        // 使用Ext.data.reader.Json读取服务器数据
                        type: 'json'
                    }
                },
                root: {
                    text: 'Ext JS',
                    id: 'all',
                    expanded: true
                }
            }),
            store = navigationTree.getStore(),
            node = mystore.getNodeById(id),
            contentPanel = me.getContentPanel(),
            themeName = Ext.themeName,
            thumbnails = me.getThumbnails(),
            hasTree = navigationTree && navigationTree.isVisible(),
            cmp, className, ViewClass, clsProto, thumbnailsStore;
        Ext.suspendLayouts(node);
        if (isNaN(node)) {
            //判断子节点父节点
            if (node.isLeaf()) {
                var b_return;
                //判断复杂表体
                // if (this.open_info && id == "houselist" ||
                //     this.open_info && id == "rateslist" ||
                //     this.open_info && id == "receiptlist" ||
                //     this.open_info && id == "paylist" ||
                //     this.open_info && id == "receivablelist" ||
                //     this.open_info && id == "handlelist" ||
                //     this.open_info && id == "chargelist" ||
                //     this.open_info && id == "leaselist" ||
                //     this.open_info && id == "meterreadinglist") {
                //     b_return = false;
                // } else {
                b_return = this.open_info && id == this.open_info.nl;
                //}
                if (thumbnails.ownerCt) {
                } else // console.log(thumbnails)
                //contentPanel.remove(thumbnails, false); // remove thumbnail view without destroying
                {
                    //contentPanel.removeAll(true);
                    // console.log(this.grid_hides)
                    //彻底销毁隐藏并提供给‘返回’复用的grid
                    if (!b_return && this.grid_hides) {
                        var ghs = this.grid_hides;
                        for (var i = 0; i < ghs.length; i++) {
                            ghs[i].close();
                        }
                        delete this.grid_hides;
                    }
                }
                if (hasTree) {
                    // Focusing explicitly brings it into rendered range, so do that first.
                    navigationTree.getView().focusNode(node);
                    navigationTree.getSelectionModel().select(node);
                } else {
                    navigationBreadcrumb.setSelection(node);
                }
                if (b_return) {
                    cmp = this.open_info.list;
                } else {
                    className = Ext.ClassManager.getNameByAlias('widget.' + id);
                    ViewClass = Ext.ClassManager.get(className);
                    //判断view是否存在，防止不存在的view导致后续view调度失效
                    if (!ViewClass) {
                        Ext.resumeLayouts(true);
                        return;
                    }
                    clsProto = ViewClass.prototype;
                    if (clsProto.themes) {
                        clsProto.themeInfo = clsProto.themes[themeName];
                        if (themeName === 'gray') {
                            clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
                        } else if (themeName !== 'neptune' && themeName !== 'classic') {
                            if (themeName === 'crisp-touch') {
                                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                            }
                            clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
                        }
                        // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
                        if (!clsProto.themeInfo) {
                            Ext.log.warn('Example \'' + className + '\' lacks a theme specification for the selected theme: \'' + themeName + '\'. Is this intentional?');
                        }
                    }
                    cmp = new ViewClass();
                }
                // console.log(cmp)
                var text = node.get('text'),
                    title = node.isLeaf() ? (node.parentNode.get('text') + ' - ' + text) : text;
                cmp.setTitle(text);
                cmp.id = node.get('id');
                cmp.closable = true;
                Ext.Ajax.request({
                    url: JZYIndent.Cfg.server + '/system/jur/getMenuButton.do',
                    method: 'POST',
                    scope: this,
                    withCredentials: true,
                    //headers: {'Content-Type': 'application/json'},
                    params: {
                        userId: node.raw.userId,
                        id: node.raw.fid
                    },
                    success: function (result) {
                        //console.log(node.raw)
                        var respText = Ext.util.JSON.decode(result.responseText);
                        var data = respText.data;
                        // console.log(cmp.query("button"))
                        for (var i = 0; i < cmp.query("button").length; i++) {
                            for (var j = 0; j < data.length; j++) {
                                if (cmp.query("button")[i].text != null) {
                                    // console.log(cmp.query("button")[i].text + "," + data[j].name)
                                    if (cmp.query("button")[i].text == data[j].name) {
                                        cmp.query("button")[i].hidden = false;
                                    }
                                }
                            }
                        }
                        var n = contentPanel.getComponent(node.get('id'));
                        if (!n) {
                            // 判断是否已经打开该面板
                            contentPanel.add(cmp);
                            contentPanel.setActiveTab(cmp);
                            this.updateTitle(node);
                            //TODO - 新添加监听tab   ↓
                            //添加监听tab发送改变事件
                            contentPanel.on({
                                tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                                    if (newCard.config.title != '主页') {
                                        var treedata = Ext.ComponentQuery.query('treepanel');
                                        console.log(this);
                                        console.log(me.getNavigationTree());
                                        /*debugger
                                         for(var i = 0;i<=treedata.length-1;i++){//控制第一级树
                                         var treedata2 = treedata[i].root.children;
                                         for(var o = 0 ;o<=treedata2.length;o++){//二级
                                         var t = treedata2[o].id
                                         console.log(t)
                                         }
                                         }*/
                                        me.redirectTo(newCard.id);
                                    } else //navigationTree.getStore().reload()
                                    {
                                        me.redirectTo('all');
                                    }
                                }
                            });
                            console.log(contentPanel);
                        }
                        //TODO - 新添加监听tab  ↑
                        contentPanel.setActiveTab(n);
                    },
                    failure: function (conn, response, options, eOpts) {
                    }
                });
                if (!b_return) {
                    //初次/重新登陆时
                    Ext.resumeLayouts(true);
                } else //复杂表头
                {
                    //进行操作时
                    Ext.resumeLayouts(true);
                    // if (this.open_info && id == "houselist" ||
                    //     this.open_info && id == "rateslist" ||
                    //     this.open_info && id == "receiptlist" ||
                    //     this.open_info && id == "paylist" ||
                    //     this.open_info && id == "receivablelist" ||
                    //     this.open_info && id == "handlelist" ||
                    //     this.open_info && id == "chargelist" ||
                    //     this.open_info && id == "leaselist" ||
                    //     this.open_info && id == "meterreadinglist") {
                    //     if (this.open_info.action == 'ACTION_NEW') {
                    //         //父类List已统一处理
                    //         cmp.getView().scrollTo(0, 0);
                    //         cmp.getView().getStore().load();
                    //     } else {
                    //         cmp.getView().getStore().load();
                    //         cmp.getView().scrollTo(0, this.open_info.scroll_y + 1);
                    //     }
                    // } else {
                    //常规
                    //偏移1像素,否则gridview不刷新
                    if (this.open_info.action == 'ACTION_NEW') {
                        //父类List已统一处理
                        cmp.getView().scrollTo(0, 0);
                        cmp.getView().getStore().load();
                    } else {
                        cmp.getView().getStore().load();
                        cmp.getView().scrollTo(0, this.open_info.scroll_y + 1);
                    }
                }
                //}
                if (cmp.floating) {
                    cmp.show();
                }
            } else {
                // Only attempt to select the node if the tree is visible
                if (hasTree) {
                    if (id !== 'all') {
                    }
                } else // If the node is the root (rootVisible is false), then
                // Focus the first node in the tree.
                // navigationTree.ensureVisible(node.isRoot() ? store.getAt(0) : node, {
                //     select: true,
                //     focus: true
                // });
                // Ensure that non-leaf nodes are still highlighted and focused.
                {
                    //navigationBreadcrumb.setSelection(node);
                }
                // thumbnailsStore = me.getThumbnailsStore();
                // thumbnailsStore.removeAll();
                // thumbnailsStore.add(node.childNodes);
                // if (!thumbnails.ownerCt) {
                //     contentPanel.removeAll(true);
                // }
                //contentPanel.setLayout('auto');
                //center树
                //contentPanel.add(thumbnails);
                this.updateTitle(node);
                Ext.resumeLayouts(true);
            }
        }
    },
    //更新标题
    updateTitle: function (node) {
        var text = node.get('text'),
            title = node.isLeaf() ? (node.parentNode.get('text') + ' - ' + text) : text;
        //console.log(this.getContentPanel())
        //this.getContentPanel().setTitle(title);
        document.title = document.title.split(' - ')[0] + ' - ' + text;
    },
    exampleRe: /^\s*\/\/\s*(\<\/?example\>)\s*$/,
    themeInfoRe: /this\.themeInfo\.(\w+)/g,
    renderCodeMarkup: function (loader, response) {
        var code = this.processText(response.responseText, loader.themeInfo);
        // Passed in from the block above, we keep the proto cloned copy.
        loader.resource.html = code;
        loader.getTarget().setHtml(code);
        //prettyPrint();
        return true;
    },
    processText: function (text, themeInfo) {
        var lines = text.split('\n'),
            removing = false,
            keepLines = [],
            len = lines.length,
            exampleRe = this.exampleRe,
            themeInfoRe = this.themeInfoRe,
            encodeTheme = function (text, match) {
                return Ext.encode(themeInfo[match]);
            },
            i, line, code;
        for (i = 0; i < len; ++i) {
            line = lines[i];
            if (removing) {
                if (exampleRe.test(line)) {
                    removing = false;
                }
            } else if (exampleRe.test(line)) {
                removing = true;
            } else {
                // Replace "this.themeInfo.foo" with the value of "foo" properly encoded
                // for JavaScript (otherwise strings would not be quoted).
                line = line.replace(themeInfoRe, encodeTheme);
                keepLines.push(line);
            }
        }
        code = Ext.htmlEncode(keepLines.join('\n'));
        return '<pre class="prettyprint">' + code + '</pre>';
    },
    onSetRegion: function (tool) {
        var panel = tool.toolOwner;
        var regionMenu = panel.regionMenu || (panel.regionMenu = Ext.widget({
            xtype: 'menu',
            items: [
                {
                    text: 'North',
                    checked: panel.region === 'north',
                    group: 'mainregion',
                    handler: function () {
                        panel.setBorderRegion('north');
                    }
                },
                {
                    text: 'South',
                    checked: panel.region === 'south',
                    group: 'mainregion',
                    handler: function () {
                        panel.setBorderRegion('south');
                    }
                },
                {
                    text: 'East',
                    checked: panel.region === 'east',
                    group: 'mainregion',
                    handler: function () {
                        panel.setBorderRegion('east');
                    }
                },
                {
                    text: 'West',
                    checked: panel.region === 'west',
                    group: 'mainregion',
                    handler: function () {
                        panel.setBorderRegion('west');
                    }
                }
            ]
        }));
        regionMenu.showBy(tool.el);
    },
    //菜单点击
    onTreeNavSelectionChange: function (selModel, records) {
        if (this.open_info) {
            delete this.open_info;
        }
        var record = records[0];
        if (record) {
            this.redirectTo(record.getId());
        }
    },
    //展开/关闭点击
    onBreadcrumbNavSelectionChange: function (breadcrumb, node) {
        if (node) {
            this.redirectTo(node.getId());
        }
    },
    onThumbnailClick: function (view, node, item, index, e) {
        var navigationTree = this.getNavigationTree();
        // If not using breadcrumb nav, drive the app through the tree's normal selection listener
        // This ensures that the tree is scrolled correctly with the correct node highlighted.
        if (navigationTree && navigationTree.isVisible()) {
            navigationTree.ensureVisible(node, {
                select: true,
                focus: true
            });
        } else {
            var idd = node.data['idd'];
            if (idd) {
                idd += '/-1';
            }

            this.redirectTo(idd || node.getId());
        }
    },
    //登录之后
    onLogin: function (view, user, loginManager) {
        if (this.login) {
            this.login.destroy();
            delete this.login;
        }
        this.loginManager = loginManager;
        //this.organization = organization;
        this.user = user;
        this.showUI(view);
    },
    //显示主界面
    showUI: function (view) {
        // Ext.create('JZYIndent.store.Navigation', {
        //     storeId: 'navigation'
        // });
        /*        Ext.create('Ext.data.ArrayStore', {
         storeId: 'st_userlist',
         pageSize: 100,
         autoLoad :true,
         model: 'JZYIndent.model.UGroup',
         proxy : {
         type: 'reste',
         url: '/list/UGroup',
         reader :
         {
         type : 'json',
         rootProperty : 'data',
         totalProperty:'total'
         }
         }
         });
         */
        var me = this;
        me.viewport = new JZYIndent.view.main.Main({
            session: this.session,
            viewModel: {
                data: {
                    currentOrg: this.organization,
                    currentUser: this.user
                }
            }
        });
        var url = me.getOrigUri() || 'all';
        //不是通过login窗口登录的之后会有route来到，不需要重复调用redirectTo
        if (view) {
            me.redirectTo(url, true);
        }

    },
    //显示登录窗口
    showLogin: function () {
        if (this.login) {
            return;
        }

        this.login = new JZYIndent.view.login.Login({
            session: this.session,
            autoShow: true,
            listeners: {
                scope: this,
                login: 'onLogin'
            }
        });
    },
    //开始执行
    onLaunch: function () {
        var me = this;
        // var token = Ext.util.Cookies.get("accessToken");
        var user = Ext.util.Cookies.get("username");
        var pwd = Ext.util.Cookies.get("password");
        if ((user != null) && (user != "")) {
            if (!me.loginManager) {
                me.redirectTo('all');
                me.loginManager = new JZYIndent.LoginManager({
                    session: null,
                    model: 'User'
                });
            }
            var data = {
                username: user,
                password: pwd
            };
            me.loginManager.login({
                data: data,
                scope: me,
                success: function (user) {
                    console.log(1);
                    var hash = window.location.hash;
                    if ((hash != null) && (hash != "") && (hash.length > 0)) {
                        hash = hash.substring(1);
                        me.setOrigUri(hash);
                    }
                    this.onLogin(null, user, me.loginManager);
                },
                failure: function () {
                    console.log(123);
                    me.showLogin();
                }
            });
        } else {
            me.showLogin();
        }
    }
});
Ext.override(Ext.form.field.Base, {
    //针对form中的基本组件 　　
    initComponent: function () {
        if (this.allowBlank !== undefined && !this.allowBlank) {
            if (this.fieldLabel) {
                this.fieldLabel += '<font style="color:red">*</font>';
            }
        }
        this.callParent(arguments);
    }
});
// Ext.define('overrides.data.proxy.Ajax', {
//     override:'Ext.data.proxy.Ajax',
//     config: {
//         /**
//          * @cfg {Boolean} withCredentials
//          * This configuration is sometimes necessary when using cross-origin resource sharing.
//          * @accessor
//          */
//
//         withCredentials: true
//     }
// });
// Ext.override(Ext.data.TreeStore, {
//     load : function(options) {
//         options = options || {};
//         options.params = options.params || {};
//
//         var me = this, node = options.node || me.tree.getRootNode(), root;
//
//         // If there is not a node it means the user hasnt defined a rootnode
//         // yet. In this case lets just
//         // create one for them.
//         if (!node) {
//             node = me.setRootNode( {
//                 expanded : true
//             });
//         }
//
//         if (me.clearOnLoad) {
//             node.removeAll(false);
//         }
//
//         Ext.applyIf(options, {
//             node : node
//         });
//         options.params[me.nodeParam] = node ? node.getId() : 'root';
//
//         if (node) {
//             node.set('loading', true);
//         }
//         return me.callParent( [ options ]);
//     }
// });
// Ext.define('Ext.form.MultiSelect', {
//     extend: 'Ext.form.ComboBox',
//     alias: 'widget.multicombobox',
//     xtype: 'multicombobox',
//     initComponent: function () {
//         this.multiSelect = true;
//         this.listConfig = {
//             itemTpl: Ext.create('Ext.XTemplate',
//                 '<input type=checkbox>{[values.' + this.displayField + ']}'),
//             onItemSelect: function (record) {
//                 var node = this.getNode(record);
//                 if (node) {
//                     Ext.fly(node).addCls(this.selectedItemCls);
//
//                     var checkboxs = node.getElementsByTagName("input");
//                     if (checkboxs != null) {
//                         var checkbox = checkboxs[0];
//                         checkbox.checked = true;
//                     }
//                 }
//             },
//             onItemDeselect: function (record) {
//                 var node = this.getNode(record);
//                 if (node) {
//                     Ext.fly(node).removeCls(this.selectedItemCls);
//
//                     var checkboxs = node.getElementsByTagName("input");
//                     if (checkboxs != null) {
//                         var checkbox = checkboxs[0];
//                         checkbox.checked = false;
//                     }
//                 }
//             },
//             listeners: {
//                 itemclick: function (view, record, item, index, e, eOpts) {
//                     var isSelected = view.isSelected(item);
//                     var checkboxs = item.getElementsByTagName("input");
//                     if (checkboxs != null) {
//                         var checkbox = checkboxs[0];
//                         if (!isSelected) {
//                             checkbox.checked = true;
//                         } else {
//                             checkbox.checked = false;
//                         }
//                     }
//                 }
//             }
//         }
//         this.callParent();
//     }
// });


