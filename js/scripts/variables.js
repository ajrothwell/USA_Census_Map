/*
var w = 900, h = 400;
var svg = d3.select('svg');
svg.attr('width', w)
	.attr('height', h);
*/

var stateNum;
var stateNameMasterData;
var stateNumberByName = d3.map();
			

var extension = 200;
var projection, path;

var thisImperfectStateName

var quantile = d3.scale.quantile()
				
var theQuantiles, copiedQuantiles=[];

var formData, formData2, dblclickedStateData			
var demographicsArray = []
var chosenFeature
var lons = []
var lats = []
var centerLon, centerLat, theCenter
var stateWidth, stateHeight, stateDim, statePercent
var pi = Math.PI
var theScale, theReScale
var stateName
var stateNumber
var stateNumber_saved = 00
var theDemographic
var theDemographic_saved
var demoMin, demoMax
//var demoMinRounded, demoMaxRounded
var demoMinFloor, demoMaxNew
var countyMode = 0

var stateMasterTopoJson, stateGeoJson, countyMasterTopoJson, countyGeoJson
var stateMasterData, countyMasterData
var citiesMasterData
			
var demographicById, countyNameById, stateNameById
var demographicLabelById
var demoByCode = d3.map();
var scaletypeByCode = d3.map();
var decimalsByCode = d3.map();
var unitsByCode = d3.map();
var scaledown1ByCode = d3.map();
var scaledown2ByCode = d3.map();
var theScaletype, theDecimals, theScaledown1, theScaledown2
			
var countyCopiedData = [];
			
var countryNameHeight=50
var stateNameHeight=90
var countyNameHeight=120
var demoNameHeight=155
var demoValueHeight=185

