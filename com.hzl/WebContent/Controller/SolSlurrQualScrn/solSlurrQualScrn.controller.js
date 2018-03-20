sap.ui.define([
		"com/hzl/Controller/baseController",
		"sap/m/MessageBox"
	], function(baseController, MessageBox) {
	"use strict";

	return baseController.extend("com.hzl.Controller.SolSlurrQualScrn.solSlurrQualScrn", {
		/** SAP UI5 life cycle method triggered on first load 
		 *  @DefaultValue setting default value for date control 
		 *  @Visiblity hiding and showing controls based on requirement
		 */
		onInit : function (evt) {
			this.getView().byId("SSQSupdate").setEnabled(false);
			this.getView().byId("SSQScancel").setEnabled(false);			
			this.getView().byId("SSQSdate").setValue(this.changeDateFormat(new Date()).slice(0,10));
		},

		/** @Event search event name onSearch triggers when search button clicked
		 *  @Validation validation for Empty mandatory fields and reverse date
		 */			
		onSearch:function(oEvent){	
			this.getView().byId("SSQSupdate").setEnabled(false);
			this.getView().byId("SSQScancel").setEnabled(false);
			var that = this;	
    		var date = this.getView().byId("SSQSd");
    		var plant = this.getView().byId("SSQSplant");    		
    		if(this.validation(this.filterBar) > 0){
    			MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("mandAlert"));     			
    			return;
    		}    		
    	    if (Date.parse(fromDate.getValue().slice(0,10)+" "+fromDate.getValue().slice(11).split("-").join(":")) >= Date.parse(toDate.getValue().slice(0,10)+" "+toDate.getValue().slice(11).split("-").join(":"))) {	    	
    	    	MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("dateAlert"));     	    	
    	        return;
    	    }
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
        }
	});	

});