import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "#AB6F62",
          "#766D0F",
          "#90A2F3",
        ],
      },
    ],
    labels: [],
  };

  constructor(private http:HttpClient) {
    console.log('A');
  }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget').subscribe((res:any) =>{
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        this.createChart();
      }
    });
  }
  createChart() {
    var ctx = document.getElementById("myChart");
    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: this.dataSource,
    });
  }

}
