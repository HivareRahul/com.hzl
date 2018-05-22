sap.ui.define([], function () {
	"use strict";
	return {
        /** @Function to remove the date stamp and to change the date format
         */
		removeDateStamp: function (myDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MMM dd,yyyy"});
			return  oDateFormat.format(new Date(myDate));
		},
		
        /** @Function to make the required fields editable
         */		
		solSlryRptFactorField: function(mytableFieldData){
            if (mytableFieldData === "TH5") {  
                return false;
            }else {       
                return true;
            }			
		},
		
        /** @Function to make the required fields editable
         */		
		solSlryRptZnMICField: function(mytableFieldData){
            if (mytableFieldData === "TH5") {  
                return true;
            }else {       
                return false;
            }			
		},

        /** @Function to apply CSS
         */		
		solSlryRptClss: function(mytableFieldData){               
            if (mytableFieldData === "TH5") {                
            	return "dykeThickner";
            }else if(mytableFieldData === "RE"){                	    
            	return "reactor";            	
            }else if(mytableFieldData.slice(0,2) === "TH"){                	   
            	return "thickner"; 
            } else {                	 
            	return "tank";             	
            }			
		}
	};
});