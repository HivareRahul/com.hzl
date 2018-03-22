sap.ui.define([
		"com/hzl/Controller/baseController",
		"sap/m/MessageBox",
		"sap/ui/model/resource/ResourceModel",
		"com/hzl/Controller/SolSlurrQualScrn/solSlurrQualScrnPersoService",
		"sap/m/TablePersoController",
		"sap/ui/model/json/JSONModel",
		"com/hzl/Util/ajaxHandler"
	], function(baseController, MessageBox, ResourceModel, solSlurrQualScrnPersoService, TablePersoController, JSONModel, ajaxHandler) {
		"use strict";

	return baseController.extend("com.hzl.Controller.SolSlurrQualScrn.solSlurrQualScrn", {

		/** SAP UI5 life cycle method triggered on first load 
		 *  @DefaultValue setting default value for date control 
		 *  @Visiblity hiding and showing controls based on requirement
		 *  @Models i18n for ResourceModel and viewModel for basic view operations
		 */
		onInit : function (evt) {
			this.getView().setModel(new JSONModel({enable:false}),"viewModel");	
			this.oViewModel = this.getView().getModel("viewModel");
			this.getView().byId("SSQSdate").setValue(this.changeDateFormat(new Date()).slice(0,10));
			this.getView().setModel(new ResourceModel({ bundleUrl : "i18n/messageBundle.properties"}), "i18n");
			this._oTPC = new TablePersoController({
				table: this.getView().byId("SSQS_Table"),
				componentName: "SSQS",
				persoService: solSlurrQualScrnPersoService
			}).activate();			
		},

		/** @Event search event name onSearch triggers when search button clicked
		 *  @Validation validation for Empty mandatory fields and reverse date
		 */			
		onSearch:function(oEvent){					
			this.oViewModel.setProperty("/enable", true);			
			var that = this;	
    		var date = this.getView().byId("SSQSdate");
    		var plant = this.getView().byId("SSQSplant");    		
    		if(this.validation(this.filterBar) > 0){
    			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));     			
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
    		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QULTY_DIS");   
    		// 03-22-2018 08:44:00
    		oAjaxHandler.setProperties("Param.1",date.getValue() + " 00:00:00");
    		oAjaxHandler.setProperties("Param.2",plant.getValue());
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
        	
    	/** @Function validation for empty data in mandatory fields
    	 *  @Return numeric value
    	 */          
    	validation: function(){
    		var that = this;
    		var result = 0;
    		var arr = ["SSQSplant","SSQSdate"];
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
         
     	/** @Method called when reset button is clicked
     	 *  @Functinality resets the control data 
     	 */	         
        onReset:function(oEvent){
    		var arr = ["SSQSplant","SSQSdate"];
    		for(var i=0;i<arr.length;i++){
    			this.getView().byId(arr[i]).setValue("");
    		}
        },

		/** @Event press event triggers when view setting icon clicked on table header
		 */ 
		handleViewSettings: function (oEvent) {
			if (!this._settingDialog) {
				this._settingDialog = sap.ui.xmlfragment("com.hzl.view.SolSlurrQualScrn.solSlurrQualScnSttgs", this);
		        this._settingDialog.setModel(this.getView().getModel("i18n"), "i18n"); 				
			}
			this._settingDialog.open();
		},

		/** @Event press event triggers when setting icon clicked on table header
		 */
		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		}
	});	

});



// http://10.101.23.146:50000/XMII/Illuminator?j_user=CSPPRH&j_password=system@01&QueryTemplate=SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QULTY_DIS&Content-Type=text/json&Param.1=03-19-2018 00:00:00&Param.2=HYDRO-1