
var newusr;

$(document).ready(function(){
	var usr;
	var psswrd;
	var status;
	var con;

	$("#sub").click(function(e){
		e.preventDefault();
		usr = $("input[name=usr]").val();
		newusr = usr;
		psswrd = $("input[name=passwrd]").val();
		con = new Strophe.Connection({proto: new Strophe.Bosh("http://utmuser156-206.wireless.utoronto.ca:7070/http-bind/")}); //YOUR OWN ADDRESS HERE
		con.addHandler(onMessage, null, 'message', "chat", null, null);
		con.addHandler(onPresence, null, 'presence', null, null, null);
		con.connect(usr, psswrd, connectCallback);
	});

	$("#statSubmit").click(function(e){
		e.preventDefault();
		var stat = $("#stat option:selected").text();
		var status = $("#status").val();
		var msg = $pres({from: usr}).c("show").t(stat).up().c("status").t(status);
		msg = msg.tree();
		con.send(msg);
	});

	$("#newMessage").click(function(e){
		e.preventDefault();
		var recipient = $("#to").val();
		var message = $("#message").val();
		var msg = $msg({from: usr, to: recipient, type: "chat"}).c("body").t(message);
		msg = msg.tree();
		con.send(msg);
		$("#events").append("<p> Sent message " + message + " to " + recipient + "<p>");
	});	

});
	
	function onMessage(msg){
		var name = msg.getAttribute("from").split("@");
		if($(msg).attr('type').match("chat") && $(msg).children('body').text() != ""){
			var msgreceived = $(msg).children('body').text();
			$("#events").append("<p> New Message: " + "<b>" + msgreceived.toString() + "</b>" +" From " + "<b>" + name[0] + "</b>"+ "</p>");
		}
		return true;
	}
	
	function onPresence(pres){
		var name = pres.getAttribute("from").split("/");
		if(name[0] != newusr && pres.getAttribute("type") != "unavailable") {
			var from = pres.getAttribute("from");
			var newPresMsg = $(pres).children('show').text();
			var newPres = $(pres).children('status').text();
			$("#events").append("<p><b>Status Alert:</b> " + pres.getAttribute("from").split("@")[0] + "'s status is currently " + newPres.toString() + "</p>");
		}

		if(name[0] != newusr && pres.getAttribute("type") == "unavailable"){
			$("#events").append("<p>" + pres.getAttribute("from").split("@")[0] + " is currently Offline" + "<p>"); 
		}

		else if(name[0] == newusr && pres.getAttribute("type") != "unavailable" && pres.getAttribute("from") == pres.getAttribute("to")){
			var newPresMsg = $(pres).children('show').text();
			var newPres = $(pres).children('status').text();
			$("#events").append("<p> You are now currently " + "<b>" + newPresMsg + "</b>" + " with status " + "<b>" + newPres + "</b>"+ "<p>")
		}
		
		return true;
	}

	$(window).bind('beforeunload', function(){
		con.disconnect("I want to leave.");
	});

	function connectCallback(status){
	if (status == Strophe.Status.ERROR){
		console.log("An error has occurred");
		$("#events").append("<p>An error has occurred</p>");
	}
	else if (status == Strophe.Status.CONNECTING){
		console.log("The connection is currently being made");
		$("#events").append("<p>The connection is currently being made</p>");
	}
	else if (status == Strophe.Status.CONNFAIL){
		console.log("The connection is authenticating");
		$("#events").append("<p>The connection is authenticating</p>");
	}
	else if (status == Strophe.Status.AUTHFAIL){
		console.log("The authenticaton attempt failed");
		$("#events").append("<p>The authenticaton attempt failed</p>");
	}
	else if (status == Strophe.Status.CONNECTED){
		console.log("The connection has succeeded");
		$("#events").append("<p>The connection has succeeded</p>");
	}
	else if (status == Strophe.Status.DISCONNECTED){
		console.log("The connection has been terminated");
		$("#events").append("<p>The connection has been terminated</p>");
	}
	else if (status == Strophe.Status.DISCONNECTING){
		console.log("The connection is currently being terminated");
		$("#events").append("<p>The connection is currently being terminated</p>");
	}
	else if (status == Strophe.Status.ATTACHED){
		console.log("The connection has been attached");
		$("#events").append("<p>The connection has been attached</p>");
	}
	else{
		console.log("error");
	}
}







