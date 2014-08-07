
function completeCountryMap(theDemographic) {

	// Clear the SVG entirely, all at once
	svg.selectAll('g').remove();

	// add the "see counties" navigation button
	svg.append('g')
		.attr('id', 'countySwitchButton')
		.attr('class', 'switchButton')
		.on('click', function(){
			countyMode = 1
			initCountryMap();
		})
		.append('rect')
		.attr("x", 30)
		.attr("y", 360)
		.attr("width", 175)
		.attr("height", 25)
		.attr('stroke-width', 1)
		.attr('stroke', 'rgb(0,0,0)')
		.attr('fill', 'rgb(220,220,220)')
	
	svg.select('#countySwitchButton')
		.append('text')
		.attr('class', 'switchButtonText')
		.attr("x", 46)
		.attr("y", 377)
		.text('Click to Show Counties')



	// setting up the maps 
	stateNameById = d3.map();
	for (i=0; i<stateMasterData.length; i++) {
		stateNameById.set(stateMasterData[i].GEOID10, stateMasterData[i].NAME10);
	}

	demographicById = d3.map();
	for (i=0; i<stateMasterData.length; i++) {
		demographicById.set(stateMasterData[i].GEOID10, stateMasterData[i][theDemographic]);
	}

	demographicLabelById = d3.map()
	if (theDemographic_saved != '0') {	
		for (i=0; i<stateMasterData.length; i++) {
			demographicLabelById.set(stateMasterData[i].GEOID10, stateMasterData[i][theDemographic]);
		}
	} else {
		for (i=0; i<stateMasterData.length; i++) {
			demographicLabelById.set(stateMasterData[i].GEOID10, '');
		}
	}			



	// reset the demographicsArray = []
	demographicsArray = []
	// do a loop that fills out an array with a demographics stat
	for (i=0; i<stateMasterData.length; i++){
		demographicsArray[i] = parseFloat(stateMasterData[i][theDemographic])
	}

	demographicsArray.sort(function(a,b){return a-b})
	demoMin = demographicsArray[1]
	demoMax = demographicsArray[demographicsArray.length - 2]

	theScaletype = scaletypeByCode.get(theDemographic_saved)
	quantile.range(d3.range(9).map(function(i) { return 'q' + i + '-9_' + theScaletype; }));
	theDecimals = decimalsByCode.get(theDemographic_saved)
	theUnits = unitsByCode.get(theDemographic_saved)
	theScaledown1 = scaledown1ByCode.get(theDemographic_saved)
	theScaledown2 = scaledown2ByCode.get(theDemographic_saved)



	// This part sets the domain for the different scaletypes
	if (theScaletype == 1) {  // if using large raw whole numbers, ex. population
		quantile.domain([demoMin, demoMax/theScaledown1])
	} else if (theScaletype == 4) {  // if you want whole numbers as divisions, ex. median age
		demoMinFloor = Math.floor(demoMin)
		demoMaxNew = 0
		var i=1
		while(demoMaxNew < demoMax) {
			demoMaxNew = demoMinFloor + i * 9
			i++
		}
		quantile.domain([demoMinFloor, demoMaxNew])
	} else if (theScaletype == 2) { // if you are using percentages, ex. White Population %
		demoMinFloor = Math.floor(demoMin)
		demoMaxNew = 0
		var i=1
		while(demoMaxNew < demoMax) {
			demoMaxNew = demoMinFloor + i * 9
			i++
		}
		quantile.domain([demoMinFloor, demoMaxNew])
	} else if (theScaletype == 3) {  // if you are comparing numbers, 0.9-1.1
/*		if (demoMax - 1 > 1 - demoMin){
			quantile.domain([1-(demoMax-1), demoMax]);			
		} else {
			quantile.domain([demoMin, 1+(1-demoMin)]);
		}
*/		quantile.domain([0.91, 1.09]);
	}


	// this part sets the presentation of the numbers in the legend
	theQuantiles = quantile.quantiles()

	if (theScaletype == 1) {  // if you are just using raw whole numbers (large)
		copiedQuantiles[0] = '< ' + commaSeparateNumber(theQuantiles[0].toFixed(theDecimals) + ' ' + theUnits)
		for(i=1; i < theQuantiles.length; i++) {
			copiedQuantiles[i] = commaSeparateNumber(theQuantiles[i-1].toFixed(theDecimals) + ' ' + theUnits) + ' - ' + commaSeparateNumber(theQuantiles[i].toFixed(theDecimals) + ' ' + theUnits);
		}
		copiedQuantiles[theQuantiles.length] = '> ' + commaSeparateNumber(theQuantiles[theQuantiles.length-1].toFixed(theDecimals) + ' ' + theUnits)
	} else if (theScaletype == 4) {  // if you worked it out to get whole numbers as divisions
		copiedQuantiles[0] = '< ' + theQuantiles[0].toFixed(0);
		for(i=1; i < theQuantiles.length; i++) {
			copiedQuantiles[i] = theQuantiles[i-1].toFixed(0) + ' - ' + theQuantiles[i].toFixed(0);
		}
		copiedQuantiles[theQuantiles.length] = '> ' + theQuantiles[theQuantiles.length-1].toFixed(0);
	} else if (theScaletype == 2) {  // cases where decimals are important
		copiedQuantiles[0] = '< ' + theQuantiles[0].toFixed(1) + '%';
		for(i=1; i < theQuantiles.length; i++) {
			copiedQuantiles[i] = theQuantiles[i-1].toFixed(1) + '% - ' + theQuantiles[i].toFixed(1) + '%';
		}
		copiedQuantiles[theQuantiles.length] = '> ' + theQuantiles[theQuantiles.length-1].toFixed(1) + '%';
	} else if (theScaletype == 3) {  // cases where decimals are important
		copiedQuantiles[0] = '< ' + theQuantiles[0].toFixed(2);
		for(i=1; i < theQuantiles.length; i++) {
			copiedQuantiles[i] = theQuantiles[i-1].toFixed(2) + ' - ' + theQuantiles[i].toFixed(2);
		}
		copiedQuantiles[theQuantiles.length] = '> ' + theQuantiles[theQuantiles.length-1].toFixed(2);
	}






		

	svg.append('g')
		.attr('id', 'theShapeG')
		.attr('class', 'theShapeG')
		.selectAll("path")
		.data(stateGeoJson.features)
		.enter()
		.append("path")
		.attr('id', function(d) { return d.properties.GEOID; })
		.attr('class', function(d) { return quantile(parseFloat(demographicById.get(d.properties.GEOID))); })
		.attr("d", path)
		.on('mouseover', function() {
			svg.select('#theTextG')
				.append('text')
				.attr('id', 'subShapeName')
				.attr('class', 'state_name_label')
				.text(stateNameById.get(this.id))
				.attr('y', stateNameHeight)
				.attr('x', 550)
				.attr("text-anchor", "left");
			svg.select('#theTextG')
				.append('text')
				.attr('id', 'demoValueText')
				.attr('class', 'demoValueText')
				.text(commaSeparateNumber(demographicLabelById.get(this.id)))
				.attr('y', demoValueHeight)
				.attr('x', 550)
				.attr("text-anchor", "left");
		})
		.on('mouseout', function() {
			svg.select('#subShapeName').remove()
			svg.select('#demoValueText').remove()
		})
		.on('dblclick', function() {
			thisStateName = stateNameById.get(this.id).replace(' ', '+')
			dblclickedStateData = 'stateInput=' + thisStateName
			stateNumber = stateNumberByName.get(thisStateName)
			initMap_CountryStateSplitter(stateNumber)
		});

	svg.append('g')
		.attr('id', 'theTextG')
		.append('text')
		.attr('id', 'shapeName')
		.attr('class', 'country_name_label')
		.attr('y', countryNameHeight)
		.attr('x', 550)
		.attr("text-anchor", "left")
		.text("United States of America");
	svg.select('#theTextG')
		.append('text')
		.attr('id', 'demoNameText')
		.attr('class', 'demoNameText')
		.text(demoByCode.get(theDemographic_saved))
		.attr('y', demoNameHeight)
		.attr('x', 550)
		.attr("text-anchor", "left");


/* adding cities
	svg.select('#theShapeG')
		.selectAll("circle")
		.data(citiesMasterData)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return projection([d.lon, d.lat])[0];
		})
		.attr("cy", function(d) {
			return projection([d.lon, d.lat])[1];
		})
		.attr("r", 3)//function(d) {
//			return Math.sqrt(parseInt(d.population) * 0.00004);
//		})
		.style("fill", "yellow")
		.style("opacity", 0.75)
		.on('mouseover', function(d) {
			svg.select('#theTextG')
				.append('text')
				.attr('id', 'subShapeName')
				.attr('class', 'county_sub_name_label')
				.text(d.place)
				.attr('y', 90)
				.attr('x', 550)
				.attr("text-anchor", "left");
		})
		.on('mouseout', function() {
			svg.select('#subShapeName').remove()
//			svg.select('#demoNameText').remove()
		})
*/



	// if the demographic is set to anything at all:
	if (theDemographic != '0') { 
		drawLegend();
	}			

}

