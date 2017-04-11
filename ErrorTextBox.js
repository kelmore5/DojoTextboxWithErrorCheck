require(['dijit/form/TextBox', 'dojo/_base/lang', 'dojo/_base/Deferred', 'dijit/Dialog'],
    function(TextBox, lang, Deferred, Dialog) {

        //Extends the TextBox class to include error message handling
        lang.extend(TextBox, {
            rowIndex: 0,
            errorMessage: undefined,

            //What needs to be checked for all textboxes
            //Optional error message argument to replace default
            checkValue: function (errorMessage) {
                var deferred = new Deferred();
                var _this = this;

                if (_this.maxLength) {
                    if (_this.get("value").length > _this.maxLength) {
                        var errorMessage2 = _this.title + " name is too long. The max length for " + _this.title + " is " + _this.maxLength + " characters.";
                        deferred.resolve({success: _this.changeState(false, errorMessage2)});
                        return deferred.promise;
                    }
                }

                _this.extraValueCheck().then(function () {
                    deferred.resolve({success: _this.changeState(true)});
                }, function (err) {
                    deferred.reject({success: _this.changeState(false, errorMessage)});
                });

                return deferred.promise;
            },

            //An extra value check for textboxes
            //Can be set to whatever the developer wants
            //In other words: checkValue runs, and then whatever
            //function is in extraValueCheck is run
            //Just make sure extraValueCheck returns a deferred.promise value
            //Maybe turn into event later
            extraValueCheck: function () {
                var deferred = new Deferred();
                var _this = this;
                _this.get("state") != "Error" ? deferred.resolve({success: true}) : deferred.reject({success: _this.changeState(false)});
                return deferred.promise;
            },

            //Checks the state of the widget
            //Takes in boolean operator and prints out (optional) error message
            //if boolean returned false
            //Used in changeMode.jsp
            changeState: function (bool, errorMessage) {
                var _this = this;

                if (bool) {
                    _this.state = "Success";
                } else {
                    _this.state = "Error";
                    if (errorMessage) {
                        _this.showErrorMessage(errorMessage);
                    } else if (_this.errorMessage) {
                        _this.showErrorMessage(_this.errorMessage);
                    }
                }

                return bool;
            },

            showErrorMessage: function (errorMessage) {
                this.showErrorDialog(errorMessage);
            },

            /**
             * Creates an error dialog with an ok button
             * @param text The text to put in the dialog
             */
            showErrorDialog: function (text) {
                new Dialog({
                    title: "Error",
                    content: text
                }).show();
            }
        });
    }
);
