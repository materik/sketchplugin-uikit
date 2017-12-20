
var PAGE_TITLE = "UI Kit";

function UIKit(context) {
    this._context = context;
    this._artboards = new Artboards(context)

    this.setupPage()
    this.setupEnumerator()
}

UIKit.generateInContext = function(context) {
    var uikit = new UIKit(context)
    uikit.generate()
    return uikit
}

UIKit.prototype.setupPage = function() {
    this._page = this._context.sketch().getOrCreatePage(PAGE_TITLE)
    this._context.sketch().cleanPage(this._page)
}

UIKit.prototype.setupEnumerator = function() {
    var group = Library.getSymbolGroupInContext(this._context)
    this._enumerators = group._subgroups.map( (e) => { return e.enumerator() })
    this._enumerators = this._enumerators.sort(SymbolGroupEnumerator.sortByAtomic)
}

UIKit.prototype.createColumn = function(enumerator, cutoffHeight) {
    return new Column(this._context, enumerator, cutoffHeight)
}

UIKit.prototype.generate = function() {
    for (var i in this._enumerators) {
        var enumerator = this._enumerators[i]
        this._artboards.addLabel(enumerator.currentTopName())
        while (enumerator.hasMore()) {
            this._artboards.addColumn(this.createColumn(enumerator, ARTBOARD_HEIGHT))
        }   
    }

    this._artboards.layoutInPage(this._page)
}
