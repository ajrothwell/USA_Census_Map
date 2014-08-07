

// read in data - slow steps to only do once
function readIn(){

d3.json('topojson/State_topo_3e4.json', function(stateTopoJson) {
	stateMasterTopoJson = stateTopoJson
	stateGeoJson = topojson.feature(stateTopoJson, stateTopoJson.objects.State_geo);
	// the TopoJSON file had incorrect state id#s.  Fix this with StateKey.csv
	d3.csv('database/StateKey.csv', function(stateKeyData) {
		for (var i = 0; i < stateKeyData.length; i++) {
			// get the Natural Earth ID from the csv
			var csvNEID = stateKeyData[i].NEID;
			//Find the corresponding id inside the GeoJSON
			for (var j = 0; j < stateGeoJson.features.length; j++) {
				var jsonNEID = stateGeoJson.features[j].id;
				if (csvNEID == jsonNEID) {
					var stateNumberText = stateKeyData[i].GEOID.toString()
					// numbers < 10 need a zero in front of them 
					if(stateNumberText.length == 1){
						stateGeoJson.features[j].properties.GEOID = '0' + stateNumberText;
					} else {
						stateGeoJson.features[j].properties.GEOID = stateNumberText;
					}
					break;
				}
			}
		}
	});
	setTimeout(initCountryMap, 1000);
});
			
d3.csv('database/State_Data.csv', function(stateData) {
	stateMasterData=stateData;
	for (i=0; i<stateMasterData.length; i++) {
		if(stateMasterData[i].GEOID10.length == 1){
			stateMasterData[i].GEOID10 = '0' + stateMasterData[i].GEOID10
		}
	}
});

d3.csv('database/statenumbersandnames.csv', function(stateNameData) {
	stateNameMasterData=stateNameData;
	for (i=0; i<stateNameMasterData.length; i++) {
		if(stateNameMasterData[i].GEOID.length == 1){
			stateNameMasterData[i].GEOID = '0' + stateNameMasterData[i].GEOID
		}
		stateNumberByName.set(stateNameMasterData[i].Statename, stateNameMasterData[i].GEOID)
	}
});

d3.csv('database/DemoKey.csv', function(demoKey) {
	demoMasterKey=demoKey;
	for (i=0; i<demoMasterKey.length; i++) {
		demoByCode.set(demoMasterKey[i].code, demoMasterKey[i].demographic);
		scaletypeByCode.set(demoMasterKey[i].code, demoMasterKey[i].scaletype);
		decimalsByCode.set(demoMasterKey[i].code, demoMasterKey[i].decimals);
		unitsByCode.set(demoMasterKey[i].code, demoMasterKey[i].units);
		scaledown1ByCode.set(demoMasterKey[i].code, demoMasterKey[i].scaledown1);
		scaledown2ByCode.set(demoMasterKey[i].code, demoMasterKey[i].scaledown2);
	}
});

// Using the US topojson I got somewhere else now				
d3.json ('topojson/us_01_topo.json', function(countyTopoJson) {
	countyMasterTopoJson = countyTopoJson
	countyGeoJson = topojson.feature(countyTopoJson, countyTopoJson.objects.counties);
});

// Using the CSV straight from ArcGIS right now			
d3.csv('database/County_Data.csv', function(countyData) {
	countyMasterData=countyData;
});

new appView();

};

