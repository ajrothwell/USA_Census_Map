
function initStateMap(stateNumber){

	stateNumber=stateNumber
	centerStateView(stateNumber);

	projection = d3.geo.mercator()
		.center([centerLon, centerLat])
		.scale(theReScale-(theReScale*.2))
		.translate([w/2, h/2]);
					
	path = d3.geo.path()
		.projection(projection);

	
	// re-define countyGeoJson from countyTopoJson so that all states are there
	countyGeoJson = topojson.feature(countyMasterTopoJson, countyMasterTopoJson.objects.counties);


	// add the state number (as a string) as a property to the counties
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
	
	
	jQuery.extend(countyCopiedData, countyMasterData);


	// now call another function that does the demographics part
	completeStateMap();

}