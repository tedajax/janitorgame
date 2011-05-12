var successNetwork = false;
var networkedGame = false;
var socket;

function client()
{
	this.socketURL = "ws://example.com/Pittfield/Room";
	this.successNetwork = false;
	this.networkedGame = false;
	
	socket = new EasyWebSocket(socketURL);
    
    socket.onopen = function() 
	{
		networkedGame = true;
        sendPlayer();
    };
    
    socket.onmessage = function(event) 
	{
		var message = JSON.parse(event.data);
            
	    if(msg.type == 'ServerDown') 
	    {
 			
 		} 

	    else if(msg.type == 'ServerPlayerUpdate') 
	    {
	    	if(msg.data.id != playerID) 
		  	{
		  		
                
            }
        }
    };
    
     socket.onclose = function() 
	 {
    
            networkedGame = false;
     };
};


   
var sendData = function(data) 
{
	socket.send(JSON.stringify(data));
};
    
var socketSendLeave = function()
{
    sendData({type: "Player left" });
};
    
var sendPlayer = function() 
{
	sendData({     type: 'PlayerJoin',
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
		  					 }});
};