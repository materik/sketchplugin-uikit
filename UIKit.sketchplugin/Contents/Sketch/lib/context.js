
function Context(context) {
    this._sketch = new Sketch(context)
    this._config = undefined
}

Context.prototype.sketch = function() {
    return this._sketch
}

Context.prototype.config = function() {
    return this._config
}

Context.prototype.setConfig = function(config) {
    this._config = config
}
