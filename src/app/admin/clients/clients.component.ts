import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface Subscription {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  imagePath: string;
  subscriptions: Subscription[];
}


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent  implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  expandedClient: number | null = null;
  apiUrl = 'http://localhost:8080/api/clients'; // Adjust as needed
  
  // Sample clients for testing
  sampleClients: Client[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      imagePath: '/training-image-01.jpg',
      subscriptions: [
        { id: 1, type: 'Monthly Fitness', startDate: '2025-03-01', endDate: '2025-04-01' },
        { id: 2, type: 'Personal Training', startDate: '2025-03-15', endDate: '2025-06-15' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      imagePath: '/training-image-01.jpg',
      subscriptions: [
        { id: 3, type: 'Annual Membership', startDate: '2025-01-01', endDate: '2026-01-01' }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      imagePath: '/training-image-01.jpg',
      subscriptions: []
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      imagePath: '/training-image-01.jpg',
      subscriptions: [
        { id: 4, type: 'Swimming Classes', startDate: '2025-02-15', endDate: '2025-05-15' },
        { id: 5, type: 'Yoga Sessions', startDate: '2025-03-01', endDate: '2025-06-01' }
      ]
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      imagePath:'/training-image-01.jpg',
      subscriptions: [
        { id: 6, type: 'Monthly Fitness', startDate: '2025-04-01', endDate: '2025-05-01' }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Comment this out when you want to use real API
    // this.loadClients();
    
    // Use sample data instead
    this.loadSampleData();
  }

  loadClients(): void {
    this.isLoading = true;
    this.http.get<Client[]>(this.apiUrl)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.clients = data;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          alert('Failed to load clients');
        }
      });
  }
  
  loadSampleData(): void {
    // Use sample data for testing
    this.clients = [...this.sampleClients];
  }

  deleteClient(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this client?')) {
      // For sample data
      this.clients = this.clients.filter(client => client.id !== id);
      
      // When using real API
      /*
      this.isLoading = true;
      this.http.delete(`${this.apiUrl}/${id}`)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.clients = this.clients.filter(client => client.id !== id);
            alert('Client deleted successfully');
          },
          error: (err) => {
            console.error('Error deleting client:', err);
            alert('Failed to delete client');
          }
        });
      */
    }
  }

  toggleSubscriptions(id: number): void {
    this.expandedClient = this.expandedClient === id ? null : id;
  }

 
  
  getSubscriptionStatus(subscription: Subscription): string {
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    
    if (endDate < today) {
      return 'expired';
    } else {
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 7 ? 'expiring-soon' : 'active';
    }
  }

}
