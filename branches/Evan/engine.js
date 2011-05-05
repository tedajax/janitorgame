function Engine()
{
	this.hud;
	this.cam = new camera();
};

Engine.prototype.init = function()
{
	this.hud = new HUD();
};

Engine.prototype.getFileString = function(url)
{
	var request;
	if (window.XMLHttpRequest)
	{
		request = new XMLHttpRequest();
	}
	else
	{
		request = ActiveXObject("Microsoft.XMLHTTP");
	}
	
	request.open("GET", url, false);
	request.send();
	return request.responseText;
};

Engine.prototype.createInheritance = function(descendant, parent)
{
    var sConstructor = parent.toString();
    var aMatch = sConstructor.match( /\s*function (.*)\(/ );
    if ( aMatch != null ) { descendant.prototype[aMatch[1]] = parent; }
    for (var m in parent.prototype) {
        descendant.prototype[m] = parent.prototype[m];
    }
};

var engine = new Engine();