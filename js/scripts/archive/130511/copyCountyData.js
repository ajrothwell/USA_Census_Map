
function copyCountyData(stateNumber){
	
	jQuery.extend(countyCopiedData, countyMasterData);


	// add a column for state
	for (i=0; i<countyCopiedData.length; i++){
		var stateNumberText = countyCopiedData[i].GEOID10.toString()
		if(stateNumberText.length == 4){
			countyCopiedData[i].state = '0' + stateNumberText.slice(0,1);
		} else {
			countyCopiedData[i].state = stateNumberText.slice(0,2)
		}
	}


	// cut out the data not related to the state
	for (i=0; i<countyCopiedData.length; i++){
		if (countyCopiedData[i].state != stateNumber){
			countyCopiedData.splice(i,1);
			i--;
		} 
	}

	
}
