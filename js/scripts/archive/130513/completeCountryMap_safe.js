
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



	stateNameById = d3.map();
	for (i=0; i<stateMasterData.length; i++) {
		stateNameById.set(stateMasterData[i].GEOID10, stateMasterData[i].NAME10);
	}


	demographicById = d3.map();
	// do a loop that fills out a set()
	for (i=0; i<stateMasterData.length; i++) {
		demographicById.set(stateMasterData[i].GEOID10, stateMasterData[i][theDemographic]);
	}


	// reset the demographicsArray = []
	demographicsArray = []
	// do a loop that fills out an array with a demographics stat
	for (i=0; i<stateMasterData.length; i++){
		demographicsArray[i] = parseInt(stateMasterData[i][theDemographic])
	}
	demoMin = d3.min(demographicsArray);
	demoMax = d3.max(demographicsArray);
	// reset the domain for the colors
	quantile.domain([demoMin, demoMax/4]);



	theQuantiles = quantile.quantiles()
//	copiedQuantiles[0] = '< ' + Math.round(theQuantiles[0])
	copiedQuantiles[0] = '< ' + theQuantiles[0].toFixed(2);
	for(i=1; i < theQuantiles.length; i++) {
//		copiedQuantiles[i] = Math.round(theQuantiles[i-1]) + ' - ' + Math.round(theQuantiles[i]);
		copiedQuantiles[i] = theQuantiles[i-1].toFixed(2) + ' - ' + theQuantiles[i].toFixed(2);
	}
//	copiedQuantiles[theQuantiles.length] = '> ' + Math.round(theQuantiles[theQuantiles.length-1])
	copiedQuantiles[theQuantiles.length] = '> ' + theQuantiles[theQuantiles.length-1].toFixed(2);
		


	svg.append('g')
		.attr('id', 'theShapeG')
		.attr('class', 'theShapeG')
		.selectAll("path")
		.data(stateGeoJson.features)
		.enter()
		.append("path")
		.attr('id', function(d) { return d.properties.name; })
		.attr('class', function(d) { return quantile(demographicById.get(d.properties.GEOID)); })
		.attr("d", path)
		.on('mouseover', function() {
			svg.select('#theTextG')
				.append('text')
				.attr('id', 'subShapeName')
				.attr('class', 'state_sub_name_label')
				.text(this.id)
				.attr('y', 90)
				.attr('x', 550)
				.attr("text-anchor", "left");
			svg.select('#theTextG')
				.append('text')
				.attr('id', 'demoNameText')
				.attr('class', 'demoNameText')
				.text(demoByCode.get(theDemographic_saved))
				.attr('y', 130)
				.attr('x', 550)
				.attr("text-anchor", "left");
		})
		.on('mouseout', function() {
			svg.select('#subShapeName').remove()
			svg.select('#demoNameText').remove()
		})
		.on('dblclick', function() {
			var thisStateName = this.id.replace(' ', '+')
			dblclickedStateData = 'stateInput=' + thisStateName
//			alert(dblclickedStateData)
			$.ajax({
				type: 'POST',
				url: 'php/processState.php',
				cache: false,
				data: dblclickedStateData,
				success: initMap_CountryStateSplitter
			});
		});

	
	svg.append('g')
		.attr('id', 'theTextG')
		.append('text')
		.attr('id', 'shapeName')
		.attr('class', 'country_name_label')
		.attr('y', 50)
		.attr('x', 550)
		.attr("text-anchor", "left")
		.text("United States of America");


	// if the demographic is set to anything at all:
	if (theDemographic != '0') { 
		drawLegend();
	}			

}

