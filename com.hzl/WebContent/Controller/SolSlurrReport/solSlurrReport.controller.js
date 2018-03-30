sap.ui.define([
		"com/hzl/Controller/baseController",
		"sap/ui/model/json/JSONModel",
		"com/hzl/Util/ajaxHandler",
		"sap/m/MessageBox"
	], function(baseController, JSONModel, ajaxHandler, MessageBox) {
	"use strict";

	return baseController.extend("com.hzl.Controller.SolSlurrReport.solSlurrReport", {
		/** SAP UI5 life cycle method triggered on first load 
		 *  @DefaultValue setting default value for date control 
		 *  @Models viewModel for basic view operations and another i18n for ResourceModel
		 *  @Method initialSettings for user data and role based visiblity
		 */
		onInit : function (evt) {
			this.getView().setModel(new JSONModel({userDetails:[]}),"viewModel");	
			this.oViewModel = this.getView().getModel("viewModel");	
			this.getView().byId("SSRdate").setValue(this.changeDateFormat(new Date()).slice(0,10));
			this.initialSettings();			
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
		},
		
		/** @Function callback function for ajax fail
		 */			
		failRequestIniSttg: function(rs){
			sap.m.MessageBox.alert(rs.statusText);
		},
         
     	/** @Method called when reset button is clicked
     	 *  @Functinality resets the control data 
     	 */	         
        onReset:function(oEvent){
    		this.getView().byId("SSRdate").setValue("");
    		this.getView().byId("SSRplant").setSelectedKey(null);
        },

		/** @Event search event name onSearch triggers when search button clicked
		 *  @Validation validation for Empty mandatory fields and reverse date
		 */			
		onSearch:function(oEvent){								
			var that = this;	
    		var date = this.getView().byId("SSRdate");
    		var plant = this.getView().byId("SSRplant");    		
    		if(this.validation() > 0){
    			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));     			
    			return;
    		}	
			/*this.startBusyIndicator();		
			jQuery.sap.delayedCall(3000, this, function () {
				this.stopBusyIndicator();
			});	
    		var oAjaxHandler = ajaxHandler.getInstance();
    		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/SOLUTION_SLURRY/QRY/XQRY_SOLUNSLUR_QULTY_DIS");   
    		oAjaxHandler.setProperties("Param.1",date.getValue() + " 00:00:00");
    		oAjaxHandler.setProperties("Param.2",plant.getValue());
    		oAjaxHandler.setCallBackSuccessMethod(this.successSrch, this);
    		oAjaxHandler.setCallBackFailureMethod(this.failRequestScrch, this);
    		oAjaxHandler.triggerPostRequest(); */   		    		
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
     	}
	
	});	

});