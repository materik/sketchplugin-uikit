
function Sketch(context) {
    this._doc = context.document;
}

Sketch.prototype.addBorderToLayer = function(layer, hex, thickness) {
    var border = layer.style().addStylePartOfType(1);
    border.color = new Color(hex).color
    border.thickness = thickness || 1;
    return layer;
}

Sketch.prototype.addFillToLayer = function(layer, hex) {
    var fill = layer.style().addStylePartOfType(0);
    fill.setFillType(0);
    fill.color = new Color(hex).color
    layer.setName(hex);
    return layer;
}

Sketch.prototype.alert = function(msg) {
    log(msg)
    this._doc.showMessage("🎨: " + msg);
}

Sketch.prototype.cleanPage = function(page) {
    var enumerator = page.layers().objectEnumerator()
    while (layer = enumerator.nextObject()) {
        page.removeLayer(layer);
    }
}

Sketch.prototype.createArtboard = function(name, frame) {
    frame = frame || new Frame()

    var artboard = MSArtboardGroup.new();
    artboard.setName(name);
    artboard.frame().setX(frame.x || 0)
    artboard.frame().setY(frame.y || 0)
    artboard.frame().setWidth(frame.width || 1);
    artboard.frame().setHeight(frame.height || 1);

    return artboard;
}

Sketch.prototype.createTextLayer = function(text, frame, fontSize) {
    frame = frame || new Frame()

    var layer = MSTextLayer.new();
    layer.setStringValue(text);
    layer.frame().setX(frame.x || 0)
    layer.frame().setY(frame.y || 0)
    layer.frame().setWidth(frame.width || 200);
    layer.frame().setHeight(frame.height || 30);
    layer.setFontSize(fontSize || 24)

    return layer;
}

Sketch.prototype.createLayer = function(artboard, frame, shape) {
    shape.frame().setX(frame.x || 0)
    shape.frame().setY(frame.y || 0)
    shape.frame().setWidth(frame.width || 1)
    shape.frame().setHeight(frame.height || 1)
    var layer = MSShapeGroup.shapeWithPath(shape)
    artboard.addLayer(layer)
    return layer;
}

Sketch.prototype.createOval = function(artboard, frame) {
    return this.createLayer(artboard, frame, MSOvalShape.new())
}

Sketch.prototype.createRectangle = function(artboard, frame) {
    return this.createLayer(artboard, frame, MSRectangleShape.new())
}

Sketch.prototype.createPage = function(name) {
    var page = this._doc.addBlankPage();
    page.setName(name);
    return page;
}

Sketch.prototype.deletePage = function(page) {
    this.alert("Delete page: \"" + page.name() + "\"")

    this._doc.removePage(page)
}

Sketch.prototype.getArtboard = function(page, name) {
    for (var i = 0; i < page.artboards().count(); i++) {
        var artboard = page.artboards().objectAtIndex(i);
        if (artboard.name() == name) {
            return artboard;
        }
    }
}

Sketch.prototype.getOrCreateArtboard = function(page, name) {
    var artboard = this.getArtboard(page, name);
    if (artboard == null) {
        return this.createArtboard(page, name);
    }
    return page;
}

Sketch.prototype.getOrCreatePage = function(name) {
    var page = this.getPage(name);
    if (page == null) {
        return this.createPage(name);
    }
    this._doc.setCurrentPage(page);
    return page;
}

Sketch.prototype.getPage = function(name) {
    for (var i = 0; i < this._doc.pages().count(); i++) {
        var page = this._doc.pages().objectAtIndex(i);
        if (page.name() == name) {
            this._doc.setCurrentPage(page);
            return page;
        }
    }
}
