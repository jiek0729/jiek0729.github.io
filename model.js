function station(params) {
  this.station_name = params[0];
  this.coords = new google.maps.LatLng(parseFloat(params[2]), parseFloat(params[1]));
  this.rail = parseInt(params[3]) == 1 ? true : false;
  this.system = params[4];
  this.mode = params[5];
  this.line = params[6];
  this.region = params[7];
  this.state = params[8];
  this.station_id = parseInt(params[9]);
  this.city = params[10];
}

function ReadFile(filepathIncludingFileName) {
  sr = new File.OpenText(filepathIncludingFileName);

  input = "";
  while (true) {
    input += sr.ReadLine() + "\n";
    if (input == null) { break; }
  }
  sr.Close();

  return input;
}

// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  var a = [];                     // Initialize array to receive values.
  text.replace(re_value, // "Walk" the string using replace with callback.
    function(m0, m1, m2, m3) {
      // Remove backslash from \' in single quoted values.
      if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ''; // Return empty string.
    });
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
};

function csvJSON(csv){

  var lines=csv.split("\n");

  var result = {};

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

    var currentline=CSVtoArray(lines[i]);

    if(currentline === null || currentline.length === 0) {
      continue;
    }

    st = new station(currentline);

    result[st.station_id] = st;
  }

  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}
