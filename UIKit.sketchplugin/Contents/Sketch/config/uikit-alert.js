
var IGNORE_SYMBOLS_SEP = ";"

function UIKitConfigAlert(context) {
    this._context = context
    this._context.setConfig(UIKitConfig.load())

    this._alert = new Alert()

    this.setTitle();
    this.addSelectedLibrariesInput()
    this.addIgnoreSymbolsInput()
    this.addBackgroundColorInput()
    this.addButtons()
}

UIKitConfigAlert.prototype.save = function() {
    var config = new UIKitConfig()
    config.setBackgroundColor(this.getBackgroundColor())

    var libraries = this.getSelectedLibraries();
    for (var i in libraries) {
        config.includeLibrariesWithName(libraries[i])
    }

    var ignoredSymbols = this.getIgnoredSymbols();
    for (var i in ignoredSymbols) {
        config.ignoreSymbolsWithNameContainingString(ignoredSymbols[i])
    }

    config.save()
    this._context.setConfig(config)
}

UIKitConfigAlert.prototype.show = function() {
    var success = this._alert.show()
    if (success) {
        this.save()
    }
    return success
}

UIKitConfigAlert.prototype.setTitle = function() {
    this._alert.setTitleLabel('Generate UIKit');
}

UIKitConfigAlert.prototype.getBackgroundColor = function() {
    return this._backgroundColorInput.stringValue()
}

UIKitConfigAlert.prototype.addBackgroundColorInput = function() {
    var hex = this._context.config().backgroundColor().hex;
    this._alert.addMessageLabel('Background color:');
    this._backgroundColorInput = this._alert.addTextFieldInput(hex);
}

UIKitConfigAlert.prototype.getSelectedLibraries = function() {
    var selectedLibraries = []
    for (var i in this._selectedLibrariesInput) {
        var checkbox = this._selectedLibrariesInput[i];
        if (checkbox.state() === 1) {
            selectedLibraries.push(checkbox.title())   
        }
    }
    return selectedLibraries
}

UIKitConfigAlert.prototype.addSelectedLibrariesInput = function() {
    var libraries = Library.getAllLibrariesInContext(this._context)
    libraries = libraries.sort( (a, b) => { 
        return a.name().toLowerCase() > b.name().toLowerCase()
    })

    this._selectedLibrariesInput = [] 
    this._alert.addMessageLabel('Select your libraries:');
    for (var i in libraries) {
        var library = libraries[i]
        var checkbox = this._alert.addCheckboxInput(library.name());
        checkbox.setState(this._context.config().shouldIncludeLibrary(library))
        this._selectedLibrariesInput.push(checkbox)
    }
}

UIKitConfigAlert.prototype.getIgnoredSymbols = function() {
    var ignoredSymbols = []
    var _ignoredSymbols = this._ignoreSymbolsInput.stringValue().split(IGNORE_SYMBOLS_SEP)
    for (var i in _ignoredSymbols) {
        var ignoreSymbol = _ignoredSymbols[i];
        if (ignoreSymbol !== "") {
            ignoredSymbols.push(ignoreSymbol)
        }
    }
    return ignoredSymbols
}

UIKitConfigAlert.prototype.addIgnoreSymbolsInput = function() {
    var text = this._context.config()._ignoreSymbolsWithNameContainingString.join(IGNORE_SYMBOLS_SEP)
    this._alert.addMessageLabel('Ignore symbols containing strings [' + IGNORE_SYMBOLS_SEP + ']:');
    this._ignoreSymbolsInput = this._alert.addTextFieldInput(text);   
    this._ignoreSymbolsInput.setHeight(50)
}

UIKitConfigAlert.prototype.addButtons = function() {
    this._alert.addButton('Generate');
    this._alert.addButton('Cancel');
}
