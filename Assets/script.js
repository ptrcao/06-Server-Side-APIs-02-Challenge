

// Direct geocoding allows to get geographical coordinates (lat, lon) by using name of the location (city name or area name). If you use the limit parameter in the API call, you can cap how many locations with the same name will be seen in the API response (for instance, London in the UK and London in the US).
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


ApiKey = "1f17d7321af7f8489161dfb157e67bd3"

var long = 151.209900;
var lat = -33.865143;

var country = "AU"

// temp
// wind
// humidity
// date

var unitsSwitch = document.getElementsByClassName("units-switch")[0]


var units = 'metric';
unitsSwitch.classList.add('metric')
// try{unitsSwitch.classList.remove('imperial')}
// catch{console.log("Cannot remove 'imperial', possibly because it was not an existing class.")}
// City input
// document.getElementById()

// fetch(`http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`)



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
        unitsSwitch.classList.remove('metric')
        unitsSwitch.classList.add('imperial')
        units = 'imperial';
        console.log("metric -> imperial");
        console.log('Units is now set to: ' + units);
        
        // https://bobbyhadz.com/blog/javascript-change-style-of-all-elements-with-class
        var metricSpans = document.getElementsByClassName("metric")
        console.log({metricSpans})
        metricSpans.forEach(metricSpan => {
            metricSpan.style.setProperty("display","none");
        });
        
        var imperialSpans = document.getElementsByClassName("imperial")
        console.log({imperialSpans})
        imperialSpans.forEach(imperialSpan => {
            imperialSpan.style.setProperty("display","inline");
        });
        
        

    } else if (units == 'imperial') {
        unitsSwitch.classList.remove('imperial')
        unitsSwitch.classList.add('metric')
        units = 'metric'
        console.log("imperial -> metric");
        console.log('Units is now set to: ' + units);

        // https://bobbyhadz.com/blog/javascript-change-style-of-all-elements-with-class
        var metricSpans = document.getElementsByClassName("metric")
        console.log({metricSpans})
        metricSpans.forEach(metricSpan => {
            metricSpan.style.setProperty("display","inline");
        });
        
        var imperialSpans = document.getElementsByClassName("imperial")
        console.log({imperialSpans})
        imperialSpans.forEach(imperialSpan => {
            imperialSpan.style.setProperty("display","none");
        });

    }
}

)




fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=${units}&appid=${ApiKey}`)
.then( (response) => response.json())
.then( data => {
    console.log(data)
    console.table(data.list)
    console.log(JSON.stringify(data))

 
    var datesArray = [];
    console.log({datesArray})

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for(var i = 0; i < data.list.length; i++){

        // console.log(data.list[i]["dt_txt"])
        var unixTimestamp = data.list[i].dt;
        console.log(data.list[i].dt)
        // Date()
        // you don't need it for dt_txt but if you want to use the unix timestamp in the data, you can do this conversion:
        //https://stackoverflow.com/a/847196/9095603



        // https://www.tutorialrepublic.com/faq/how-to-convert-a-unix-timestamp-to-time-in-javascript.php#:~:text=Answer%3A%20Use%20the%20new%20Date,%3A00%3A00%20UTC).

        // How to Convert a Unix Timestamp to Time in JavaScript

        // Simply multiply Unix timestamp by 1000 to convert it to a JavaScript time, because Unix timestamp measures time as a number of seconds, whereas in JavaScript time is fundamentally specified as the number of milliseconds (elapsed since January 1, 1970 at 00:00:00 UTC).
        jsTimestamp = unixTimestamp * 1000
        var date = new Date(jsTimestamp);
        dateLocal = date.toLocaleDateString("en-AU")

        console.log(dateLocal);   // Prints: 5/6/2022

        timeLocal = date.toLocaleTimeString("en-AU", {hour: '2-digit', minute:'2-digit'}) // Prints: 13:10:34

        // How do I use .toLocaleTimeString() without displaying seconds?
        // https://stackoverflow.com/a/20430558/9095603

        // TypeError: date.getDay is not a function in JavaScript
        // https://bobbyhadz.com/blog/javascript-typeerror-date-getday-is-not-a-function#:~:text=getDay%20is%20not%20a%20function%22%20error%20occurs%20when%20the%20getDay,method%20on%20valid%20date%20objects.


        // var newWeatherArray;

        // newWeatherArray[dateLocal].push({})

        data.list[i].basicCalendarDate = dateLocal
        data.list[i].dayOfWeekIndex = date.getDay()
        data.list[i].dayOfWeekValue = days[date.getDay()]

        data.list[i].basicTime = timeLocal



        // Get a list of unique dates and days of the week

        // Array.push() Element if does not exist in JavaScript
        // https://bobbyhadz.com/blog/javascript-array-push-if-not-exist

        if (!datesArray.includes(dateLocal)) {
            datesArray.push(dateLocal);
            
            var dayOfWeek = days[date.getDay()];
            console.log(dayOfWeek)
          }


    }

    console.log({date})

    
    console.log({data})


    var datalist = data.list
    console.log({datalist})



    var obj = groupBy(datalist, "basicCalendarDate");
    console.log({obj})

    // Uncaught (in promise) TypeError: data.list.group is not a function
    // const result = data.list.group(({ basicCalendarDate }) => basicCalendarDate);
    // console.log({result})


    for(var i = 0; i < obj.length; i++){
        // begin with i = 1 since i = 0 is still the current day, which is treated separately in this app

        var dayTableEle = document.querySelector(`#day${i} table`);

        // var newNode = document.createElement("h6");
        // var textNode = document.createTextNode(`${dayOfWeekValue}`);
        // newNode.appendChild(textNode);
        
        
        // dayTableEle.parentElement.insertBefore(newNode,dayTableEle)
        

        dayTableEle.innerHTML = `<row><th>Time</th><th>Temp</th><th></th><th>Conditions</th><th>Humidity</th><th>Wind speed</th></row>`
        for(var j = 0; j < obj[i].length; j++){
            console.log(obj[i].length);
           
            if(!document.querySelector(`#day${i} h5`).innerText){
                document.querySelector(`#day${i} h5`).innerText = `${obj[i][j].dayOfWeekValue}`
            }
            if(!document.querySelector(`#day${i} h6`).innerText){
                document.querySelector(`#day${i} h6`).innerText = `${obj[i][j].basicCalendarDate}`
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
                tempMetric = obj[i][j].main.temp;
                tempMetric = roundedToFixed(tempMetric, 1);
                tempImperial = (tempMetric*1.8) + 32;
                tempImperial = roundedToFixed(tempImperial, 1);

                windSpeedMetric = obj[i][j].wind.speed
                windSpeedMetric = roundedToFixed(windSpeedMetric, 1);
                windSpeedImperial = windSpeedMetric * 2.23694;
                windSpeedImperial = roundedToFixed(windSpeedImperial,1);

                metricDisplay = 'inline';
                imperialDisplay = 'none';
            }
            else if(units == 'imperial'){
                tempImperial = obj[i][j].main.temp;
                tempImperial = roundedToFixed(tempImperial, 1)
                tempMetric = (tempImperial - 32) / 1.8;
                tempMetric = roundedToFixed(tempImperial, 1);

                windSpeedImperial = obj[i][j].wind.speed
                windSpeedImperial =  roundedToFixed(windSpeedImperial, 1);
                windSpeedMetric = windSpeedImperial / 2.23694;
                windSpeedMetric = roundedToFixed(windSpeedMetric,1);

                metricDisplay = 'none';
                imperialDisplay = 'inline';
            }

            dayTableEle.innerHTML += `
            <row>
                <th id="tdTime">${obj[i][j].basicTime}</td>
                <td id="tdTemp">
                    <span class="temp-metric metric" style="display:${metricDisplay};">${tempMetric} ${tempUnitsMetric}</span>
                    <span class="temp-imperial imperial" style="display:${imperialDisplay};">${tempImperial} ${tempUnitsImperial}</span>
                </td>
                <td><img src="http://openweathermap.org/img/wn/${obj[i][j].weather[0].icon}.png" alt="weather icon"></td>
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

}
)

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