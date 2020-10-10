import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public color;
  public svg;
  public width;
  public height;
  public radius;
  public pie;
  public arc;
  public outerArc;
  public key;
  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#98abc5",
          "#8a89a6",
          "#7b6888",
          "#6b486b",
          "#a05d56",
          "#d0743c",
          "#ff8c00",
        ],
      },
    ],
    labels: [],
  };

  constructor(public dataService:DataserviceService) {
  }

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) =>{
      let data1 = [];
      let label1 = [];
      data.myBudget.map((item, key)=>{
        // console.log("item", item);
        data1.push(item.title);
        label1.push(item.budget);
      });
      this.dataSource.datasets[0].data = label1;
      this.dataSource.labels = data1;
      this.createPieChart();
      this.createD3Chart();
    });
  }

  createPieChart():void{
    this.createChart();
  }
  createD3Chart():void{
    this.color = d3.scale.ordinal()
    .domain(this.dataSource.labels)
    .range(this.dataSource.datasets[0].backgroundColor);
    this.svg = d3.select("#chart")
    .append("svg")
    .append("g")

this.svg.append("g")
  .attr("class", "slices");
this.svg.append("g")
  .attr("class", "labels");
this.svg.append("g")
  .attr("class", "lines");

this.width = 960,
this.height = 450,
this.radius = Math.min(this.width, this.height) / 2;

this.pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
      return d.value;
  });

this.arc = d3.svg.arc()
  .outerRadius(this.radius * 0.8)
  .innerRadius(this.radius * 0.4);

this.outerArc = d3.svg.arc()
  .innerRadius(this.radius * 0.9)
  .outerRadius(this.radius * 0.9);

this.svg.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");


this.key = function(d){ return d.data.label; };
this.donutPieChart(this.genD3data(this.dataSource), this.color, this.arc, this.outerArc, this.radius);
  }

  createChart() {
    var ctx = document.getElementById("myChart");
    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: this.dataSource,
    });
  }
  genD3data(dataSource){
    var labels = this.color.domain();
    var i=0;
    return labels.map(function(label){
        return { label: label, value: dataSource.datasets[0].data[i++] }
    });
  }
  donutPieChart(data,color,arc,outerArc,radius) {
    /* ------- PIE SLICES -------*/
    var slice = this.svg.select(".slices").selectAll("path.slice")
      .data(this.pie(data), this.key);

    slice.enter()
      .insert("path")
      .style("fill", function(d) { return color(d.data.label); })
      .attr("class", "slice");

    slice
      .transition().duration(1000)
      .attrTween("d", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
              return arc(interpolate(t));
          };
      })

    slice.exit()
      .remove();

    /* ------- TEXT LABELS -------*/

    var text = this.svg.select(".labels").selectAll("text")
      .data(this.pie(data), this.key);

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function(d) {
          return d.data.label;
      });

    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate("+ pos +")";
          };
      })
      .styleTween("text-anchor", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start":"end";
          };
      });

    text.exit()
      .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = this.svg.select(".lines").selectAll("polyline")
      .data(this.pie(data), this.key);

    polyline.enter()
      .append("polyline");

    polyline.transition().duration(1000)
      .attrTween("points", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
      });
    polyline.exit()
      .remove();
    }
}
