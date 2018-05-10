sap.ui.define([], function () {
	"use strict";
	return {
		removeDateStamp: function (myDate) {
			return myDate.slice(0,10);
		}
	};
});