
var SEP = "/"
var MARGIN = 100

var align = function(context) {
  var doc = context.document
  var layers = doc.currentPage().layers()

  var layersMeta1 = []
  var layersMeta2 = []

  for (i = 0; i < layers.length; i++) {
    var added = false
    var layer = layers[i]
    var name = layer.name()
    var split = name.split(SEP)

    for (var j = 0; j < split.length - 1; j++) {
      var index = platformIndex(split[j]);
      if (index > 0) {
        added = true
        layersMeta1.push({
          layer: layer,
          name: split.slice(j + 1, split.length).join(SEP),
          platformIndex: index,
        });

        break;
      }
    }

    if (!added) {
      layersMeta2.push({
        layer: layer,
        name: name,
      });
    }
  }

  var pos = {x: 0, y: 0}
  pos = sort1(layersMeta1, pos)
  pos = sort2(layersMeta2, pos)
};

var sort1 = function(layersMeta, pos) {
  var tX = pos.x
  var tY = pos.y
  var maxHeight = 0
  var groupName = null

  layersMeta.sort(function(a, b) {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    if (a.platformIndex < b.platformIndex) return -1
    if (a.platformIndex > b.platformIndex) return 1
    return 0
  });

  for (var i = 0; i < layersMeta.length; i++) {
    var meta = layersMeta[i];
    var layer = meta.layer;
    
    if (groupName != meta.name) {
      groupName = meta.name
      tY = i > 0 || tY > 0 ? tY + maxHeight + MARGIN : 0
      tX = 0
      maxHeight = 0
    }

    layer.frame().x = tX
    layer.frame().y = tY
    tX += layer.frame().width() + MARGIN
    maxHeight = layer.frame().height() > maxHeight ? layer.frame().height() : maxHeight
  }


  // NOTE(materik): Added some extra margin to separate it from the rest.
  return {x: tX, y: tY + maxHeight + MARGIN}
}

var sort2 = function(layersMeta, pos) {
  var tX = pos.x
  var tY = pos.y
  var maxHeight = 0
  var groupName = null

  layersMeta.sort(function(a, b) {
    if(a.name < b.name) return -1
    if(a.name > b.name) return 1
    return 0
  });

  for (var i = 0; i < layersMeta.length; i++) {
    var l = layersMeta[i]

    if (l.name.split(SEP).length > 1) {
      var lastPart = l.name.split(SEP)[l.name.split(SEP).length - 1];
      var layerGroupName = l.name.replace(lastPart, "");
    } else {
      var layerGroupName = l.name;
    }

    if (groupName != layerGroupName) {
      groupName = layerGroupName
      tY = i > 0 || tY > 0 ? tY + maxHeight + MARGIN : 0
      tX = 0
      maxHeight = 0
    }

    l.layer.frame().x = tX
    l.layer.frame().y = tY
    tX += l.layer.frame().width() + MARGIN
    maxHeight = l.layer.frame().height() > maxHeight ? l.layer.frame().height() : maxHeight
  }

  return {x: tX, y: tY + maxHeight}
}

var platformIndex = function(platform) {
  if (platform == "Desktop") return 1
  if (platform == "Tablet") return 2
  if (platform == "Mobile") return 3
  return -1
}
