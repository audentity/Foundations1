/*
	Student: Jeff Hemmerling
	Class: Code Fellows, PDX Foundations I
	Assignment: Code: Add interactivity to your donut shop 
	Due: 2015.03.23
	File: donut3.js
*/


"use strict";

// Enable this flag for debug output.
var  debug = false;

//
// Function: output(string)
// Purpose:  Route all output through this function so the
//           implementation can be easily changed.
//
var output = function (string)
{
	console.log (string);
	//document.write (string);
};


//
// Function: arraySum(array)
// Purpose:  Return sum of numeric array elements.
//
var arraySum = function (array)
{
	var  total = 0;
	array.map (function (element) { total += element; });
	return total;
};


//
// Function: arrayPrint(array)
// Purpose:  Return a string of numeric array elements, ignoring undefined.
//
var arrayPrint = function (array)
{
	var  isFirst = true;
	var  buffer;
	buffer = "[";
	array.map (function (element)
	{
		if (!isNaN (element))
		{
			if (isFirst)
				isFirst = false;
			else
				buffer += ", ";
			buffer += element.toString();
		}
	});
	buffer += "]";
	return buffer;
};



//
// DonutShop class constructor
//
var DonutShop = function (
		shopName,           // string: Shop name
		hours,              // array: [OpeningTime, ClosingTime]
		customerMinMax,     // array: [minCount, maxCount] per hour
		donutsPerCustomer)  // real:  Average # of donuts ordered/customer
{
	// Constant data.
	this.shopName = shopName;
	this.hours = hours;    // NOTE: Using 24-hour time
	this.customerMinMax = customerMinMax;
	this.donutsPerCustomer = donutsPerCustomer;

	// Derived data.
	this.donutsRequired = [];    // Donuts to cook per hour
	this.customersPerHour = [];  // Actual number of customers per hour

	this.dump = function ()
	{
		output (this.shopName);
		output ("    Business hours: [" +
			this.hours[0] + ".." + this.hours[1] + "]\n");
		output ("    Customer min/max per hour: [" +
			this.customerMinMax[0] + ".." + this.customerMinMax[1] + "]\n");
		output ("    Average donuts ordered per customer: " + this.donutsPerCustomer);
		output ("    Actual customers per hour: " + arrayPrint (this.customersPerHour));
		output ("    Donuts needed per hour: " + arrayPrint (this.donutsRequired));
	};

	this.totalDonuts = function() { return arraySum (this.donutsRequired); };
	this.totalCustomers = function() { return arraySum (this.customersPerHour); };
};


//
// Function: customersInHour(void)
// Purpose:  Calculate how many customers for one hour.
//
DonutShop.prototype.customersInHour = function ()
{
	var  custActual = this.customerMinMax[0] + 
						Math.floor (Math.random() *
							(this.customerMinMax[1] - this.customerMinMax[0] + 1));

	// Verify the customerActual calculation.
	if (custActual < this.customerMinMax[0] ||
		custActual > this.customerMinMax[1])
	{
		output ("customersInHour(): BUG: custActual (" + custActual +
			") is out of range [" +
			this.customerMinMax[0] + ".." + this.customerMinMax[1] + "]\n");
	}

	return (custActual);
};


//
// Function: calculateFlow(void)
// Purpose:  Calculate how many donuts are required for every hour
//           that the shop is open.
//
DonutShop.prototype.calculateFlow = function ()
{
	// For each hour the shop is open...
	for (var hour = this.hours[0];  hour < this.hours[1];  ++hour)
	{
		// Get randomized number of customers this hour.
		this.customersPerHour[hour] = this.customersInHour();
		// Calculate dounts required this hour.
		var  donutsThisHour = Math.ceil (this.customersPerHour[hour] * this.donutsPerCustomer);
		this.donutsRequired[hour] = donutsThisHour;
		//output ("this.donutsRequired[" + hour + "] = " + this.donutsRequired[hour]);
	}
};



function convertHour24to12 (hour)
{
	hour %= 12;
	if (hour == 0)
		hour = 12;
	return hour;
}


