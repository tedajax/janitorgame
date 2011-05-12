/***********************************************
web sockets
***********************************************/

function enableServer()
{
	this.socketURL = 'ws://example.com/Pittfield/Room';
	this.socket = new EasyWebSocket(socketURL);
	
	
	
	socket.onopen = function()
	{
		console.log("Server running");
	}

}

