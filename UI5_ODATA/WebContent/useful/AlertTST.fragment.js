/**
 * 
 */
sap.ui.jsfragment("useful.AlertTST", {
	   createContent: function(oController) {
		   var oDialog = new sap.ui.commons.Dialog({title: "JavaScript Fragment Dialog"});
	        
	        // BINDING EXAMPLE": var oText = new sap.ui.commons.TextView({text: "{/dialogText}"});
		   var oText = new sap.ui.commons.TextView({text: "Fragment text"});
	        oDialog.addContent(oText);
	        
	        var oButton = new sap.ui.commons.Button({
	            text: "Close",
	            press: function(){oDialog .close();}
	        });
	        oDialog.addButton(oButton);

	        return oDialog;
	        /* you can call functions back in the controller
	         * press:oController.doSomething
	         */
	         

	   }
});