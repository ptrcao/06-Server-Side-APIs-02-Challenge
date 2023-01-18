// Github pages sets very aggressive cache headers (Cache-Control: max-age=86400 1 day, Expires 1 month ahead) on all served content.
// If you update your pages and push to github, people revisiting the pages who have already got cached copies will not get the new pages without actually cleaning their browser cache.
// How can a script running in a page determine that it is stale and force an update?
// https://stackoverflow.com/a/13106972/9095603
// Check if a new cache is available on page load:
window.addEventListener('load', function(e) {

    window.applicationCache.addEventListener('updateready', function(e) {
      if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        // Swap it in and reload the page to get the new hotness.
        window.applicationCache.swapCache();
        if (confirm('A new version of this site is available. Load it?')) {
          window.location.reload();
        }
      } else {
        // Manifest didn't changed. Nothing new to server.
      }
    }, false);
  
  }, false);


var inputtedCityName;

var globalCityName;
var globalCityState;
var globalCityCountry;

  // FUNCTIONS

  // An on and off switch for the loading overlay which prevents user interaction while the page is being loaded or searches are executing

  // Async/await function to show, wait, hide overlay not working in javascript
  // Your SO question answered: https://stackoverflow.com/a/75156438/9095603

    function loadingOverlayOn() {
    document
      .getElementsByClassName("overlay")[0]
      .style.setProperty("display","flex","important");
      // you need to use flex in order to make justify-content: center and align-items: center available to center the spinner child
  }
    function loadingOverlayOff() {
    document
      .getElementsByClassName("overlay")[0]
      .style.setProperty("display","none","important");
  }


async function generatePrevCitiesList(){
if((localStorage.getItem('savedCities') !== null)){
    // How to Check if a Key Exists in localStorage Using JavaScript?
    // https://www.designcise.com/web/tutorial/how-to-check-if-a-key-exists-in-localstorage-using-javascript#:~:text=Learn%20how%20to%20check%20if%20an%20item%20is%20set%20in%20localStorage&text=localStorage%20property)%20has%20no%20hasItem,getItem('nonExistent')%20!%3D%3D
    // If you're thinking this might conflict with a null value that is stored in the localStorage, then you should not worry because localStorage only stores string values and 'null' !== null.
    
    let retrievedLocalStorage = localStorage.getItem("savedCities");
    retrievedLocalStorage = JSON.parse(retrievedLocalStorage);



    console.log('START retrievedLocalStorage' + retrievedLocalStorage)

    let prevCityList = document.getElementById("prev-searched-cities")

    
    

    let prevCityListHeading = document.querySelector('.search-container p')
    prevCityListHeading.innerHTML = 'Previously searched cities:'
    // This will overwrite if it already exits, which is fine

    // prevCityList.parentNode.insertBefore(prevCityListHeading, prevCityList)
    // prevCityList.appendChild(prevCityListHeading)

    // Reset if already exits
    prevCityList.innerHTML = '';

    for(let i = 0; i < retrievedLocalStorage.length; i++){
    let cityName = retrievedLocalStorage[i].cityName
    let cityState = retrievedLocalStorage[i].cityState
    let cityCountry = retrievedLocalStorage[i].cityCountry
    let cityLat = retrievedLocalStorage[i].cityLat
    let cityLng = retrievedLocalStorage[i].cityLng


    let cityLi = document.createElement('li')
    prevCityList.appendChild(cityLi)

    let cityInstanceBtn = document.createElement('button')
    // cityInstanceBtn.setAttribute('type','button')

    let id = `prev-search-${i}`;
    cityInstanceBtn.setAttribute('id', id)

    cityInstanceBtn.setAttribute('class','city-saved-option')
    // cityInstanceBtn.setAttribute('display', 'block')
    // cityInstanceBtn.style.setProperty('display','block','!important')
    cityInstanceBtn.setAttribute('class', 'btn btn-outline-primary')
    cityInstanceBtn.setAttribute('type', 'button')

    cityInstanceBtn.setAttribute('data-city', cityName)
    cityInstanceBtn.setAttribute('data-state', cityState)
    cityInstanceBtn.setAttribute('data-country', cityCountry)

    cityInstanceBtn.innerHTML = `City name: <strong>${cityName}</strong><br>`
    if(cityState){
        cityInstanceBtn.innerHTML += `City state: ${cityState}<br>`
    }
    cityInstanceBtn.innerHTML += `Country: ${cityCountry}`

    

    cityLi.appendChild(cityInstanceBtn)
  
    // var specificCityInstanceBtn = document.getElementById(`prev-search-${i}`)



    cityInstanceBtn.addEventListener('click',async function(e){
        // console.log('look here' + e)
        // console.log('test' + cityName)

        // for use in headings inside runSearch
        // reset
        globalCityName === null;
        globalCityState === null;
        globalCityCountry === null;

        globalCityName = e.target.dataset.city
        globalCityState = e.target.dataset.state
        // if(cityState){globalCityState = cityState}
        // else{globalCityState === null}
        globalCityCountry = e.target.dataset.country
        
        // loadingOverlayOn();
        await runSearch(cityName, cityState, cityCountry, cityLat, cityLng, units)
        // loadingOverlayOff();

    })

    }


}


}

