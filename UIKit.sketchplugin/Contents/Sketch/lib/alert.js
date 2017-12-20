
function Alert() {
    this._alert = COSAlertWindow.new();
}

Alert.prototype.show = function() {
    var responseCode = this._alert.runModal()
    return responseCode === 1000;
}

Alert.prototype.setTitleLabel = function(title) {
    this._alert.setMessageText(title);
}

Alert.prototype.addMessageLabel = function(message) {
    this._alert.addTextLabelWithValue(message);
}

Alert.prototype.addButton = function(title) {
    this._alert.addButtonWithTitle(title);
}

Alert.prototype.addTextFieldInput = function(text) {
    var index = this._alert.views().length
    this._alert.addTextFieldWithValue(text || '');
    var input = this._alert.viewAtIndex(index)
    input.setWidth(200)
    return input
}

Alert.prototype.addCheckboxInput = function(title) {
    var button = NSButton.alloc().initWithFrame(NSMakeRect(0,0,200,25));
    button.setButtonType(NSSwitchButton);
    button.setTitle(title);

    this._alert.addAccessoryView(button);

    return button;
}

Alert.prototype.addSelectInput = function(options, selectedItemIndex) {
    var input = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25));
    input.i18nObjectValues = options;
    input.setEditable(false);
    input.addItemsWithObjectValues(options);

    if (selectedItemIndex !== undefined) {
        input.selectItemAtIndex(selectedItemIndex);   
    }

    this._alert.addAccessoryView(input);

    return input;
}
