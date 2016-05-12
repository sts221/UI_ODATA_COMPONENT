sap.ui.controller(
				"sns.basis.myFiori.ui5_odata.InitialView",
				{
					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf ui5_odata.InitialView
					 */
					onInit : function() {
						/*
						 * THE oModel IS NOW DEFINED IN THE Component.js and assigned to the view
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
							sap.ui.getCore().setModel(oModel);
							var oMetadata = oModel.getServiceMetadata();
						});
						// End of Odata model access
						*/
						
						/*
						// Next section for local mockserver access
						var oMockServer = new sap.ui.core.util.MockServer({ rootUri: "http://mymockserver/", });
						oMockServer.simulate("model/ZSNS_USERS_CRUD_SRV.xml");
						oMockServer.start();
						var oModel = new sap.ui.model.odata.ODataModel("http://mymockserver/", true);
						sap.ui.getCore().setModel(oModel);
						// End of mockserver model definition
						*/
						
						/* sap.ui.getCore().attachValidationError( function (evt){
		            	    var control = evt.getParameter("element");
		            	    if (control && control.setValueState) {
		            	    	    control.setValueState("Error");
		            	    }
		                });
		            
		                sap.ui.getCore().attachValidationSuccess( function (evt) {
		            	    var control = evt.getParameter("element");
		            	    if (control && control.setValueState) {
		            	    	     control.setValueState("None");
		            	    }
		                 })*/
					},

					// ==================================================================
					// ================== CREATE OPERATION
					// ==============================
					// ==================================================================
					openCreateDialog : function(idx) {
						
						// ++++++++++++++ CREATE DIALOG
						// +++++++++++++++++++++++++++++++++
						var oCreateDialog = new sap.ui.commons.Dialog();
						oCreateDialog.setTitle("Create new user");
						// ++++++++++++++ CREATE FORM +++++++++++++++++++++++++++++++++++++
						// +++++ We use controls from sap.m in order to have valueStateText
						// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						var oSimpleForm = new sap.ui.layout.form.SimpleForm({
							maxContainerCols : 2,
							width : "600px",
							content : [ new sap.ui.core.Title({
								text : "Person"
							}), new sap.m.Label({
								text: "UID"
							}), new sap.m.Input({
								value: idx,
								editable: false
							}), new sap.m.Label({
								text : "Email"
							}), new sap.m.Input({
								value : ""
							}), new sap.m.Label({
								text : "Firstname"
							}), new sap.m.Input("CrFname", {
								value : "",
								placeholder: "Enter first name ...",
								valueStateText: "First name must not be empty",
								value: {
				            	    path: "Firstname",
				            	    formatter: function(sVal) {
				            	    	if (!sVal) return;
				            	    	return sVal.toUpperCase();
				            	    }, 
				                }
								
							}), new sap.m.Label({
								text : "Lastname"
							}), new sap.m.Input({
								value : ""
							}), new sap.m.Label({
								text : "Age"
							}), new sap.m.Input({
								value : ""
							}), new sap.m.Label({
								text : "Address"
							}), new sap.m.Input({
								value : ""
							}), new sap.m.Label({
								text: "Date created"
							/* }), new sap.ui.commons.TextField({
								value: ""
							}) */
							   }), new sap.ui.commons.DatePicker({
								   type: new sap.ui.model.type.Date({pattern: "dd.MM.yy"})
							   })
							]
						}); // end simple form
						oCreateDialog.addContent(oSimpleForm);
						oCreateDialog.addButton(new sap.ui.commons.Button({
							text : "Submit",
							press : function() {
								var content = oSimpleForm.getContent();
								// console.log(content[2].mProperties.value);
								var oEntry = {};
								oEntry.Id = parseInt(content[2].getValue());
								oEntry.Email = content[4].getValue();
								
								// oEntry.Firstname = content[6].getValue();
								// Example of validation only for the firstname field
								var fname = sap.ui.getCore().byId("CrFname");
								// debugger;
								if (!fname.getValue()) {									
						    		fname.setValueState("Error");
						    	} else {
						    		oEntry.Firstname = content[6].getValue();
						    		fname.setValueState("Success");
						    	}
								oEntry.Lastname = content[8].getValue();
								oEntry.Age = parseInt(content[10].getValue());
								oEntry.Address = content[12].getValue();
								/* HANDLING THE DATE COLUMN 
								 * Without the TYPE, the date is displayed as: Wed Mar 23 2016 20:00:00 GMT-0400 (Eastern Daylight Time)
								 * When displaying the date, we need to extract the offset in milisecs. 
								 * When saving the date in the controller, we add the offset
								 */
								
								var TZOffsetMS = new Date(0).getTimezoneOffset()*60*1000;
								var dCreated = new Date(content[14].getValue());
								var tCreated = dCreated.getTime(); // this will be the time in msec in UTC. The time to be saved needs to be tCreated + offset
								var tCreated = tCreated + TZOffsetMS;
								oEntry.Datecreated = new Date(tCreated);
								
								var oView = sap.ui.getCore().byId("idInitialView1");
			                    var tModel = oView.getModel();
								//sap.ui.getCore().getModel().create(
			                    tModel.create(
										'/UserSet',
										oEntry,
										{
											success : function() {
												// debugger;
												// sap.ui.getCore().getModel().refresh();
												tModel.refresh();
												alert("Create success");
												oCreateDialog.close();
											},
											error : function(oError) {
												// debugger;
												alert("Create FAILED: ");
												// console.log(oError);
												// oCreateDialog.close();
											}
										});

							} // end press function
						}) // end Button
						); // end addButton

						oCreateDialog.open();
					},
					
					// ==================================================================
					// ===================== UPDATE PROCESS =============================
					// ==================================================================
                    openUpdateDialog: function (ctx) {
          	           var oUpdateDialog = new sap.ui.commons.Dialog();
        	           oUpdateDialog.setTitle("Update user's data");
        	                  
        	           // +++++++++++ READ DATA FROM THE MODEL BASED ON CONTEXT +++++++++++++++++
        	           // var oUser = tModel.getProperty("/UserSet('Email " + idx + "')");
        	           var oView = sap.ui.getCore().byId("idInitialView1");
                       var tModel = oView.getModel();
        	           
        	           // var tModel = sap.ui.getCore().getModel();
        	           var oUser = tModel.getProperty(ctx);
        	           
        	           // ++++++++++ PLAY ++++++++++++++++++++++++++
        	           // console.log(typeof oUser);
        	           // console.log(oUser);
        	           // console.log(oUser);
        	                  
        	           // +++++++++++ CREATE THE SIMPLE FORM ++++++++++++++++++++++++++++++++++++
        	           
                       var oSimpleForm = new sap.ui.layout.form.SimpleForm({
                    	                    maxContainerCols: 2, 
                    	                    content:[
                                                     new sap.ui.core.Title({text:"Person"}),
                                                     new sap.ui.commons.Label({text:"Email"}),
                                                     new sap.ui.commons.TextField({value: oUser.Email, editable: false}),
                                                     new sap.ui.commons.Label({text:"Firstname"}),
                                                     new sap.ui.commons.TextField({value: oUser.Firstname}),
                                                     new sap.ui.commons.Label({text:"Lastname"}),
                                                     new sap.ui.commons.TextField({value: oUser.Lastname}),
                                                     new sap.ui.commons.Label({text:"Age"}),
                                                     new sap.ui.commons.TextField({value: oUser.Age}),
                                                     new sap.ui.commons.Label({text:"Address"}),
                                                     new sap.ui.commons.TextField({value: oUser.Address}),
                                                    ]
                       });// end SimpleForm   
                       oUpdateDialog.addContent(oSimpleForm);
                       oUpdateDialog.addButton(
                         new sap.ui.commons.Button({
                              text: "Submit", 
                              press: function() {
                                       var content = oSimpleForm.getContent();
                                       /* for (var i=0; i<content.length; i++) {
                                    	   console.log(content[i]);   
                                       } */
                                       
                                       var oEntry = {};
                                       oEntry.Email = content[2].getValue();
                                       oEntry.Firstname = content[4].getValue();
                                       oEntry.Lastname = content[6].getValue();
                                       oEntry.Age = parseInt(content[8].getValue());
                                       oEntry.Address = content[10].getValue();
                                       // sap.ui.getCore().getModel().update("/UserSet('" + oEntry.Email + "')", oEntry,
                                       tModel.update("/UserSet('" + oEntry.Email + "')", oEntry,
                                    		   {
                                    	        success: function(){
                                    	        	                alert("Update successful");
                                    	        	                tModel.refresh();
                                    	        	                //sap.ui.getCore().getModel().refresh();
                                                                    oUpdateDialog.close();},
                                                error: function(oError){
                                                	             alert("Update failed")
                                                	             oUpdateDialog.close();
                                                                 alert("Update failed");}
                                               }
                                ); 
                            } // end of press function
                        }) // end of Button
                    ); // end of addButton
                    oUpdateDialog.open();
                    	
                    },
                    
                    openDeleteDialog: function(ctx) {
                    	// cts is in the form: "/UserSet('A.TEST%40ATP.COM')"
                    	var oDeleteDialog = new sap.ui.commons.Dialog();
                        oDeleteDialog.setTitle("Delete user");
                        
                        // var tModel = sap.ui.getCore().getModel();
                        var oView = sap.ui.getCore().byId("idInitialView1");
                        var tModel = oView.getModel();
         	            var oUserDeleted = tModel.getProperty(ctx).Email;
                        
                        var oText = new sap.ui.commons.TextView({text: "Are you sure to delete this user: " + oUserDeleted + " ?"});
                        oDeleteDialog.addContent(oText);
                        
                        oDeleteDialog.addButton( 
                               new sap.ui.commons.Button({
                                     text: "Confirm", 
                                     press:function(){ 
                                    	               // sap.ui.getCore().getModel().remove(ctx, {
                                    	               tModel.remove(ctx, {
                                            	       success: function() {
                                            	    	   //alert("User deleted successfully");
                                                           // sap.ui.getCore().getModel().refresh();
                                            	    	   debugger;
                                            	    	   sap.ui.getCore().byId("idInitialView1").getModel().refresh();
                                                           //var tModel = oView.getModel();
                                            	    	   //tModel.refresh();
                                            	    	   sap.m.MessageToast.show("User deleted successfully", { duration: 1000 });
                                            	    	   oDeleteDialog.close();
                                                          },
                                                       error: function(oError) {
                                                           oDeleteDialog.close();
                                                           // alert("Delete failed");
                                                           sap.m.MessageToast.show("User deletion failed", { duration: 1000 });
                                                       }})
                                                		  
                                } // end press.
                               
                            } // end button
                        )); // end addButton
                        oDeleteDialog.open();                    	
                    },
                    
					iterate : function(obj, stack) {
						for ( var property in obj) {
							if (obj.hasOwnProperty(property)) {
								if (typeof obj[property] == "object") {
									iterate(obj[property], stack + '.'
											+ property);
								} else {
									console.log(property + "   "
											+ obj[property]);
									$('#output').append(
											$("<div/>").text(
													stack + '.' + property))
								}
							}
						}

						// iterate(object, '')

					},
					
					callFragmentAlertTST: function() {
						/* 
						 * HANDLING FRAGMENTS: index.html must have the line sap.ui.localResources("useful");
						 * Also, the useful folder must be located under Webcontent
						 * The JS filename must be: AlertTST.fragment.js
						 *  You must have: Webcontent/useful/AlertTST.fragment.js
						 */
						var oDialog = sap.ui.jsfragment("useful.AlertTST", this);
						oDialog.open();
					},
					
					createUser: function(idx) {
						var oCreateDialog = new sap.ui.commons.Dialog();
						oCreateDialog.destroyContent();
						oCreateDialog.setTitle("Create new user");
						
						var mLayout = new sap.ui.commons.layout.MatrixLayout();
						var mRow = new sap.ui.commons.layout.MatrixLayoutRow();
						
						// USER ID
						var control1 = new sap.m.Label({text: "User ID"});
						var control2 = new sap.m.Input({value: idx, enabled: false});
						mLayout.createRow(control1, control2);
						// EMAIL
						var control3 = new sap.m.Label({text: "Email"});
						var control4 = new sap.m.Input({
							placeholder: "Enter email ...",
							valueStateText: "Email must be in format: x.x@xxx.xxx",
							enabled: true,
						});
						mLayout.createRow(control3, control4);
						// FIRSTNAME
						var control5 = new sap.m.Label({text: "Firstname"});
						var control6 = new sap.m.Input({
							placeholder: "Enter first name ...",
							valueStateText: "First name must not be empty", 
							value: {
								    path: "Firstname",
								    formatter: function(sVal) {
								    	if (!sVal) return;
								    	return sVal.toUpperCase();
								    }
								    
							}
						});
						// LASTNAME
						var control7 = new sap.m.Label({text: "Lastname"});
						var control8 = new sap.m.Input({
							placeholder: "Enter last name ...",
							valueStateText: "Last name must not be empty",
							value: {
								    path: "Lastname",
								    formatter: function(sVal) {
								    	if (!sVal) return;
								    	return sVal.toUpperCase();
								    }
							}
						});
						mLayout.createRow(control5, control6, control7, control8);
						//AGE
						var control9 = new sap.m.Label({text: "Age"});
						var control10 = new sap.m.Input({
							valueStateText: "This is not a valid age",
							value: ""
						});
						mLayout.createRow(control9, control10);
						//ADDRESS
						var control11 = new sap.m.Label({text: "COUNTRY"});
						var control12 = new sap.m.Input({
							value: ""
						});
						//DATE CREATED
						var control13 = new sap.m.Label({text: "Date created"});
						var control14 = new sap.m.DatePicker({
							     placeholder: "Select date ...",
							     // type: new sap.ui.model.type.Date({pattern: "dd.MM.yyyy"})
							     displayFormat: "dd-MMM-yyyy",
							     valueFormat: "yyyy-MM-dd",
							     change: function() {
							    	control14.setEnabled(false); 
							     }
							});
						mLayout.createRow(control11, control12, control13, control14);
						
						//SUBMIT AND CANCEL BUTTONS
						var control15 = new sap.m.Button({
							text: "SUBMIT",
							press: function(evt) {
								var oEntry = {};
								var canContinue = true;
								jQuery.sap.require("sap.m.MessageToast");
								
								var oRows = mLayout.getRows();	
								//ID
								var oCells = oRows[0].getCells();
								var oContent = oCells[1].getContent();
								console.log(oContent[0].getValue());
								oEntry.Id = parseInt(oContent[0].getValue());
								//Email
								var oCells = oRows[1].getCells();
								oContent = oCells[1].getContent();
								oEntry.Email = oContent[0].getValue();
								//Email validation
								// sap.ui.getCore().byId(oContent[0].sId).setValueState("Error");
								var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
						    	if (!oEntry.Email.match(mailregex)) {
						    		// The problem here is that you have to access the control object in order to setValueState
						    		// You don't know the control ID because it is dynamically generated, I did not create the control 
						    		// with IDs because I have to destroy them when closing the window
						    		// This is how to find the ID: oContent[0].sId
						    		// email.setValueState("Error");
						    		sap.ui.getCore().byId(oContent[0].sId).setValueState("Error");
						    		sap.m.MessageToast.show("Please correct yoour input", { duration: 3000 });
						    		return;
						    	} else {
						    		sap.ui.getCore().byId(oContent[0].sId).setValueState("Success");
						    	}
								console.log(oEntry.Email);
								//Firstname
								var oCells = oRows[2].getCells();
								oContent = oCells[1].getContent();
								oEntry.Firstname = oContent[0].getValue();
								if (!oEntry.Firstname) {
									sap.ui.getCore().byId(oContent[0].sId).setValueState("Error");
									sap.m.MessageToast.show("Please correct yoour input", { duration: 3000 });
						    		return;
								} else {
									sap.ui.getCore().byId(oContent[0].sId).setValueState("Success");
								}
								oContent = oCells[3].getContent();
								oEntry.Lastname = oContent[0].getValue();
								if (!oEntry.Lastname) {
									sap.ui.getCore().byId(oContent[0].sId).setValueState("Error");
									sap.m.MessageToast.show("Please correct yoour input", { duration: 3000 });
						    		return;
								} else {
									sap.ui.getCore().byId(oContent[0].sId).setValueState("Success");
								}
								console.log(oEntry.Firstname + " " + oEntry.Lastname);
								//Age
								debugger;
								var oCells = oRows[3].getCells();
								oContent = oCells[1].getContent();
								// oEntry.Age = parseInt(oContent[0].getValue());
								oEntry.Age = oContent[0].getValue();
								var vAge = /^\d{2}$/; 
								if (!oEntry.Age.match(vAge)) {
									sap.ui.getCore().byId(oContent[0].sId).setValueState("Error");
									sap.m.MessageToast.show("Please correct yoour input", { duration: 3000 });
									return;
								} else {
									sap.ui.getCore().byId(oContent[0].sId).setValueState("Success");
									oEntry.Age = parseInt(oContent[0].getValue());
								}
								console.log(oEntry.Age);
								//Address
								var oCells = oRows[4].getCells();
								oContent = oCells[1].getContent();
								oEntry.Address = oContent[0].getValue();
								console.log(oEntry.Address);
								//Datecreated
								oContent = oCells[3].getContent();
								debugger;
								// console.log(oContent[0].getValue()); // "M/D/yy
								if (!oContent[0].getValue()) {
									sap.m.MessageToast.show("Please select a date", { duration: 1000 });
									return;
								} else {
									oEntry.Datecreated = oContent[0].getValue();
									/* HANDLING THE DATE COLUMN 
									 * Without the TYPE, the date is displayed as: Wed Mar 23 2016 20:00:00 GMT-0400 (Eastern Daylight Time)
									 * When displaying the date, we need to extract the offset in milisecs. 
									 * When saving the date in the controller, we add the offset
									 */
									
									var TZOffsetMS = new Date(0).getTimezoneOffset()*60*1000; //this is the offset in msec
									var dCreated = new Date(oEntry.Datecreated);
									var tCreated = dCreated.getTime(); // this will be the time in msec in UTC. The time to be saved needs to be tCreated + offset
									var tCreated = tCreated + TZOffsetMS;
									oEntry.Datecreated = new Date(tCreated);
								}			
								
								
								
								
								     // Check for valueState in order to see if you can continue
								
						    	     // sap.ui.getCore().getModel().create(
								 var oView = sap.ui.getCore().byId("idInitialView1");
			                     var tModel = oView.getModel();
								 tModel.create(
										'/UserSet',
										oEntry,
										{
											success : function() {
												// debugger;
												//sap.ui.getCore().getModel().refresh();
												tModel.refresh();
												sap.m.MessageToast.show("User was created successfully", { duration: 1000 });
												oCreateDialog.close();
											},
											error : function(oError) {
												// debugger;
												sap.m.MessageToast.show("Error when creating user", { duration: 1000 });
												// console.log(oError);
												// oCreateDialog.close();
											}
										});
								 
								
							} 
						});
						
						var control16 = new sap.m.Button({
							text: "CANCEL",
							press: function(evt) {
								oCreateDialog.close();
								
							}
						});
						
						var control17 = new sap.m.Label({text: "", visible: false});
						mLayout.createRow(control17, control15, control17, control16);
						
						// mLayout.addRow(mRow);
						oCreateDialog.addContent(mLayout);
						
						oCreateDialog.open();
						
					},
				/**
				 * Similar to onAfterRendering, but this hook is invoked before
				 * the controller's View is re-rendered (NOT before the first
				 * rendering! onInit() is used for that one!).
				 * 
				 * @memberOf ui5_odata.InitialView
				 */
				// onBeforeRendering: function() {
				//
				// },
				/**
				 * Called when the View has been rendered (so its HTML is part
				 * of the document). Post-rendering manipulations of the HTML
				 * could be done here. This hook is the same one that SAPUI5
				 * controls get after being rendered.
				 * 
				 * @memberOf ui5_odata.InitialView
				 */
				// onAfterRendering: function() {
				//
				// },
				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf ui5_odata.InitialView
				 */
				// onExit: function() {
				//
				// }
				});