import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Category} from "../../categories/shared/category.model";
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from '../../entries/shared/entry.model';
import * as currencyFormatter from 'currency-formatter';
import {EntryService} from "../../entries/shared/entry.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any;
  revenueTotal: any ;
  balance: any;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month!: ElementRef;
  @ViewChild('year') year!: ElementRef;

  constructor(private categoryService: CategoryService, private entryService: EntryService) {
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => this.categories = categories);
  }

  generateReports(): void {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

      if (!month || !year) {
        alert('Você precisa selecionar o Mês e o Ano para gerar os relatórios')
      } else {
        this.entryService.getByMonthAndYear(+month, +year).subscribe(this.setValues.bind(this))
      }

  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    console.log(this.entries);
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance(){
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if(entry.type == 'revenue') {
        revenueTotal += currencyFormatter.unformat(entry.amount || '0', { code: 'BRL' });
        console.log(revenueTotal);
      } else {
        expenseTotal += currencyFormatter.unformat(entry.amount || '0', { code: 'BRL' });
      }

    });

    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL'});
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL'});
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL'});
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string){
    const chartData: any [] = [];

    this.entries.forEach((category: Entry): void => {

      const filteredEntries: Entry[] = this.entries.filter(
        entry => (entry.categoryId == category.categoryId) && (entry.type === entryType)
      );

      if (filteredEntries.length > 0) {

        const totalAmount = filteredEntries.reduce(
          (total, entry: any)=> total + currencyFormatter.unformat(entry.amount, {code: 'BRL'}), 0
        )

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }
}
