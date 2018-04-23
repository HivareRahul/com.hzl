sap.ui.define([
    "com/hzl/Controller/baseController"
], function(baseController) {
    "use strict";

    return baseController.extend("com.hzl.Controller.Dashboard.dashboard", {

        onInit: function() {},

        /** An event press. Its name is onTileClick
         * @event triggers when tile is pressed and routes to other view
         */
        onTileClick: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (oEvent.getSource().getCustomData()[0].getValue() === "fromFluTrnsReport") {
                oRouter.navTo("FTR");
            } else if (oEvent.getSource().getCustomData()[0].getValue() === "fromFluTransQualEntry") {
                oRouter.navTo("fluTrnsQulEntry");
            } else if (oEvent.getSource().getCustomData()[0].getValue() === "fromFluTransQualAnalEntry") {
                oRouter.navTo("FTQAE");
            } else if (oEvent.getSource().getCustomData()[0].getValue() === "solSlurrQualScrn") {
                oRouter.navTo("solSlurrQualScrn");
            } else if (oEvent.getSource().getCustomData()[0].getValue() === "solSlurrReport") {
                oRouter.navTo("solSlurrReport");
            } else if (oEvent.getSource().getCustomData()[0].getValue() === "errLogs") {
                oRouter.navTo("errLogs");
            }
        }
    });

});