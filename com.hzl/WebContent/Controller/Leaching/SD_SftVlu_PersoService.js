sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var DemoPersoService = {
            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: [{
                        id: "shtVluTbl-shtVluTbl-SV_dt",
                        order: 0,
                        text: "{i18n>SD_SV_dt}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_sft",
                        order: 1,
                        text: "{i18n>SD_SV_sft}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_spEstZnGPL",
                        order: 2,
                        text: "{i18n>SD_SV_spEstZnGPL}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_spWstZnGPL",
                        order: 3,
                        text: "{i18n>SD_SV_spWstZnGPL}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_fdEstInZnGPL",
                        order: 4,
                        text: "{i18n>SD_SV_fdEstInZnGPL}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_fdWstInZnGPL",
                        order: 5,
                        text: "{i18n>SD_SV_fdWstInZnGPL}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_den",
                        order: 6,
                        text: "{i18n>SD_SV_dst}",
                        visible: true
                    },
                    {
                        id: "shtVluTbl-shtVluTbl-SV_znGPL",
                        order: 7,
                        text: "{i18n>SD_SV_znGPL}",
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
                            id: "shtVluTbl-shtVluTbl-SV_dt",
                            order: 0,
                            text: "{i18n>SD_SV_dt}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_sft",
                            order: 1,
                            text: "{i18n>SD_SV_sft}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_spEstZnGPL",
                            order: 2,
                            text: "{i18n>SD_SV_spEstZnGPL}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_spWstZnGPL",
                            order: 3,
                            text: "{i18n>SD_SV_spWstZnGPL}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_fdEstInZnGPL",
                            order: 4,
                            text: "{i18n>SD_SV_fdEstInZnGPL}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_fdWstInZnGPL",
                            order: 5,
                            text: "{i18n>SD_SV_fdWstInZnGPL}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_den",
                            order: 6,
                            text: "{i18n>SD_SV_dst}",
                            visible: true
                        },
                        {
                            id: "shtVluTbl-shtVluTbl-SV_znGPL",
                            order: 7,
                            text: "{i18n>SD_SV_znGPL}",
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