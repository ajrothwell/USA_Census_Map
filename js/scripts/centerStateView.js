

function centerStateView(stateNumber) {

	// goes through the stateGeoJson object and finds the correct state
	for (i=0; i<stateGeoJson.features.length; i++){
		if (stateGeoJson.features[i].properties.GEOID == stateNumber){
			chosenFeature = stateGeoJson.features[i]
		}
	}

	stateName = chosenFeature.properties.name

	// reset lons=[] and lats=[]
	lons = []
	lats = []
				
	if (chosenFeature.geometry.type == 'Polygon') {
		for (i=0; i<chosenFeature.geometry.coordinates[0].length; i++){
			lons[i] = chosenFeature.geometry.coordinates[0][i][0]
			lats[i] = chosenFeature.geometry.coordinates[0][i][1]
		}
	}				
				
				
	if (chosenFeature.geometry.type == 'MultiPolygon') {
		for (j=0; j<chosenFeature.geometry.coordinates.length; j++){
			for (i=0; i<chosenFeature.geometry.coordinates[j][0].length; i++){
				if (chosenFeature.geometry.coordinates[j][0][i][0] < 0){
					lons[lons.length] = chosenFeature.geometry.coordinates[j][0][i][0]
					lats[lats.length] = chosenFeature.geometry.coordinates[j][0][i][1]
				}
			}
		}
	}
				
	stateWidth = d3.max(lons)-d3.min(lons)
	stateHeight = d3.max(lats)-d3.min(lats)

	var w2 = w-extension
	
	if (stateHeight > stateWidth) {
//		alert('height is greater than width - keep it small')
		statePercent = stateHeight/360
		theScale = h/2/pi
		theReScale = theScale/statePercent*0.8

	} else {
		if (stateWidth > stateHeight*1.25) {
//			alert('width greater than 1.25 * height - make it huge')
			statePercent = stateWidth/360
			theScale = w2/2/pi
			if (stateNumber == 27 || stateNumber == 02 || stateNumber == 55) {
//				alert('rescale for Minnesota, Alaska, Wisconsin')
				theReScale = theScale/statePercent*0.6
			} else if (stateNumber == 05 || stateNumber == 22 || stateNumber == 29 || stateNumber == 54) {
//				alert('rescale for Arkansas, Louisiana, Missouri, W Virginia')
				theReScale = theScale/statePercent*0.7
			} else {
				theReScale = theScale/statePercent*0.82
			}
		
		} else if (stateWidth > stateHeight*1.1) {
//			alert('width greater than 1.1 * height - a little smaller')
			statePercent = stateWidth/360
			theScale = w2/2/pi
			if (stateNumber == 26 || stateNumber == 39 || stateNumber == 12) {
//				alert('rescale for Michigan, Ohio, Florida')
				theReScale = theScale/statePercent*0.6
			} else {
				theReScale = theScale/statePercent*0.72
			}
		} else {
//			alert('width barely greater than height - keep it in the middle')
			statePercent = stateWidth/360
			theScale = h/2/pi
			theReScale = theScale/statePercent
		}
	}			

	if (stateNumber != 15) {
		centerLon = d3.max(lons) - (stateWidth/2)
		centerLat = d3.max(lats) - (stateHeight/2)
	} else {
		centerLon = d3.max(lons) - (stateWidth*0.1)
		centerLat = d3.max(lats) - (stateHeight*0.8)
		theReScale = theScale/statePercent*3
	}

	theCenter = [centerLon, centerLat]

}