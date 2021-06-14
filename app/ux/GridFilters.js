
Ext.define('JZYIndent.ux.GridFilters', {
    extend: 'Ext.plugin.Abstract',

    requires: [
        'Ext.grid.filters.filter.*'
    ],

    mixins: [
        'Ext.util.StoreHolder'
    ],

    alias: 'plugin.gfilters',

    pluginId: 'gfilters',

    /**
     * @property {Object} defaultFilterTypes
     * This property maps {@link Ext.data.Model#cfg-field field type} to the appropriate
     * grid filter type.
     * @private
     */
    defaultFilterTypes: {
        'boolean': 'boolean',
        'int': 'number',
        date: 'date',
        number: 'number'
    },

    /**
     * @property {String} [filterCls="x-grid-filters-filtered-column"]
     * The CSS applied to column headers with active filters.
     */
    filterCls: Ext.baseCSSPrefix + 'grid-filters-filtered-column',

    /**
     * @cfg {String} [menuFilterText="Filters"]
     * The text for the filters menu.
     */
    menuFilterText: 'Filters',

    /**
     * @cfg {Boolean} showMenu
     * Defaults to true, including a filter submenu in the default header menu.
     */
    showMenu: true,

    /**
     * @cfg {String} stateId
     * Name of the value to be used to store state information.
     */
    stateId: undefined,

    init: function (grid) {

        var me = this,
            store, headerCt;

        //<debug>
        Ext.Assert.falsey(me.grid);
        //</debug>
        me.grid = grid;
        grid.filters = me;

        if (me.grid.normalGrid) {
            me.isLocked = true;
        }

        grid.clearFilters = me.clearFilters.bind(me);
        store = grid.store;
        headerCt = grid.headerCt;
//c4w 将菜单从列头位置改到工具栏，不再为列头菜单生成filter菜单项
/*        headerCt.on({
            scope: me,
            add: me.onAdd,
            menucreate: me.onMenuCreate
        });
*/
        grid.on({
            scope: me,
            //destroy: me.onGridDestroy,
            beforereconfigure: me.onBeforeReconfigure,
            reconfigure: me.onReconfigure
        });
        me.bindStore(store);
        if (grid.stateful) {
            store.statefulFilters = true;
        }

        me.initColumns();
    },

    /**
     * Creates the Filter objects for the current configuration.
     * Reconfigure and on add handlers.
     * @private
     */
    initColumns: function () {
        var grid = this.grid,
            store = grid.getStore(),
            columns = grid.columnManager.getColumns(),
            len = columns.length,
            i, column,
            filter, filterCollection, block;
        //
		var tbar = grid.down('toolbar');
		if(!tbar){
			return;
		}

        // We start with filters defined on any columns.
        //c4w create menu on toolbar
        var me = this;
        var its=[];
        for (i = 0; i < len; i++) {
            column = columns[i];
            filter = column.filter;

            if (filter && !filter.isGridFilter) {
                if (!filterCollection) {
                    filterCollection = store.getFilters();
                    filterCollection.beginUpdate();
                }
                this.createColumnFilter(column);
                column.filter.createMenu();
				its.push({text:column.text,
					checked:false,
					menu:column.filter.menu,
					filter:column.filter,
		          	listeners: {
		                scope: me,
		                checkchange: me.onCheckChange,
                		activate:me.onBeforeActivate
		            }
  				});
            }
        }
 		tbar.insert(0,[{
			xtype:'splitbutton',
            text:'检索',
            iconCls: null,
            menu:its,
            handler: 'onClearFilters',
            scope: me
        },{
            xtype: 'component',
            name:'cpt_total',
            html: ''
        }]);

        if (filterCollection) {
            filterCollection.endUpdate();
        }
    },

	onClearFilters: function () {
        // The "filters" property is added to the grid (this) by gridfilters
		var me=this;
		me.resetScroll();
		setTimeout(function(){
			me.clearFilters();
		},100);
    },

    resetScroll:function(){
    	var grid_view = this.grid.getView();
    	grid_view.scrollTo(0,0);
    },
    createColumnFilter: function (column) {
        var me = this,
            columnFilter = column.filter,
            filter = {
                column: column,
                grid: me.grid,
                owner: me
            },
            field, model, type;

        if (Ext.isString(columnFilter)) {
            filter.type = columnFilter;
        } else {
            Ext.apply(filter, columnFilter);
        }

        if (!filter.type) {
            model = me.store.getModel();
            // If no filter type given, first try to get it from the data field.
            field = model && model.getField(column.dataIndex);
            type = field && field.type;

            filter.type = (type && me.defaultFilterTypes[type]) ||
                           column.defaultFilterType || 'string';
        }

        column.filter = Ext.Factory.gridFilter(filter);
    },

    onAdd: function (headerCt, column, index) {
        var filter = column.filter;

        if (filter && !filter.isGridFilter) {
            this.createColumnFilter(column);
        }
    },

    /**
     * @private Handle creation of the grid's header menu.
     */
    onMenuCreate: function (headerCt, menu) {
        menu.on({
            beforeshow: this.onMenuBeforeShow,
            scope: this
        });
    },

    /**
     * @private Handle showing of the grid's header menu. Sets up the filter item and menu
     * appropriate for the target column.
     */
    onMenuBeforeShow: function (menu) {
        var me = this,
            menuItem, filter, ownerGrid, ownerGridId;

        if (me.showMenu) {
            // In the case of a locked grid, we need to cache the 'Filters' menuItem for each grid since
            // there's only one Filters instance. Both grids/menus can't share the same menuItem!
            if (!me.menuItems) {
                me.menuItems = {};
            }

            // Don't get the owner grid if in a locking grid since we need to get the unique menuItems key.
            ownerGrid = menu.up('grid');
            ownerGridId = ownerGrid.id;

            menuItem = me.menuItems[ownerGridId];

            if (!menuItem || menuItem.isDestroyed) {
                menuItem = me.createMenuItem(menu, ownerGridId);
            }

            me.activeFilterMenuItem = menuItem;

            filter = me.getMenuFilter(ownerGrid.headerCt);
            if (filter) {
                filter.showMenu(menuItem);
            }

            menuItem.setVisible(!!filter);
            me.sep.setVisible(!!filter);
        }
    },

    createMenuItem: function (menu, ownerGridId) {
        var me = this,
            item;

        me.sep = menu.add('-');

        item = menu.add({
            checked: false,
            itemId: 'filters',
            text: me.menuFilterText,
            listeners: {
                scope: me,
                checkchange: me.onCheckChange
            }
        });

        return (me.menuItems[ownerGridId] = item);
    },

    /**
     * Handler called by the grid 'beforedestroy' event
     */
    onGridDestroy: function () {
        var me = this,
            menuItems = me.menuItems,
            item;

        me.bindStore(null);
        me.sep = Ext.destroy(me.sep);

        for (item in menuItems) {
            menuItems[item].destroy();
        }

        me.grid = null;
    },

    onUnbindStore: function(store) {
        store.getFilters().un('remove', this.onFilterRemove, this);
    },

    onBindStore: function(store, initial, propName) {
        this.local = !store.getRemoteFilter();
        store.getFilters().on('remove', this.onFilterRemove, this);
    },

    onFilterRemove: function (filterCollection, list) {
        // We need to know when a store filter has been removed by an operation of the gridfilters UI, i.e.,
        // store.clearFilter().  The preventFilterRemoval flag lets us know whether or not this listener has been
        // reached by a filter operation (preventFilterRemoval === true) or by something outside of the UI
        // (preventFilterRemoval === undefined).
        var len = list.items.length,
            columnManager = this.grid.columnManager,
            i, item, header, filter;


        for (i = 0; i < len; i++) {
            item = list.items[i];

            header = columnManager.getHeaderByDataIndex(item.getProperty());
            if (header) {
                // First, we need to make sure there is indeed a filter and that its menu has been created. If not,
                // there's no point in continuing.
                //
                // Also, even though the store may be filtered by this dataIndex, it doesn't necessarily mean that
                // it was created via the gridfilters API. To be sure, we need to check the prefix, as this is the
                // only way we can be sure of its provenance (note that we can't check `operator`).
                //
                // Note that we need to do an indexOf check on the string because TriFilters will contain extra
                // characters specifiying its type.
                //
                // TODO: Should we support updating the gridfilters if one or more of its filters have been removed
                // directly by the bound store?
                filter = header.filter;
                if (!filter || !filter.menu || item.getId().indexOf(filter.getBaseIdPrefix()) === -1) {
                    continue;
                }

                if (!filter.preventFilterRemoval) {
                    // This is only called on the filter if called from outside of the gridfilters UI.
                    filter.onFilterRemove(item.getOperator());
                }
            }
        }
    },

    /**
     * @private
     * Get the filter menu from the filters MixedCollection based on the clicked header.
     */
    getMenuFilter: function (headerCt) {
        return headerCt.getMenu().activeHeader.filter;
    },
	onBeforeActivate:function(item,value){
		this.activeFilterMenuItem=item;
		this.activeFilterMenuItem.activeFilter=item.filter;
	},
    /** @private */
    onCheckChange: function (item, value) {
        // Locking grids must lookup the correct grid.
        var grid = this.isLocked ? item.up('grid') : this.grid,
            //filter = this.getMenuFilter(grid.headerCt);
        	filter = item.filter;

        //this.resetScroll();
        //setTimeout(function(){
        	filter.setActive(value);
        //},100);
    },

    getHeaders: function () {
        return this.grid.view.headerCt.columnManager.getColumns();
    },

    /**
     * Checks the plugin's grid for statefulness.
     * @return {Boolean}
     */
    isStateful: function () {
        return this.grid.stateful;
    },

    /**
     * Adds a filter to the collection and creates a store filter if has a `value` property.
     * @param {Object/Ext.grid.filter.Filter} filters A filter configuration or a filter object.
     */
    addFilter: function (filters) {
        var me = this,
            grid = me.grid,
            store = me.store,
            hasNewColumns = false,
            suppressNextFilter = true,
            dataIndex, column, i, len, filter, columnFilter;

        if (!Ext.isArray(filters)) {
            filters = [filters];
        }

        for (i = 0, len = filters.length; i < len; i++) {
            filter = filters[i];
            dataIndex = filter.dataIndex;
            column = grid.columnManager.getHeaderByDataIndex(dataIndex);

            // We only create filters that map to an existing column.
            if (column) {
                hasNewColumns = true;

                // Don't suppress active filters.
                if (filter.value) {
                    suppressNextFilter = false;
                }

                columnFilter = column.filter;

                // If already a gridfilter, let's destroy it and recreate another from the new config.
                if (columnFilter && columnFilter.isGridFilter) {
                    columnFilter.deactivate();
                    columnFilter.destroy();

                    if (me.activeFilterMenuItem) {
                        me.activeFilterMenuItem.menu = null;
                    }
                }

                column.filter = filter;
            }
        }

        // Batch initialize all column filters.
        if (hasNewColumns) {
            store.suppressNextFilter = suppressNextFilter;
            me.initColumns();
            store.suppressNextFilter = false;
        }
    },

    /**
     * Adds filters to the collection.
     * @param {Array} filters An Array of filter configuration objects.
     */
    addFilters: function (filters) {
        if (filters) {
            this.addFilter(filters);
        }
    },

    /**
     * Turns all filters off. This does not clear the configuration information.
     * @param {Boolean} autoFilter If true, don't fire the deactivate event in
     * {@link Ext.grid.filters.filter.Base#setActive setActive}.
     */
    clearFilters: function (autoFilter) {
        var grid = this.grid,
            columns = grid.columnManager.getColumns(),
            store = grid.store,
            oldAutoFilter = store.getAutoFilter(),
            column, filter, i, len, filterCollection;

        if (autoFilter !== undefined) {
            store.setAutoFilter(autoFilter);
        }

        // We start with filters defined on any columns.
        for (i = 0, len = columns.length; i < len; i++) {
            column = columns[i];
            filter = column.filter;

            if (filter && filter.isGridFilter) {
                if (!filterCollection) {
                    filterCollection = store.getFilters();
                    filterCollection.beginUpdate();
                }

                filter.setActive(false);
            }
        }

        if (filterCollection) {
            filterCollection.endUpdate();
        }

        if (autoFilter !== undefined) {
            store.setAutoFilter(oldAutoFilter);
        }
    },

    onBeforeReconfigure: function(grid, store, columns) {
        if (store) {
            store.getFilters().beginUpdate();
        }
        this.reconfiguring = true;
    },

    onReconfigure: function(grid, store, columns, oldStore) {
        var me = this;
        if (store && oldStore !== store) {
            me.bindStore(store);
        }

        if (columns) {
            me.initColumns();
        }

        if (store) {
            store.getFilters().endUpdate();
        }

        me.reconfiguring = false;
    }
});
