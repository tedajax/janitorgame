function GetBossState(percept)
{
	var state = percept.actor.state;
	
	switch (state)
	{
		default:
		case Boss.IDLE_STATE:
			break;
			
		case Boss.FOLLOW_STATE:
			break;
	}
};

GetBossState.prototype.sqr = function(value)
{
	return value * value;
};

GetBossState.prototype.targetDist = function(percept)
{
	return Math.sqrt(sqr(percept.actor.position.e(1) - percept.target.position.e(1)) +
					 sqr(percept.actor.position.e(3) - percept.target.positoin.e(3)));
};