generatePrevCitiesList();

// Include a JS file directly in another?
// https://stackoverflow.com/a/70283698/9095603
// const getStateCountry = require('./getstatecountry.js');

// JavaScript ES6 Modules
// https://youtu.be/cRHQNNcYf6s

// Note that JavaScript ES6 Modules will not be supported by older browsers, so a fallback solution may be needed, e.g. Babel or nomodule

import { getCountry, getState } from './getstatecountry.js'

const gottenCountry = getCountry;
const userState = getState;


console.log({gottenCountry})
console.log({userState})

function getDateFormatString(browserlocale) {
    
    const options = {
    //   hour: "numeric",
    //   minute: "numeric",
    //   second: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
  
    const formatObj = new Intl.DateTimeFormat(browserlocale, options).formatToParts(
      Date.now()
    );
  
    return formatObj
      .map((obj) => {
        switch (obj.type) {
        //   case "hour":
        //     return "HH";
        //   case "minute":
        //     return "MM";
        //   case "second":
        //     return "SS";
          case "day":
            return "DD";
          case "month":
            return "MM";
          case "year":
            return "YYYY";
          default:
            return obj.value;
        }
      })
      .join("");
  }

console.log(getDateFormatString("en-US")); //Expected Output: "MM/DD/YYYY, HH:MM:SS PM"

console.log(getDateFormatString("ko-KR")); //Expected Output: "YYYY. MM. DD. 오후 HH:MM:SS"


let language = navigator.language;
console.log(language);
// https://stackoverflow.com/questions/673905/how-to-determine-users-locale-within-browser#comment129149482_674570

if(language){

    // https://stackoverflow.com/a/70019245/9095603
    console.log('Detected date format = ' + getDateFormatString(language));
    

}




// toggle-style is the inline script tag used for the units choice button

function toggleImperialBtnState(){
    document.getElementById("toggle-style").innerHTML = `
    #units-switch + .toggleContainer::before {
        left: 50%;
    }
    #units-switch + .toggleCheckbox + .toggleContainer div:first-child{
        /* color: #343434; */
        color: white;
    }
    #units-switch + .toggleCheckbox + .toggleContainer div:last-child{
        /* color: white; */
        color: #343434;
    }
    `;
}

function toggleMetricBtnState(){
document.getElementById("toggle-style").innerHTML = ``;
// when you empty this style tag out, it will fall back to Assets/style.css styles, which is the style for metric
}




// toggle-style2 is the inline script tag used for the date format button
function toggleMMDDBtnState(){
    document.getElementById("toggle-style2").innerHTML = `
    #dateformat-switch + .toggleContainer::before {
        left: 50%;
    }
    #dateformat-switch + .toggleCheckbox + .toggleContainer div:first-child{
        /* color: #343434; */
        color: white;
    }
    #dateformat-switch + .toggleCheckbox + .toggleContainer div:last-child{
        /* color: white; */
        color: #343434;
    }
    `;
}


function toggleDDMMBtnState(){
    document.getElementById("toggle-style2").innerHTML = ``;
    // when you empty this style tag out, it will fall back to Assets/style.css styles, which is the style for metric
    }








// Direct geocoding allows to get geographical coordinates (lat, lon) by using name of the location (city name or area name). If you use the limit parameter in the API call, you can cap how many locations with the same name will be seen in the API response (for instance, London in the UK and London in the US).
// https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


const apiKey = "1f17d7321af7f8489161dfb157e67bd3"

// var long = 151.209900;
// var lat = -33.865143;

var country;
// var country = "AU"

// temp
// wind
// humidity
// date

var unitsSwitch = document.getElementsByClassName("units-switch")[0]

// test
// country = language.match(/(?<=\-).*/);
// console.log('regex-matched country = ' + country);

// Automatically set units based on country returned by the API call
var units;
if(country == "MM" || "LR" || "US"){
    units='imperial';
    // document.querySelector(".toggleContainer::before").style.setProperty("left","50%")
    // Uncaught TypeError: Cannot read properties of null (reading 'style')
    // You cannot edit a pseudo element from Javascript directly as they do not exist except to the CSS stylesheet
    // Instead, create inline styles tag in the current DOM and edit that
    // solution inspired by
    // https://stackoverflow.com/a/25748085/9095603
    // https://stackoverflow.com/a/13357564/9095603

    toggleImperialBtnState()
}
else{
    units = 'metric';
    // document.querySelector(".toggleContainer::before").style.setProperty("left","0%")
    // Uncaught TypeError: Cannot read properties of null (reading 'style')
    // You cannot edit a pseudo element from Javascript directly as they do not exist except to the CSS stylesheet
    // Instead, create inline styles tag in the current DOM and edit that
    // solution inspired by
    // https://stackoverflow.com/a/25748085/9095603
    // https://stackoverflow.com/a/13357564/9095603
    toggleMetricBtnState()
}

// https://stackoverflow.com/a/65283552/9095603
// ... if you know their location, you can default to Imperial in the United States, Liberia or Myanmar and use Metric in other locations


// try{unitsSwitch.classList.remove('imperial')}
// catch{console.log("Cannot remove 'imperial', possibly because it was not an existing class.")}
// City input
// document.getElementById()

// fetch(`https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`)



    // metric
    var tempUnitsMetric = '&#8451;';
    var windSpeedUnitsMetric = 'm/s';

    // imperial
    var tempUnitsImperial = '&#8457';
    var windSpeedUnitsImperial = 'mph';

// Not used but useful potentially
// Change the style of an entire CSS class using javascript
// https://stackoverflow.com/a/9153841/9095603

unitsSwitch.addEventListener("click",function () {
    if (units == 'metric') {
        // unitsSwitch.classList.remove('metric')
        // unitsSwitch.classList.add('imperial')
        units = 'imperial';
        console.log("metric -> imperial");
        console.log('Units is now set to: ' + units);
        
        // https://stackoverflow.com/a/3871602/9095603
        // https://bobbyhadz.com/blog/javascript-change-style-of-all-elements-with-class
        var metricSpans = document.getElementsByClassName("metric")
        console.log({metricSpans})
        Array.prototype.forEach.call(metricSpans, function(metricSpan){
            metricSpan.style.setProperty("display","none");
        });
        
        var imperialSpans = document.getElementsByClassName("imperial")
        Array.prototype.forEach.call(imperialSpans, function(imperialSpan){
            imperialSpan.style.setProperty("display","inline");

            // CSS Animation onClick
            // Use sad comrade method to reset animation for every new click
            // https://stackoverflow.com/a/58353279/9095603
            // reset .flash animation class
            imperialSpan.classList.remove("flash")
            // fire .flash animation class
            imperialSpan.classList.add("flash")

        toggleImperialBtnState()
        
        });
      

    } else if (units == 'imperial') {
        // unitsSwitch.classList.remove('imperial')
        // unitsSwitch.classList.add('metric')
        units = 'metric'
        console.log("imperial -> metric");
        console.log('Units is now set to: ' + units);

        // https://bobbyhadz.com/blog/javascript-change-style-of-all-elements-with-class
        var metricSpans = document.getElementsByClassName("metric")
        console.log({metricSpans})
        Array.prototype.forEach.call(metricSpans, function(metricSpan){
            metricSpan.style.setProperty("display","inline");

            // CSS Animation onClick
            // Use sad comrade method to reset animation for every new click
            // https://stackoverflow.com/a/58353279/9095603
            // reset .flash animation class
            metricSpan.classList.remove("flash")
            // fire .flash animation class
            metricSpan.classList.add("flash")
        });
        
        var imperialSpans = document.getElementsByClassName("imperial")
        Array.prototype.forEach.call(imperialSpans, function(imperialSpan){
            imperialSpan.style.setProperty("display","none");
        });


        // console.log({imperialSpans})
        // imperialSpans.forEach(imperialSpan => {
        //     imperialSpan.style.setProperty("display","none");
        // });
        // Uncaught TypeError: metricSpans.forEach is not a function
        // No, it's not an array. As specified in DOM4, it's an HTMLCollection (in modern browsers, at least. Older browsers returned a NodeList).
        // https://stackoverflow.com/a/3871602/9095603


        toggleMetricBtnState()
    }
}

)


// Number of the locations in the API response (up to 5 results can be returned in the API response)
var limit = 5;

const citySlotContainer = document.querySelector('.modal-body .d-grid');

const myModal = new bootstrap.Modal(document.getElementById('city-select-modal'))

const myModal2 = new bootstrap.Modal(document.getElementById('error-missing-input'))

const myModal3 = new bootstrap.Modal(document.getElementById('error-no-city-matches-modal'))



var searchBtn = document.getElementById('search-button')
var cityInputField = document.querySelector('.search-container input')

searchBtn.addEventListener('click',function(e){
    e.preventDefault();
    if(cityInputField.value){
        inputtedCityName = cityInputField.value;
        console.log('inputtedCityName: ' + inputtedCityName)
        getMatches(inputtedCityName, limit, apiKey);
    }
    else{
        // modal: missing input: Please enter a city name before attempting a search
        // Note this is different from the other error: no results found; empty array returned
   
            myModal2.show()
        
        
    }
})

//test hardcode value
// var inputtedCityName = 'Wellington';

async function getMatches(userInput,returnedMatchesLimit,credential){
const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=${returnedMatchesLimit}&appid=${credential}`);
const data = await response.json();


    if(data && data.length > 0){

    // Searchable select in Bootstrap 5
    // https://stackoverflow.com/a/68208211/9095603
    // You can use what is known as a Datalist in Bootstrap5 to achieve that. It works almost exactly like the Live Search that you mentioned

    // Reset from last search
    citySlotContainer.innerHTML = '';

    for (let i=0; i < data.length; i++){

        let cityName = data[i].name
        let cityState = data[i].state
        let cityCountry = data[i].country
        let cityLat = data[i].lat
        let cityLng = data[i].lon

        let cityInstanceBtn = document.createElement('button')
        // cityInstanceBtn.setAttribute('type','button')

        let id = `city-match-${i}`;
        cityInstanceBtn.setAttribute('id', id)

        cityInstanceBtn.setAttribute('class','city-option')
        // cityInstanceBtn.setAttribute('display', 'block')
        // cityInstanceBtn.style.setProperty('display','block','!important')
        cityInstanceBtn.setAttribute('class', 'btn btn-dark')


        cityInstanceBtn.setAttribute('data-city', cityName)
        cityInstanceBtn.setAttribute('data-state', cityState)
        cityInstanceBtn.setAttribute('data-country', cityCountry)


        cityInstanceBtn.innerHTML = `City name: <strong>${cityName}</strong><br>`
        if(data[i].state){
            cityInstanceBtn.innerHTML += `City state: ${cityState}<br>`
        }
        cityInstanceBtn.innerHTML += `Country: ${cityCountry}`
        citySlotContainer.appendChild(cityInstanceBtn)


        cityInstanceBtn.addEventListener('click', async function(){

            myModal.hide()

        // for use in headings inside runSearch

        // globalCityName === null;
        // globalCityState === null;
        // globalCityCountry === null;

        // globalCityName = cityName
        // if(cityState){globalCityState = cityState}
        // else{globalCityState === null}
        // globalCityCountry = cityCountry


        globalCityName = document.getElementById(id).dataset.city
        globalCityState = document.getElementById(id).dataset.state
        // if(cityState){globalCityState = cityState}
        // else{globalCityState === null}
        globalCityCountry = document.getElementById(id).dataset.country

        // loadingOverlayOn();
    
        await runSearch(cityName, cityState, cityCountry, cityLat, cityLng, units)
        
        // loadingOverlayOff();
 
            
        })



    }



    
    myModal.show()

    }
    else if (data = []){
        myModal3.show()
    }




}

async function runSearch(cityName, cityState, country, cityLat, cityLng, detectedUnits){


    loadingOverlayOn();
    

    console.log('check cityState: ' + cityState)
    console.log('check globalCityState: ' + globalCityState)
    // Display searched city name in heading
    var h2Today = document.getElementById('today-title')
    var h2Next5Days = document.getElementById('next-5-days-title')


    if(globalCityState != 'undefined' && globalCityName && globalCityCountry){
        // undefined because data attribute saves as data-state="undefined" when undefined
        h2Today.innerHTML = `<span class="orange">Today's</span> forecast for <span class="cornflowerblue">${globalCityName}, ${globalCityState}, ${globalCityCountry}</span>`
        h2Next5Days.innerHTML = `<span class="orange">4-day</span> outlook for <span class="cornflowerblue">${globalCityName}, ${globalCityState}, ${globalCityCountry}</span>`
    }
    else if (globalCityState = 'undefined' && globalCityName && globalCityCountry){
        // undefined because data attribute saves as data-state="undefined" when undefined
        h2Today.innerHTML = `<span class="orange">Today's</span> forecast for <span class="cornflowerblue">${globalCityName},${globalCityCountry}</span>`
        h2Next5Days.innerHTML = `<span class="orange">4-day</span> outlook for <span class="cornflowerblue">${globalCityName}, ${globalCityCountry}</span>`
    }

var newSearchObject = {
    cityName: cityName,
    cityState: cityState,
    cityCountry: country,
    cityLat: cityLat,
    cityLng: cityLng,
    detectedUnits: detectedUnits,
}

var retrievedLocalStorage = localStorage.getItem('savedCities');
retrievedLocalStorage = JSON.parse(retrievedLocalStorage);



// Rahat's example - you need to change the variables for your situation:
// const arr = retrievedLocalStorage.map(a => {a.cityLat, a.cityLng})
// arr.some(s => {return (s.lat == myObj.cityLat && s.lng == myObj.cityLng) } )





if( retrievedLocalStorage === null){

// with the array square brackets
localStorage.setItem("savedCities", JSON.stringify([newSearchObject]));

generatePrevCitiesList();

}
else if ( retrievedLocalStorage.length > 0 && retrievedLocalStorage.length < 5 ) {

    retrievedLocalStorage.reverse()

    

    if( !retrievedLocalStorage.some(s => {return (s.cityLat == newSearchObject.cityLat && s.cityLng == newSearchObject.cityLng) } ) ){
        // The reason why .includes check doesn't work:
        // Check if an array of objects contains another object: https://stackoverflow.com/a/63336477/9095603
        // Also explained here: https://stackoverflow.com/a/49187997/9095603
        // this solution which converts objects to string first isn't entirely reliable if you can't guarantee the same order is preserved, for example: https://stackoverflow.com/a/201305/9095603
        // https://stackoverflow.com/a/51603494/9095603




        // warning, note that existingSearchObject.push(newSearchObject) itself gives the array element count, so don't use that, use existingSearchObject, which has now been changed
        retrievedLocalStorage.push(newSearchObject);

        retrievedLocalStorage.reverse()
    console.log('existingSearchObject2: ' + retrievedLocalStorage)
    localStorage.setItem("savedCities", JSON.stringify(retrievedLocalStorage));
    }
    
    generatePrevCitiesList();

}
else if ( retrievedLocalStorage.length >= 5 ) {
    
    retrievedLocalStorage.reverse()



    if( !retrievedLocalStorage.some(s => {return (s.cityLat == newSearchObject.cityLat && s.cityLng == newSearchObject.cityLng) } ) ){



        retrievedLocalStorage.push(newSearchObject);
    }

    
 while( retrievedLocalStorage.length > 5){
    retrievedLocalStorage.shift();
 }



    retrievedLocalStorage.reverse()
    localStorage.setItem("savedCities", JSON.stringify(retrievedLocalStorage));

    generatePrevCitiesList();

}


const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLng}&units=${detectedUnits}&appid=${apiKey}`)
const data = await response.json()

    console.log(data)
    console.table(data.list)
    console.log(JSON.stringify(data))

    var timezone = data.city.timezone;
    console.log({timezone})
    var country = data.city.country;
    console.log({country})
    var cityName = data.city.name
    console.log({cityName})
 
    var datesArray = [];
    console.log({datesArray})

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // // Display searched city name in heading
    // var h2Today = document.getElementById('today-title')
    // var h2Next5Days = document.getElementById('next-5-days-title')

    // if(globalCityState && globalCityName && globalCityCountry){
    //     h2Today.innerHTML = `<span class="orange">Today's</span> forecast for <span class="cornflowerblue">${globalCityName}, ${globalCityState}, ${globalCityCountry}</span>`
    //     h2Next5Days.innerHTML = `<span class="orange">Next 5-day</span> forecast for <span class="cornflowerblue">${globalCityName}, ${globalCityState}, ${globalCityCountry}</span>`
    // }
    // else if (!globalCityState && globalCityName && globalCityCountry){
    //     h2Today.innerHTML = `<span class="orange">Today's</span> forecast for <span class="cornflowerblue">${globalCityName},${globalCityCountry}</span>`
    //     h2Next5Days.innerHTML = `<span class="orange">Next 5-day</span> forecast for <span class="cornflowerblue">${globalCityName}, ${globalCityCountry}</span>`
    // }
    

    for(let i = 0; i < data.list.length; i++){

        // console.log(data.list[i]["dt_txt"])
        var unixTimestamp = data.list[i].dt;
        console.log(data.list[i].dt)
        // Date()
        // you don't need it for dt_txt but if you want to use the unix timestamp in the data, you can do this conversion:
        //https://stackoverflow.com/a/847196/9095603



        // https://www.tutorialrepublic.com/faq/how-to-convert-a-unix-timestamp-to-time-in-javascript.php#:~:text=Answer%3A%20Use%20the%20new%20Date,%3A00%3A00%20UTC).

        // How to Convert a Unix Timestamp to Time in JavaScript

        // Simply multiply Unix timestamp by 1000 to convert it to a JavaScript time, because Unix timestamp measures time as a number of seconds, whereas in JavaScript time is fundamentally specified as the number of milliseconds (elapsed since January 1, 1970 at 00:00:00 UTC).
        var jsTimestamp = unixTimestamp * 1000
        var date = new Date(jsTimestamp);
        var basicDateLocalAU = date.toLocaleDateString("en-AU")
        var basicDateLocalUS = date.toLocaleDateString("en-US")
        var basicDateLocalUser = date.toLocaleDateString(`en-${country}`)

        console.log(basicDateLocalAU);   // Prints: 5/6/2022
        console.log(basicDateLocalUS);   // Prints: 6/5/2022
        console.log(basicDateLocalUser);   // Prints: 6/5/2022

        var timeLocalAU = date.toLocaleTimeString("en-AU", {hour: '2-digit', minute:'2-digit'}) // Prints: 13:10:34

        // How do I use .toLocaleTimeString() without displaying seconds?
        // https://stackoverflow.com/a/20430558/9095603

        // TypeError: date.getDay is not a function in JavaScript
        // https://bobbyhadz.com/blog/javascript-typeerror-date-getday-is-not-a-function#:~:text=getDay%20is%20not%20a%20function%22%20error%20occurs%20when%20the%20getDay,method%20on%20valid%20date%20objects.


        // var newWeatherArray;

        // newWeatherArray[basicDateLocalAU].push({})

        data.list[i].basicDateLocalAU = basicDateLocalAU
        data.list[i].basicDateLocalUS = basicDateLocalUS
        data.list[i].basicDateLocalUser = basicDateLocalUser
        data.list[i].dayOfWeekIndex = date.getDay()
        data.list[i].dayOfWeekValue = days[date.getDay()]

        // time format is the same everywhere so we can just use Australia for convenience
        data.list[i].basicTime = timeLocalAU



        // Get a list of unique dates and days of the week

        // Array.push() Element if does not exist in JavaScript
        // https://bobbyhadz.com/blog/javascript-array-push-if-not-exist

        if (!datesArray.includes(basicDateLocalUser)) {
            datesArray.push(basicDateLocalUser);
            
            var dayOfWeek = days[date.getDay()];
            console.log(dayOfWeek)
          }


    }

    console.log({date})

    
    console.log({data})


    var datalist = data.list
    console.log({datalist})



    var obj = groupBy(datalist, "basicDateLocalAU");
    console.log({obj})

    // Uncaught (in promise) TypeError: data.list.group is not a function
    // const result = data.list.group(({ basicCalendarDateAU }) => basicCalendarDateAU);
    // console.log({result})


    for(let i = 0; i < obj.length; i++){
        // begin with i = 1 since i = 0 is still the current day, which is treated separately in this app

        var dayTableEle = document.querySelector(`#day${i} table`);

        // var newNode = document.createElement("h6");
        // var textNode = document.createTextNode(`${dayOfWeekValue}`);
        // newNode.appendChild(textNode);
        
        
        // dayTableEle.parentElement.insertBefore(newNode,dayTableEle)
        

        dayTableEle.innerHTML = `<row><th>Time</th><th>Temp</th><th></th><th>Conditions</th><th>Humidity</th><th>Wind speed</th></row>`
        for(let j = 0; j < obj[i].length; j++){
            console.log(obj[i].length);
           
            // if not yet written, then write it
            if(!document.querySelector(`#day${i} h5`).innerText){
                document.querySelector(`#day${i} h5`).innerText = `${obj[i][j].dayOfWeekValue}`
            }
            // if not yet written, then write it
            if(!document.querySelector(`#day${i} span#usercountry-dateformat`).innerText){
                document.querySelector(`#day${i} span#usercountry-dateformat`).innerText = `${obj[i][j].basicDateLocalUser}`
            }
            // if not yet written, then write it
            if(!document.querySelector(`#day${i} span#AU-dateformat`).innerText){
                document.querySelector(`#day${i} span#AU-dateformat`).innerText = `${obj[i][j].basicDateLocalAU}`
                document.querySelector(`#day${i} span#AU-dateformat`).style.setProperty("display","none")
            }
            // if not yet written, then write it
            if(!document.querySelector(`#day${i} span#US-dateformat`).innerText){
                document.querySelector(`#day${i} span#US-dateformat`).innerText = `${obj[i][j].basicDateLocalUS}`
                document.querySelector(`#day${i} span#US-dateformat`).style.setProperty("display","none")
            }

            // Use this if you selected "standard" as the metric, but just select metric on the API call and you won't need to bother with it
            // var kelvinToCelcius = obj[i][j].main.temp - 273.15;
            // kelvinToCelcius = roundedToFixed(kelvinToCelcius, 1)

            
            var tempMetric;
            var tempImperial;
  

            var windSpeedImperial;
            var windSpeedMetric;

            
            // Strategy is to save both imperial and metric values to DOM, hide one or the other column depending on the current toggle

            if(units == 'metric'){
                var tempMetric = obj[i][j].main.temp;
                tempMetric = roundedToFixed(tempMetric, 1);
                var tempImperial = (tempMetric*1.8) + 32;
                tempImperial = roundedToFixed(tempImperial, 1);

                var windSpeedMetric = obj[i][j].wind.speed
                windSpeedMetric = roundedToFixed(windSpeedMetric, 1);
                var windSpeedImperial = windSpeedMetric * 2.23694;
                windSpeedImperial = roundedToFixed(windSpeedImperial,1);

                var metricDisplay = 'inline';
                var imperialDisplay = 'none';
            }
            else if(units == 'imperial'){
                var tempImperial = obj[i][j].main.temp;
                tempImperial = roundedToFixed(tempImperial, 1)
                var tempMetric = (tempImperial - 32) / 1.8;
                tempMetric = roundedToFixed(tempMetric, 1);

                var windSpeedImperial = obj[i][j].wind.speed
                windSpeedImperial =  roundedToFixed(windSpeedImperial, 1);
                var windSpeedMetric = windSpeedImperial / 2.23694;
                windSpeedMetric = roundedToFixed(windSpeedMetric,1);

                var metricDisplay = 'none';
                var imperialDisplay = 'inline';
            }

            dayTableEle.innerHTML += `
            <row>
                <td id="tdTime">${obj[i][j].basicTime}</td>
                <td id="tdTemp">
                    <span class="temp-metric metric" style="display:${metricDisplay};">${tempMetric} ${tempUnitsMetric}</span>
                    <span class="temp-imperial imperial" style="display:${imperialDisplay};">${tempImperial} ${tempUnitsImperial}</span>
                </td>
                <td><img src="https://openweathermap.org/img/wn/${obj[i][j].weather[0].icon}.png" alt="weather icon"></td>
                <td id="tdConditions">${obj[i][j].weather[0].description}</td>
                <td id="tdHumidity">${obj[i][j].main.humidity} %</td>
                <td id="tdWindSpeed">
                    <span class="windspeed-metric metric" style="display:${metricDisplay};">${windSpeedMetric} ${windSpeedUnitsMetric}</span>
                    <span class="windspeed-imperial imperial" style="display:${imperialDisplay};">${windSpeedImperial} ${windSpeedUnitsImperial}</span>
                </td>
                <td id="tdWindDir"><i style="transform: rotate(${obj[i][j].wind.deg}deg)" class="fa-solid fa-arrow-up"></i></td>
            </row>
            `
            
            
        }
        

    }





    // for(var i = 0; i < datesArray.length; i++){
    //     console.log({datesArray})
    //     dayOfWeek = datesArray[i].getDay();
    //     console.log({dayOfWeek})
    // }

    // for(var i = 0; i < data.list.length; i++){

    //     data.list[i].main.temp
    // }

    // datesArray.forEach(function callback(value,index)
    // {
    //     console.log(index)
    // }
    // )




