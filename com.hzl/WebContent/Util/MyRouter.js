sap.ui.define([
    "sap/ui/core/routing/Router",
    "sap/m/routing/RouteMatchedHandler"
], function(Router) {
    "use strict";

    return Router.extend("com.hzl.Util.MyRouter", {
        /** 
         * @Function creates the router constructor
         */
        constructor: function() {
            sap.ui.core.routing.Router.apply(this, arguments);
            this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this);
        },

        /** 
         * @Function destroys router
         */
        destroy: function() {
            sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
            this._oRouteMatchedHandler.destroy();
        }
    });
});