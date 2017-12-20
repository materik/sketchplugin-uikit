
var USER_DEFAULTS_KEY = "sketch-plugin-uikit-config";

function UIKitConfig() {
    this._backgroundColorHex = "#ffffff";
    this._includeLibrariesWithName = [];
    this._ignoreSymbolsWithNameContainingString = [];
}

UIKitConfig.clean = function() {
    var defaults = new UserDefaults(USER_DEFAULTS_KEY)
    defaults.removeKey()
    defaults.removeKey("backgroundColorHex")
    defaults.removeKey("includeLibrariesWithName")
    defaults.removeKey("ignoreSymbolsWithNameContainingString")
}

UIKitConfig.load = function() {
    var defaults = new UserDefaults(USER_DEFAULTS_KEY)

    var config = new UIKitConfig()
    if (defaults.boolForKey()) {
        config._backgroundColorHex = defaults.stringForKey("backgroundColorHex")
        config._includeLibrariesWithName = defaults.arrayForKey("includeLibrariesWithName")
        config._ignoreSymbolsWithNameContainingString = defaults.arrayForKey("ignoreSymbolsWithNameContainingString")
    }

    return config
}

UIKitConfig.prototype.save = function() {
    var defaults = new UserDefaults(USER_DEFAULTS_KEY)
    defaults.setBoolForKey(true)
    defaults.setStringForKey(this._backgroundColorHex, "backgroundColorHex");
    defaults.setArrayForKey(this._includeLibrariesWithName, "includeLibrariesWithName");
    defaults.setArrayForKey(this._ignoreSymbolsWithNameContainingString, "ignoreSymbolsWithNameContainingString");
}

UIKitConfig.prototype.multiPage = function() {
    return this._multiPage
}

UIKitConfig.prototype.setMultiPage = function(multiPage) {
    this._multiPage = multiPage
}

UIKitConfig.prototype.backgroundColor = function() {
    return new Color(this._backgroundColorHex)
}

UIKitConfig.prototype.setBackgroundColor = function(hex) {
    this._backgroundColorHex = hex
}

UIKitConfig.prototype.shouldIncludeLibrary = function(library) {
    return Utility.contains(this._includeLibrariesWithName, library.name())
}

UIKitConfig.prototype.includeLibrariesWithName = function(string) {
    this._includeLibrariesWithName.push(string)
}

UIKitConfig.prototype.shouldIncludeSymbol = function(symbol) {
    var name = symbol.name();
    for (var i in this._ignoreSymbolsWithNameContainingString) {
        if (name.indexOf(this._ignoreSymbolsWithNameContainingString[i]) !== -1) {
            return false
        }
    }
    return true
}

UIKitConfig.prototype.ignoreSymbolsWithNameContainingString = function(string) {
    this._ignoreSymbolsWithNameContainingString.push(string)
}

/* ------------------------------ */

function UserDefaults(key) {
    this._defaults = NSUserDefaults.standardUserDefaults()
    this._key = key
}

UserDefaults.prototype.key = function(key) {
    return this._key + (key ? "." + key : "");
}

UserDefaults.prototype.removeKey = function(key) {
    return this._defaults.removeObjectForKey(this.key(key))
}

UserDefaults.prototype.boolForKey = function(key) {
    return this._defaults.boolForKey(this.key(key))
}

UserDefaults.prototype.setBoolForKey = function(value, key) {
    this._defaults.setBool_forKey(value, this.key(key))
}

UserDefaults.prototype.stringForKey = function(key) {
    return this._defaults.objectForKey(this.key(key))
}

UserDefaults.prototype.setStringForKey = function(value, key) {
    this._defaults.setObject_forKey(value, this.key(key))
}

UserDefaults.prototype.arrayForKey = function(key) {
    return this._defaults.objectForKey(this.key(key)).split(",")
}

UserDefaults.prototype.setArrayForKey = function(value, key) {
    this._defaults.setObject_forKey(value.join(","), this.key(key))
}
