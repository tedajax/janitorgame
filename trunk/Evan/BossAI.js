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
			if (percept.actor.position.distanceFrom(percept.target.position) < 50)
			{
				if (Math.floor(Math.random() * 5) <= 3)
					state = Boss.JUMP_BACK_STATE;
				else
					state = Boss.JUMP_STATE;
			}
		break;
			
		case Boss.JUMP_BACK_STATE:
			//console.log(percept.actor.position.e(2));
			if (targetDist(percept) > 75)
				if (percept.actor.position.e(2) <= percept.thght + 2.0)
					state = Boss.FOLLOW_STATE;
		break;
		
		case Boss.JUMP_STATE:
			if (percept.actor.position.e(2) >= 60)
				state = Boss.JUMP_HOVER_STATE;
		break;
		
		case Boss.JUMP_HOVER_STATE:
			if (percept.timer <= 0)
				state = Boss.JUMP_SLAM_STATE;
		break;
		
		case Boss.JUMP_SLAM_STATE:
			if (percept.actor.position.e(2) <= percept.thght + 5.0)
				state = Boss.FOLLOW_STATE;
		break;
		case Boss.FORCE_FOLLOW_STATE:
			state = Boss.FOLLOW_STATE;
		break;
	}
	
	return state;
};

sqr = function(value)
{
	return value * value;
};

targetDist = function(percept)
{
	return Math.sqrt(sqr(percept.actor.position.e(1) - percept.target.position.e(1)) +
					 sqr(percept.actor.position.e(3) - percept.target.position.e(3)));
};