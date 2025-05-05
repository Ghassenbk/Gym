import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.css'
})
export class CoachesComponent {
  coaches = [
    {
      name: 'Ali Kriden',
      speciality: 'Yoga',
      imageUrl: 'second-trainer.jpg',
      selectedRating: 0,
      showComments: false,
      comments: [
        { text: 'Great for beginners!', rating: 4 },
        { text: 'Very patient and professional.', rating: 5 },
        { text: 'Always smiling and helpful!', rating: 4 },
      ]
    },
    {
      name: 'Sara Zen',
      speciality: 'Pilates',
      imageUrl: 'first-trainer.jpg',
      selectedRating: 0,
      showComments: false,
      comments: [
        { text: 'Fun and engaging sessions!', rating: 5 },
        { text: 'Very knowledgeable and kind.', rating: 4 },
      ]
    },
    {
      name: 'Sara Zen',
      speciality: 'Pilates',
      imageUrl: 'first-trainer.jpg',
      selectedRating: 0,
      showComments: false,
      comments: [
        { text: 'Fun and engaging sessions!', rating: 5 },
        { text: 'Very knowledgeable and kind.', rating: 4 },
      ]
    },
    {
      name: 'Sara Zen',
      speciality: 'Pilates',
      imageUrl: 'first-trainer.jpg',
      selectedRating: 0,
      showComments: false,
      comments: [
        { text: 'Fun and engaging sessions!', rating: 5 },
        { text: 'Very knowledgeable and kind.', rating: 4 },
      ]
    },
    
  ];

  selectRating(coach: any, star: number) {
    coach.selectedRating = star;
  }

  toggleComments(coach: any) {
    // Close all other dropdowns before toggling the selected one
    this.coaches.forEach(c => {
      if (c !== coach) {
        c.showComments = false;
      }
    });
    coach.showComments = !coach.showComments;
  }
  
}
