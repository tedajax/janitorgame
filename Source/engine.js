function Engine()
{
	
};

Engine.prototype.init = function()
{
	this.aManager = new AssetManager();
	this.lastTime = new Date().getTime();
	this.sManager = new SoundManager();
};

Engine.prototype.getDeltaTime = function() {
	var currTime =  new Date().getTime();
	var dTime = currTime - this.lastTime;
	this.lastTime = currTime;
	//console.log(dTime);
	return dTime * 0.001;
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