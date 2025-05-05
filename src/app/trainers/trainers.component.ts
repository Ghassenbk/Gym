import { Component } from '@angular/core';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css'
})
export class TrainersComponent {
  trainers = [
    {
      name: 'Zied Aamara',
      specialty: 'Boxing Coach',
      photo: '/first-trainer.jpg',
      rating: 4
    },
    {
      name: 'Lotfi Kriden ',
      specialty: 'BodyBuilding Coach',
      photo: '/second-trainer.jpg',
      rating: 5
    },
    {
      name: 'Rami lachlah',
      specialty: 'CrossFit Specialist',
      photo: '/third-trainer.jpg',
      rating: 3
    }
  ];

  // Returns an array of 5 elements [0,1,2,3,4] to loop through for stars
  getStars(): number[] {
    return [0, 1, 2, 3, 4];
  }
}

