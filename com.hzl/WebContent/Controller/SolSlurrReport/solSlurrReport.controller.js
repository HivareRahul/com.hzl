sap.ui.define([
		"com/hzl/Controller/baseController",
		"sap/ui/model/json/JSONModel",
		"com/hzl/Util/ajaxHandler",
		"sap/m/MessageBox",
		"sap/ui/model/Sorter",
		"sap/m/TablePersoController",
		"com/hzl/Controller/SolSlurrReport/SolSlurrRptPersoService",
		"sap/ui/core/util/Export",
		"sap/ui/core/util/ExportTypeCSV"
	], function(baseController, JSONModel, ajaxHandler, MessageBox, Sorter, TablePersoController, SolSlurrRptPersoService, Export, ExportTypeCSV) {
	"use strict";
	return baseController.extend("com.hzl.Controller.SolSlurrReport.solSlurrReport", {
		/** SAP UI5 life cycle method triggered on first load 
		 *  @DefaultValue setting default value for date control 
		 *  @Models viewModel for basic view operations and another i18n for ResourceModel
		 *  @Method viewSettingInit method for instantiation view setting dialog , initialSettings for user data and role based visiblity
		 */
		onInit : function (evt) {
			this.getView().setModel(new JSONModel({enable:false,userDetails:[],visiblity:{updateSave:false,updateCancel:false}}),"viewModel");	
			this.oViewModel = this.getView().getModel("viewModel");	
			this.getView().byId("SSRdate").setValue(this.changeDateFormat(new Date()).slice(0,10));
			this.initialSettings();		
			this.viewSettingInit();
			this._oTPC = new TablePersoController({
				table: this.getView().byId("SSR_Table"),
				componentName: "SSR",
				persoService: SolSlurrRptPersoService
			}).activate();			
		},
		
	 	/** @Function initialSettings to get user data
	 	 */			
		initialSettings: function(){
			var oAjaxHandler = ajaxHandler.getInstance();
			oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/COMMON/QRY/XQRY_GetLoggedInUserDetails");
			oAjaxHandler.setProperties("Param.1","10.101.23.146:50000/");
			oAjaxHandler.setCallBackSuccessMethod(this.successIniSttg, this);
			oAjaxHandler.setCallBackFailureMethod(this.failRequestIniSttg, this);
			oAjaxHandler.triggerPostRequest();		
		},
		
		/** @Function callback function for ajax success
		 */		
		successIniSttg: function(rs){
			var viewModel = this.oViewModel.getData();
			viewModel.userDetails = rs;
			this.oViewModel.setData(viewModel);
			this.visiblitySettings();
		},
		
		/** @Function callback function for ajax fail
		 */			
		failRequestIniSttg: function(rs){
			sap.m.MessageBox.alert(rs.statusText);
		},
    	
    	/** @Function visiblity setting based on roles
    	 */	    	
    	visiblitySettings: function(){
    		var viewModel = this.oViewModel.getData();    		
    		this.role = "ZNREC_REPORT_ANALYST";
    		if(this.role === "ZNREC_REPORT_ANALYST"){
        		viewModel.visiblity.updateCancel = true;
        		viewModel.visiblity.updateSave = true;		
    		}    		
    		this.oViewModel.setData(viewModel);
    	},
         
     	/** @Method called when reset button is clicked
     	 *  @Functinality resets the control data 
     	 */	         
        onReset:function(){
    		this.getView().byId("SSRdate").setValue("");
    		this.getView().byId("SSRplant").setSelectedKey(null);
        },

		/** @Event search event name onSearch triggers when search button clicked
		 *  @Validation validation for Empty mandatory fields and reverse date
		 */			
		onSearch:function(oEvent){
			this.oViewModel.setProperty("/enable", false);	
			var that = this;	
    		var date = this.getView().byId("SSRdate");
    		var plant = this.getView().byId("SSRplant");    		
    		if(this.validation() > 0){
    			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));     			
    			return;
    		}	
			this.startBusyIndicator();		
			jQuery.sap.delayedCall(3000, this, function () {
				this.stopBusyIndicator();
			});	
    		var oAjaxHandler = ajaxHandler.getInstance();
    		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QTY_DIS");   
    		oAjaxHandler.setProperties("Param.1",date.getValue() + " 00:00:00");
    		oAjaxHandler.setProperties("Param.2",plant.getValue());
    		oAjaxHandler.setCallBackSuccessMethod(this.successSrch, this);
    		oAjaxHandler.setCallBackFailureMethod(this.failRequestScrch, this);
    		oAjaxHandler.triggerPostRequest();   		    		
         },
          
     	 /** @Function callback function for ajax success
     	 */	         
         successSrch: function(rs){
				this.getView().setModel(new JSONModel(rs),"tableModel");	
         },
         
     	/** @Function callback function for ajax fail
     	 */	         
         failRequestScrch: function(rs){
        	 sap.m.MessageBox.alert(rs.statusText);
         },
     	
     	/** @Function validation for empty data in mandatory fields
     	 *  @Return numeric value
     	 */          
     	validation: function(){
     		var that = this;
     		var result = 0;
     		var arr = ["SSRplant","SSRdate"];
     		arr.forEach(function(items){
     				if(that.getView().byId(items).getValue() == ""){
     					that.getView().byId(items).setValueState("Error");
     					result ++;
     				}else{
     					that.getView().byId(items).setValueState("None");
     				}
     		});
     		return result;
     	},
    	
    	/** @Event itemPress event triggered after clicking on a table row
    	 *  @Model gets the required data and binds to the model
    	 *  @Visiblity makes input fields enable
    	 */	    	
    	vendorSelect: function(oEvent){
    		this.oViewModel.setProperty("/enable", true);
	        var oItem = oEvent.getParameter("listItem");
	    	var oTable = this.getView().byId("SSR_Table");
	    	var oIndex = oTable.indexOfItem(oItem);
	    	var oModel = this.getView().getModel("viewModel");
	        var oFlag = oModel.getProperty("/oIndex");
	        if (oFlag === undefined) {
	          oModel.setProperty("/oIndex", oIndex);
	          this.onPress(oItem, true);
	        } else {
	          var oPreviousItem = oTable.getItems()[oFlag];
	          this.onPress(oPreviousItem, false);
	          var oCurrentItem = oTable.getItems()[oIndex];
	          oModel.setProperty("/oIndex", oIndex);
              this.onPress(oCurrentItem, true);
            }
  
    	},
    	
    	/** @Method to make input field editable on row click
    	 */	    	
    	onPress: function(oItem, oFlag) {
            var oEditableCells = oItem.getCells();
            $(oEditableCells).each(function(i) {
              var oEditableCell = oEditableCells[i];
              var oMetaData = oEditableCell.getMetadata();
              var oElement = oMetaData.getElementName();
              if (oElement == "sap.ui.commons.TextField") {
                oEditableCell.setEditable(oFlag);
              }
            });
         },
     	
     	/** @Event press event trigger on clicking save button of page not add dialog
     	 *  @Visiblity setting visiblity of save and cancel button
     	 *  @Model getting the required data into model table getSelected item method
     	 *  @oAjaxHandler reusable ajax call
     	 */		
     	onUpdate: function(oEvent){
     		var oTable = this.getView().byId("SSR_Table");
     		//oTable.getSelectedItem().getBindingContext("tableModel").getProperty("EQP_DESC");
     		sap.m.MessageToast.show(oTable.getSelectedItem().getBindingContext("tableModel").getProperty("EQP_DESC"));
     		/*this.oViewModel.setProperty("/enable", false);
     		var myEditModel1 = this.getView().getModel("myEdit").getData();	
     		var oTable = this.getView().byId("fluTrnsQulAnlyEntrTable");
     		myEditModel1.fourth = oTable.getSelectedItem().getCells()[5].getValue();
     		myEditModel1.first = oTable.getSelectedItem().getCells()[7].getValue();
     		var oAjaxHandler = ajaxHandler.getInstance();
     		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_UPD_ROW_QUAL");
     		oAjaxHandler.setProperties("Param.1",myEditModel1.first);
     		this.getView().setModel(new JSONModel({first:"",second:"",third:"",fourth:"",fifth:"",sixth:"",seventh:"",eight:""}), "myEdit"); 
     		oAjaxHandler.setCallBackSuccessMethod(this.successOnUpdate, this);
     		oAjaxHandler.setCallBackFailureMethod(this.failRequestOnUpdate, this);
     		oAjaxHandler.triggerPostRequest();	*/			
     	},
     	
     	/** @Function callback function for ajax success
     	 */		
     	successOnUpdate: function(rs){
     		sap.m.MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("updateAlert"));
     		this.onSearch();
     	},
     	
     	/** @Function callback function for ajax fail
     	 */		
     	failRequestOnUpdate: function(rs){
     		sap.m.MessageBox.alert(rs.statusText);
     	},
    	
    	/** @Event press event trigger on clicking cancel button
    	 */    	
    	onCancel: function(){
    		this.onSearch();
    	},

		/** @Event press event triggers when view setting icon clicked on table header
		 */ 
		handleViewSettings: function (oEvent) {
			if (!this._settingDialog) {
				this._settingDialog = sap.ui.xmlfragment("com.hzl.view.SolSlurrReport.SolSlurrRptStgs", this);
		        this._settingDialog.setModel(this.getView().getModel("i18n")); 				
			}
			this._settingDialog.open();
		},
		
		/** @Event press event triggers when view setting parameters are set
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
		},
    	
      	/** @Function to instantiation of view setting dialog
      	 */	         
    	viewSettingInit: function(){
			this.mGroupFunctions = {
					EQP_DESC : function(oContext) {
						var name = oContext.getProperty("EQP_DESC");
						return {
							key: name,
							text: name
						};
					},
					STD_VOL : function(oContext) {
						var name = oContext.getProperty("STD_VOL");
						return {
							key: name,
							text: name
						};
					},
					EQP_FAC : function(oContext) {
						var name = oContext.getProperty("EQP_FAC");
						return {
							key: name,
							text: name
						};
					},
					ACT_VOL : function(oContext) {
						var name = oContext.getProperty("ACT_VOL");
						return {
							key: name,
							text: name
						};
					},
					ZN_CAL : function(oContext) {
						var name = oContext.getProperty("ZN_CAL");
						return {
							key: name,
							text: name
						};
					},
					ZN_MIC : function(oContext) {
						var name = oContext.getProperty("ZN_MIC");
						return {
							key: name,
							text: name
						};
					}				
				};    		
    	},

		/** @Event press event triggers when setting icon clicked on table header
		 */
		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},
		
		/** @Event press event triggers when import icon clicked on table header to export in CSV file
		 */ 		
		onDataExport: function(){
			var that = this;
			var oExport = new Export({
				exportType : new ExportTypeCSV({}),
				models : this.getView().getModel("tableModel"),
				rows : {
					path : "/Rowsets/Rowset/0/Row/"
				},
				columns : [{
					name : "Samples",
					template : {
						content : "{EQP_DESC}"
					}
				}, {
					name : "Standard",
					template : {
						content : "{STD_VOL}"
					}
				}, {
					name : "Factor",
					template : {
						content : "{EQP_FAC}"
					}
				}, {
					name : "Actual Volume",
					template : {
						content : "{ACT_VOL}"
					}
				}, {
					name : "Zn gpl/wt %",
					template : {
						content : "{ZN_CAL}"
					}
				}, {
					name : "Zn MIC(tons)",
					template : {
						content : "{ZN_MIC}"
					}
				}]
			});

			oExport.saveFile().catch(function(oError) {
				MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("expoErrorAlert") + oError);
			}).then(function() {
				oExport.destroy();
			});			
		}
	
	});	

});