// var cardAll = document.querySelectorAll('.card')

// Array.from(cardAll).forEach(node => {
//     // node.style.setProperty("display","inline-block","!important");
//     node.setAttribute("style","display: inline-block !important;")
// })

// document.getElementById("four-day-outlook-container").setAttribute("style","display: inline-block !important;")


var cardAll = document.getElementById("card-container")
cardAll.setAttribute("style","display: inline-block;")

var unitsBox = document.getElementById("units-switch-container")
unitsBox.style.setProperty("display","flex")

loadingOverlayOff();
}


var currentYear = new Date().getFullYear()
document.getElementById("current-year").innerText = currentYear;



// Get the closest number out of an array
// https://stackoverflow.com/a/19277804/9095603
// var counts = [4, 9, 15, 6, 2],
//   goal = 5;

// var closest = counts.reduce(function(prev, curr) {
//   return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
// });

// console.log(closest);





// https://www.tutorialrepublic.com/faq/how-to-convert-a-unix-timestamp-to-time-in-javascript.php#:~:text=Answer%3A%20Use%20the%20new%20Date,%3A00%3A00%20UTC).

// How to Convert a Unix Timestamp to Time in JavaScript

// Simply multiply Unix timestamp by 1000 to convert it to a JavaScript time, because Unix timestamp measures time as a number of seconds, whereas in JavaScript time is fundamentally specified as the number of milliseconds (elapsed since January 1, 1970 at 00:00:00 UTC).

