sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";
	var DemoPersoService = {
		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "SSR-SSR_Table-smp",
					order: 0,
					text: "{i18n>SSR_smp}",
					visible: true
				},
				{
					id: "SSR-SSR_Table-std",
					order: 1,
					text: "{i18n>SSR_std}",
					visible: true
				},
				{
					id: "SSR-SSR_Table-fac",
					order: 2,
					text: "{i18n>SSR_fac}",
					visible: true
				},
				{
					id: "SSR-SSR_Table-actVol",
					order: 3,
					text: "{i18n>SSR_actVol}",
					visible: true
				},
				{
					id: "SSR-SSR_Table-znGpl",
					order: 4,
					text: "{i18n>SSR_znGpl}",
					visible: true
				},
				{
					id: "SSR-SSR_Table-znKg",
					order: 5,
					text: "{i18n>SSR_znMic}",
					visible: true
				}
			]
		},

		/** @Function call to get the persona data
		 */	
		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			var oBundle = this._oBundle;
			oDeferred.resolve(oBundle);
			return oDeferred.promise();
		},

		/** @Function call to set the persona data
		 */	
		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},
		
		/** @Function call to reset the persona data
		 */	
		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();
			var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns : [
								{
									id: "SSR-SSR_Table-smp",
									order: 0,
									text: "{i18n>SSR_smp}",
									visible: true
								},
								{
									id: "SSR-SSR_Table-std",
									order: 1,
									text: "{i18n>SSR_std}",
									visible: true
								},
								{
									id: "SSR-SSR_Table-fac",
									order: 2,
									text: "{i18n>SSR_fac}",
									visible: true
								},
								{
									id: "SSR-SSR_Table-actVol",
									order: 3,
									text: "{i18n>SSR_actVol}",
									visible: true
								},
								{
									id: "SSR-SSR_Table-znGpl",
									order: 4,
									text: "{i18n>SSR_znGpl}",
									visible: true
								},
								{
									id: "SSR-SSR_Table-znKg",
									order: 5,
									text: "{i18n>SSR_znMic}",
									visible: true
								}
							]
			};

			this._oBundle = oInitialData;
			oDeferred.resolve();
			return oDeferred.promise();
		},
		
		/** @Function call to set the weight property
		 */	
		getCaption : function (oColumn) {
			if (oColumn.getHeader() && oColumn.getHeader().getText) {
				if (oColumn.getHeader().getText() === "Weight") {
					return "Weight (Important!)";
				}
			}
			return null;
		},

		/** @Function call to group the list
		 */
		getGroup : function(oColumn) {
			if ( oColumn.getId().indexOf('productCol') != -1 ||
					oColumn.getId().indexOf('supplierCol') != -1) {
				return "Primary Group";
			}
			return "Secondary Group";
		}
	};

	return DemoPersoService;

}, true);