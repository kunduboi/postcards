var datFile;
let url = "https://coolors.co/1d2021-424445-1b2529-545b5e-001117";
let cols;
let cityNumber = 0;
let colsURLArr = ["https://coolors.co/e1d89f-cd8b76-c45baa-7d387d-27474e","https://coolors.co/3f0d12-a71d31-f1f0cc-d5bf86-8d775f","https://coolors.co/283d3b-197278-edddd4-c44536-772e25","https://coolors.co/f4e8c1-a0c1b9-70a0af-706993-331e38","https://coolors.co/00487c-4bb3fd-3e6680-0496ff-027bce","https://coolors.co/ea526f-fcaa67-f7f7ff-23b5d3-279af1","https://coolors.co/35524a-627c85-779cab-a2e8dd-32de8a","https://coolors.co/ef7674-ec5766-da344d-d91e36-c42348","https://coolors.co/e0e0e2-81d2c7-b5bad0-7389ae-416788","https://coolors.co/bad1cd-f2d1c9-e086d3-8332ac-462749","https://coolors.co/d36135-7fb069-ece4b7-e6aa68-aba9bf","https://coolors.co/05a8aa-b8d5b8-d7b49e-dc602e-bc412b","https://coolors.co/e56399-e5d4ce-de6e4b-7fd1b9-7a6563"];



function preload(){
  datFile = loadTable('Data/airport-codes.csv','csv','header'); 
}

function setup() {
  console.log(colsURLArr);
  drawTempArt();

  //invoke the search function on-click
  document.getElementById("search-btn").onclick = function(){searchDB()};
}

function createCols(_url) {
  //parses the URL into an array of colors
  let slash_index = _url.lastIndexOf('/');
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = '#' + arr[i];
  }
  return arr;
}

//draws the generated background using your city data
function drawArt(){
  // put setup code here
  var myCanvas = createCanvas(800,500);
  myCanvas.parent("gen-sketch");
  //could try to choose colors based on location here, work more later
  url = colsURLArr[Math.floor(Math.random()*colsURLArr.length)];
  cols = createCols(url);
  
  //for dynamic backgrounds
  bgColIndex = Math.floor(random(cols.length));
  // background(cols[bgColIndex]);

  background(51);
	cols.splice(bgColIndex,1);
	angleMode(DEGREES);
	noStroke();
	let span = width/Math.floor(random(cityNumber*2,cityNumber*3));
	for(let x = 0 ; x < width; x += span){
		for(let y = 0; y < height; y+= span){
			fill(cols[Math.floor(random(cols.length))]);
			push();
			translate(x + span/2, y + span/2);
			rotate(Math.floor(random(4))*90);
			arc(-span/2,-span/2,span*2,span*2,0,90);
			pop();
		}
	}	
}

//draws the default placeholder art (backup fn for the one above)
function drawTempArt(){
   //draws the generative art
  var myCanvas = createCanvas(800,500);
  myCanvas.parent("gen-sketch");
  cols = createCols(url);

  //for dynamic backgrounds
  bgColIndex = Math.floor(random(cols.length));
  // background(cols[bgColIndex]);
  background(51);
	cols.splice(bgColIndex,1);
	angleMode(DEGREES);
	noStroke();
	let span = width/6;
	for(let x = 0 ; x < width; x += span){
		for(let y = 0; y < height; y+= span){
			fill(cols[Math.floor(random(cols.length))]);
			push();
			translate(x + span/2, y + span/2);
			rotate(Math.floor(random(4))*90);
			arc(-span/2,-span/2,span*2,span*2,0,90);
			pop();
		}
	}	
}


//add your name/handle to the postcard
function addName(){
  var txtInput2 = document.getElementById("name-field").value;
  console.log(txtInput2);
  tempdiv = select('.person-info');
  tempdiv.html(txtInput2); 
}

function searchDB(){
  cityNumber = cityNumber + 1;
  console.log(cityNumber);

  var txtInput = document.getElementById("search-field").value;
  console.log(txtInput);

  // this fetches an array of the iata column
  console.log(datFile.getColumn('iata_code'));
  let matchedRows = datFile.findRows(txtInput,'municipality');

  // this outputs all airport row entries that match the given string input
  console.log(matchedRows);

   // this fetches a single airport code, in the following preference order: large > medium > small
  let airportCheck = -1;
  let tempdiv;
  let airportIATA;
  for(let r = 0; r < matchedRows.length; r++){  
    if(airportCheck == 2){
      break;
    }

    if(matchedRows[r].get('type') == "large_airport"){
      airportCheck = 2;
      console.log(matchedRows[r].get('iata_code'), matchedRows[r].get('type'));
      airportIATA = matchedRows[r].get('iata_code');
    }

    else if(matchedRows[r].get('type') == "medium_airport" && airportCheck < 2){
      airportCheck = 1;
      console.log(matchedRows[r].get('iata_code'), matchedRows[r].get('type'));
      airportIATA = matchedRows[r].get('iata_code');  
    }

    else if(matchedRows[r].get('type') == "small_airport" && airportCheck < 1){
      airportCheck = 0;
      console.log(matchedRows[r].get('iata_code'), matchedRows[r].get('type'));
      airportIATA = matchedRows[r].get('iata_code');
    }  
  }

  //adding the airport IATA code to the HTML DOM
  console.log(airportIATA);
  tempdiv = select('.city-info');
  tempdiv.html(airportIATA + '    -><br>', true); 
}