function GetBossState(percept)
{
	var state = percept.actor.state;
	
	switch (state)
	{
		default:
		case Boss.IDLE_STATE:
			break;
			
		case Boss.FOLLOW_STATE:
			//console.log(percept.actor.position.distanceFrom(percept.target.position));
			if (percept.actor.position.distanceFrom(percept.target.position) < 40)
				state = Boss.JUMP_STATE;
			break;
			
		case Boss.JUMP_STATE:
			if (percept.actor.velocity.e(2) < 0.0 && percept.actor.position.e(1) <= percept.thght + 0.1)
				state = Boss.FOLLOW_STATE;
			break;
	}
	
	return state;
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