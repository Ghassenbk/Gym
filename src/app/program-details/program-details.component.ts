import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.css']
})
export class ProgramDetailsComponent {
  openCalendarId: number | null = null;
  selectedProgramIds: number[] = [];

  constructor(private http: HttpClient) {}

  toggleCalendar(id: number) {
    this.openCalendarId = this.openCalendarId === id ? null : id;
  }

  toggleProgramSelection(id: number) {
    if (this.selectedProgramIds.includes(id)) {
      this.selectedProgramIds = this.selectedProgramIds.filter(programId => programId !== id);
    } else {
      this.selectedProgramIds.push(id);
    }
  }

  proceedToPayment() {
    if (this.selectedProgramIds.length > 0) {
      // Send selected program IDs to the backend
      this.http.post('/api/subscribe', { programIds: this.selectedProgramIds })
        .subscribe({
          next: (response) => {
            console.log('Successfully sent program IDs to backend:', response);
            // Handle success (e.g., redirect to payment page)
          },
          error: (error) => {
            console.error('Error sending program IDs to backend:', error);
            // Handle error (e.g., show error message)
          }
        });
      console.log('Selected Program IDs:', this.selectedProgramIds); // For demo purposes
    }
  }

  programs = [
    {
      id: 1,
      icon: '/training-image-01.jpg',
      title: 'Yoga Basics',
      description: 'A calming intro to yoga poses and breathing for strength...',
      schedule: [
        { day: 'Monday', activity: 'Stretch & Balance', time: '15:00' },
        { day: 'Tuesday', activity: 'Core Strength', time: '15:00' },
        { day: 'Wednesday', activity: 'Breathing & Flexibility', time: '15:00' },
      ]
    },
    {
      id: 2,
      icon: '/training-image-02.jpg',
      title: 'Pilates Training',
      description: 'Full-body moves that boost posture, control and endurance...',
      schedule: [
        { day: 'Monday', activity: 'Pilates Basics', time: '15:00' },
        { day: 'Tuesday', activity: 'Core Stability', time: '15:00' },
        { day: 'Wednesday', activity: 'Breathing Techniques', time: '15:00' },
      ]
    },
    {
      id: 3,
      icon: '/training-image-02.jpg',
      title: 'Pilates Training',
      description: 'Full-body moves that boost posture, control and endurance...',
      schedule: [
        { day: 'Monday', activity: 'Pilates Basics', time: '15:00' },
        { day: 'Tuesday', activity: 'Core Stability', time: '15:00' },
        { day: 'Wednesday', activity: 'Breathing Techniques', time: '15:00' },
      ]
    },
    {
      id: 4,
      icon: '/training-image-02.jpg',
      title: 'Pilates Training',
      description: 'Full-body moves that boost posture, control and endurance...',
      schedule: [
        { day: 'Monday', activity: 'Pilates Basics', time: '15:00' },
        { day: 'Tuesday', activity: 'Core Stability', time: '15:00' },
        { day: 'Wednesday', activity: 'Breathing Techniques', time: '15:00' },
      ]
    },
  ];
}