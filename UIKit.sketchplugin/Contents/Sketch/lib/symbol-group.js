
var SEP = "/";
var SEP_NICE = " > ";

function SymbolGroup(title) {
    this._title = title
    this._subgroups = []
    this._symbols = []
}

SymbolGroup.prototype.createAndAddSubgroupWithTitle = function(title) {
    var titleSplit = title.split(SEP)
    var groupTitle = titleSplit.shift()

    var group = this.getSubgroupWithTitle(groupTitle)
    if (group == null) {
        group = new SymbolGroup(groupTitle)
        this._subgroups.push(group)
    }

    if (titleSplit.length > 0) {
        var subgroupTitle = titleSplit.join(SEP)
        group.createAndAddSubgroupWithTitle(subgroupTitle)
    }

    return group
}

SymbolGroup.prototype.addSubgroup = function(subgroup) {
    this._subgroups.push(subgroup);
}

SymbolGroup.prototype.addSymbol = function(symbol) {
    var symbolName = symbol.name()
    var symbolNameSplit = symbolName.split(SEP)
    if (!symbol.shouldNameBeUsedAsGroup()) {
        var symbolShortName = symbolNameSplit.pop()
    }

    if (symbolNameSplit.length > 0) {
        var subgroupTitle = symbolNameSplit.join(SEP)
        var subgroup = this.getOrCreateSubgroupWithTitle(subgroupTitle)
        subgroup._symbols.push(symbol)
    } else {
        this._symbols.push(symbol)
    }
}

SymbolGroup.prototype.getOrCreateSubgroupWithTitle = function(title) {
    var subgroup = this.getSubgroupWithTitle(title)
    if (subgroup == null) {
        subgroup = this.createAndAddSubgroupWithTitle(title)
        return this.getSubgroupWithTitle(title)
    } else {
        return subgroup
    }
}

SymbolGroup.prototype.getSubgroupWithTitle = function(title) {
    var titleSplit = title.split(SEP)
    var groupTitle = titleSplit.shift()

    var subgroup = this._subgroups.find( (subgroup) => {
        return subgroup._title === groupTitle
    })

    if (subgroup == null) {
        return null
    } else if (titleSplit.length > 0) {
        var subgroupTitle = titleSplit.join(SEP)
        return subgroup.getSubgroupWithTitle(subgroupTitle)
    } else {
        return subgroup
    }
}

SymbolGroup.prototype.enumerator = function() {
    return new SymbolGroupEnumerator(this)
}

SymbolGroup.prototype.sort = function() {
    this._subgroups = this._subgroups.sort(SymbolGroup.sortByName)
    this._symbols = this._symbols.sort(Symbol.sortByPlatform)
}

SymbolGroup.width = function(symbols) {
    var width = 0;
    for (var i in symbols) {
        var symbol = symbols[i]._symbol
        width += symbol.frame().width()
    }
    return width
}

SymbolGroup.maxWidth = function(symbols) {
    var maxWidth = 0;
    for (var i in symbols) {
        var symbol = symbols[i]._symbol
        maxWidth = Math.max(maxWidth, symbol.frame().width())
    }
    return maxWidth
}

SymbolGroup.height = function(symbols) {
    var height = 0;
    for (var i in symbols) {
        var symbol = symbols[i]._symbol
        height += symbol.frame().height()
    }
    return height
}

SymbolGroup.maxHeight = function(symbols) {
    var maxHeight = 0;
    for (var i in symbols) {
        var symbol = symbols[i]._symbol
        maxHeight = Math.max(maxHeight, symbol.frame().height())
    }
    return maxHeight
}

SymbolGroup.sortByName = function(a, b) {
    return a._title > b._title
}

SymbolGroup.sortByWidth = function(a, b) {
    return SymbolGroup.width(a._symbols) > SymbolGroup.width(b._symbols)
}

/* ---------------------- */

function SymbolGroupEnumerator(group) {
    group.sort()

    this._group = group

    this._currentSubgroupEnumerator = null
    this._currentIndex = 0
    this._hasMore = true
}

SymbolGroupEnumerator.prototype.currentTopName = function() {
    var name = this.currentGroupName();
    return name.split(SEP_NICE)[0];
}

SymbolGroupEnumerator.prototype.currentGroupName = function() {
    var subtitle = (
        this._currentSubgroupEnumerator == null
            ? undefined
            : this._currentSubgroupEnumerator.currentGroupName()
    )   
    if (this._group._title && subtitle) {
        return this._group._title + SEP_NICE + subtitle
    } else if (this._group._title) {
        return this._group._title
    } else if (subtitle) {
        return subtitle
    } else {
        return ""
    }
}

SymbolGroupEnumerator.prototype.currentGroupHeight = function() {
    return (
        this._currentSubgroupEnumerator == null
            ? SymbolGroup.maxHeight(this._group._symbols)
            : this._currentSubgroupEnumerator.currentGroupHeight()
    )
}

SymbolGroupEnumerator.prototype.nextGroupHeight = function() {
    var copy = this.copy()
    copy.nextSymbols()
    return copy.currentGroupHeight()
}

SymbolGroupEnumerator.prototype.nextSymbols = function() {
    if (this.hasSymbols() && this.hasMore()) {
        this._hasMore = false
        return this._group._symbols
    } else if (this._currentSubgroupEnumerator != null) {
        var symbols = this._currentSubgroupEnumerator.nextSymbols()
        if (symbols != null) {
            return symbols
        } else {
            this._currentIndex += 1
            this._currentSubgroupEnumerator = null
            return this.nextSymbols()
        }
    } else if (this._currentIndex < this._group._subgroups.length) {
        this._currentSubgroupEnumerator = this._group._subgroups[this._currentIndex].enumerator()
        return this.nextSymbols()
    } else {
        this._hasMore = false
        return null
    }
}

SymbolGroupEnumerator.prototype.hasSymbols = function() {
    return this._group._symbols.length > 0
}

SymbolGroupEnumerator.prototype.hasMore = function() {
    return this._hasMore
}

SymbolGroupEnumerator.prototype.copy = function() {
    var copy = new SymbolGroupEnumerator(this._group)
    copy._currentSubgroupEnumerator = this._currentSubgroupEnumerator ? this._currentSubgroupEnumerator.copy() : null
    copy._currentIndex = this._currentIndex
    copy._hasMore = this._hasMore
    return copy
}

SymbolGroupEnumerator.sortByAtomic = function(a, b) {
    var atomic1 = Utility.atomicIndex(a.currentTopName())
    var atomic2 = Utility.atomicIndex(b.currentTopName())
    if (atomic1 > atomic2) return 1
    if (atomic1 < atomic2) return -1
    return 0
}