// The following example demonstrates how to convert Unix timestamp to JavaScript time and extract date and time part from it. Let's try it out and see how it works:

// Timestamp in seconds
// var unixTimestamp = 1651822834;

// /* Create a new JavaScript Date object based on Unix timestamp.
// Multiplied it by 1000 to convert it into milliseconds */
// var date = new Date(unixTimestamp * 1000);

// // Generate date string
// console.log(date.toLocaleDateString("en-US"));   // Prints: 5/6/2022
// console.log(date.toLocaleDateString("en-GB"));   // Prints: 06/05/2022
// console.log(date.toLocaleDateString("default")); // Prints: 5/6/2022

// // Generate time string
// console.log(date.toLocaleTimeString("en-US"));   // Prints: 1:10:34 PM
// console.log(date.toLocaleTimeString("it-IT"));   // Prints: 13:10:34
// console.log(date.toLocaleTimeString("default")); // Prints: 1:10:34 PM


// var ctx = document.getElementById('myChart').getContext('2d');

// let chart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         datasets: [{
//             data: [{
//                 x: '2021-11-06 23:39:30',
//                 y: 50
//             }, {
//                 x: '2021-11-07 01:00:28',
//                 y: 60
//             }, {
//                 x: '2021-11-07 09:00:28',
//                 y: 20
//             }]
//         }],
//     },
//     options: {
//         scales: {
//             x: {
//                 min: '2021-11-07 00:00:00',
//             }
//         }
//     }
// });




