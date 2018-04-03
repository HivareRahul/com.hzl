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
			this.getView().setModel(new JSONModel({enable:false,userDetails:[]}),"viewModel");	
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
        onReset:function(){
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
    		if(true){
    			return;
    		}
    		this.getView().setModel(new JSONModel({first:"",second:"",third:"",fourth:"",fifth:""}), "myEdit");
    		var myEditModel = this.getView().getModel("myEdit").getData();
    		var row = oEvent.getParameter("listItem").getBindingContext("tableModel");        		
    		myEditModel.first = row.getProperty("S_DATE");
    		myEditModel.second = row.getProperty("GUID");
    		myEditModel.third = row.getProperty("STATUS"); 
    		myEditModel.fifth = row.getProperty("TAG_ID"); 
    		
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
     		var that = this;
     		this.oViewModel.setProperty("/enable", false);
     		var myEditModel1 = this.getView().getModel("myEdit").getData();	
     		var oTable = this.getView().byId("fluTrnsQulAnlyEntrTable");
     		myEditModel1.fourth = oTable.getSelectedItem().getCells()[5].getValue();
     		myEditModel1.first = oTable.getSelectedItem().getCells()[7].getValue();
     		var oAjaxHandler = ajaxHandler.getInstance();
     		oAjaxHandler.setProperties("QueryTemplate","SAP_ZN_REC/FLUID_TRANSFER_REPORT/QRY/XQRY_FLUID_TRN_UPD_ROW_QUAL");
     		oAjaxHandler.setProperties("Param.1",myEditModel1.first);
     		oAjaxHandler.setProperties("Param.2",myEditModel1.second);
     		oAjaxHandler.setProperties("Param.3",myEditModel1.third);
     		oAjaxHandler.setProperties("Param.4",myEditModel1.fourth);
     		oAjaxHandler.setProperties("Param.5",myEditModel1.fifth);
     		oAjaxHandler.setProperties("Param.6",myEditModel1.sixth);
     		oAjaxHandler.setProperties("Param.7",myEditModel1.seventh);
     		oAjaxHandler.setProperties("Param.8",myEditModel1.eight);
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
     	}
	
	});	

});