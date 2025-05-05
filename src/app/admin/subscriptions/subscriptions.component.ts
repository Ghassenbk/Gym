import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

export interface Subscription {
  id: number;
  amountPaid: number;
  paymentMethod: string;
  subscriptionDate: Date;
  expirationDate: Date;
  client: { name: string };
  programs: { title: string }[];
}
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent implements OnInit, AfterViewInit {
  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];
  isLoading = true;
  searchTerm = '';
  filterMonth = '';
  months = [
    { name: 'January', value: '01' }, { name: 'February', value: '02' },
    { name: 'March', value: '03' }, { name: 'April', value: '04' },
    { name: 'May', value: '05' }, { name: 'June', value: '06' },
    { name: 'July', value: '07' }, { name: 'August', value: '08' },
    { name: 'September', value: '09' }, { name: 'October', value: '10' },
    { name: 'November', value: '11' }, { name: 'December', value: '12' }
  ];

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadSubscriptions();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  loadSubscriptions() {
    this.isLoading = true;
    // Simulate API call with sample data
    this.subscriptions = [
      {
        id: 1,
        amountPaid: 99.99,
        paymentMethod: 'Credit Card',
        subscriptionDate: new Date('2025-01-15'),
        expirationDate: new Date('2025-02-15'),
        client: { name: 'John Doe' },
        programs: [{ title: 'Strength Training' }, { title: 'Yoga Basics' }]
      },
      {
        id: 2,
        amountPaid: 149.99,
        paymentMethod: 'PayPal',
        subscriptionDate: new Date('2025-02-10'),
        expirationDate: new Date('2025-03-10'),
        client: { name: 'Jane Smith' },
        programs: [{ title: 'Cardio Blast' }]
      },
      {
        id: 3,
        amountPaid: 79.99,
        paymentMethod: 'Debit Card',
        subscriptionDate: new Date('2025-03-05'),
        expirationDate: new Date('2025-04-05'),
        client: { name: 'Mike Johnson' },
        programs: [{ title: 'Pilates Core' }]
      },
      {
        id: 4,
        amountPaid: 199.99,
        paymentMethod: 'Credit Card',
        subscriptionDate: new Date('2025-04-20'),
        expirationDate: new Date('2025-05-20'),
        client: { name: 'Sarah Williams' },
        programs: [{ title: 'HIIT Workout' }, { title: 'Strength Training' }]
      },
      {
        id: 5,
        amountPaid: 129.99,
        paymentMethod: 'Bank Transfer',
        subscriptionDate: new Date('2025-04-25'),
        expirationDate: new Date('2025-05-25'),
        client: { name: 'Emily Brown' },
        programs: [{ title: 'Yoga Advanced' }]
      }
    ];
    this.filteredSubscriptions = this.subscriptions;
    this.isLoading = false;
    this.renderChart();
  }

  filterSubscriptions() {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const matchesSearch = !this.searchTerm || 
        sub.client?.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesMonth = !this.filterMonth || 
        (new Date(sub.subscriptionDate).getMonth() + 1).toString().padStart(2, '0') === this.filterMonth;
      return matchesSearch && matchesMonth;
    });
  }

  viewDetails(id: number) {
    console.log('View subscription:', id);
  }

  deleteSubscription(id: number) {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
      this.filterSubscriptions();
      this.renderChart();
    }
  }

  renderChart() {
    const monthlyRevenue = this.months.map(month => {
      const total = this.subscriptions
        .filter(sub => (new Date(sub.subscriptionDate).getMonth() + 1).toString().padStart(2, '0') === month.value)
        .reduce((sum, sub) => sum + sub.amountPaid, 0);
      return total;
    });

    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.months.map(m => m.name),
        datasets: [{
          label: 'Monthly Revenue ($)',
          data: monthlyRevenue,
          backgroundColor: 'rgba(63, 81, 181, 0.6)',
          borderColor: 'rgba(63, 81, 181, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

}