// const ctx = document.getElementById('myChart');

// var ctx = document.getElementById('myChart').getContext('2d');

// new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });






// let employees = [
//     {name: 'Alina', company: 'Google', id : 1},
//     {name: 'Vika', company: 'Coca Cola', id : 2},
//     {name: 'Alex', company: 'Jonson & Jonson', id : 3},
//     {name: 'Vlad', company: 'Google', id : 4},
//     {name: 'Fibi', company: 'Coca Cola', id : 5},
//     {name: 'Joey', company: 'Google', id : 6},
//   ]
  
//   const grouped = groupBy(employees, employee => employee.company);
//   console.log({grouped})


// javascript | Object grouping
// https://stackoverflow.com/a/21776652/9095603

function groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

// Alternatively, array reduce is a common method used for this problem
// https://stackoverflow.com/a/67261611/9095603
// https://stackoverflow.com/a/54203304/9095603



// Round to the nearest n decimal places
// https://stackoverflow.com/a/12698296/9095603
// If you use Math.round(5.01) you will get 5 instead of 5.0.
// If you use toFixed you run into rounding issues.
// If you want the best of both worlds, combine the two:
function roundedToFixed(input, digits){
    var rounder = Math.pow(10, digits);
    return (Math.round(input * rounder) / rounder).toFixed(digits);
  }



//   transform: rotate(45deg);





// Using Angle in degrees to draw arrow in the direction in Javascript on Canvas
// https://stackoverflow.com/a/73391713/9095603


function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }