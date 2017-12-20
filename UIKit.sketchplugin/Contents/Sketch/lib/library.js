
function Library(context, library) {
    this._context = context
    this._library = library
}

Library.prototype.name = function() {
    return this._library.name()
}

Library.getSymbolGroupInContext = function(context) {
    var group = new SymbolGroup()
    var libraries = this.getFilteredLibrariesInContext(context)
    for (var i in libraries) {
        var library = libraries[i];

        var subgroup = new SymbolGroup(library.name())
        var symbols = library.getFilteredSymbols();
        for (var i in symbols) {
            subgroup.addSymbol(symbols[i])
        }

        group.addSubgroup(subgroup);
    }

    return group
}

Library.getFilteredLibrariesInContext = function(context) {
    var filteredLibraries = [];
    var libraries = this.getAllLibrariesInContext(context);
    for (var i in libraries) {
        var library = libraries[i];
        if (context.config().shouldIncludeLibrary(library)) {
            filteredLibraries.push(library)
        }
    }
    return filteredLibraries
}

Library.getAllLibrariesInContext = function(context) {
    var libraries = []
    var enumerator = AppController.sharedInstance().librariesController().libraries().objectEnumerator()
    while (library = enumerator.nextObject()) {
        libraries.push(new Library(context, library))
    }
    return libraries
}

Library.prototype.getFilteredSymbols = function() {
    var filteredSymbols = [];
    var symbols = this.getAllSymbols()
    for (var i in symbols) {
        var symbol = symbols[i];
        if (this._context.config().shouldIncludeSymbol(symbol)) {
            filteredSymbols.push(symbol)
        }
    }
    return filteredSymbols
}

Library.prototype.getAllSymbols = function() {
    var symbols = []
    var enumerator = this._library.document().localSymbols().objectEnumerator()
    while (symbol = enumerator.nextObject()) {
        symbols.push(new Symbol(this._context, this._library, symbol))
    }
    return symbols
}