//
// Function: showDonutFlow(void)
// Purpose:
//   On a per hour basis, output:
//   - Number of customers;
//   - Number of donuts required.
//   Also output totals for the day.
//
DonutShop.prototype.showDonutFlow = function ()
{
	// Hide the table while it's being repopulated.
	//$("#productionTable").css ("visibility", "hidden");
	//$("#productionTable").fadeOut();
	$("#productionTable").hide();

	// Set shop name
	$("#tableTitle").text (this.shopName);

	// Add rows to table.
	var totalDonuts = 0;
	//$("#tableRows").empty();
	$("#productionTable tbody tr").empty();
	for (var h = this.hours[0];  h < this.hours[1];  ++h)
	{
		var   hour = Number (h);
		var   donutsThisHour = this.donutsRequired[hour];
		totalDonuts += donutsThisHour;
		//var   customersThisHour = this.customersPerHour[hour];
		var  rowHTML = "";
		rowHTML += "<tr>";
		rowHTML += " <td>" + convertHour24to12 (hour) + "-";
		rowHTML += convertHour24to12 (hour + 1);
		rowHTML += ((hour + 1 < 12) ? "am" : "pm");
		rowHTML += "</td>";
		rowHTML += " <td>" + donutsThisHour + "</td>";
		rowHTML += "</tr>";
		$("#productionTable").append (rowHTML);
	}
	// Add total row.
	$("#productionTable").append ("<tr>"
		+ " <td><strong>TOTAL DONUTS</strong></td>"
		+ " <td>" + totalDonuts + "</td>"
		+ "</tr>");

	$("#productionTable").fadeIn();
	//$("#productionTable").css ("visibility", "visible");
};


/*
	DONUT SHOP DATA
                                          CUST   DONUTS
                                          MIN/   PER
    SHOP NAME               HOURS         MAX    CUST
    Downtown            7:00am-6:00pm   [8..43]  4.50
    Capitol Hill        7:00am-6:00pm   [4..37]  2.00
    South Lake Union    7:00am-6:00pm   [9..23]  6.33
    Wedgewood           7:00am-6:00pm   [2..28]  1.25
    Ballard             7:00am-6:00pm   [8..58]  3.75
*/

var  shops = [];
shops.push (new DonutShop ("Downtown",         [7,18], [8,43], 4.50));
shops.push (new DonutShop ("Capitol Hill",     [7,18], [4,37], 2.00));
shops.push (new DonutShop ("South Lake Union", [7,18], [9,23], 6.33));
shops.push (new DonutShop ("Wedgewood",        [7,18], [2,28], 1.25));
shops.push (new DonutShop ("Ballard",          [7,18], [8,58], 3.75));

// Populate shop name menu.
shops.map (function(shop, idx) {
	$('#locationMenu').append(
		"<option index=\"" +
		idx +
		//shop.shopName +
		"\">" +
		shop.shopName +
		"</option>");
});

// Function to populate & display production schedule for one shop.
function displayShopData (shopName) {
	var   shopIdx = -1;
	shops.every (function(shop, idx) {
		if (shop.shopName === shopName) {
			//console.log ("shops[" + idx + "] = " + shop.shopName);
			shopIdx = idx;
			return false;   // break from every()
		}
		return true;   // Keep searching array
	});

	if (shopIdx === -1)
	{
		alert ("ERROR: Can't find shop '" + shopName + "'");
		return;
	}
	//alert ("Found shop idx = " + shopIdx);

	shops[shopIdx].showDonutFlow();
	return;
}

// When user selects a shop, show that data.
$('#locationMenu').change (function()
{
	//alert ($(this).text());
	/*
	if ($(this).value())   // Nothing. value() not defined?
	else
		alert ("No value defined");
	*/
	//alert ($('#locationMenu').value());
	var  str = '';
	$("select option:selected").each (function() {
		//console.log ($(this).text());
		str = $(this).text();
	});
	displayShopData (str);
});


//
// Main function.
//

// Calculate donuts required for all shops.
shops.map (function (shop) {
	shop.calculateFlow();
});

// Initially show data of first shop.
displayShopData (shops[0].shopName);

// eof
