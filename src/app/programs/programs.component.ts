import { Component } from '@angular/core';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css'
})
export class ProgramsComponent {
   programs = [
  {
    id: 1,
    icon: '/features-first-icon.png',
    title: 'Basic Fitness',
    description: 'A perfect program for beginners looking to improve overall fitness, flexibility, and endurance.'
  },
  {
    id: 2,
    icon: '/features-first-icon.png',
    title: 'Advanced Muscle Course',
    description: 'An intensive strength-training course designed for experienced individuals aiming to build muscles.'
  },
  {
    id: 3,
    icon: '/features-first-icon.png',
    title: 'New Gym Training',
    description: 'An course to help you get familiar with gym equipment and effective workout routines.'
  },
  {
    id: 4,
    icon: '/features-first-icon.png',
    title: 'Yoga Training',
    description: 'Improve flexibility, reduce stress, and strengthen your core through our guided yoga sessions.'
  },
  {
    id: 5,
    icon: '/features-first-icon.png',
    title: 'Basic Muscle Course',
    description: 'A foundational program focused on strength building and muscle toning for beginners.'
  },
  {
    id: 6,
    icon: '/features-first-icon.png',
    title: 'Body Building Course',
    description: 'A  bodybuilding program tailored for maximizing muscle gain, definition, and physical conditioning.'
  }
];

}
