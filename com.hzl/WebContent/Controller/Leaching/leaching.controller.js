sap.ui.define([
    "com/hzl/Controller/baseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/TablePersoController",
    "com/hzl/Controller/Leaching/leachingPersoService",
    "sap/ui/model/Sorter",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "com/hzl/Util/ajaxHandler",
    "com/hzl/Util/myFormatter"
], function(baseController, Filter, FilterOperator, TablePersoController, leachingPersoService, Sorter, Export, ExportTypeCSV, MessageBox, JSONModel, ResourceModel, ajaxHandler, myFormatter) {
    "use strict";

    return baseController.extend("com.hzl.Controller.Leaching.leaching", {
        /** SAP UI5 life cycle method triggered on first load 
         *  @DefaultValue setting default value for date control 
         *  @TablePersoController creating TablePersoController for table
         *  @Models viewModel for basic view operations and another i18n for ResourceModel
         *  @Method initialSettings for user data and role based visiblity 
         */
        onInit: function() {
            this.getView().setModel(new JSONModel({
                userDetails: []
            }), "viewModel");
            this.oViewModel = this.getView().getModel("viewModel");
            this.initialSettings();
            this.getView().byId("toDate").setValue(this.changeDateFormat(new Date()).slice(0, 10));
            this.getView().byId("frmDate").setValue(this.changeDateFormat(new Date(new Date().setDate(new Date().getDate() - 2))).slice(0, 10));
            this._oTPC = new TablePersoController({
                table: this.getView().byId("FTR_Table"),
                componentName: "leachingRecords",
                persoService: leachingPersoService
            }).activate();
            this.viewSettingInit();
            this.getView().setModel(new ResourceModel({
                bundleUrl: "i18n/messageBundle.properties"
            }), "i18n");
        },
        
        /** @Formatter loads the Formatter file
         */        
        formatter: myFormatter,        

        /** @Event press event triggers when setting icon clicked on table header
         */
        onPersoButtonPressed: function() {
            this._oTPC.openDialog();
        },

        /** @Event press event triggers to refresh persona 
         */
        onTablePersoRefresh: function() {
            leachingPersoService.resetPersData();
            this._oTPC.refresh();
        },

        /** @Event press event triggers to get selected persona items
         */
        onTableGrouping: function(oEvent) {
            this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
        },

        /** @Event itemPress event triggered after clicking on a table row
         *  @Functionality gets the selected row data and navigates with that data 
         */
        vendorSelect: function(oEvent) {
            var row = oEvent.getParameter("listItem").getBindingContext("tableModel");
            var patternData = {
                first: row.getProperty("S_DATE"),
                second: row.getProperty("TO_MAT_DESC"),
                third: row.getProperty("FRM_MAT_NUM"),
                fourth: row.getProperty("TO_MAT_NUM"),
                fifth: row.getProperty("TO_PLANT_NUM"),
                sixth: row.getProperty("FRM_PLANT_NUM"),
                headerData: {
                    Date: row.getProperty("S_DATE"),
                    MaterialQuantity: row.getProperty("TOTAL_QTY"),
                    QuantityUOM: "m3",
                    ZnMIC: row.getProperty("TOTAL_ZN_MIC"),
                    ZnMICUOM: "MIC",
                    ZnGPL: row.getProperty("AVG_ZN_GPL"),
                    ZnGPLUOM: "GPL",
                    ZnVol: row.getProperty("TOTAL_ZN_VOL"),
                    ZnVolUOM: "m3",
                    MaterialTransferedFromPlant: row.getProperty("FRM_PLANT_DESC"),
                    MaterialTranferedToPlant: row.getProperty("TO_PLANT_DESC"),
                    MaterialTransferedFrom: row.getProperty("FRM_MAT_DESC"),
                    MaterialTransferedTo: row.getProperty("TO_MAT_DESC")
                }
            };
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("shiftDetails", {
                shiftData: btoa(JSON.stringify(patternData))
            });
        },


        /** @Event press event triggers when view setting parameters are set
         */
        handleConfirm: function(oEvent) {

            var oView = this.getView();
            var oTable = oView.byId("FTR_Table");

            var mParams = oEvent.getParameters();
            var oBinding = oTable.getBinding("items");

            var sPath;
            var bDescending;
            var vGroup;
            var aSorters = [];
            if (mParams.groupItem) {
                sPath = mParams.groupItem.getKey();
                bDescending = mParams.groupDescending;
                vGroup = this.mGroupFunctions[sPath];
                aSorters.push(new Sorter(sPath, bDescending, vGroup));
            }
            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
        },

        /** @Event press event triggers when view setting icon clicked on table header
         */
        handleViewSettings: function() {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("com.hzl.view.Leaching.leachingStgs", this);
                this._oDialog.setModel(this.getView().getModel("i18n"), "i18n");
            }
            this._oDialog.open();
        },

        /** @Event press event triggers when import icon clicked on table header to export in CSV file
         */
        onDataExport: function() {
            var that = this;
            var oExport = new Export({
                exportType: new ExportTypeCSV({}),
                models: this.getView().getModel("tableModel"),
                rows: {
                    path: "/Rowsets/Rowset/0/Row/"
                },
                columns: [{
                    name: "Date",
                    template: {
                        content: "{S_DATE}"
                    }
                }, {
                    name: "Quality in m3",
                    template: {
                        content: "{TOTAL_QTY}"
                    }
                }, {
                    name: "MIC Zn in MT",
                    template: {
                        content: "{TOTAL_ZN_MIC}"
                    }
                }, {
                    name: "Zn in GPL",
                    template: {
                        content: "{AVG_ZN_GPL}"
                    }
                }, {
                    name: "Zn Vol in m3",
                    template: {
                        content: "{TOTAL_ZN_VOL}"
                    }
                }, {
                    name: "Material Transfered from Plant",
                    template: {
                        content: "{FRM_PLANT_DESC} - {FRM_PLANT_NUM}"
                    }
                }, {
                    name: "Material Transfered to plant",
                    template: {
                        content: "{TO_PLANT_DESC} - {TO_PLANT_NUM}"
                    }
                }, {
                    name: "Material Transfered from",
                    template: {
                        content: "{FRM_MAT_DESC} - {FRM_MAT_NUM}"
                    }
                }, {
                    name: "Material Transfered To",
                    template: {
                        content: "{TO_MAT_DESC} - {TO_MAT_NUM}"
                    }
                }]
            });

            oExport.saveFile().catch(function(oError) {
                MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("expoErrorAlert") + oError);
            }).then(function() {
                oExport.destroy();
            });
        },

        /** @Event search event name onSearch triggers when search button clicked
         *  @Validation validation for Empty mandatory fields and reverse date
         *  @oAjaxHandler reusable ajax call
         */
        onSearch: function() {
            var fromDate = this.getView().byId("frmDate").getValue() + " 00:00:00";
            var toDate = this.getView().byId("toDate").getValue() + " 23:59:59";
            var plant = this.getView().byId("plant");
            if (this.validation() > 0) {
            	sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));
                return;
            }
            if (Date.parse(fromDate.slice(0, 10) + " " + fromDate.slice(11).split("-").join(":")) >= Date.parse(toDate.slice(0, 10) + " " + toDate.slice(11).split("-").join(":"))) {
            	sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("dateAlert"));
                return;
            }
            this.startBusyIndicator();
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_REPORT_MAIN_DIS");
            oAjaxHandler.setProperties("Param.1", fromDate);
            oAjaxHandler.setProperties("Param.2", toDate);
            oAjaxHandler.setProperties("Param.3", plant.getValue());
            oAjaxHandler.setCallBackSuccessMethod(this.successSrch, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestScrch, this);
            oAjaxHandler.triggerPostRequest();
        },

        /** @Function callback function for ajax success
         */
        successSrch: function(rs) {
    		if(rs.Rowsets.Rowset[1].Row["0"].SUCC_IND === 1){
                this.getView().setModel(new JSONModel(rs), "tableModel");
                this.stopBusyIndicator();
    		}else{
    			var rsp = {};
    			rsp.statusText = rs.Rowsets.Rowset[1].Row["0"].SUCCERR_MESSAGE;
    			this.failRequestScrch(rsp);
    		}             
        },

        /** @Function callback function for ajax fail
         */
        failRequestScrch: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
            this.stopBusyIndicator();
        },

        /** @Function validation for empty data in mandatory fields
         *  @Return numeric value
         */
        validation: function() {
            var that = this;
            var result = 0;
            var arr = ["frmDate", "toDate", "plant"];
            arr.forEach(function(items) {
                if (that.getView().byId(items).getValue() == "") {
                    that.getView().byId(items).setValueState("Error");
                    result++;
                } else {
                    that.getView().byId(items).setValueState("None");
                }
            });
            return result;
        },

        /** @Method called when reset button is clicked
         *  @Functinality resets the control data 
         */
        onReset: function() {
            var arr = ["frmDate", "toDate"];
            for (var i = 0; i < arr.length; i++) {
                this.getView().byId(arr[i]).setValue("");
            }
            this.getView().byId("plant").setSelectedKey(null);
        },

        /** @Function to instantiation of view setting dialog
         */
        viewSettingInit: function() {
            this.mGroupFunctions = {
                S_DATE: function(oContext) {
                    var name = oContext.getProperty("S_DATE");
                    return {
                        key: name,
                        text: name
                    };
                },
                TOTAL_QTY: function(oContext) {
                    var name = oContext.getProperty("TOTAL_QTY");
                    return {
                        key: name,
                        text: name
                    };
                },
                TOTAL_ZN_MIC: function(oContext) {
                    var name = oContext.getProperty("TOTAL_ZN_MIC");
                    return {
                        key: name,
                        text: name
                    };
                },
                AVG_ZN_GPL: function(oContext) {
                    var name = oContext.getProperty("AVG_ZN_GPL");
                    return {
                        key: name,
                        text: name
                    };
                },
                TOTAL_ZN_VOL: function(oContext) {
                    var name = oContext.getProperty("TOTAL_ZN_VOL");
                    return {
                        key: name,
                        text: name
                    };
                },
                FRM_PLANT_NUM: function(oContext) {
                    var name = oContext.getProperty("FRM_PLANT_NUM");
                    return {
                        key: name,
                        text: name
                    };
                },
                TO_PLANT_NUM: function(oContext) {
                    var name = oContext.getProperty("TO_PLANT_NUM");
                    return {
                        key: name,
                        text: name
                    };
                },
                FRM_MAT_NUM: function(oContext) {
                    var name = oContext.getProperty("FRM_MAT_NUM");
                    return {
                        key: name,
                        text: name
                    };
                },
                TO_MAT_NUM: function(oContext) {
                    var name = oContext.getProperty("TO_MAT_NUM");
                    return {
                        key: name,
                        text: name
                    };
                }
            };
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