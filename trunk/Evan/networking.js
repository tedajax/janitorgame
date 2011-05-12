/***********************************************
web sockets
***********************************************/


//Initialize server, create socket, 
function serverLoop()
{
	//Set socket url
	this.socketURL = "ws://example.com/Pittfield/Room";
	
	//Make new socket with url
	this.socket = new EasyWebSocket(socketURL);
	
	//Log confirmation.
	socket.onopen = function()
	{
		sendDataToSocket("Server up and running");
	}
	
	//When receiving data
	socket.onmessage = function(event) 
	{
		//Parse as string.
		var message = JSON.parse(event.data);
        
        //Locate/populate player
        if(message.type == "player has joined")
        {
        	sendFullServer();
        }
        
        //Receiving data from peer
        else if(message.type == "Receiving data")
        {
        	boss.position.e(1)   = message.data.bossPosX;
        	boss.position.e(2)   = message.data.bossPosY; 
        	boss.position.e(3)   = message.data.bossPosZ;
			boss.velocity.e(1)   = message.data.bossVelX;
			boss.velocity.e(2)   = message.data.bossVelY;
			boss.position.e(3)   = message.data.bossVelZ;
			boss.scale.e(1)      = message.data.bossScaleX; 
			boss.scale.e(2)      = message.data.bossScaleY;
			boss.scale.e(3)      = message.data.bossScaleZ;
			player.position.e(1) = message.data.playerPosX;
			player.position.e(2) = message.data.playerPosY;
			player.position.e(3) = message.data.playerPosZ;
			player.velocity.e(1) = message.data.playerVelX; 
			player.velocity.e(2) = message.data.playerVelY; 
			player.position.e(3) = message.data.playerVelZ;
			player.scale.e(1)    = message.data.playerScaleX;
			player.scale.e(2)    = message.data.playerScaleY; 
			player.scale.e(3)    = message.data.playerScaleZ;
			boss.rotation        = message.data.bossRot; 
			player.rotation      = message.data.playerRot;
		}
	}
	
	socket.onclose = function()
	{
		sendServerDown("Server is closing");
	}
	
	setInterval(sendPlayerData(boss, player), 20);
}


//Outgoing data to the server.
serverLoop.prototype.sendPlayerData = function(boss, player)
{
	//Send boss/player position, boss/player velocity, boss/player scale, boss/player rotation.
	sendDataToSocket( { type: 'SendingPlayer',
	 

						data: { 
								bossPosX:        boss.position.e(1),
								bossPosY:        boss.position.e(2), 
								bossPosZ:        boss.position.e(3),
								bossVelX:        boss.velocity.e(1), 
								bossVelY:        boss.velocity.e(2), 
								bozzVelZ:        boss.position.e(3),
								bossScaleX:      boss.scale.e(1), 
								bossScaleY:      boss.scale.e(2),
								bossScaleZ:      boss.scale.e(3),
								playerPosX:      player.position.e(1), 
								playerPosY:      player.position.e(2), 
								playerPosZ:      player.position.e(3),
								playerVelX:      player.velocity.e(1), 
								playerVelY:      player.velocity.e(2), 
								playreVelZ:      player.position.e(3),
								playerScaleX:    player.scale.e(1), 
								playerScaleY:    player.scale.e(2), 
								playerScaleZ:    player.scale.e(3),
								bossRot:		 boss.rotation,
								playerRot:		 player.rotation
							  }
					});
								

}

//Update, will be set in set interval
/*function updateServer()
{
	sendPlayerData(boss, player);
}*/


//Adapter for socket.send
function sendDataToSocket(data)
{
	 socket.send(JSON.stringify(data));
}

//Cap capacity.
function sendFullServer()
{
	sendDataToSocket("Server is Full");
}

//Server shutdown.
function sendServerDown()
{
	sendDataToSocket("Server is down :(");
}
	
