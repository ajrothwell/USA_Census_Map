
function initStateMap(stateNumber){

	stateNumber1=stateNumber
	centerStateView(stateNumber);

	projection = d3.geo.mercator()
		.center([centerLon, centerLat])
		.scale(theReScale-(theReScale*.2))
		.translate([w/2, h/2]);
					
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
//	alert(countyCopiedData[0].GEOID10)
	
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


	// reset the demographicsArray = []
	demographicsArray = []

	// do a loop that fills out an array with a demographics stat
	for (i=0; i<countyCopiedData.length; i++){
		demographicsArray[i] = parseInt(countyCopiedData[i].DP0010001)
	}

	
	demographicById = d3.map();
	
	// do a loop that fills out an a set()
	for (i=0; i<countyCopiedData.length; i++) {
		demographicById.set(countyCopiedData[i].GEOID10, countyCopiedData[i].DP0010001);
	}
	

	demoMin = d3.min(demographicsArray);
	demoMax = d3.max(demographicsArray);
	
	// reset the domain for the colors
	quantize.domain([demoMin, demoMax/4]);

	d3.select('svg')
		.select('g')
		.remove();
		
	d3.select('svg')
		.select('text')
		.remove();

	svg.append('g')
		.attr('class', 'theCounty')
		.selectAll('path')
		.data(countyGeoJson.features)
		.enter()
		.append('path')
//		.attr('class', 'q3-9')
		.attr('theID', function(d) { return d.id; })
		.attr('theDemo', function(d) { return demographicById.get(d.id); })
		.attr('class', function(d) { return quantize(demographicById.get(d.id)); })
		.attr('d', path)
//		.attr('fill', 'steelblue')

	svg.append('text')
		.attr('class', 'name_label')
		.attr('y', 40)
		.attr('x', 40)
		.attr("text-anchor", "left")
		.text(stateName);

}
