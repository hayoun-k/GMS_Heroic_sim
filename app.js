// sf success rates table
let successRate = [0.95, 0.90, 0.85, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55,
	0.50, 0.45, 0.40, 0.35, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30,
	0.30, 0.30, 0.03, 0.02, 0.01];

// sf destruction rates table
// multipled by failure rates at each stage
let destructionRate = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
	-1,-1,-1,-1,-1, 0.03,0.03,0.03,0.04,0.04,
	0.1, 0.1, 0.2, 0.3, 0.4];

// when the safeguard is on
let safeGuard = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
	-1,-1,-1,-1,-1, -1,-1,0.03,0.04,0.04,
	0.1, 0.1, 0.2, 0.3, 0.4];

// selecting a destruction table based on safeguard
const seldest = (sg) => {
  switch(sg){
    case "0":
      return destructionRate;
      break;
    case "1":
      return safeGuard;
      break;
    default:
      return destructionRate;
      break;  
  }
}

// function for meso consumption for each attempt
const spendMesoList = (itemLev,events,sg,mvps) => {
  let baseCost = 0;
  let baseDiscount = 0;
  let totalCost = 0;
  let mesoList = [];

  for (let myStar=0; myStar < 25; myStar++) {
    baseCost = baseMeso(myStar, itemLev);
    baseDiscount = 1-mvps;
    // 30% off or ssf
    if(events == 2 || events == 4) {
      baseDiscount = baseDiscount*0.7;
    }
    // all safeguard
    if(sg == 1 && myStar > 11 && myStar < 17) {
      baseDiscount++;
      // safeguard during 15-16 event and ssf
      if((events ==3 || events ==4) && myStar ===15) {
        baseDiscount--;
      }
    } else if ((events != 3 || events != 4) && sg ==2 & myStar > 14 && myStar < 17) {
      baseDiscount++;
    }
    else if((events==3||events==4) && sg==2 && myStar==16){
      baseDiscount++;
    }
    mesoList.push(baseDiscount*baseCost);
  }
  return mesoList;
}

const mesoSpent = (myStar,mesoList) => {
  return mesoList[myStar];
}

const baseMeso = (myStar,itemLev) => {
  let baseCost = 0;
  if(myStar < 10) {
    baseCost = 1000, + Math.pow(itemLev, 3) * (myStar + 1) / 25;
  }else if (myStar == 10) {
    baseCost = 1000 + Math.pow(itemLev, 3) * Math.pow(myStar + 1, 2.7) / 400;
  }else if(myStar==11){
    baseCost = 1000 + Math.pow(itemLev, 3) * Math.pow(myStar + 1, 2.7) / 220;
  }else if(myStar==12){
    baseCost = 1000 + Math.pow(itemLev, 3) * Math.pow(myStar + 1, 2.7) / 150;
  }else if(myStar==13){
    baseCost = 1000 + Math.pow(itemLev, 3) * Math.pow(myStar + 1, 2.7) / 110;
  }else if(myStar==14){
    baseCost = 1000 + Math.pow(itemLev, 3) * Math.pow(myStar + 1, 2.7) / 75;
  }else{
    baseCost = 1000 + Math.pow(itemLev, 3) * Math.pow(myStar + 1, 2.7) / 200;
  }
  baseCost = Math.round(baseCost / 100) * 100;
  return baseCost;
}

