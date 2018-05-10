sap.ui.define([
    "com/hzl/Controller/baseController",
    "com/hzl/Util/ajaxHandler",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(baseController, ajaxHandler, JSONModel, MessageBox) {
    "use strict";

    return baseController.extend("com.hzl.Controller.Logs.errLogs", {
        /** SAP UI5 life cycle method triggered on first load 
         *  @DefaultValue setting default value for date control 
         *  @Models viewModel for basic view operations and another i18n for ResourceModel
         *  @Method initialSettings for user data
         */
        onInit: function() {
            this.getView().setModel(new JSONModel({
            	userDetails : []
            }), "viewModel");    
            this.getView().byId("errDate").setValue(this.changeDateFormat(new Date()).slice(0, 10));
            this.oViewModel = this.getView().getModel("viewModel");
        	this.initialSettings();
        },

        /** @Function initialSettings to get user data
         */
        initialSettings: function() {
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/COMMON/QRY/XQRY_GetLoggedInUserDetails");
            oAjaxHandler.setProperties("Param.1", "10.101.23.146:50000/");
            oAjaxHandler.setCallBackSuccessMethod(this.successIniSttg, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestIniSttg, this);
            oAjaxHandler.triggerPostRequest();
        },

        /** @Function callback function for ajax success
         */
        successIniSttg: function(rs) {
            var viewModel = this.oViewModel.getData();
            viewModel.userDetails = rs;
            this.oViewModel.setData(viewModel);
        },

        /** @Function callback function for ajax fail
         */
        failRequestIniSttg: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
        },

        /** @Event search event name onSearch triggers when search button clicked
         *  @Validation validation for Empty mandatory fields
         *  @oAjaxHandler reusable ajax call
         */
        onSearch: function() {
            var date = this.getView().byId("errDate").getValue();
            if (date == "") {
            	sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));
                return;
            }
            this.startBusyIndicator();
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/COMMON/QRY/XQRY_SEL_ERRORLOG");
            oAjaxHandler.setProperties("Param.1", date + " 00:00:00");
            oAjaxHandler.setCallBackSuccessMethod(this.successSrch, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestScrch, this);
            oAjaxHandler.triggerPostRequest();
        },

        /** @Function callback function for ajax success
         */
        successSrch: function(rs) {
            this.getView().setModel(new JSONModel(rs), "tableModel");
            this.stopBusyIndicator();
        },

        /** @Function callback function for ajax fail
         */
        failRequestScrch: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
            this.stopBusyIndicator();
        }
    
    });

});