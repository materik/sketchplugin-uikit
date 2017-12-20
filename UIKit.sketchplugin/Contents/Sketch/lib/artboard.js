
var MARGIN_COLUMN = 50;
var MARGIN_ROW = 150;
var MARGIN_LABEL = 75;
var ARTBOARD_WIDTH = 3518;
var ARTBOARD_HEIGHT = 2486;
var PADDING_LEFT = 200;
var PADDING_TOP = 250;
var LABEL_FONT_SIZE_LIBRARY = 48;
var LABEL_FONT_SIZE_GROUP = 24;

function Artboards(context) {
    this._context = context
    this._artboards = []
}

Artboards.prototype.addColumn = function(column) {
    var artboard = this.getArtboard(column)
    artboard.addColumn(column)
}

Artboards.prototype.getArtboard = function(newColumn) {
    if (this._artboards.length === 0) {
        return this.createArtboard()
    } else {
        var lastArtboard = this._artboards[this._artboards.length - 1]
        if (lastArtboard.columnsWidth(newColumn) > ARTBOARD_WIDTH) {
            return this.createArtboard()
        } else {
            return lastArtboard
        }
    }
}

Artboards.prototype.createArtboard = function() {
    var page = this._artboards.length
    var artboard = new Artboard(this._context, page)
    this._artboards.push(artboard)

    return artboard
}

Artboards.prototype.layoutInPage = function(page) {
    var y = 0
    for (var i in this._artboards) {
        var artboard = this._artboards[i]._artboard;
        artboard.frame().setY(y)
        page.addLayer(artboard)

        y += artboard.frame().height() + MARGIN_ROW
    }
}

Artboards.prototype.addLabel = function(text) {
    this.createArtboard().addLabel(text)
}

/* ---------------------- */

function Artboard(context, page) {
    this._context = context
    this._label = undefined
    this._columns = []

    var title = "Page " + (page + 1);
    var artboard = context.sketch().createArtboard(title, new Frame(0, 0, ARTBOARD_WIDTH, ARTBOARD_HEIGHT))
    artboard.setBackgroundColor(context.config().backgroundColor().color)
    artboard.setHasBackgroundColor(true)
    this._artboard = artboard
}

Artboard.prototype.setHeight = function(height) {
    this._artboard.frame().setHeight(height)
}

Artboard.prototype.addColumn = function(column) {
    //column.offsetY(this.paddingTop())
    column.offsetX(this.columnsWidth())

    this._columns.push(column)

    var layers = column.layers()
    for (var i in layers) {
        this._artboard.addLayer(layers[i])
    }

    this._artboard.frame().setHeight(Math.max(ARTBOARD_HEIGHT, column.height()))
}

Artboard.prototype.columnsWidth = function(newColumn) {
    var width = 0
    for (var i in this._columns) {
        var column = this._columns[i];
        width += column.width() - PADDING_LEFT / 2
    }
    if (newColumn) {
        width += newColumn.width() - PADDING_LEFT / 2
    }
    return width
}

Artboard.prototype.numberOfColumns = function() {
    return this._columns.length
}

Artboard.prototype.paddingTop = function() {
    return this._label ? 2 * MARGIN_LABEL : 0
}

Artboard.prototype.addLabel = function(text) {
    this._label = this.label(text)
    this._artboard.addLayer(this._label)
}

Artboard.prototype.label = function(text) {
    return this._context.sketch().createTextLayer(text, new Frame(PADDING_LEFT, PADDING_TOP - 1.5 * MARGIN_LABEL), LABEL_FONT_SIZE_LIBRARY)
}

/* ---------------------- */

function Column(context, enumerator, cutoffHeight) {
    this._context = context
    this._enumerator = enumerator;
    this._cutoffHeight = cutoffHeight || 100000;
    this._width = 0;
    this._height = 0;

    this._layers = this._create()
}

Column.prototype._create = function() {
    var layers = []
    var y = PADDING_TOP + MARGIN_LABEL;

    while (symbols = this._enumerator.nextSymbols()) {
        var x = PADDING_LEFT;

        for (var i in symbols) {
            var symbol = symbols[i]
            var instance = symbol.newInstance()
            instance.setName(symbol.name())
            instance.frame().setX(x);
            instance.frame().setY(y);
            layers.push(instance);

            x += instance.frame().width() + MARGIN_COLUMN;
        }

        var label = this._enumerator.currentGroupName()
        var textLayer = this.label(label, y - MARGIN_LABEL)
        layers.push(textLayer)

        y += this._enumerator.currentGroupHeight() + MARGIN_ROW;

        this._width = Math.max(this._width, x - MARGIN_COLUMN + PADDING_LEFT);
        this._height = y - MARGIN_ROW + PADDING_TOP;

        if (y + this._enumerator.nextGroupHeight() + PADDING_TOP > this._cutoffHeight) {
            break;
        }
    }

    return layers
}

Column.prototype.offsetX = function(x) {
    for (var i in this._layers) {
        var layer = this._layers[i];
        layer.frame().setX(layer.frame().x() + x);
    }
}

Column.prototype.offsetY = function(y) {
    for (var i in this._layers) {
        var layer = this._layers[i];
        layer.frame().setY(layer.frame().y() + y);
    }
}

Column.prototype.layers = function() {
    return this._layers;
}

Column.prototype.width = function() {
    return this._width;
}

Column.prototype.height = function() {
    return this._height;
}

Column.prototype.addToArtboard = function(artboard) {
    var layers = this.layers()
    for (var i in layers) {
        artboard.addLayer(layers[i])
    }
}

Column.prototype.label = function(text, y) {
    return this._context.sketch().createTextLayer(text, new Frame(PADDING_LEFT, y), LABEL_FONT_SIZE_GROUP)
}