function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let starForce = () => {
  const itemLv = document.getElementById('itemlv');
  let itemLev = itemLv.value;
  console.log(itemLev);
  let starCatch;
  let catchChecked = document.querySelectorAll("input[name='starcatch']:checked");
  if (catchChecked.length > 0) {
    starCatch = catchChecked[0].value * 0.01;
  } else {
    starForce = undefined;
  }
  let startStar = parseInt(document.getElementById("startingstar").value);
  let targetStar = parseInt(document.getElementById("goal").value);
  let itemPiece = document.getElementById("piece").value;
  let noLogs = document.getElementById('nolog');
  let chanceTime = 0;
  let cr = 0;
  let myTry = 0;
  let accRate = 0;
  let catchProp = 1; //fix it
  let events = document.querySelector('input[name="events"]:checked').value;
  let sg = document.querySelector('input[name="safeguard"]:checked').value;
  let mvp = document.querySelector('input[name="mvp"]:checked').value;
  let spentMesoList = [];
  let spentMeso = 0;
  let totalSpentMeso = 0;
  let maxMeso = 0;
  let minMeso = 100000000000000;
  let straight = 0;
  let res = '';
  let logs = '<button type="button" class="btn btn-dark btn-lg" onclick="getres()">Return</button><br>';
  let sfMesoList = [];

  if(targetStar < startStar) {
    alert('If you want to lose stars...just do it in the game.');
    return 0;
  }
  if(itemPiece < 1) {
    alert('You Cannot enhance already boomed item...')
  }
  if(itemLev < 0 ) {
    alert('item level error');
    return 0;
  }
  sfMesoList = spendMesoList(itemLev, events, sg, mvp);
  for (let i=0; i < itemPiece; i++) {
    spentMeso = 0;
    startStar = parseInt(document.getElementById("startingstar").value);
    straight = 0

    while (startStar < targetStar) {
      if (chanceTime == 2) {
        if(noLogs.checked!=true) {
          logs+= (startStar) + '→' + (startStar + 1) + 'Sucessful(chance time), ' + mesoSpent(startStar,sfMesoList) +'meso spent<br>';
        }
        spentMeso += mesoSpent(startStar,sfMesoList);
        startStar++;
        chanceTime = 0;
      }else if(events==3 && startStar < 16 && startStar%5==0) {
        if(noLogs.checked!=true){
          logs+= (startStar) + '→' + (startStar+1) + ' Enhancement Successful(Shining Starforce 5,10,15), ' + mesoSpent(startStar,sfMesoList) +'meso spent<br>';
        }
          spentMeso+=mesoSpent(startStar,sfMesoList);
          startStar++;
          chanceTime=0;
      }else {
        
          accRate = successRate[startStar] * (starCatch + 1);
        
        if(Math.random()<accRate){
          if(noLogs.checked!=true){
          logs+= (startStar) + '→' + (startStar+1) + ' Enhacement Successful, ' + mesoSpent(startStar,sfMesoList) +'meso spent<br>';
        }
          spentMeso+=mesoSpent(startStar,sfMesoList);
          startStar++;
          chanceTime=0;
        }else {
          if(Math.random()<seldest(sg)[startStar]){
            if(noLogs.checked!=true){
            logs+= '<span style="color:red">'+(startStar) + '→12 Enhancement failed(destroyed), ' + mesoSpent(startStar,sfMesoList) +'meso spent</span><br>';
          }
            spentMeso+=mesoSpent(startStar,sfMesoList);
            startStar = 12;
            chanceTime=0;
            cr++;
            straight++;
          }else{
            if(startStar<16 || startStar%5==0){
              
              if(noLogs.checked!=true){
              logs+= (startStar) + '→' + (startStar) + ' Enhancement failed(unchanged), ' + mesoSpent(startStar,sfMesoList) +'meso spent<br>';
            }
              spentMeso+=mesoSpent(startStar,sfMesoList);
              straight++;
            }else{
              if(noLogs.checked!=true){
              logs+= (startStar) + '→' + (startStar-1) + ' Enhancement(star dropped), ' + mesoSpent(startStar,sfMesoList) +'meso spent<br>';
            }
              spentMeso+=mesoSpent(startStar,sfMesoList);
              startStar--;
              chanceTime++;
              straight++;
          }
            }
          }
        }
        myTry++;
    }
    if(noLogs.checked!=true){
      logs+= '<span style="color:blue">'+(i+1) + 'th item ' + 'enhanced to ' + startStar + ' star</span><br><br>'
      }
    totalSpentMeso +=spentMeso;
    if(spentMeso>maxMeso) {maxMeso = spentMeso;}
    if(spentMeso<minMeso) {minMeso = spentMeso;}
    if(straight==0) {
      res+= 'Amazing! Straight!<br>';
    }
  }
  if(noLogs.checked!=true){
    logs+= '<button type="button" class="btn btn-dark btn-lg" onclick="getres()">Return</button><br>';
    }else{
      logs+= 'It is not set to show logs';
    }

  res += '<li>Enhanced total '+ itemPiece +' items from '+parseInt(document.getElementById("startingstar").value)+' star ';
  res += 'to ' + parseInt(document.getElementById("goal").value) + ' star, with ' +myTry+' times of tapping.</li>';
  if(itemPiece!=1){ res+='<li>On average ';}
  res+= 'Spent: '+ addCommas(totalSpentMeso/itemPiece) + ' meso (Approx. ' +eokcut(totalSpentMeso/itemPiece)+ ')</li>';
  if(itemPiece!=1){
  res+= '<li>Your max spending was ' + addCommas(maxMeso) + ' meso (Apprx. ' +eokcut(maxMeso)+ ')</li>';
  res+= '<li>Your min spending was ' + addCommas(minMeso) + ' meso (Apprx. ' +eokcut(minMeso)+ ')</li>';
  }
  if(itemPiece!=1){ res+='<li>On average per item, ';}
  res+= 'Item destroyed: ' + (cr/itemPiece)+' times</li>';
  if(itemPiece!=1){ res+='<li>On average per item, ';}
  res+= 'Number of try: ' + (myTry/itemPiece)+' </li>';

  let spentMesoSum = 0;
  for(let i=0; i < 100000; i++) {
		spentMeso = 0;
		startStar = parseInt(document.getElementById("startingstar").value);

	while(startStar<targetStar){//repeat till the goal
		if(chanceTime==2) {
			spentMeso+=mesoSpent(startStar,sfMesoList);
			startStar++;
			chanceTime=0;//chancetime reset
		}else if((events==3||events==4) && startStar < 16 && startStar%5==0) {
			spentMeso+=mesoSpent(startStar,sfMesoList);
			startStar++;
			chanceTime=0;//chancetime reset
		}else {
			accRate = successRate[startStar] * (starCatch + 1);
			if(Math.random()<accRate){
				spentMeso+=mesoSpent(startStar,sfMesoList);
				startStar++;
				chanceTime=0;//chancetime reset
			}else {
				if(Math.random()<seldest(sg)[startStar]){//if destroyed
					spentMeso+=mesoSpent(startStar,sfMesoList);
					startStar = 12;//back to 12 stars
					chanceTime=0;//chancetime reset
					cr++;
				}else {
					if(startStar<16 || startStar%5==0) {
						spentMeso+=mesoSpent(startStar,sfMesoList);
					}else {
						spentMeso+=mesoSpent(startStar,sfMesoList);
						startStar--;
						chanceTime++;
					}
				}
			}
		}
	}
	spentMesoSum+=spentMeso;
	spentMesoList.push(Math.round(spentMeso/10000000)*10000000);
	if(spentMeso>maxMeso){maxMeso = spentMeso}
  if(spentMeso<minMeso){minMeso = spentMeso}
	}
  let rankCount=0;
	for(let i=0; i < 100000; i++) {
		if(spentMesoList[i] < (totalSpentMeso/itemPiece)) {
			rankCount++;
		}
	}

	let rankPct = (rankCount/100000*100);
	let avgMeso = Math.round(spentMesoSum/100000);
	res+= '<li>Top ' + rankPct.toFixed(3) +'% of luck! (' + (100-rankPct).toFixed(3) + '% of people spend more meso than you.).</li>'
	res+= '<li>Average of total meso spent is ' + addCommas(avgMeso) + ' meso (Apprx. ' +eokcut(avgMeso)+ ').</li>'
	res+= '<li>The unluckiest person in Maple World spent ' + addCommas(maxMeso) + ' meso (Apprx. ' +eokcut(maxMeso)+ ')</li>';
  res+= '<li>The favorite player of Wonki spent ' + addCommas(minMeso) + ' meso (Apprx. ' +eokcut(minMeso)+ ')</li>';
	res+= '<div class="button-container"><button type="button" class="btn btn-dark btn-lg return" onclick="retsim()">Return</button>';
  res+= '<button type="button" class="btn btn-dark btn-lg redo" onclick="starForce()">Redo(Same setting)</button>';
  res+= '<button type="button" class="btn btn-dark btn-lg get-log" onclick="getlog()">Show the enhancemnet log</button></div>';
  document.getElementById("resinside").innerHTML = res;
  document.getElementById("loginside").innerHTML = `<p class="logs">${logs}</p>`;

  let trace = {
    x: spentMesoList,
    opacity: 0.75,
    type: 'histogram',
    marker: {
    color: "hsl(66, 66%, 57%)",
    },
  };
  let layout = {
    title: 'Starforce Enhancement simulation of 100,000 items <br> (' + document.getElementById('itemlv').value + 'lv) from ' +parseInt(document.getElementById("startingstar").value) + " to " + parseInt(document.getElementById("goal").value) + "stars",
    font: {
      family: 'Maplestory Bold',
      size: 14,
      color: 'black',
    },
    bargap: 0.05,
    bargroupgap: 0.2
  };
  let data = [trace];
  document.getElementById("restab").click();
  Plotly.newPlot('myDiv',data, layout);
}

