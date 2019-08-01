<!doctype html>
<html>

<head>
  <meta charset="utf8">
  <title>sql.js demo: Online SQL interpreter</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.46.0/codemirror.css">
  <link rel="stylesheet" href="{{ URL::asset('/') }}css/demo.css" />
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.46.0/codemirror.js"></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js'></script>

</head>

<body>
 
  

  <h1>SQLite RhizerDB</h1>

  <main>
    <label for='commands'>Enter some SQL</label>
    <br>

    <textarea id="commands">
    SELECT * FROM `demo`;
    </textarea>

    <button id="execute" class="button">Execute</button>
    
    <label class="button">Load an SQLite database file: <input type='file' id='dbfile'></label>

    <div id="error" class="error"></div>

    <pre id="output">Los resultados se mostraran aqui</pre>
    
    <pre id="outputT">Data Test...</pre>

    <div id="app">
        <p>@{{ message }}</p>
      </div>

  </main>
  
     <!-- line chart canvas element -->
        <canvas id="buyers" width="600" height="400"></canvas>
        <!-- pie chart canvas element -->
        <canvas id="countries" width="600" height="400"></canvas>
        <!-- bar chart canvas element -->
        <canvas id="income" width="600" height="400"></canvas>
        <script>
            
            // pie chart data
            var pieData = [
                {
                    value: 20,
                    color:"#878BB6"
                },
                {
                    value : 40,
                    color : "#4ACAB4"
                },
                {
                    value : 10,
                    color : "#FF8153"
                },
                {
                    value : 30,
                    color : "#FFEA88"
                }
            ];
            // pie chart options
            var pieOptions = {
                 segmentShowStroke : false,
                 animateScale : true
            }
            // get pie chart canvas
            var countries= document.getElementById("countries").getContext("2d");
            // draw pie chart
            new Chart(countries).Pie(pieData, pieOptions);
            // bar chart data
            var barData = {
                labels : ["January","February","March","April","May","June"],
                datasets : [
                    {
                        fillColor : "#48A497",
                        strokeColor : "#48A4D1",
                        data : [456,479,324,569,702,600]
                    },
                    {
                        fillColor : "rgba(73,188,170,0.4)",
                        strokeColor : "rgba(72,174,209,0.4)",
                        data : [364,504,605,400,345,320]
                    }
                ]
            }
            // get bar chart canvas
            var income = document.getElementById("income").getContext("2d");
            // draw bar chart
            new Chart(income).Bar(barData);
        </script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.46.0/mode/sql/sql.min.js"></script>

  
  <script language="JavaScript" src="{{ URL::asset('/') }}js/gui.js"></script>
  
  
</body>

</html>
