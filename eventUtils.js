/**
 * event compatible
 * @authors safilo (wulinqing@hotmail.com)
 * @date    2016-06-02 20:20:28
 * @version 1.0.0
 */
Function.prototype.myBind = function myBind(context) {
    if ("bind" in Function.prototype) {
        return this.bind.apply(this, Array.prototype.slice.call(arguments, 0));
    }
    //IE 6~8
    var _this = this;
    var outerArg = Array.prototype.slice.call(arguments, 1);
    return function() {
        var innerArg = Array.prototype.slice.call(arguments, 0);
        _this.apply(context,outerArg.concat(innerArg));
    };
};

var eventUtils = {
    /*
     * bind：DOM2 event binding, compatible with all browsers, solved the problem of THIS and duplication
     * @param curEle [object] ->Elements to be operated at
     * @param type [string] ->Event type that needs to be bound
     * @param fn [function] ->Method to bind
     * by safilo on 2016/06/02
     */
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            !element["myEvent" + type] ? (element["myEvent" + type] = []) : null;
            var ary = element["myEvent" + type];

            for (var i = 0, len = ary.length; i < len; i++) {
                if (ary[i].photo === handler) {
                    return;
                }
            }
            var tempFn = handler.myBind(element);
            tempFn.photo = handler;
            ary.push(tempFn);

            element.attachEvent("on" + type, tempFn);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.attaachEvent) {
            var ary = element["myEvent" + type];
            if (ary) {
                for (var i = 0, len = ary.length; i < len; i++) {
                    if (ary[i].photo === handler) {
                        element.dettachEvent("on" + type, tempFn);
                        ary.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            element["on" + type] = null;
        }
    }
};
