sap.ui.define([
    "com/hzl/Controller/baseController",
    "sap/ui/model/json/JSONModel",
    "com/hzl/Util/ajaxHandler",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "com/hzl/Util/myFormatter"
], function(baseController, JSONModel, ajaxHandler, MessageBox, Sorter, Export, ExportTypeCSV, myFormatter) {
    "use strict";
    return baseController.extend("com.hzl.Controller.SolSlurrReport.solSlurrReport", {

    	/** SAP UI5 life cycle method triggered on first load 
         *  @DefaultValue setting default value for date control 
         *  @Models viewModel for basic view operations and another i18n for ResourceModel
         *  @Method viewSettingInit method for instantiation view setting dialog , initialSettings for user data and role based visiblity
         */
        onInit: function() {
            this.getView().setModel(new JSONModel({
            	totalZincMic: "",
            	myEditData: [],
                enable: false,
                userDetails: [],
                visiblity: {
                	tableFieldEnabled: false,
                	updateSave: false,
                    updateCancel: false                    
                }
            }), "viewModel");
            this.oViewModel = this.getView().getModel("viewModel");
            this.getView().byId("SSRdate").setValue(this.changeDateFormat(new Date()).slice(0, 10));
            this.initialSettings();
            this.viewSettingInit();
        },        
        
        /** @Formatter loads the Formatter file
         */        
        formatter: myFormatter,        

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
            this.visiblitySettings();
        },

        /** @Function callback function for ajax fail
         */
        failRequestIniSttg: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
        },

        /** @Function visiblity setting based on roles
         */
        visiblitySettings: function() {
            var viewModel = this.oViewModel.getData();
            var myRole = viewModel.userDetails.Rowsets.Rowset[2].Row[3].ROLE;
            switch (myRole) {
	            case "ZNREC_LAB_ANALYST":
	            		this.getView().byId("SSR_Table").destroyColumns();
		                break;
	            case "ZNREC_LAB_SUP":
	            		this.getView().byId("SSR_Table").destroyColumns();
		                break;
	            case "ZNREC_READONLY":
	            		break;
	            case "ZNREC_REPORT_ANALYST":
		                viewModel.visiblity.updateCancel = true;
		                viewModel.visiblity.updateSave = true;   
		                viewModel.visiblity.tableFieldEnabled = true;
	                	break;
	            default:
		            	this.getView().byId("SSQS_Table").destroyColumns();
            }                                    
            this.oViewModel.setData(viewModel);
        },

        /** @Method called when reset button is clicked
         *  @Functinality resets the control data 
         */
        onReset: function() {
            this.getView().byId("SSRdate").setValue("");
            this.getView().byId("SSRplant").setSelectedKey(null);
        },

        /** @Event search event name onSearch triggers when search button clicked
         *  @Validation validation for Empty mandatory fields and reverse date
         */
        onSearch: function() {
            this.oViewModel.setProperty("/enable", false);
            var date = this.getView().byId("SSRdate");
            var plant = this.getView().byId("SSRplant");
            if (this.validation() > 0) {
            	sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));
                return;
            }
            this.startBusyIndicator();
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QTY_DIS");
            oAjaxHandler.setProperties("Param.1", date.getValue() + " 00:00:00");
            oAjaxHandler.setProperties("Param.2", plant.getValue());
            oAjaxHandler.setCallBackSuccessMethod(this.successSrch, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestScrch, this);
            oAjaxHandler.triggerPostRequest();
        },

        /** @Function callback function for ajax success
         * @initTableSetting initialisation of table as per requirement
         */
        successSrch: function(rs) {
        	this.getView().setModel(new JSONModel(), "tableModel");
    		if(rs.Rowsets.Rowset[1].Row["0"].SUCC_IND === 1){    			
                var myModel = new JSONModel();
                myModel.setData(rs);
                myModel.setSizeLimit(300);
                this.getView().setModel(myModel, "tableModel");
                this.initTableSetting();
                this.stopBusyIndicator();
                this.totalZincMic();
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
            var arr = ["SSRplant", "SSRdate"];
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

        /** @Event change event triggers when row data is changed
         */
        onRowChange: function(oEvent) {
            this.oViewModel.setProperty("/enable", true);
            this.onFieldChange(oEvent);
            var inc = 0;
            var editArr = this.oViewModel.getData();
            var rowData = oEvent.getSource().getParent().getBindingContext("tableModel");
            var myData = {
                ACT_VOL: rowData.getProperty("ACT_VOL"),
                EQP_DESC: rowData.getProperty("EQP_DESC"),
                EQP_FAC: rowData.getProperty("EQP_FAC"),
                EQP_NUM: rowData.getProperty("EQP_NUM"),
                EQP_TYP: rowData.getProperty("EQP_TYP"),
                GUID_FACTOR: rowData.getProperty("GUID_FACTOR"),
                GUID_QTY: rowData.getProperty("GUID_QTY"),
                PLANT_DESC: rowData.getProperty("PLANT_DESC"),
                PLANT_NUM: rowData.getProperty("PLANT_NUM"),
                STATUS_FACTOR: rowData.getProperty("STATUS_FACTOR"),
                STATUS_QTY: rowData.getProperty("STATUS_QTY"),
                STD_VOL: rowData.getProperty("STD_VOL"),
                S_DATE: rowData.getProperty("S_DATE"),
                ZN_CAL: rowData.getProperty("ZN_CAL"),
                ZN_MIC: rowData.getProperty("ZN_MIC")
            };

            if (editArr.myEditData.length === 0) {
                editArr.myEditData.push(myData);
            } else {
                for (var i = 0; i < editArr.myEditData.length; i++) {
                    if (editArr.myEditData[i].GUID_FACTOR === rowData.getProperty("GUID_FACTOR")) {
                        editArr.myEditData[i].ACT_VOL = rowData.getProperty("ACT_VOL");
                        editArr.myEditData[i].EQP_DESC = rowData.getProperty("EQP_DESC");
                        editArr.myEditData[i].EQP_FAC = rowData.getProperty("EQP_FAC");
                        editArr.myEditData[i].EQP_NUM = rowData.getProperty("EQP_NUM");
                        editArr.myEditData[i].EQP_TYP = rowData.getProperty("EQP_TYP");
                        editArr.myEditData[i].PLANT_DESC = rowData.getProperty("PLANT_DESC");
                        editArr.myEditData[i].PLANT_NUM = rowData.getProperty("PLANT_NUM");
                        editArr.myEditData[i].STATUS_FACTOR = rowData.getProperty("STATUS_FACTOR");
                        editArr.myEditData[i].STATUS_QTY = rowData.getProperty("STATUS_QTY");
                        editArr.myEditData[i].STD_VOL = rowData.getProperty("STD_VOL");
                        editArr.myEditData[i].S_DATE = rowData.getProperty("S_DATE");
                        editArr.myEditData[i].ZN_CAL = rowData.getProperty("ZN_CAL");
                        editArr.myEditData[i].ZN_MIC = rowData.getProperty("ZN_MIC");
                        inc++;
                    }
                }
                if (inc === 0) {
                    editArr.myEditData.push(myData);
                }
            }
            this.oViewModel.setData(editArr);
        },

        /** @Event press event trigger on clicking save button of page not add dialog
         *  @Visiblity setting visiblity of save and cancel button
         *  @Model getting the required data into model table getSelected item method
         *  @oAjaxHandler reusable ajax call
         */
        onUpdate: function() {
            this.startBusyIndicator();        	
            var tblData = 'Param.1={"Root":' + encodeURIComponent(JSON.stringify(this.oViewModel.getData().myEditData)) + '}';
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QTY_UPDATE");
            oAjaxHandler.setRequestData(tblData);
            oAjaxHandler.setCallBackSuccessMethod(this.successOnUpdate, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestOnUpdate, this);
            oAjaxHandler.triggerPostRequest();
            this.oViewModel.getData().myEditData = [];
        },

        /** @Function callback function for ajax success
         */
        successOnUpdate: function(rs) {
    		if(rs.Rowsets.Rowset[0].Row[0].QrySuccess === 1){
    			sap.m.MessageToast.show(rs.Rowsets.Rowset[0].Row[0].Succ_Err_Message);
                this.onSearch();
    		}else{
    			var rsp = {};
    			rsp.statusText = rs.Rowsets.Rowset["0"].Row["0"].Succ_Err_Message;
    			this.failRequestOnUpdate(rsp);
    		}             
            
        },

        /** @Function callback function for ajax fail
         */
        failRequestOnUpdate: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
            this.stopBusyIndicator();
        },

        /** @Event press event trigger on clicking cancel button
         */
        onCancel: function() {
            this.onSearch();
        },

        /** @Event press event triggers when view setting icon clicked on table header
         */
        handleViewSettings: function() {
            if (!this._settingDialog) {
                this._settingDialog = sap.ui.xmlfragment("com.hzl.view.SolSlurrReport.SolSlurrRptStgs", this);
                this._settingDialog.setModel(this.getView().getModel("i18n"));
            }
            this._settingDialog.open();
        },

        /** @Event press event triggers when view setting parameters are set
         * @initTableSetting initialisation of table as per requirement
         */
        handleConfirm: function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("SSR_Table");
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
            this.initTableSetting();
        },

        /** @Function to instantiation of view setting dialog
         */
        viewSettingInit: function() {
            this.mGroupFunctions = {
                EQP_DESC: function(oContext) {
                    var name = oContext.getProperty("EQP_DESC");
                    return {
                        key: name,
                        text: name
                    };
                },
                STD_VOL: function(oContext) {
                    var name = oContext.getProperty("STD_VOL");
                    return {
                        key: name,
                        text: name
                    };
                },
                EQP_FAC: function(oContext) {
                    var name = oContext.getProperty("EQP_FAC");
                    return {
                        key: name,
                        text: name
                    };
                },
                ACT_VOL: function(oContext) {
                    var name = oContext.getProperty("ACT_VOL");
                    return {
                        key: name,
                        text: name
                    };
                },
                ZN_CAL: function(oContext) {
                    var name = oContext.getProperty("ZN_CAL");
                    return {
                        key: name,
                        text: name
                    };
                },
                ZN_MIC: function(oContext) {
                    var name = oContext.getProperty("ZN_MIC");
                    return {
                        key: name,
                        text: name
                    };
                }
            };
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
                    name: "Samples",
                    template: {
                        content: "{EQP_DESC}"
                    }
                }, {
                    name: "Standard",
                    template: {
                        content: "{STD_VOL}"
                    }
                }, {
                    name: "Factor",
                    template: {
                        content: "{EQP_FAC}"
                    }
                }, {
                    name: "Actual Volume",
                    template: {
                        content: "{ACT_VOL}"
                    }
                }, {
                    name: "Zn gpl/wt %",
                    template: {
                        content: "{ZN_CAL}"
                    }
                }, {
                    name: "Zn MIC(tons)",
                    template: {
                        content: "{ZN_MIC}"
                    }
                }]
            });

            oExport.saveFile().catch(function(oError) {
                MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("expoErrorAlert") + oError);
            }).then(function() {
                oExport.destroy();
            });
        },

        /** @Function use for initial setting of table fields enabling ,disabling and coloring cells text as per requirement
         */
        initTableSetting: function() {
            var myTable = this.getView().byId("SSR_Table");
            for (var i = 0; i < myTable.getItems().length; i++) {
                if (myTable.getItems()[i].getMetadata().getElementName() === "sap.m.GroupHeaderListItem") {
                    continue;
                }                
                if (myTable.getItems()[i].getCells()[6].getText() === "TH5") {                
                	for(var j=0; j < myTable.getItems()[i].getCells().length ;j++){
                		myTable.getItems()[i].getCells()[j].addStyleClass("dykeThickner");
                	}                	                	
                }else if(myTable.getItems()[i].getCells()[6].getText() === "RE"){                	
                	for(var n=0; n < myTable.getItems()[i].getCells().length ;n++){
                		myTable.getItems()[i].getCells()[n].addStyleClass("reactor");
                	}                    	
                }else if(myTable.getItems()[i].getCells()[6].getText().slice(0,2) === "TH"){                	
                	for(var m=0; m < myTable.getItems()[i].getCells().length ;m++){
                		myTable.getItems()[i].getCells()[m].addStyleClass("thickner");
                	}                    	
                } else {                	
                	for(var k=0; k < myTable.getItems()[i].getCells().length ;k++){
                		myTable.getItems()[i].getCells()[k].addStyleClass("tank");
                	}                	                	
                }
            }
        },
        
        /** @Function for input field validation
         */
        onFieldChange: function(oEvent) {
            this.oViewModel.getData().quantityChanged++;
            var result = isNaN(parseFloat(oEvent.getParameter("newValue")));
            if(oEvent.getParameter("newValue").slice(-1) !== "."){
	            if(result === false){
	            	oEvent.getSource().setValue(parseFloat(oEvent.getParameter("newValue")));
	            }else{
	            	oEvent.getSource().setValue("0");
	            }
            }
        },

        /** @Function to set the value of Total zinc MIC at table header
         */
        totalZincMic: function(){
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_TOTAL_ZN");
            oAjaxHandler.setProperties("Param.1", this.getView().byId("SSRdate").getValue() + " 00:00:00");
            oAjaxHandler.setProperties("Param.2", this.getView().byId("SSRplant").getValue());
            oAjaxHandler.setCallBackSuccessMethod(this.successTotalZincMic, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestTotalZincMic, this);
            oAjaxHandler.triggerPostRequest();           
        },

        /** @Function callback function for ajax success
         */
        successTotalZincMic: function(rs) {
            var viewModel = this.oViewModel.getData(); 
            viewModel.totalZincMic = rs.Rowsets.Rowset["0"].Row["0"].TOTAL_ZN_MIC;
            this.oViewModel.setData(viewModel);
        },

        /** @Function callback function for ajax fail
         */
        failRequestTotalZincMic: function(rs) {
            sap.m.MessageBox.alert(rs.statusText);
        }

    });

});