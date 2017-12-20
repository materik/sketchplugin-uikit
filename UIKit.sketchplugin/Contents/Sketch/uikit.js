
@import './config/uikit.js';
@import './config/uikit-alert.js';
@import './lib/alert.js';
@import './lib/artboard.js';
@import './lib/context.js';
@import './lib/foundation.js';
@import './lib/library.js';
@import './lib/sketch.js';
@import './lib/symbol.js';
@import './lib/symbol-group.js';
@import './lib/uikit.js';
@import './lib/utility.js';

var generateUIKit = function(context) {
    var _context = new Context(context);
    var alert = new UIKitConfigAlert(_context)
    if (alert.show()) {
        UIKit.generateInContext(_context)
        Sketch.alert(context, "UIKit was successfully generated")
    }
}

var cleanConfig = function(context) {
    UIKitConfig.clean()
    Sketch.alert(context, "Config was successfully cleaned")
}
