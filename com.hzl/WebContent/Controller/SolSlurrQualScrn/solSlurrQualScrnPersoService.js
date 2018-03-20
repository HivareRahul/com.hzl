sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";
	var DemoPersoService = {
		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "SSQS-SSQS_Table-smpId",
					order: 0,
					text: "{i18n>SSQS_smpId}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-smpNm",
					order: 1,
					text: "{i18n>SSQS_smpNm}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-smpGrp",
					order: 2,
					text: "{i18n>SSQS_smpGrp}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-znGPL",
					order: 3,
					text: "{i18n>SSQS_znGpl}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-perH2o",
					order: 4,
					text: "{i18n>SSQS_h2o}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-bdGrmCc",
					order: 5,
					text: "{i18n>SSQS_bd}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-perTzn",
					order: 6,
					text: "{i18n>SSQS_tZn}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-solGpl",
					order: 7,
					text: "{i18n>SSQS_sldGpl}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-perPb",
					order: 8,
					text: "{i18n>SSQS_pb}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-perZn",
					order: 9,
					text: "{i18n>SSQS_zn}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-perCd",
					order: 10,
					text: "{i18n>SSQS_cd}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-perAg",
					order: 11,
					text: "{i18n>SSQS_ag}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-sluDen",
					order: 12,
					text: "{i18n>SSQS_sluDen}",
					visible: true
				},
				{
					id: "SSQS-SSQS_Table-solDen",
					order: 13,
					text: "{i18n>SSQS_sldDen}",
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
									id: "SSQS-SSQS_Table-smpId",
									order: 0,
									text: "{i18n>SSQS_smpId}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-smpNm",
									order: 1,
									text: "{i18n>SSQS_smpNm}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-smpGrp",
									order: 2,
									text: "{i18n>SSQS_smpGrp}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-znGPL",
									order: 3,
									text: "{i18n>SSQS_znGpl}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-perH2o",
									order: 4,
									text: "{i18n>SSQS_h2o}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-bdGrmCc",
									order: 5,
									text: "{i18n>SSQS_bd}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-perTzn",
									order: 6,
									text: "{i18n>SSQS_tZn}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-solGpl",
									order: 7,
									text: "{i18n>SSQS_sldGpl}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-perPb",
									order: 8,
									text: "{i18n>SSQS_pb}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-perZn",
									order: 9,
									text: "{i18n>SSQS_zn}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-perCd",
									order: 10,
									text: "{i18n>SSQS_cd}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-perAg",
									order: 11,
									text: "{i18n>SSQS_ag}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-sluDen",
									order: 12,
									text: "{i18n>SSQS_sluDen}",
									visible: true
								},
								{
									id: "SSQS-SSQS_Table-solDen",
									order: 13,
									text: "{i18n>SSQS_sldDen}",
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