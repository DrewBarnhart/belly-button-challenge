// get the JSON data and console log it
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function (data) {
    console.log(data);
    
    // populate the dropdown by obtaining subject ID's
    var dropdownList = d3.select("#selDataset");
    var subject_id = data.names;
    subject_id.forEach((id) => {
      dropdownList.append("option").text(id);
    });
   
    //start infor w/ ID 940
    var demographicInfo = data.metadata;
    var subjectMetadata = demographicInfo.filter(subject => subject.id == '940');
    Object.entries(subjectMetadata[0]).forEach(([key,value]) => {
      d3.select('#sample-metadata').append("h6").text(`${key}: ${value}`);
    });
   
    // start charts with data with ID = 940
    var otuData = data.samples;
    var subjectOtuData = otuData.filter(subject => subject.id == '940');
    
    // get x, y and text values from data
    var sampleValues = subjectOtuData[0].sample_values;
    var otuIds = subjectOtuData[0].otu_ids;
    var otuLabels = subjectOtuData[0].otu_labels;
    var x = sampleValues.slice(0,10).reverse();
    var y = otuIds.slice(0,10).map(y => `OTU ${y}`).reverse();
    var hover = otuLabels.slice(0,10).reverse();
    
    // set params for bar chart
    var bar_graph = {
      x: x,
      y: y,
      text: hover,
      type: 'bar',
      orientation: 'h'
    };

    // set param for bubble chart
    let bubble_chart = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
      }
    };
    var bubble_layout = {
      xaxis: {title: 'OTU ID'}
    }

    //plot the charts using Plotly
    Plotly.newPlot('bar', [bar_graph]);
    Plotly.newPlot('bubble',[bubble_chart],bubble_layout);

    // Call updateView() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updateView);
    
    // Create function that updates the views when new selection is made from the dropdown
    function updateView() {
      var dropdownList = d3.select("#selDataset");
    
      // Get selected subject ID
      var selectedSubject = dropdownList.property("value");
    
      //find demographic_info by subject ID
      var demographicInfo = data.metadata;
      var subjectMetadata = demographicInfo.filter(subject => subject.id == selectedSubject);
    
      //Make sure  Demographic Info panel is reset
      d3.select('#sample-metadata').html("");
    
      //Add demographic info of selected subject to panel
      Object.entries(subjectMetadata[0]).forEach(([key,value]) => {
        d3.select('#sample-metadata').append("h6").text(`${key}: ${value}`);
      });
    
      //loadd  data for selected subject ID
      var otuData = data.samples;
      var subjectOtuData = otuData.filter(subject => subject.id == selectedSubject);
      var sampleValues = subjectOtuData[0].sample_values;
      var otuIds = subjectOtuData[0].otu_ids;
      var otuLabels = subjectOtuData[0].otu_labels;
      var x = sampleValues.slice(0,10).reverse();
      var y = otuIds.slice(0,10).map(y => `OTU ${y}`).reverse();
      var hover = otuLabels.slice(0,10).reverse();
    
      //set params for charts
      var bar_graph = {
        x: x,
        y: y,
        text: hover,
        type: 'bar',
        orientation: 'h'
        
      };

      var graph_layout = {
        xaxis: {title: 'otu ID'}
      };

      var bubble_graph = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
        }
      };
      var bubble_layout = {
        xaxis: {title: 'OTU ID'}
      }
    
      //plot the charts
      Plotly.newPlot('bar', [bar_graph],graph_layout);
      Plotly.newPlot('bubble',[bubble_graph],bubble_layout);
      }
  });