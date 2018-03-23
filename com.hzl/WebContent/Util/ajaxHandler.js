sap.ui.define([], function() {
	"use strict";
	var ajaxHandler = {
	    
		/** 
		 * @Function gives the instance of ajax call
		 */			
		getInstance: function() {
			var init = function() {
				this.requestUri = "http://10.101.23.146:50000";
				this.requestMethod = "GET";
				this.oRequestData = {};
			};
			
			this._reference = this;
			var fnct = jQuery.proxy(init, this);
			fnct();
			return this;
		},

		/** 
		 * @Function triggers the ajax request 
		 * @Example post ,get ,put ajax requests
		 */			
		_triggerRequest: function() {
		
		var request = $.ajax({
							url: this.requestUri,
							method: this.requestMethod,
							data: this.oRequestData,
							//dataType: this.contentType,
							cache: false
						});
		var that = this;				

						request.done(function(msg) {
							if(that.callBackSuccess)
							that.callBackSuccess.call(that._reference, msg);
						});

						request.fail(function(jqXHR, textStatus) {
						    if(that.callBackFailure)
                            that.callBackFailure.call(that._reference, jqXHR, textStatus);
						});

						request.always(function() {
						    if(that.callBackAlways)
                            that.callBackAlways.call(that._reference);
						});


		},
		
		/** 
		 * @Function triggers post request
		 */	
		triggerPostRequest: function() {
           this.setRequestMethod("POST");
           this._triggerRequest();
		},
		
		/** 
		 * @Function triggers put request
		 */	
		triggerPutRequest: function() {
           this.setRequestMethod("PUT");
           this._triggerRequest();
		},
		
		/** 
		 * @Function triggers get request
		 */	
		triggerGetRequest: function() {
            this.setRequestMethod("GET");
            this._triggerRequest();
		},
		
		/** 
		 * @Function sets the request method
		 */			
		setRequestMethod: function(sMethod){
		  this.requestMethod = sMethod;  
		},

		/** 
		 * @Function sets the url context
		 */	
		setUrlContext: function(oContext) {
			if (!oContext.startsWith('/')) {
				$(oContext).append("/");
			}

			this.requestUri += oContext;
		},

		/** 
		 * @Function sets the url properties
		 */		
		setProperties: function(sAttrib, sValue) {
			if (this.requestUri.indexOf('?') !== -1) {
				this.requestUri = this.requestUri + "&" + sAttrib + "=" + sValue;
			} else {
				
				this.requestUri += '?';
				this.requestUri = this.requestUri + sAttrib + "=" + sValue;
			}
		},
		
		/** 
		 * @Function sets the request data
		 */
		setRequestData: function(oRequestData) {
			this.oRequestData = JSON.stringify(oRequestData);
		},

		/** 
		 * @Function sets the success call back function
		 */		
		setCallBackSuccessMethod: function(fName, oContext) {
			this.callBackSuccess = fName;
			this._reference = oContext;
		},
		
		/** 
		 * @Function sets the failure call back function
		 */			
		setCallBackFailureMethod: function(fName, oContext) {
			this.callBackFailure = fName;
			this._reference = oContext;
		},

		/** 
		 * @Function sets the always call back function
		 */			
		setCallBackAlwaysMethod: function(fName, oContext) {
			this.callBackAlways = fName;
			this._reference = oContext;
		}

	};
	return ajaxHandler;
});