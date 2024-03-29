var execBtn = document.getElementById("execute");
var outputElm = document.getElementById('output');
var outputElmT = document.getElementById('outputT');
var errorElm = document.getElementById('error');
var commandsElm = document.getElementById('commands');
var dbFileElm = document.getElementById('dbfile');
var temp='';


// Start the worker in which sql.js will run
var worker = new Worker("../../dist/worker.sql-wasm.js");
worker.onerror = error;

// Open a database
worker.postMessage({ action: 'open' });

// Connect to the HTML element we 'print' to
function print(text) {
	outputElm.innerHTML = text.replace(/\n/g, '<br>');
    outputElmT.innerHTML = text.replace(/\n/g, '<br>');
}
function error(e) {
	console.log(e);
	errorElm.style.height = '2em';
	errorElm.textContent = e.message;
}

function noerror() {
	errorElm.style.height = '0';
}

// Run a command in the database
function execute(commands) {
	tic();
	worker.onmessage = function (event) {
		var results = event.data.results;
		toc("Executing SQL");

		tic();
		outputElm.innerHTML = "";
        outputElmT.innerHTML = "";
		for (var i = 0; i < results.length; i++) {
			outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
			outputElmT.appendChild(tableCreateT(results[i].columns, results[i].values));
			temp+=1;
		}
		toc("Displaying results");
	}
	worker.postMessage({ action: 'exec', sql: commands });
	outputElm.textContent = "Fetching results...";
}

// Create an HTML table
var tableCreate = function () {
	function valconcat(vals, tagName) {
		if (vals.length === 0) return '';
		var open = '<' + tagName + '>', close = '</' + tagName + '>';
		return open + vals.join(close + open) + close;
	}
	return function (columns, values) {
		var tbl = document.createElement('table');
		var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
		var rows = values.map(function (v) { return valconcat(v, 'td'); });
		html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
		tbl.innerHTML = html;
		return tbl;
	}
}();

// Execute the commands when the button is clicked
function execEditorContents() {
	noerror()
	execute(editor.getValue() + ';');
}
execBtn.addEventListener("click", execEditorContents, true);

// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
function tic() { tictime = performance.now() }
function toc(msg) {
	var dt = performance.now() - tictime;
	console.log((msg || 'toc') + ": " + dt + "ms");
}

// Add syntax highlihjting to the textarea
var editor = CodeMirror.fromTextArea(commandsElm, {
	mode: 'text/x-mysql',
	viewportMargin: Infinity,
	indentWithTabs: true,
	smartIndent: true,
	lineNumbers: true,
	matchBrackets: true,
	autofocus: true,
	extraKeys: {
		"Ctrl-Enter": execEditorContents,
		
	}
});

// Load a db from a file
dbFileElm.onchange = function () {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function () {
		worker.onmessage = function () {
			toc("Loading database from file");
			// Show the schema of the loaded database
			editor.setValue("SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';");
			execEditorContents();
		};
		tic();
		try {
			worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
		}
		catch (exception) {
			worker.postMessage({ action: 'open', buffer: r.result });
		}
	}
	r.readAsArrayBuffer(f);
}


// line chart data
var buyerData = {
	labels : ["January","February","March","April","May","June"],
	datasets : [
	{
		fillColor : "rgba(172,194,132,0.4)",
		strokeColor : "#ACC26D",
		pointColor : "#fff",
		pointStrokeColor : "#9DB86D",
		data : [203,156,99,251,305,247]
	}
]
}

// Pass data to chart

var tableCreateT = function () {
	function valconcat(vals, tagName) {
		if (vals.length === 0) return '';
		var open = '<' + tagName + '>', close = '</' + tagName + '>';
		return open + vals.join(close + open);
	}
	return function (columns, values) {
		var tbl = document.createElement('p');
		var html = 'ROWS= '+'<b>' + columns + '</b>'+'</br> ';
		buyerData.labels = columns;
		// get line chart canvas
var buyers = document.getElementById('buyers').getContext('2d');
// draw line chart
new Chart(buyers).Line(buyerData);
		var rows = values.map(function (v) { return v + ' - ' });
		html += valconcat(rows, 'p')  + `<br>` ;
		tbl.innerHTML = html;
				
		return tbl;
	}
}();


var vCol = function(col){
	return col;
}

new Vue({
	el: '#app',
	data: {
	  message: temp
	}
  })
