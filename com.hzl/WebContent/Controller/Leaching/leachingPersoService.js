sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "leachingRecords-FTR_Table-recordDate",
                        order: 0,
                        text: "{i18n>date}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordQuality",
                        order: 1,
                        text: "{i18n>qualityM3}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordQualityUOM",
                        order: 2,
                        text: "Quantity UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMic",
                        order: 3,
                        text: "{i18n>micZnMt}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMicUOM",
                        order: 4,
                        text: "Zn MIC UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordGpl",
                        order: 5,
                        text: "{i18n>znGpl}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordGplUOM",
                        order: 6,
                        text: "Zn GPL UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtVolume",
                        order: 7,
                        text: "{i18n>mtVol}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtVolumeUOM",
                        order: 8,
                        text: "Zn Vol UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordFrmPlt",
                        order: 9,
                        text: "{i18n>frmPlt}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordToPlt",
                        order: 10,
                        text: "{i18n>toPlt}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtrNumFrm",
                        order: 10,
                        text: "{i18n>mtrNoFrm}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtrNumTo",
                        order: 10,
                        text: "{i18n>mtrNoTo}",
                        visible: true
                    }
                ]
            },

            /** @Function call to get the persona data
             */
            getPersData: function() {
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
            setPersData: function(oBundle) {
                var oDeferred = new jQuery.Deferred();
                this._oBundle = oBundle;
                oDeferred.resolve();
                return oDeferred.promise();
            },

            /** @Function call to reset the persona data
             */
            resetPersData: function() {
                var oDeferred = new jQuery.Deferred();
                var oInitialData = {
                    _persoSchemaVersion: "1.0",
                    aColumns: [{
                            id: "leachingRecords-FTR_Table-recordDate",
                            order: 0,
                            text: "{i18n>date}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordQuality",
                            order: 1,
                            text: "{i18n>qualityM3}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordQualityUOM",
                            order: 2,
                            text: "Quantity UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMic",
                            order: 3,
                            text: "{i18n>micZnMt}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMicUOM",
                            order: 4,
                            text: "Zn MIC UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordGpl",
                            order: 5,
                            text: "{i18n>znGpl}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordGplUOM",
                            order: 6,
                            text: "Zn GPL UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtVolume",
                            order: 7,
                            text: "{i18n>mtVol}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtVolumeUOM",
                            order: 8,
                            text: "Zn Vol UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordFrmPlt",
                            order: 9,
                            text: "{i18n>frmPlt}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordToPlt",
                            order: 10,
                            text: "{i18n>toPlt}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtrNumFrm",
                            order: 10,
                            text: "{i18n>mtrNoFrm}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtrNumTo",
                            order: 10,
                            text: "{i18n>mtrNoTo}",
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
            getCaption: function(oColumn) {
                if (oColumn.getHeader() && oColumn.getHeader().getText) {
                    if (oColumn.getHeader().getText() === "Weight") {
                        return "Weight (Important!)";
                    }
                }
                return null;
            },

            /** @Function call to group the list
             */
            getGroup: function(oColumn) {
                if (oColumn.getId().indexOf('productCol') != -1 ||
                    oColumn.getId().indexOf('supplierCol') != -1) {
                    return "Primary Group";
                }
                return "Secondary Group";
            }
        };

        return DemoPersoService;

    }, true);sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "leachingRecords-FTR_Table-recordDate",
                        order: 0,
                        text: "{i18n>date}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordQuality",
                        order: 1,
                        text: "{i18n>qualityM3}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordQualityUOM",
                        order: 2,
                        text: "Quantity UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMic",
                        order: 3,
                        text: "{i18n>micZnMt}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMicUOM",
                        order: 4,
                        text: "Zn MIC UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordGpl",
                        order: 5,
                        text: "{i18n>znGpl}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordGplUOM",
                        order: 6,
                        text: "Zn GPL UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtVolume",
                        order: 7,
                        text: "{i18n>mtVol}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtVolumeUOM",
                        order: 8,
                        text: "Zn Vol UOM",
                        visible: false
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordFrmPlt",
                        order: 9,
                        text: "{i18n>frmPlt}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordToPlt",
                        order: 10,
                        text: "{i18n>toPlt}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtrNumFrm",
                        order: 10,
                        text: "{i18n>mtrNoFrm}",
                        visible: true
                    },
                    {
                        id: "leachingRecords-FTR_Table-recordMtrNumTo",
                        order: 10,
                        text: "{i18n>mtrNoTo}",
                        visible: true
                    }
                ]
            },

            /** @Function call to get the persona data
             */
            getPersData: function() {
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
            setPersData: function(oBundle) {
                var oDeferred = new jQuery.Deferred();
                this._oBundle = oBundle;
                oDeferred.resolve();
                return oDeferred.promise();
            },

            /** @Function call to reset the persona data
             */
            resetPersData: function() {
                var oDeferred = new jQuery.Deferred();
                var oInitialData = {
                    _persoSchemaVersion: "1.0",
                    aColumns: [{
                            id: "leachingRecords-FTR_Table-recordDate",
                            order: 0,
                            text: "{i18n>date}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordQuality",
                            order: 1,
                            text: "{i18n>qualityM3}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordQualityUOM",
                            order: 2,
                            text: "Quantity UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMic",
                            order: 3,
                            text: "{i18n>micZnMt}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMicUOM",
                            order: 4,
                            text: "Zn MIC UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordGpl",
                            order: 5,
                            text: "{i18n>znGpl}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordGplUOM",
                            order: 6,
                            text: "Zn GPL UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtVolume",
                            order: 7,
                            text: "{i18n>mtVol}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtVolumeUOM",
                            order: 8,
                            text: "Zn Vol UOM",
                            visible: false
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordFrmPlt",
                            order: 9,
                            text: "{i18n>frmPlt}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordToPlt",
                            order: 10,
                            text: "{i18n>toPlt}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtrNumFrm",
                            order: 10,
                            text: "{i18n>mtrNoFrm}",
                            visible: true
                        },
                        {
                            id: "leachingRecords-FTR_Table-recordMtrNumTo",
                            order: 10,
                            text: "{i18n>mtrNoTo}",
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
            getCaption: function(oColumn) {
                if (oColumn.getHeader() && oColumn.getHeader().getText) {
                    if (oColumn.getHeader().getText() === "Weight") {
                        return "Weight (Important!)";
                    }
                }
                return null;
            },

            /** @Function call to group the list
             */
            getGroup: function(oColumn) {
                if (oColumn.getId().indexOf('productCol') != -1 ||
                    oColumn.getId().indexOf('supplierCol') != -1) {
                    return "Primary Group";
                }
                return "Secondary Group";
            }
        };

        return DemoPersoService;

    }, true);