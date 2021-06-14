
Ext.define('JZYIndent.ux.Word', {
	extend :'Ext.util.Observable',
	alias: 'plugin.word',

    // Word language text
    langTitle: '统计字数',
    langToolTip: '清除word冗余并统计字数',
    wordPasteEnabled: true,
    // private
	curLength: 0,
	lastLength: 0,
	lastValue: '',
	// private
    init: function(cmp){

        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },
	// private
	checkIfPaste: function(e){

		var diffAt = 0;
		this.curLength = this.cmp.getValue().length;
		this.cmp.suspendEvents();
		var str = this.fixWordPaste(this.cmp.getValue());
		this.cmp.setValue(str);
		this.cmp.resumeEvents();
		//var len_html=str.length;
		var len_text= this.getWordCount(str);
		Ext.MessageBox.show({
            title: '字数统计结果',
            msg: '文本字数：'+len_text,
            buttons: Ext.MessageBox.OK,
            scope: this,
            icon: Ext.MessageBox.INFO
        });
	},

	getWordCount:function(str){
		var txt = $(str).text();
		var len = txt.length;
		var cout=0;
		for(var i=0; i<len; i++){
			var ch = txt.charAt(i);
			if(ch==' ' || ch=='　'  || ch=='\r' || ch=='\n'){
				continue;
			}
			cout++;
		}
		return cout;
	},
	// private
	findValueDiffAt: function(val){

		for (i=0;i<this.curLength;i++){
			if (this.lastValue[i] != val[i]){
				return i;
			}
		}

	},
    /**
     * Cleans up the jubberish html from Word pasted text.
     * @param wordPaste String The text that needs to be cleansed of Word jibberish html.
     * @return {String} The passed in text with all Word jibberish html removed.
     */
    fixWordPaste: function(wordPaste) {

        var removals = [/&nbsp;/ig, /[\r\n]/g, /<(xml|style)[^>]*>.*?<\/\1>/ig, /<\/?(meta|object|span)[^>]*>/ig,
			/<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig, /(lang|class|type|href|name|title|id|clear)=\"[^\"]*\"/ig, /style=(\'\'|\"\")/ig, /<![\[-].*?-*>/g,
			/MsoNormal/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /&nbsp;/g,
            /<\/?SPAN[^>]*>/g, /<\/?FONT[^>]*>/g, /<\/?STRONG[^>]*>/g, /<\/?H1[^>]*>/g, /<\/?H2[^>]*>/g, /<\/?H3[^>]*>/g, /<\/?H4[^>]*>/g,
            /<\/?H5[^>]*>/g, /<\/?H6[^>]*>/g, /<\/?P[^>]*><\/P>/g, /<!--(.*)-->/g, /<!--(.*)>/g, /<!(.*)-->/g, /<\\?\?xml[^>]*>/g,
            /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /style=\"[^\"]*\"/g, /style=\'[^\"]*\'/g, /lang=\"[^\"]*\"/g,
            /lang=\'[^\"]*\'/g, /class=\"[^\"]*\"/g, /class=\'[^\"]*\'/g, /type=\"[^\"]*\"/g, /type=\'[^\"]*\'/g, /href=\'#[^\"]*\'/g,
            /href=\"#[^\"]*\"/g, /name=\"[^\"]*\"/g, /name=\'[^\"]*\'/g, / clear=\"all\"/g, /id=\"[^\"]*\"/g, /title=\"[^\"]*\"/g,
            /<span[^>]*>/g, /<\/?span[^>]*>/g, /<title>(.*)<\/title>/g, /class=/g, /<meta[^>]*>/g, /<link[^>]*>/g, /<style>(.*)<\/style>/g,
            /<w:[^>]*>(.*)<\/w:[^>]*>/g];

        Ext.each(removals, function(s){
            wordPaste = wordPaste.replace(s, "");
        });

        // keep the divs in paragraphs
        wordPaste = wordPaste.replace(/<div[^>]*>/g, "<p>");
        wordPaste = wordPaste.replace(/<\/?div[^>]*>/g, "</p>");
        return wordPaste;

    },
	// private
    onRender: function() {

        this.cmp.getToolbar().add({
            iconCls: 'x-edit-sourceedit',
            pressed: true,
            handler: function(t){
                //t.toggle(!t.pressed);
                //this.wordPasteEnabled = !this.wordPasteEnabled;
            	this.checkIfPaste();
            },
            scope: this,
            tooltip: {
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });

    }
});