function retsim() {
  document.getElementById("autosim").click();
}
function getlog(){
  document.getElementById("logtab").click();
}
function getres(){
  document.getElementById("restab").click();
}

function eokcut(num){
  let bil = Math.round(num/1000000000);
  let mil = Math.round(num/1000000)
  let y = "";
  console.log(bil, mil);
  if(bil>0){y+= bil + 'billion ';}
  if(bil%1000!=0){y += (bil % 1000) +'million ';}
  y+= 'meso';
  return y;
}

function showSfTable(){
	let lev = document.sftbl.sftlev.value;
	let j;
	let tablesize;
	let tblcontent = '<table class="table cost-table"><thead><tr><th scope="col">#</th>';
	tblcontent+='<th scope="col">cost(meso)</th></tr></thead><tbody>';
	if(lev<100){
		return 0;
	}else{
		if(lev<100){tablesize=5;}
		else if(lev<110){tablesize=8;}
		else if(lev<120){tablesize=10;}
		else if(lev<130){tablesize=15;}
		else if(lev<140){tablesize=20;}
		else{tablesize=25;}
		for(let i=0;i<tablesize;i++){
			j=i+1;
			tblcontent+='<tr>';
			tblcontent+='<th scope="row">' + i + '→' + j + '</th>';
			tblcontent+='<td>' + addCommas(baseMeso(i,lev)) + ' meso</td>';
			tblcontent+='</tr>';
		}
		tblcontent+='</tbody></table>';
		document.getElementById("showsftable").innerHTML = tblcontent;
		return 0;
	}
}

