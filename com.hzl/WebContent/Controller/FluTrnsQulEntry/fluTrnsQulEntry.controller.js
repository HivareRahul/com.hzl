sap.ui.define([
	"com/hzl/Controller/baseController",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageBox",
	"sap/m/TablePersoController",
	"com/hzl/Controller/FluTrnsQulEntry/fluTrnsQulEntryPersoService",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"com/hzl/Util/ajaxHandler"
], function (baseController, Export, ExportTypeCSV, MessageBox, TablePersoController, fluTrnsQulEntryPersoService, Sorter, JSONModel, ResourceModel, ajaxHandler) {
	"use strict";

	return baseController.extend("com.hzl.Controller.FluTrnsQulEntry.fluTrnsQulEntry", {

		/** SAP UI5 life cycle method triggered on first load 
		 *  @DefaultValue setting default value for date control 
		 *  @Visiblity hiding and showing controls based on requirement
		 *  @TablePersoController creating TablePersoController for table
		 *  @Models viewModel for basic view operations and another i18n for ResourceModel
		 *  @Method viewSettingInit method for instantiation view setting dialog 
		 */		
		onInit: function () {
			this.getView().setModel(new JSONModel({enable:false}),"viewModel");
			this.oViewModel = this.getView().getModel("viewModel");
			this.getView().byId("toDate").setValue(this.changeDateFormat(new Date()));			
			this.getView().byId("frmDate").setValue(this.changeDateFormat(new Date(new Date().setMonth(new Date().getMonth()-1))));	
			this._oTPC = new TablePersoController({
				table: this.getView().byId("fluTrnsQualityEntryTable"),
				componentName: "FTQE",
				persoService: fluTrnsQulEntryPersoService
			}).activate();	
			this.viewSettingInit();		 
	        this.getView().setModel(new ResourceModel({ bundleUrl : "i18n/messageBundle.properties"}), "i18n");
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
					name : "Date",
					template : {
						content : "{S_DATE}"
					}
				}, {
					name : "Shift",
					template : {
						content : "{SHIFT}"
					}
				}, {
					name : "Material Transfered",
					template : {
						content : "{TO_MAT_DESC}"
					}
				}, {
					name : "Tag Id",
					template : {
						content : "{TAG_ID}"
					}
				}, {
					name : "Material Transfered From",
					template : {
						content : "{FROM_PLANT_DESC}"
					}
				}, {
					name : "Material Transfered To",
					template : {
						content : "{TO_PLANT_DESC}"
					}
				}, {
					name : "Quantity",
					template : {
						content : "{MAT_QTY}"
					}
				}, {
						name : "Quantity UOM",
						template : {
							content : "m3"
					}
				 }]
			});

			oExport.saveFile().catch(function(oError) {
				MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("expoErrorAlert") + oError);
			}).then(function() {
				oExport.destroy();
			});			
		},

		/** @Event press event triggers when setting icon clicked on table header
		 */
		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},
		
		/** @Event press event triggers to refresh persona 
		 */ 
		onTablePersoRefresh : function() {
			fluTrnsQulEntryPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/** @Event press event triggers to get selected persona items
		 */ 
		onTableGrouping : function(oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		},

		/** @Event press event triggers when view setting icon clicked on table header
		 */ 
		handleViewSettings: function (oEvent) {
			if (!this._settingDialog) {
				this._settingDialog = sap.ui.xmlfragment("com.hzl.view.FluTrnsQulEntry.FluTrnsQulEnStgs", this);
		        this._settingDialog.setModel(this.getView().getModel("i18n"), "i18n"); 				
			}
			this._settingDialog.open();
		},
		
		/** @Event press event triggers when view setting parameters are set
		 */ 		
		handleConfirm: function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("fluTrnsQualityEntryTable");
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

		/** @Event search event name onSearch triggers when search button clicked
		 *  @Validation validation for Empty mandatory fields and reverse date
		 *  @oAjaxHandler reusable ajax call
		 */			
		onSearch:function(oEvent){	
			this.oViewModel.setProperty("/enable", false);
			var that = this;	
    		this.filterBar = this.getView().byId("FTQE_fltBar");
    		var fromDate = this.getView().byId("frmDate");
    		var toDate = this.getView().byId("toDate");
    		var plant = this.getView().byId("FTQEplant");    		
    		if(this.validation(this.filterBar) > 0){
    			sap.m.MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));     			
    			return;
    		}    		
    	    if (Date.parse(fromDate.getValue().slice(0,10)+" "+fromDate.getValue().slice(11).split("-").join(":")) >= Date.parse(toDate.getValue().slice(0,10)+" "+toDate.getValue().slice(11).split("-").join(":"))) {	    	
    	    	sap.m.MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("dateAlert"));     	    	
    	        return;
    	    }	
			this.startBusyIndicator();		
			jQuery.sap.delayedCall(2000, this, function () {
				this.stopBusyIndicator();
			});	
    		var oAjaxHandler = ajaxHandler.getInstance();
    		oAjaxHandler.setUrlContext("/XMII/Illuminator");
    		oAjaxHandler.setProperties("j_user","CSPPRH");
    		oAjaxHandler.setProperties("j_password","system@01");
    		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_QTYDET_DIS");    		
    		oAjaxHandler.setProperties("IsTesting","T");
    		oAjaxHandler.setProperties("Param.1",fromDate.getValue());
    		oAjaxHandler.setProperties("Param.2",toDate.getValue());
    		oAjaxHandler.setProperties("Param.3",plant.getValue());
    		oAjaxHandler.setProperties("Content-Type","text/json");
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
         
     	/** @Method called when reset button is clicked
     	 *  @Functinality resets the control data 
     	 */	         
        onReset:function(oEvent){
        		var oFilterDataModel = new JSONModel({frmDate:"",toDate:"",tsId:"",MatTrans:"",matTrnsFrm:"",matTrnsTo:"",sft:"",plt:"",tagId:""});
               this.getView().setModel(oFilterDataModel,"filterData"); 
               this.getView().byId("frmDate").setValue("");
               this.getView().byId("toDate").setValue("");
        },
        	
    	/** @Function validation for empty data in mandatory fields
    	 *  @Return numeric value
    	 */          
    	validation: function(){
    		var that = this;
    		var result = 0;
    		var arr = ["frmDate","toDate","FTQEplant"];
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
    	
    	/** @Event press event trigger on clicking cancel button
    	 */    	
    	onCancel: function(){
    		this.onSearch();
    	},
    	
    	/** @Event press event trigger on clicking save button of page not add dialog
    	 *  @Visiblity setting visiblity of save and cancel button
    	 *  @Model getting the required data into model table getSelected item method
    	 *  @oAjaxHandler reusable ajax call
    	 */	    	
    	onUpdate: function(oEvent){
    		var that = this;
    		this.oViewModel.setProperty("/enable", false);
    		var myCell = this.getView().byId("fluTrnsQualityEntryTable").getSelectedItem();
    		var myEditModel1 = this.getView().getModel("myEdit").getData();
    		myEditModel1.fourth = myCell.getCells()[5].getValue();
    		var oAjaxHandler = ajaxHandler.getInstance();
    		oAjaxHandler.setUrlContext("/XMII/Illuminator");
    		oAjaxHandler.setProperties("j_user","CSPPRH");
    		oAjaxHandler.setProperties("j_password","system@01");
    		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_UPD_ROW_QTY");
    		oAjaxHandler.setProperties("Param.1",myEditModel1.first);
    		oAjaxHandler.setProperties("Param.2",myEditModel1.second);
    		oAjaxHandler.setProperties("Param.3",myEditModel1.third);
    		oAjaxHandler.setProperties("Param.4",myEditModel1.fourth);    		
    		oAjaxHandler.setProperties("Param.5",myEditModel1.fifth);
    		oAjaxHandler.setProperties("Content-Type","text/json");
    		this.getView().setModel(new JSONModel({first:"",second:"",third:"",fourth:""}), "myEdit"); 
    		oAjaxHandler.setCallBackSuccessMethod(this.successOnUpdate, this);
    		oAjaxHandler.setCallBackFailureMethod(this.failRequestOnUpdate, this);
    		oAjaxHandler.triggerPostRequest();	    			
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
    	
    	/** @Event itemPress event triggered after clicking on a table row
    	 *  @Model gets the required data and binds to the model
    	 *  @Visiblity makes input fields enable
    	 */	    	
    	vendorSelect: function(oEvent){
    		this.oViewModel.setProperty("/enable", true);
    		this.getView().setModel(new JSONModel({first:"",second:"",third:"",fourth:"",fifth:""}), "myEdit");
    		var myEditModel = this.getView().getModel("myEdit").getData();
    		var row = oEvent.getParameter("listItem").getBindingContext("tableModel");        		
    		myEditModel.first = row.getProperty("S_DATE");
    		myEditModel.second = row.getProperty("GUID");
    		myEditModel.third = row.getProperty("STATUS"); 
    		myEditModel.fifth = row.getProperty("TAG_ID"); 
    		
	        var oItem = oEvent.getParameter("listItem");
	    	var oTable = this.getView().byId("fluTrnsQualityEntryTable");
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
    	
      	/** @Function to instantiation of view setting dialog
      	 */	         
    	viewSettingInit: function(){
			this.mGroupFunctions = {
					S_DATE: function(oContext) {
						var name = oContext.getProperty("S_DATE");
						return {
							key: name,
							text: name
						};
					},
					SHIFT: function(oContext) {
						var name = oContext.getProperty("SHIFT");
						return {
							key: name,
							text: name
						};
					},
					TO_MAT_DESC: function(oContext) {
						var name = oContext.getProperty("TO_MAT_DESC");
						return {
							key: name,
							text: name
						};
					},
					FRM_PLANT_DESC: function(oContext) {
						var name = oContext.getProperty("FRM_PLANT_DESC");
						return {
							key: name,
							text: name
						};
					},
					TO_PLANT_DESC: function(oContext) {
						var name = oContext.getProperty("TO_PLANT_DESC");
						return {
							key: name,
							text: name
						};
					},
					ZN_GPL_PARAM: function(oContext) {
						var name = oContext.getProperty("MAT_QTY");
						return {
							key: name,
							text: name
						};
					}				
				};    		
    	}


	});

});