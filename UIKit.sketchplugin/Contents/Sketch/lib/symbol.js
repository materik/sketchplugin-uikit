
function Symbol(context, library, symbol) {
    this._context = context
    this._library = library
    this._symbol = symbol
    this._name = undefined
    this._platform = undefined
    this._ignore = undefined
}

Symbol.prototype.name = function() {
    if (this._name === undefined) {
        this._name = this._symbol.name();
        this._name = this._name.replace("/Mobile/", "/")
        this._name = this._name.replace("/Tablet/", "/")
        this._name = this._name.replace("/Desktop/", "/")
    }
    return this._name
}

Symbol.prototype.platform = function() {
    if (this._platform === undefined) {
        var name = this._symbol.name()
        if (name.indexOf("/Mobile/") !== -1) {
            this._platform = "Mobile"
        } else if (name.indexOf("/Tablet/") !== -1) {
            this._platform = "Tablet"
        } else if (name.indexOf("/Desktop/") !== -1) {
            this._platform = "Desktop"
        } else {
            this._platform = ""
        }
    }
    return this._platform
}

Symbol.prototype.newInstance = function() {
    var doc = this._context.sketch()._doc
    var symbol = doc.localSymbolForSymbol_inLibrary(this._symbol, this._library);
    return symbol.newSymbolInstance()
}

Symbol.prototype.shouldNameBeUsedAsGroup = function() {
    if (this.name().indexOf("Checkmark") !== -1) { return false }
    if (this.name().indexOf("Radio") !== -1) { return false }
    if (this.name().indexOf("Logo") !== -1) { return false }
    if (this.platform() !== "") { return true }
    return false
}

Symbol.sortByPlatform = function(a, b) {
    var platform1 = Utility.platformIndex(a.platform())
    var platform2 = Utility.platformIndex(b.platform())
    if (platform1 > platform2) return 1
    if (platform1 < platform2) return -1
    return 0
}