let probtable =[
	["95.0%","90.0%","85.0%","85.0%","80.0%","75.0%","70.0%","65.0%","60.0%","55.0%",
"50.0%","45.0%","40.0%","35.0%","30.0%","30.0%","30.0%","30.0%","30.0%","30.0%",
"30.0%","30.0%","3.0%","2.0%","1.0%"],
["5.0%","10.0%","15.0%","15.0%","20.0%","25.0%","30.0%","35.0%","40.0%","45.0%",
"50.0%","55.0%","60.0%","65.0%","70.0%","67.9%","","","","",
"63.0%","","","",""],
["","","","","","","","","","",
"","","","","","","67.9%","67.9%","67.2%","67.2%",
"","63.0%","77.6%","68.6%","59.4%"],
["","","","","","","","","","",
"","","","","","2.1%","2.1%","2.1%","2.8%","2.8%",
"7.0%","7.0%","19.4%","29.4%","39.6%"]];


function sfprobtable(){
	let tblcontent = '<table class="table">	<thead><tr>';
	let j;
	tblcontent+= '<th scope="col">*</th><th scope="col">success</th><th scope="col">maintained</th>';
	tblcontent+= '<th scope="col">fail</th><th scope="col">destroyed</th></tr></thead><tbody>';
	for(let i=0;i<25;i++){
		j=i+1;
		tblcontent+='<tr>';
		tblcontent+='<th scope="row">' + i + '→' + j + '</th>';
		tblcontent+='<td>' + probtable[0][i] + '</td>';
		tblcontent+='<td>' + probtable[1][i] + '</td>';
		tblcontent+='<td>' + probtable[2][i] + '</td>';
		tblcontent+='<td>' + probtable[3][i] + '</td>';
		tblcontent+='</tr>';
	}
	tblcontent+='</tbody></table>';
	document.getElementById("protinside").innerHTML = tblcontent;
}

let probtable_catch =[
	["99.75%","94.50%","89.25%","89.25%","84.00%","78.75%","73.50%","68.25%","63.00%","57.75%",
"52.50%","47.25%","42.00%","36.75%","31.50%","31.50%","31.50%","31.50%","31.50%","31.50%",
"31.50%","31.50%","3.15%","2.10%","1.05%"],
["0.25%","5.50%","10.75%","10.75%","16.00%","21.25%","26.50%","31.75%","37.00%","42.25%",
"47.50%","52.75%","58.00%","63.25%","68.50%","66.45%","","","","",
"61.65%","","","",""],
["","","","","","","","","","",
"","","","","","","66.45%","66.45%","65.76%","65.76%",
"","61.65%","77.48%","68.53%","59.37%"],
["","","","","","","","","","",
"","","","","","2.06%","2.06%","2.06%","2.74%","2.74%",
"6.85%","6.85%","19.37%","29.37%","39.58%"]];

function sfprobtable_catch(){
	let tblcontent = '<table class="table">	<thead><tr>';
	let j;
	tblcontent+= '<th scope="col">*</th><th scope="col">success</th><th scope="col">maintained</th>';
	tblcontent+= '<th scope="col">fail</th><th scope="col">destroyed</th></tr></thead><tbody>';
	for(let i=0;i<25;i++){
		j=i+1;
		tblcontent+='<tr>';
		tblcontent+='<th scope="row">' + i + '→' + j + '</th>';
		tblcontent+='<td>' + probtable_catch[0][i] + '</td>';
		tblcontent+='<td>' + probtable_catch[1][i] + '</td>';
		tblcontent+='<td>' + probtable_catch[2][i] + '</td>';
		tblcontent+='<td>' + probtable_catch[3][i] + '</td>';
		tblcontent+='</tr>';
	}
	tblcontent+='</tbody></table>';
	document.getElementById("protinside").innerHTML = tblcontent;
}