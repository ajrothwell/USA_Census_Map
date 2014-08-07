
function completeStateMap(theDemographic) {

	svg.selectAll('g').remove();
	svg.select('#shapeName').remove();

	countyNameById = d3.map();
	for (i=0; i<countyCopiedData.length; i++) {
		countyNameById.set(countyCopiedData[i].GEOID10, countyCopiedData[i].NAMELSAD10);
	}



	demographicById = d3.map();
	// do a loop that fills out a set()
	for (i=0; i<countyCopiedData.length; i++) {
		demographicById.set(countyCopiedData[i].GEOID10, countyCopiedData[i][theDemographic]);
	}

	// reset the demographicsArray = []
	demographicsArray = []
	// do a loop that fills out an array with a demographics stat
	for (i=0; i<countyCopiedData.length; i++){
		demographicsArray[i] = parseInt(countyCopiedData[i][theDemographic])
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
		.attr('class', 'theShapeG')
		.selectAll('path')
		.data(countyGeoJson.features)
		.enter()
		.append('path')
		.attr('id', function(d) { return countyNameById.get(d.id); })
		.attr('class', function(d) { return quantile(demographicById.get(d.id)); })
		.attr('d', path)
		.on("mouseover", function() {
			svg.append('text')
				.attr('id', 'countyname')
				.attr('class', 'sub_name_label')
				.text(this.id)
				.attr('y', 80)
				.attr('x', 550)
				.attr("text-anchor", "left");
		})
		.on("mouseout", function() {
			svg.select('#countyname')
				.remove()
		});

	svg.append('text')
		.attr('id', 'shapeName')
		.attr('class', 'name_label')
		.attr('y', 50)
		.attr('x', 550)
		.attr("text-anchor", "left")
		.text(stateName);

	// if the demographic is set to anything at all:
	if (theDemographic != '00') { 
		drawLegend();
	}
}

/*
	} else {
		
		svg.append('g')
			.attr('class', 'theShapeG')
			.selectAll('path')
			.data(countyGeoJson.features)
			.enter()
			.append('path')
			.attr('id', function(d) { return countyNameById.get(d.id); })
			.attr('d', path)
//			.attr('fill', 'rgb(200,200,200)')
			.on("mouseover", function() {
				svg.append('text')
					.attr('id', 'countyname')
					.attr('class', 'sub_name_label')
					.text(this.id)
					.attr('y', 80)
					.attr('x', 550)
					.attr("text-anchor", "left");
			})
			.on("mouseout", function() {
				svg.select('#countyname')
					.remove()
			});

		svg.append('text')
			.attr('id', 'shapeName')
			.attr('class', 'name_label')
			.attr('y', 50)
			.attr('x', 550)
			.attr("text-anchor", "left")
			.text(stateName);

	}

}
*/
