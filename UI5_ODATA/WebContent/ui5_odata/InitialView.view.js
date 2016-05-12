sap.ui.jsview("sns.basis.myFiori.ui5_odata.InitialView", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui5_odata.InitialView
	*/ 
	getControllerName : function() {
		return "sns.basis.myFiori.ui5_odata.InitialView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui5_odata.InitialView
	*/ 
	createContent : function(oController) {
		
		var appHeader = new sap.ui.commons.ApplicationHeader('appHeader', {
            logoText: "CRUD operations",
            // logoSrc:"images/runsimple.png",
            displayLogoff: false,
            displayWelcome: true,
            userName: "Sorin Stancu"
        });
		 
		 var oTable = new sap.ui.table.Table(this.createId("oTableId"), {
		     editable: false,
		     toolbar: new sap.ui.commons.Toolbar({
		              items: [
		                      // ================== CALL FRAGMENT BUTTON =========================
		                      new sap.ui.commons.Button({
		                    	 text: "Call fragment",
		                    	 press: oController.callFragmentAlertTST
		                      }), 
		                      
		                      // ================== CREATE USER MATRIX FORM=================
		                      new sap.ui.commons.Button({
		                    	 text: "CREATE USER (Matrix Layout)",
		                    	 press: function() {
		                    		 var idx = oTable._getRowCount();
		                    		 idx++;
		                    		 oController.createUser(idx);
		                    	 }
		                      }),
		                      // ================== CREATE BUTTON SIMPLE FORM ================================
		                      new sap.ui.commons.Button({
		                    	  text: "Create user (Simple form)",
		                    	  press: function() {
		                    		 var userID = oTable._getRowCount();
		                    		 /* 
		                    		  * The issue here is that var rows = oTable.getRows() will return only the number 
		                    		  * of rows displayed on the screen
		                    		  */
		                    		 oController.openCreateDialog(userID+1);
		                    	  }
		                      }), 
		                      // ================== UPDATE BUTTON ================================
		                      new sap.ui.commons.Button({
		                    	  text: "Update",
		                    	  press: function() {
//		                    		  var idx = oTable.getSelectedIndex();
//		                    		  if (idx == -1) return;
//		                    		  var rows = oTable.getRows();
//		                    		  var user = rows[idx].getCells();
//		                    		  oController.openUpdateDialog(user);
		                    		  
		                    		  var idx = oTable.getSelectedIndex();
		                    		  if (idx == -1) {
		                    			  jQuery.sap.require("sap.ui.commons.MessageBox");
		                    			  sap.ui.commons.MessageBox.show(
		                    					  "Please select a row first",
		                    					  sap.ui.commons.MessageBox.Icon.ERROR,
		                    					  "ERROR"		                    					  
		                    					  );
		                    			  return;
		                    			  };
		                    	      var ctx = oTable.getContextByIndex(idx).sPath;
		                              oController.openUpdateDialog(ctx);
		                    	  }
		                       }),
		                       // ================== DELETE BUTTON =================================
		                       new sap.ui.commons.Button({
		                    	   text: "Delete user",
		                    	   press: function() {
		                    		   var idx = oTable.getSelectedIndex();
		                    		   // debugger;
		                    		   if (idx == -1) {
		                    		   jQuery.sap.require("sap.ui.commons.MessageBox");
		                    			  /* sap.ui.commons.MessageBox.show(
		                    					  "Please select a row first",
		                    					  sap.ui.commons.MessageBox.Icon.ERROR,
		                    					  "ERROR"		                    					  
		                    					  );
		                    					  */
		                    		      sap.m.MessageToast.show("Please select a row first", { duration: 1000 });
		                    			  return;
		                    		   }; // end idx == -1
		                    		   
                                       // var rows = oTable.getRows();
                                       // var user = rows[idx].getCells();
		                    		   var ctx = oTable.getContextByIndex(idx).sPath; // sPath is "/UserSet('A.TEST%40ATP.COM')"
		                    		   oController.openDeleteDialog(ctx);
		                    	   }
		                       })
		                      ] // end of items
		    }) // end of toolbar
		 }); //end of Table
		 
		 oTable.addColumn(new sap.ui.table.Column({
			 label: new sap.ui.commons.Label({text: "ID"}),
			 template: new sap.ui.commons.TextView({text: "{Id}"}),
			 width: "40px",
			 sortProperty: "ID",
			 editable: false
		 }));
		 
		 oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Email"}),
            // template: new sap.ui.commons.TextField().bindProperty("value", "Email"),
            template: new sap.ui.commons.TextView({text: "{Email}"}),
            sortProperty: "Email",
            editable: false
        }));
		 
		 oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({text: "Firstname"}),
            // template: new sap.ui.commons.TextField().bindProperty("value", "Firstname"),
            template: new sap.ui.commons.TextView({text: "{Firstname}"}),
            sortProperty: "Firstname",
            editable: false
        }));
		 
		 oTable.addColumn(new sap.ui.table.Column({
		     label: new sap.ui.commons.Label({text: "Lastname"}),
		     // template: new sap.ui.commons.TextField().bindProperty("value", "Lastname"),
		     template: new sap.ui.commons.TextView({text: "{Lastname}"}),
		     sortProperty: "Lastname",
		     editable: false		 
		 }));
		 
		 oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Age"}),
			// template: new sap.ui.commons.TextField().bindProperty("value", "Age"),
			// template: new sap.ui.commons.TextField({value: "{Age}"}),
			template: new sap.ui.commons.TextView({text: "{Age}"}),
			sortProperty: "Age",
			width: "50px",
			editable: false
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Address"}),
			// template: new sap.ui.commons.TextField().bindProperty("value", "Address"),
			// template: new sap.ui.commons.TextField({value: "{Address}"}),
			template: new sap.ui.commons.TextView({text: "{Address}"}),
			sortProperty: "Address",
			editable: false	
		}));
		
		/* var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});
		var TZOffset = new Date(0).getTimezoneOffset()*60*1000;
		var dateStr = dateFormat.format(new Date(FlightDate.getTime() + TZOffsetMs)); //05-12-2012   
		var parsedDate = new Date(dateFormat.parse(dateStr).getTime() - TZOffsetMs); //1354665600000 */   
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// +++++++++++++++++      HANDLING THE DATE COLUMN in a table +++++++++++++++++++++
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		/* Without the TYPE, the date is displayed as: Wed Mar 23 2016 20:00:00 GMT-0400 (Eastern Daylight Time)
		 * When displaying the date, we need to extract the offset in milisecs. 
		 * When saving the date in the controller, we add the offset
		 */
		
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text: "Date created"}),
			width: "100px",
			/* template: new sap.ui.commons.TextView({text: "{Datecreated}", type:  new sap.ui.model.type.Date({pattern: "dd.MM.YYYY"})}), */
			template: new sap.ui.commons.TextView("TD", {
				text: {
					    path: "Datecreated", 
					    /*formatter: function(value) {
					    	console.log("THIS :" + value);
					    },*/  		    
					    type: new sap.ui.model.type.Date({pattern: "dd.MM.YYYY", UTC: true})
				}
			}),
			editable:false
		}));
		
		// oTable.setModel(oModel); // Do I need this ?
		// debugger;
        oTable.bindRows("/UserSet");
        
//		layout.createRow(appHeader);
		var ele = [appHeader,oTable];
		return ele;

	}


	}

);
