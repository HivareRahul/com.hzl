sap.ui.define([
    "com/hzl/Controller/baseController",
    "sap/ui/model/json/JSONModel",
    "com/hzl/Util/ajaxHandler",
    "sap/m/TablePersoController",
    "com/hzl/Controller/Leaching/SD_RptEtry_PersoService",
    "com/hzl/Controller/Leaching/SD_SftAvg_PersoService",
    "com/hzl/Controller/Leaching/SD_SftVlu_PersoService",
    "com/hzl/Util/myFormatter"
], function(baseController, JSONModel, ajaxHandler, TablePersoController, SD_RptEtry_PersoService, SD_SftAvg_PersoService, SD_SftVlu_PersoService, myFormatter) {
    "use strict";
    return baseController.extend("com.hzl.Controller.Leaching.shiftDetails", {
        /** SAP UI5 life cycle method triggered on first load 
         * @Functionality instantiated the router to get the navigated data
         * @Function initPersonas called to initialisation of all personas belong to this screen
         * @Models viewModel for basic view operations
         */
        onInit: function() {
            this.getView().setModel(new JSONModel({
                userDetails: []
            }), "viewModel");
            this.oViewModel = this.getView().getModel("viewModel");
            this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
            this.initPersonas();
        },
        
        /** @Formatter loads the Formatter file
         */        
        formatter: myFormatter,        

        /** @Validation first verifies navigated data present or not
         *  @Model initialise shtVluTblModel and headerModel model
         *  @oAjaxHandler reusable ajax call
         */
        onRouteMatched: function(oEvent) {
            if (!oEvent.getParameter("arguments").shiftData) {
                return;
            } else {
                this.startBusyIndicator();
                this.getView().setModel(new JSONModel({}), "shtVluTblModel");
                var patterData = JSON.parse(atob(oEvent.getParameter("arguments").shiftData));

                var oAjaxHandler = ajaxHandler.getInstance();
                oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_REPORT_PSHIFT_DIS");
                oAjaxHandler.setProperties("Param.1", patterData.first);
                oAjaxHandler.setProperties("Param.2", patterData.second);
                oAjaxHandler.setProperties("Param.3", patterData.third);
                oAjaxHandler.setProperties("Param.4", patterData.fourth);
                oAjaxHandler.setProperties("Param.5", patterData.fifth);
                oAjaxHandler.setProperties("Param.6", patterData.sixth);
                oAjaxHandler.setCallBackSuccessMethod(this.successTab1, this);
                oAjaxHandler.setCallBackFailureMethod(this.failRequestTab1, this);
                oAjaxHandler.triggerPostRequest();

                this.getView().setModel(new JSONModel([{
                    Date: patterData.headerData.Date,
                    MaterialQuantity: patterData.headerData.MaterialQuantity,
                    QuantityUOM: patterData.headerData.QuantityUOM,
                    ZnMIC: patterData.headerData.ZnMIC,
                    ZnMICUOM: patterData.headerData.ZnMICUOM,
                    ZnGPL: patterData.headerData.ZnGPL,
                    ZnGPLUOM: patterData.headerData.ZnGPLUOM,
                    ZnVol: patterData.headerData.ZnVol,
                    ZnVolUOM: patterData.headerData.ZnVolUOM,
                    MaterialTransferedFromPlant: patterData.headerData.MaterialTransferedFromPlant,
                    MaterialTranferedToPlant: patterData.headerData.MaterialTranferedToPlant,
                    MaterialTransferedFrom: patterData.headerData.MaterialTransferedFrom,
                    MaterialTransferedTo: patterData.headerData.MaterialTransferedTo
                }]), "headerModel");

            }

        },

        /** @Function callback function for ajax success
         * @Method initialSettings for user data and role based visiblity
         */
        successTab1: function(rs) { 
        	this.getView().setModel(new JSONModel(), "sftAvgTblModel");
    		if(rs.Rowsets.Rowset[1].Row["0"].SUCC_IND === 1){
                this.getView().setModel(new JSONModel(rs), "sftAvgTblModel");
                this.initialSettings();
                this.stopBusyIndicator();
    		}else{
    			var rsp = {};
    			rsp.statusText = rs.Rowsets.Rowset[1].Row["0"].SUCC_MESS;
    			this.failRequestTab1(rsp);
                this.initialSettings();    			
    		}              
        },

        /** @Function callback function for ajax fail
         */
        failRequestTab1: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
            this.stopBusyIndicator();
        },

        /** @Return returns the router
         */
        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        /** @Event selectionChange event triggered after clicking on a table row based on that other table data loaded
         *  @oAjaxHandler reusable ajax call
         */
        tableOneSelect: function(oEvent) {
            this.getView().byId("shtVluTbl").setBusy(true);
            jQuery.sap.delayedCall(2000, this, function() {
                this.getView().byId("shtVluTbl").setBusy(false);
            });
            var row = oEvent.getParameter("listItem").getBindingContext("sftAvgTblModel");
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_REPORT_SHIFT_DET_DIS");
            oAjaxHandler.setProperties("Param.1", row.getProperty("S_DATE"));
            oAjaxHandler.setProperties("Param.2", row.getProperty("SHIFT"));
            oAjaxHandler.setProperties("Param.3", row.getProperty("TO_MAT_DESC"));
            oAjaxHandler.setProperties("Param.4", row.getProperty("FRM_MAT_NUM"));
            oAjaxHandler.setProperties("Param.5", row.getProperty("TO_MAT_NUM"));
            oAjaxHandler.setProperties("Param.6", row.getProperty("TO_PLANT_NUM"));
            oAjaxHandler.setProperties("Param.7", row.getProperty("FRM_PLANT_NUM"));
            oAjaxHandler.setProperties("Content-Type", "text/json");
            oAjaxHandler.setCallBackSuccessMethod(this.successTab2, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestTab2, this);
            oAjaxHandler.triggerPostRequest();

        },

        /** @Function callback function for ajax success
         */
        successTab2: function(rs) {
            this.getView().setModel(new JSONModel(), "shtVluTblModel");
    		if(rs.Rowsets.Rowset[1].Row["0"].SUCC_IND === 1){
    			this.getView().setModel(new JSONModel(rs), "shtVluTblModel");
    		}else{
    			var rsp = {};
    			rsp.statusText = rs.Rowsets.Rowset[1].Row["0"].SUCCERR_MESSAGE;
    			this.failRequestTab2(rsp); 			
    		}              
        },

        /** @Function callback function for ajax fail
         */
        failRequestTab2: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
        },

        /** @Function function for initialisation of persona's
         */
        initPersonas: function() {
            this._oTPC_rptEty = new TablePersoController({
                table: this.getView().byId("repEtryTbl"),
                componentName: "repEtryTbl",
                persoService: SD_RptEtry_PersoService
            }).activate();
            this._oTPC_sftAvg = new TablePersoController({
                table: this.getView().byId("sftAvgTbl"),
                componentName: "sftAvgTbl",
                persoService: SD_SftAvg_PersoService
            }).activate();
            this._oTPC_sftVlu = new TablePersoController({
                table: this.getView().byId("shtVluTbl"),
                componentName: "shtVluTbl",
                persoService: SD_SftVlu_PersoService
            }).activate();
        },

        /** @Event press event triggers when setting icon clicked on table report entry header
         */
        onPersoButtonPressedRepEtry: function() {
            this._oTPC_rptEty.openDialog();
        },

        /** @Event press event triggers when setting icon clicked on table Shift average header
         */
        onPersoButtonPressedSftAvg: function() {
            this._oTPC_sftAvg.openDialog();
        },

        /** @Event press event triggers when setting icon clicked on table Shift Value header
         */
        onPersoButtonPressedSftVlu: function() {
            this._oTPC_sftVlu.openDialog();
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
        }
    });
});