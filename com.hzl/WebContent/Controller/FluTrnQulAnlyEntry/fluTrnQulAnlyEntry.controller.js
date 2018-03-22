sap.ui.define([
	"com/hzl/Controller/baseController",
	"sap/m/TablePersoController",
	"com/hzl/Controller/FluTrnQulAnlyEntry/fluTrnsQulAnlyEntrPersoService",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/resource/ResourceModel",
	"com/hzl/Util/ajaxHandler"
], function(baseController, TablePersoController, fluTrnsQulAnlyEntrPersoService, MessageBox, Filter, JSONModel, Export, ExportTypeCSV, ResourceModel, ajaxHandler) {
"use strict";

return baseController.extend("com.hzl.Controller.FluTrnQulAnlyEntry.fluTrnQulAnlyEntry", {
	/** SAP UI5 life cycle method triggered on first load 
	 *  @DefaultValue setting default value for date control 
	 *  @Visiblity hiding and showing controls based on requirement
	 *  @TablePersoController creating TablePersoController for table
	 *  @Models viewModel for basic view operations and another i18n for ResourceModel
	 *  @Method createAddDialog and viewSettingInit method for instantiation for add dialog and view setting dialog
	 */
	onInit: function () {	
		this.getView().setModel(new JSONModel({enable:false}),"viewModel");
		this.oViewModel = this.getView().getModel("viewModel");		
		this.getView().byId("toDate").setValue(this.changeDateFormat(new Date()));			
		this.getView().byId("frmDate").setValue(this.changeDateFormat(new Date(new Date().setMonth(new Date().getMonth()-1))));						
		this.viewSettingInit();
		this._oTPC = new TablePersoController({
			table: this.getView().byId("fluTrnsQulAnlyEntrTable"),
			componentName: "FTQAE",
			persoService: fluTrnsQulAnlyEntrPersoService
		}).activate();		
        this.getView().setModel(new ResourceModel({ bundleUrl : "i18n/messageBundle.properties"}), "i18n");
        this.createAddDialog();
	},
	
	/** @Event search event name onSearch triggers when search button clicked
	 *  @Validation validation for mandatory fields and reverse date
	 *  @oAjaxHandler reusable ajax call
	 */	
	onSearch : function(oEvent){
		this.oViewModel.setProperty("/enable", false);
		var that = this;		
		this.filterBar = this.getView().byId("FTQAE_fltBar");
		var fromDate = this.filterBar.determineControlByName("fromDate");
		var toDate = this.filterBar.determineControlByName("toDate");
		var plant = this.filterBar.determineControlByName("plant");
		if(this.validation(this.filterBar) > 0){
			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert")); 
			return;
		}
	    if (Date.parse(fromDate.getValue().slice(0,10)+" "+fromDate.getValue().slice(11).split("-").join(":")) >= Date.parse(toDate.getValue().slice(0,10)+" "+toDate.getValue().slice(11).split("-").join(":"))) {	    	
	    	MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("dateAlert"));   	
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
		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_QUAL_DIS");
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
		this.getView().setModel(new JSONModel(rs),"fluTrnsQulAnlyEntr");
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
		var arr = ["fromDate","toDate","plant"];
		arr.forEach(function(items){
				if(that.getView().byId("FTQAE_fltBar").determineControlByName(items).getValue() == ""){
					that.getView().byId("FTQAE_fltBar").determineControlByName(items).setValueState("Error");
					result ++;
				}else{
					that.getView().byId("FTQAE_fltBar").determineControlByName(items).setValueState("None");
				}
		});
		return result;
	},
	
	/** @Function validation for empty data in add dialog mandatory fields
	 *  @Return numeric value
	 */ 	
	addValidation: function(){
		var result = 0;
		var arr = ["addDate","addShift","addMatTrans","addMatTransFrm","addMatTransTo","addZnGPL","addDen"];
		arr.forEach(function(items){
				if(sap.ui.core.Fragment.byId("idQualAnalysisRec",items).getValue() == ""){
					sap.ui.core.Fragment.byId("idQualAnalysisRec",items).setValueState("Error");
					result ++;
				}else{
					sap.ui.core.Fragment.byId("idQualAnalysisRec",items).setValueState("None");
				}
		});
		return result;		
	},
	
	/** @Event press event triggers when import icon clicked on table header to export in CSV file
	 */ 	
	onDataExport: function(){
		var oExport = new Export({
			exportType : new ExportTypeCSV({}),
			models : this.getView().getModel("fluTrnsQulAnlyEntr"),
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
				name : "Material Transfered From",
				template : {
					content : "{FRM_PLANT_DESC}"
				}
			}, {
				name : "Material Transfered To",
				template : {
					content : "{TO_PLANT_DESC}"
				}
			}, {
				name : "Zn GPL",
				template : {
					content : "{ZN_GPL_PARAM}"
				}
			}, {
				name : "Zn GPL UOM",
				template : {
					content : "GPL"
				}
			}, {
				name : "Zn Density",
				template : {
					content : "{DEN_PARAM}"
				}
			}, {
				name : "Zn Density UOM",
				template : {
					content : "kg/m3"
				}
			}]	
		});
		
		oExport.saveFile().always(function() {
			this.destroy();
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
		fluTrnsQulAnlyEntrPersoService.resetPersData();
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
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("com.hzl.view.FluTrnQulAnlyEntry.fluTrnsQulAnlyEntrStgs", this);
	        this._oDialog.setModel(this.getView().getModel("i18n"),"i18n");			
		}
		this._oDialog.open();
	},
	
	/** @Event press event triggers when view setting paramters are set
	 */ 	
	handleConfirm: function(oEvent) {
		var oView = this.getView();
		var oTable = oView.byId("fluTrnsQulAnlyEntrTable");
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
	
	/** @Function instantiation of Add dialog
	 *  @Model resource and i18n models are set to Add Dialog 
	 */ 
	createAddDialog: function(){
		var addDialogModel = {"Date" : "","Shift": "","MaterialTransfered": "","MaterialTransferedNum": "","MaterialTransferFrom": "","MaterialTransferFromNum": "","MaterialTransferTo": "","MaterialTransferToNum": "","ZnInGPL":"","Density":"","TO_MAT_NUM":""};
		if (!this._addDialog) {
			this._addDialog = sap.ui.xmlfragment("idQualAnalysisRec","com.hzl.view.FluTrnQulAnlyEntry.addFTQAE", this);
	        this._addDialog.setModel(this.getView().getModel("i18n"),"i18n");	
		}
		this._addDialog.setModel(new JSONModel(addDialogModel), "addDialogModel");		
	},
	
	/** @Event press event triggers when plus icon clicked on table header
	 *  @Validation validation to check plant field has data or not
	 *  @oAjaxHandler reusable ajax call
	 */	
	onAdd: function(){	
		var that = this;
		var plant = this.getView().byId("FTQAE_fltBar").determineControlByName("plant").getValue();	
		if(plant == ""){
			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("selePltAlert")); 
			return;
		}
		var oAjaxHandler = ajaxHandler.getInstance();
		oAjaxHandler.setUrlContext("/XMII/Illuminator");
		oAjaxHandler.setProperties("j_user","CSPPRH");
		oAjaxHandler.setProperties("j_password","system@01");
		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_ADD_BUTTON_CLK_QUAL");
		oAjaxHandler.setProperties("Param.1",plant);
		oAjaxHandler.setProperties("Content-Type","text/json");
		oAjaxHandler.setCallBackSuccessMethod(this.successOnAdd, this);
		oAjaxHandler.setCallBackFailureMethod(this.failRequestOnAdd, this);
		oAjaxHandler.triggerPostRequest();			
		this._addDialog.open();			
	},
	
	/** @Function callback function for ajax Success
	 *  @Model set model inpDialogModel for Add Dialog
	 */	 	
	successOnAdd: function(rs){
		this.getView().setModel(new JSONModel(rs),"inpDialogModel");
		this._addDialog.setModel(this.getView().getModel("inpDialogModel"));
	},

	/** @Function callback function for ajax fail
	 */	 
	failRequestOnAdd: function(rs){
		sap.m.MessageBox.alert(rs.statusText);
	},
	
	/** @Event press event triggers on cancel button of Add Dialog 
	 *  @Method cleanAddDialog clean up the Dialog and _addDialog close the dialog
	 */		
	onCloseDialog: function(){
		this.cleanAddDialog();
		this._addDialog.close();
	},
	
	/** @Event valueHelpRequest event triggers on click of Add Dialog input controls
	 *  @Variable this.CD to get Custom data
	 *  @Dialog opens the global dialog and does the binding with inpDialogModel model
	 */	
	handleValueHelp : function (oEvent) {
		var that = this;
		this.CD = oEvent.getSource().getCustomData()[0].getValue();		
		var sInputValue = oEvent.getSource().getValue();
		this.inputId = oEvent.getSource().getId();
		if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment("com.hzl.view.Global.inputDialog", this);
			this.getView().addDependent(this._valueHelpDialog);
		}		
		this._valueHelpDialog.setModel(this.getView().getModel("inpDialogModel"));
		this._valueHelpDialog.open(sInputValue);
		if(this.CD === "FRM_MAT_DESC"){
			this._valueHelpDialog.bindAggregation("items", "inpDialogModel>/Rowsets/Rowset/0/Row/", new sap.m.StandardListItem({title:"{inpDialogModel>FRM_MAT_DESC}",description:"{inpDialogModel>FRM_MAT_NUM}"}));
		}else if(this.CD === "TO_PLANT_DESC"){
			this._valueHelpDialog.bindAggregation("items", "inpDialogModel>/Rowsets/Rowset/2/Row/", new sap.m.StandardListItem({title:"{inpDialogModel>TO_PLANT_DESC}",description:"{inpDialogModel>TO_PLANT_NUM}"}));
		}else if(this.CD === "FRM_PLANT_DESC"){
			this._valueHelpDialog.bindAggregation("items", "inpDialogModel>/Rowsets/Rowset/1/Row/", new sap.m.StandardListItem({title:"{inpDialogModel>FRM_PLANT_DESC}",description:"{inpDialogModel>FRM_PLANT_NUM}"}));
		}
	},
	
	/** @Method to get Routing 
	 */		
	getRouter: function(){
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	
	/** @Method called when reset button is clicked
	 *  @Functinality resets the control data 
	 */	
	onReset: function(){
		var arr = ["fromDate","toDate","plant"];
		for(var i=0;i<arr.length;i++){
			this.getView().byId("FTQAE_fltBar").determineControlByName(arr[i]).setValue("");
		}
	},
	
	/** @Event triggered on search of Global dialog
	 */		
	_handleValueHelpSearch: function(evt){
		var sValue = evt.getParameter("value");
		var oFilter = new Filter(
				this.CD,
			sap.ui.model.FilterOperator.Contains, sValue
		);
		evt.getSource().getBinding("items").filter([oFilter]);		
	},
	
	/** @Event triggered on close of Global dialog
	 *  @Model sets the required data to addDialogModel model and Add dialog input fields
	 */		
	_handleValueHelpClose: function(evt){
		var addDialogModelData = this._addDialog.getModel("addDialogModel").getData();
		var oSelectedItem = evt.getParameter("selectedItem");
		if (oSelectedItem) {
			var productInput = sap.ui.getCore().byId(this.inputId);
			productInput.setValue(oSelectedItem.getTitle());
			if(this.inputId === "idQualAnalysisRec--addMatTrans"){
				addDialogModelData.MaterialTransferedNum = oSelectedItem.getDescription();
			}else if(this.inputId === "idQualAnalysisRec--addMatTransFrm"){
				addDialogModelData.MaterialTransferFromNum = oSelectedItem.getDescription();
			}else if(this.inputId === "idQualAnalysisRec--addMatTransTo"){
				addDialogModelData.MaterialTransferToNum = oSelectedItem.getDescription();
			}
		}
		this._addDialog.getModel("addDialogModel").setData(addDialogModelData);
		evt.getSource().getBinding("items").filter([]);		
	},
	
	/** @Event press triggered on press of save button of add dialog
	 *  @Validation validates the mandatory fields
	 *  @Variable data.TO_MAT_NUM logic of for loop for bussiness logic
	 *  @oAjaxHandler reusable ajax call
	 *  @onCloseDialog method called to clean up and close the add dialog
	 */		
	onSave: function(){
		var that = this;
		if(this.addValidation() > 0){
			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert")); 
			return;
		}		
		var data = this._addDialog.getModel("addDialogModel").getData();		
		var oAjaxHandler = ajaxHandler.getInstance();
		oAjaxHandler.setUrlContext("/XMII/Illuminator");
		oAjaxHandler.setProperties("j_user","CSPPRH");
		oAjaxHandler.setProperties("j_password","system@01");
		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_ADD_ROW_QUAL");
		oAjaxHandler.setProperties("Param.1",data.Density);
		oAjaxHandler.setProperties("Param.2",data.Shift);
		oAjaxHandler.setProperties("Param.3",data.Date);
		oAjaxHandler.setProperties("Param.4",data.ZnInGPL);
		oAjaxHandler.setProperties("Param.5",data.MaterialTransferedNum);
		oAjaxHandler.setProperties("Param.6","");
		oAjaxHandler.setProperties("Param.7",data.MaterialTransferToNum);
		oAjaxHandler.setProperties("Param.8",data.MaterialTransferFromNum);
		oAjaxHandler.setProperties("Content-Type","text/json");
		oAjaxHandler.setCallBackSuccessMethod(this.successOnSave, this);
		oAjaxHandler.setCallBackFailureMethod(this.failRequestOnSave, this);
		oAjaxHandler.triggerPostRequest();	
		this.onCloseDialog();
	},
	
	/** @Function callback function for ajax success
	 */	 	
	successOnSave: function(rs){
		sap.m.MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("succAlert"));
		this.onSearch();
	},
	
	/** @Function callback function for ajax fail
	 */	 	
	failRequestOnSave: function(rs){
		sap.m.MessageBox.alert(rs.statusText);
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
		var myEditModel1 = this.getView().getModel("myEdit").getData();	
		var oTable = this.getView().byId("fluTrnsQulAnlyEntrTable");
		myEditModel1.fourth = oTable.getSelectedItem().getCells()[5].getValue();
		myEditModel1.first = oTable.getSelectedItem().getCells()[7].getValue();
		var oAjaxHandler = ajaxHandler.getInstance();
		oAjaxHandler.setUrlContext("/XMII/Illuminator");
		oAjaxHandler.setProperties("j_user","CSPPRH");
		oAjaxHandler.setProperties("j_password","system@01");
		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_UPD_ROW_QUAL");
		oAjaxHandler.setProperties("Param.1",myEditModel1.first);
		oAjaxHandler.setProperties("Param.2",myEditModel1.second);
		oAjaxHandler.setProperties("Param.3",myEditModel1.third);
		oAjaxHandler.setProperties("Param.4",myEditModel1.fourth);
		oAjaxHandler.setProperties("Param.5",myEditModel1.fifth);
		oAjaxHandler.setProperties("Param.6",myEditModel1.sixth);
		oAjaxHandler.setProperties("Param.7",myEditModel1.seventh);
		oAjaxHandler.setProperties("Param.8",myEditModel1.eight);
		oAjaxHandler.setProperties("Content-Type","text/json");
		this.getView().setModel(new JSONModel({first:"",second:"",third:"",fourth:"",fifth:"",sixth:"",seventh:"",eight:""}), "myEdit"); 
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
		this.getView().setModel(new JSONModel({first:"",second:"",third:"",fourth:"",fifth:"",sixth:"",seventh:"",eight:""}), "myEdit");
		var myEditModel = this.getView().getModel("myEdit").getData();
		var row = oEvent.getParameter("listItem").getBindingContext("fluTrnsQulAnlyEntr");        		
		myEditModel.second = row.getProperty("S_DATE");
		myEditModel.third = row.getProperty("GUID");
		myEditModel.fifth = row.getProperty("FRM_MAT_NUM");
		myEditModel.sixth = row.getProperty("STATUS");
		myEditModel.seventh = row.getProperty("TO_PLANT_NUM");
		myEditModel.eight = row.getProperty("FRM_PLANT_NUM");
		
		var oItem = oEvent.getParameter("listItem");
    	var oTable = this.getView().byId("fluTrnsQulAnlyEntrTable");
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
	
 	/** @Function to clean up add dialog
 	 */	     
	cleanAddDialog: function(){
		var arr = ["addDate","addShift","addMatTrans","addMatTransFrm","addMatTransTo","addZnGPL","addDen"];
		for(var i=0; i<arr.length; i++){
			sap.ui.core.Fragment.byId("idQualAnalysisRec",arr[i]).setValue("");
			sap.ui.core.Fragment.byId("idQualAnalysisRec",arr[i]).setValueState("None");
		}		
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
				FRM_MAT_DESC: function(oContext) {
					var name = oContext.getProperty("FRM_MAT_DESC");
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
				ZN_GPL_PARAM: function(oContext) {
					var name = oContext.getProperty("ZN_GPL_PARAM");
					return {
						key: name,
						text: name
					};
				},
				DEN_PARAM: function(oContext) {
					var name = oContext.getProperty("DEN_PARAM");
					return {
						key: name,
						text: name
					};
				}
		};		
	}
});

});