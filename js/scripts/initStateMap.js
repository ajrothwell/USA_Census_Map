
function initStateMap(stateNumber){

	// I'm not sure if this comes in handy
	stateNumber_saved=stateNumber
	centerStateView(stateNumber);

	projection = d3.geo.mercator()
		.center([centerLon, centerLat])
		.scale(theReScale-(theReScale*.2))
		.translate([w/2-150, h/2]);
					
	path = d3.geo.path()
		.projection(projection);

	
	// re-define countyGeoJson from countyTopoJson so that all states are there
	countyGeoJson = topojson.feature(countyMasterTopoJson, countyMasterTopoJson.objects.counties);

	// add the state number as a property to the counties
	for (i=0; i<countyGeoJson.features.length; i++){
		var stateNumberText = countyGeoJson.features[i].id.toString()
		if(stateNumberText.length == 4){
			countyGeoJson.features[i].properties.state = '0' + stateNumberText.slice(0,1);
		} else {
			countyGeoJson.features[i].properties.state = stateNumberText.slice(0,2)
		}
	}


	// step through and remove the ones that are not in the selected state
	for (i=0; i<countyGeoJson.features.length; i++){
		if (countyGeoJson.features[i].properties.state != stateNumber){
			countyGeoJson.features.splice(i,1);
			i--;
		} 
	}


	// Now working with the CSV data

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

	getDemographic();

}
