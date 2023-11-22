import { Component } from '@angular/core';
import { NgChartsModule } from "ng2-charts";
import { ChartConfiguration } from "chart.js";

@Component({
    standalone: true,
    imports: [NgChartsModule],
    templateUrl: "./graphics.component.html",
    styles: [],
})
export class GraphicsComponent {
    private seriesA = [65, 59, 80, 81, 56, 55, 40];
    private seriesB = [28, 48, 40, 19, 86, 27, 90];
    private average = this.seriesA.map((v, idx) => (v + this.seriesB[idx]) / 2);
    protected chartLegend = true;
    protected chartPlugins = [];
    protected chartData: ChartConfiguration["data"] = {
        labels: ["2006", "2007", "2008", "2009", "2010", "2011", "2012"],
        datasets: [
            {
                type: "bar",
                data: this.seriesA,
                label: "Series A",
            },
            {
                type: "bar",
                data: this.seriesB,
                label: "Series B",
            },
            {
                type: "line",
                data: this.average,
                label: "Average",
                fill: true,
                tension: 0.5,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, .1)",
            },
        ],
    };
    protected chartOptions: ChartConfiguration["options"] = {
        responsive: true,
    };
}
