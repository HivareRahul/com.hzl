sap.ui.define([
    "com/hzl/Controller/baseController",
    "sap/m/MessageBox",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "com/hzl/Util/ajaxHandler",
    "sap/ui/model/Sorter",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV"
], function(baseController, MessageBox, ResourceModel, JSONModel, ajaxHandler, Sorter, Export, ExportTypeCSV) {
    "use strict";

    return baseController.extend("com.hzl.Controller.SolSlurrQualScrn.solSlurrQualScrn", {

        /** SAP UI5 life cycle method triggered on first load 
         *  @DefaultValue setting default value for date control 
         *  @Visiblity hiding and showing controls based on requirement
         *  @Models i18n for ResourceModel and viewModel for basic view operations
         *  @Method viewSettingInit method for instantiation for view setting dialog and initialSettings for user data and role based visiblity
         */
        onInit: function() {
            this.getView().setModel(new JSONModel({
                enable: false,
                userDetails: [],
                myEditData: [],
                visiblity: {
                    tableFieldEditable: false,
                	updateSave: false,
                    updateCancel: false
                }
            }), "viewModel");
            this.oViewModel = this.getView().getModel("viewModel");
            this.initialSettings();
            this.getView().byId("SSQSdate").setValue(this.changeDateFormat(new Date()).slice(0, 10));
            this.getView().setModel(new ResourceModel({
                bundleUrl: "i18n/messageBundle.properties"
            }), "i18n");
            this.viewSettingInit();
        },

        /** @Event search event name onSearch triggers when search button clicked
         *  @Validation validation for Empty mandatory fields and reverse date
         */
        onSearch: function() {
            this.oViewModel.setProperty("/enable", false);
            var date = this.getView().byId("SSQSdate");
            var plant = this.getView().byId("SSQSplant");
            if (this.validation() > 0) {
            	sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));
                return;
            }
            this.startBusyIndicator();
            var oAjaxHandler = ajaxHandler.getInstance();
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QULTY_DIS");
            oAjaxHandler.setProperties("Param.1", date.getValue() + " 00:00:00");
            oAjaxHandler.setProperties("Param.2", plant.getValue());
            oAjaxHandler.setCallBackSuccessMethod(this.successSrch, this);
            oAjaxHandler.setCallBackFailureMethod(this.failRequestScrch, this);
            oAjaxHandler.triggerPostRequest();
        },

        /** @Function callback function for ajax success
         */
        successSrch: function(rs) {
        	this.getView().setModel(new JSONModel(), "tableModel");
    		if(rs.Rowsets.Rowset[1].Row["0"].SUCC_IND === 1){    			
                var myModel = new JSONModel();
                myModel.setData(rs);
                myModel.setSizeLimit(300);
                this.getView().setModel(myModel, "tableModel");                
                if(this.myRole === "ZNREC_LAB_ANALYST"){
                	this.roleBasedValidation();
                }
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
            var arr = ["SSQSplant", "SSQSdate"];
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
            this.getView().byId("SSQSdate").setValue("");
            this.getView().byId("SSQSplant").setSelectedKey(null);
        },

        /** @Event press event triggers when view setting icon clicked on table header
         */
        handleViewSettings: function() {
            if (!this._settingDialog) {
                this._settingDialog = sap.ui.xmlfragment("com.hzl.view.SolSlurrQualScrn.solSlurrQualScnSttgs", this);
                this._settingDialog.setModel(this.getView().getModel("i18n"), "i18n");
            }
            this._settingDialog.open();
        },

        /** @Event press event triggers when view setting parameters are set
         */
        handleConfirm: function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("SSQS_Table");
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
                aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
            }
            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
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
                GUID: rowData.getProperty("GUID"),
                S_DATE: rowData.getProperty("S_DATE"),
                PLANT_NUM: rowData.getProperty("PLANT_NUM"),
                PLANT_DESC: rowData.getProperty("PLANT_DESC"),
                EQP_NUM: rowData.getProperty("EQP_NUM"),
                EQP_DESC: rowData.getProperty("EQP_DESC"),
                EQP_TYP: rowData.getProperty("EQP_TYP"),
                EQP_GRP: rowData.getProperty("EQP_GRP"),
                SAMP_GRP: rowData.getProperty("SAMP_GRP"),
                EQP_IND: rowData.getProperty("EQP_IND"),
                ZN_GPL_PARAM: rowData.getProperty("ZN_GPL_PARAM"),
                PER_H2O_PARAM: rowData.getProperty("PER_H2O_PARAM"),
                BD_PARAM: rowData.getProperty("BD_PARAM"),
                PERC_ZNPT_PARAM: rowData.getProperty("PERC_ZNPT_PARAM"),
                SOLID_GPL_PARAM: rowData.getProperty("SOLID_GPL_PARAM"),
                PER_PB_PARAM: rowData.getProperty("PER_PB_PARAM"),
                PER_ZN_PARAM: rowData.getProperty("PER_ZN_PARAM"),
                PER_CD_PARAM: rowData.getProperty("PER_CD_PARAM"),
                PER_AG_PARAM: rowData.getProperty("PER_AG_PARAM"),
                SLURRY_DEN_PARAM: rowData.getProperty("SLURRY_DEN_PARAM"),
                SOLID_DEN_PARAM: rowData.getProperty("SOLID_DEN_PARAM"),
                EQP_STD_VAL: rowData.getProperty("EQP_STD_VAL"),
                CRET_DATE: rowData.getProperty("CRET_DATE"),
                STATUS: rowData.getProperty("STATUS")
            };

            if (editArr.myEditData.length === 0) {
                editArr.myEditData.push(myData);
            } else {
                for (var i = 0; i < editArr.myEditData.length; i++) {
                    if (editArr.myEditData[i].GUID === rowData.getProperty("GUID")) {
                        editArr.myEditData[i].S_DATE = rowData.getProperty("S_DATE");
                        editArr.myEditData[i].PLANT_NUM = rowData.getProperty("PLANT_NUM");
                        editArr.myEditData[i].PLANT_DESC = rowData.getProperty("PLANT_DESC");
                        editArr.myEditData[i].EQP_NUM = rowData.getProperty("EQP_NUM");
                        editArr.myEditData[i].EQP_DESC = rowData.getProperty("EQP_DESC");
                        editArr.myEditData[i].EQP_TYP = rowData.getProperty("EQP_TYP");
                        editArr.myEditData[i].EQP_GRP = rowData.getProperty("EQP_GRP");
                        editArr.myEditData[i].SAMP_GRP = rowData.getProperty("SAMP_GRP");
                        editArr.myEditData[i].EQP_IND = rowData.getProperty("EQP_IND");
                        editArr.myEditData[i].ZN_GPL_PARAM = rowData.getProperty("ZN_GPL_PARAM");
                        editArr.myEditData[i].PER_H2O_PARAM = rowData.getProperty("PER_H2O_PARAM");
                        editArr.myEditData[i].BD_PARAM = rowData.getProperty("BD_PARAM");
                        editArr.myEditData[i].PERC_ZNPT_PARAM = rowData.getProperty("PERC_ZNPT_PARAM");
                        editArr.myEditData[i].SOLID_GPL_PARAM = rowData.getProperty("SOLID_GPL_PARAM");
                        editArr.myEditData[i].PER_PB_PARAM = rowData.getProperty("PER_PB_PARAM");
                        editArr.myEditData[i].PER_ZN_PARAM = rowData.getProperty("PER_ZN_PARAM");
                        editArr.myEditData[i].PER_CD_PARAM = rowData.getProperty("PER_CD_PARAM");
                        editArr.myEditData[i].PER_AG_PARAM = rowData.getProperty("PER_AG_PARAM");
                        editArr.myEditData[i].SLURRY_DEN_PARAM = rowData.getProperty("SLURRY_DEN_PARAM");
                        editArr.myEditData[i].SOLID_DEN_PARAM = rowData.getProperty("SOLID_DEN_PARAM");
                        editArr.myEditData[i].EQP_STD_VAL = rowData.getProperty("EQP_STD_VAL");
                        editArr.myEditData[i].CRET_DATE = rowData.getProperty("CRET_DATE");
                        editArr.myEditData[i].STATUS = rowData.getProperty("STATUS");
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
            oAjaxHandler.setProperties("QueryTemplate", "SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QULTY_UPDATE");
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
                sap.m.MessageToast.show(rs.Rowsets.Rowset["0"].Row["0"].Succ_Err_Message);
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

        /** @Function to instantiation of view setting dialog
         */
        viewSettingInit: function() {
            this.mGroupFunctions = {
                EQP_NUM: function(oContext) {
                    var name = oContext.getProperty("EQP_NUM");
                    return {
                        key: name,
                        text: name
                    };
                },
                EQP_DESC: function(oContext) {
                    var name = oContext.getProperty("EQP_DESC");
                    return {
                        key: name,
                        text: name
                    };
                },
                ZN_GPL_PARA: function(oContext) {
                    var name = oContext.getProperty("ZN_GPL_PARA");
                    return {
                        key: name,
                        text: name
                    };
                },
                PER_H2O_PARAM: function(oContext) {
                    var name = oContext.getProperty("PER_H2O_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                BD_PARAM: function(oContext) {
                    var name = oContext.getProperty("BD_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                PERC_ZNPT_PARAM: function(oContext) {
                    var name = oContext.getProperty("PERC_ZNPT_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                SOLID_GPL_PARAM: function(oContext) {
                    var name = oContext.getProperty("SOLID_GPL_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                PER_PB_PARAM: function(oContext) {
                    var name = oContext.getProperty("PER_PB_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                PER_ZN_PARAM: function(oContext) {
                    var name = oContext.getProperty("PER_ZN_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                PER_CD_PARAM: function(oContext) {
                    var name = oContext.getProperty("PER_CD_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                PER_AG_PARAM: function(oContext) {
                    var name = oContext.getProperty("PER_AG_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                SLURRY_DEN_PARAM: function(oContext) {
                    var name = oContext.getProperty("SLURRY_DEN_PARAM");
                    return {
                        key: name,
                        text: name
                    };
                },
                SOLID_DEN_PARAM: function(oContext) {
                    var name = oContext.getProperty("SOLID_DEN_PARAM");
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
                    name: "Sample ID",
                    template: {
                        content: "{EQP_NUM}"
                    }
                }, {
                    name: "Sample Name",
                    template: {
                        content: "{EQP_DESC}"
                    }
                }, {
                    name: "Zn GPL",
                    template: {
                        content: "{ZN_GPL_PARAM}"
                    }
                }, {
                    name: "%H2 O",
                    template: {
                        content: "{PER_H2O_PARAM}"
                    }
                }, {
                    name: "B.D (gms/cc)",
                    template: {
                        content: "{BD_PARAM}"
                    }
                }, {
                    name: "% T/Zn",
                    template: {
                        content: "{PERC_ZNPT_PARAM}"
                    }
                }, {
                    name: "Solids GPL",
                    template: {
                        content: "{SOLID_GPL_PARAM}"
                    }
                }, {
                    name: "%Pb",
                    template: {
                        content: "{PER_PB_PARAM}"
                    }
                }, {
                    name: "%Zn",
                    template: {
                        content: "{PER_ZN_PARAM}"
                    }
                }, {
                    name: "%Cd",
                    template: {
                        content: "{PER_CD_PARAM}"
                    }
                }, {
                    name: "%Ag",
                    template: {
                        content: "{PER_AG_PARAM}"
                    }
                }, {
                    name: "Slurry Density",
                    template: {
                        content: "{SLURRY_DEN_PARAM}"
                    }
                }, {
                    name: "Solid Density",
                    template: {
                        content: "{SOLID_DEN_PARAM}"
                    }
                }]
            });

            oExport.saveFile().catch(function(oError) {
                MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("expoErrorAlert") + oError);
            }).then(function() {
                oExport.destroy();
            });
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
            this.myRole = viewModel.userDetails.Rowsets.Rowset[2].Row[0].ROLE;
            switch (this.myRole) {
	            case "ZNREC_LAB_ANALYST":
		                viewModel.visiblity.updateCancel = true;
		                viewModel.visiblity.updateSave = true; 	            	
		            	viewModel.visiblity.tableFieldEditable = true;
		                break;
	            case "ZNREC_LAB_SUP":
		                viewModel.visiblity.updateCancel = true;
		                viewModel.visiblity.updateSave = true;   
		                viewModel.visiblity.tableFieldEditable = true;
		                break;
	            case "ZNREC_READONLY":
	            		break;
	            case "ZNREC_REPORT_ANALYST":
	            		this.getView().byId("SSQS_Table").destroyColumns();
	                	break;
	            default:
		            	this.getView().byId("SSQS_Table").destroyColumns();         
            }                                    
            this.oViewModel.setData(viewModel);
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
        
        /** @Function visiblity of input fields based on role
         */        
        roleBasedValidation: function(){
            var viewModel = this.oViewModel.getData(); 
            if (this.getView().byId("SSQSdate").getValue() !== this.changeDateFormat(new Date()).slice(0, 10) ) {                
            	viewModel.visiblity.tableFieldEditable = false;
            }else{
            	viewModel.visiblity.tableFieldEditable = true;
            }  
        	this.oViewModel.setData(viewModel);
        }
    });

});