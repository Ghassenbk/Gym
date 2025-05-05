import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class CoachProfileComponent implements OnInit {
  coach = {
    imagePath: 'second-trainer.jpg',
    experienceYears: 10,
    name: 'John Doe',
    email: 'john.doe@example.com',
    specialty: 'Strength Training',
    clientsCount: 50
  };

  programs = [
    {
      imagePath: '/training-image-01.jpg',
      difficulty: 'Intermediate',
      title: 'Strength Builder',
      duration: '8 weeks',
      price: 199,
      description: 'A comprehensive strength training program.',
      subtitle: 'Build muscle and strength',
      enrolledClients: 25,
      plans: [
        { day: 'Monday', activity: 'Chest & Triceps', time: '60 min' },
        { day: 'Wednesday', activity: 'Back & Biceps', time: '60 min' }
      ]
    },
    {
      imagePath: '/training-image-01.jpg',
      difficulty: 'Intermediate',
      title: 'BODY BUILDING',
      duration: '8 weeks',
      price: 199,
      description: 'A comprehensive strength training program.',
      subtitle: 'Build muscle and strength',
      enrolledClients: 25,
      plans: [
        { day: 'Monday', activity: 'Chest & Triceps', time: '60 min' },
        { day: 'Wednesday', activity: 'Back & Biceps', time: '60 min' }
      ]
    }
  ];

  selectedProgram: any = null;
  isEditing: boolean = false;
  programForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.programForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [''],
      difficulty: ['Beginner'],
      plans: this.fb.array([])
    });
  }

  get plansFormArray(): FormArray {
    return this.programForm.get('plans') as FormArray;
  }

  ngOnInit() {}

  selectProgram(program: any) {
    this.selectedProgram = program;
    this.isEditing = false;
    this.resetForm();
  }

  startEdit() {
    this.isEditing = true;
    this.programForm.patchValue({
      title: this.selectedProgram.title,
      subtitle: this.selectedProgram.subtitle,
      description: this.selectedProgram.description,
      price: this.selectedProgram.price,
      duration: this.selectedProgram.duration,
      difficulty: this.selectedProgram.difficulty
    });

    const plansArray = this.plansFormArray;
    plansArray.clear();
    this.selectedProgram.plans.forEach((plan: any) => {
      plansArray.push(this.fb.group({
        day: [plan.day, Validators.required],
        activity: [plan.activity, Validators.required],
        time: [plan.time, Validators.required]
      }));
    });
    if (plansArray.length === 0) {
      this.addPlan(); // Ensure at least one plan exists
    }
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.isEditing = false;
    this.resetForm();
  }

  saveProgram() {
    if (this.programForm.valid) {
      const updatedProgram = {
        ...this.selectedProgram,
        ...this.programForm.value
      };
      const index = this.programs.findIndex(p => p === this.selectedProgram);
      if (index !== -1) {
        this.programs[index] = updatedProgram;
      }
      this.selectedProgram = updatedProgram;
      this.isEditing = false;
      this.resetForm();
    }
  }

  addPlan() {
    this.plansFormArray.push(this.fb.group({
      day: ['', Validators.required],
      activity: ['', Validators.required],
      time: ['', Validators.required]
    }));
    this.cdr.detectChanges();
  }

  removePlan(index: number) {
    this.plansFormArray.removeAt(index);
    this.cdr.detectChanges();
  }

  private resetForm() {
    this.programForm.reset({
      title: '',
      subtitle: '',
      description: '',
      price: 0,
      duration: '',
      difficulty: 'Beginner'
    });
    this.plansFormArray.clear();
    this.cdr.detectChanges();
  }

  editProfile() {
    // Implement profile editing logic
  }

  addNewProgram() {
    // Implement add new program logic
  }
}