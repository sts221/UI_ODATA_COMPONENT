jQuery.sap.declare("sns.basis.myFiori.Component");

sap.ui.core.UIComponent.extend("sns.basis.myFiori.Component", {
    createContent : function() {
		// create root view
   		var oView = sap.ui.view({
			id:"idInitialView1", 
			viewName:"sns.basis.myFiori.ui5_odata.InitialView", 
			type:sap.ui.core.mvc.ViewType.JS,
			viewData: { component: this}
		});

		
		// Next section for mock server access
		var oMockServer = new sap.ui.core.util.MockServer({ rootUri: "http://mymockserver/", });
		oMockServer.simulate("model/ZSNS_USERS_CRUD_SRV.xml");
		oMockServer.start();
		var oModel = new sap.ui.model.odata.ODataModel("http://mymockserver/", true);
		oView.setModel(oModel);
		return oView;
		
   		
		/*
		// Next section for OData model access 
		var oModel = new sap.ui.model.odata.v2.ODataModel(
				// "proxy/http/sapsb.rcmp-grc.gc.ca:8006/sap/opu/odata/sap/Z_USERS_CRUD_SRV",
				"proxy/http/sapdev.rcmp-grc.gc.ca:8007/sap/opu/odata/sap/ZSNS_USERS_CRUD_SRV",
				true, "000232017", "Bwater$1");
		oModel.setHeaders({
			"DataServiceVersion" : "2.0",
			"MaxDataServiceVersion" : "2.0"
		});
		oModel.attachMetadataFailed(function() {
			alert("Model cannot be instantiated");
			return false;
		});
		oModel.attachMetadataLoaded(function() {
			// alert("Model correctly instantiated.$metadata
			// loaded");
			
			// sap.ui.getCore().setModel(oModel);
			oView.setModel(oModel);
			var oMetadata = oModel.getServiceMetadata();
			return oView;
		});
		// End of Odata model access
		*/
		
		//sap.ui.getCore().setModel(oModel);
	 } 
});