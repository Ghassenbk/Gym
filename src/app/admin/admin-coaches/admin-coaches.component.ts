import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoachService } from '../../services/coachservice/coach.service';
import { HttpErrorResponse } from '@angular/common/http';

interface Plan {
  day: string;
  activity: string;
  time: string;
}

interface Program {
  id: number;
  title: string;
  description: string;
  price: number;
  imagePath: string;
  enrolledClients: number;
  plans: Plan[];
}

interface Coach {
  id: number;
  name: string;
  email: string;
  password?: string;
  imagePath: string;
  specialties: string;
  role: string;
  rating: number;
  reviews: any[];
  programs: Program[];
}

interface CoachRequest {
  name: string;
  email: string;
  password: string;
  imagePath: string;
  specialties: string;
}

@Component({
  selector: 'app-admin-coaches',
  templateUrl: './admin-coaches.component.html',
  styleUrls: ['./admin-coaches.component.css'],
  standalone: false,
})
export class AdminCoachesComponent implements OnInit {
  isLoading: boolean = false;
  coaches: Coach[] = [];
  expandedCoach: number | null = null;
  showAddCoachModal: boolean = false;
  showEditCoachModal: boolean = false;
  showDeleteConfirmModal: boolean = false;
  imagePreview: string | null = null;
  editImagePreview: string | null = null;
  deleteCoachId: number | null = null;
  deleteCoachName: string = '';
  backendUrl: string = 'http://localhost:9090';

  newCoach: Partial<Coach> & { imageFile?: File } = {
    name: '',
    email: '',
    password: '',
    specialties: '',
    imagePath: '',
    role: 'COACH'
  };

  editCoach: Partial<Coach> & { imageFile?: File } = {
    id: 0,
    name: '',
    email: '',
    password: '',
    specialties: '',
    imagePath: '',
    role: 'COACH'
  };

  constructor(private coachService: CoachService) {}

  ngOnInit(): void {
    this.fetchCoaches();
  }

  getImageUrl(imagePath: string): string {
    return imagePath && imagePath !== '/default-coach-image.jpg' ? `${this.backendUrl}${imagePath}` : '/assets/placeholder.png';
  }

  getEditImageSrc(): string {
    return this.editImagePreview || this.getImageUrl(this.editCoach.imagePath || '/default-coach-image.jpg');
  }

  fetchCoaches(): void {
    this.isLoading = true;
    this.coachService.getCoaches().subscribe({
      next: (coaches: Coach[]) => {
        this.coaches = coaches.map((coach: Coach) => ({
          ...coach,
          rating: coach.rating || 0,
          reviews: coach.reviews || [],
          programs: coach.programs || []
        }));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching coaches:', error);
        this.isLoading = false;
      }
    });
  }

  togglePrograms(coachId: number): void {
    this.expandedCoach = this.expandedCoach === coachId ? null : coachId;
  }

  viewProgramDetails(coachId: number, programId: number, event: MouseEvent): void {
    event.stopPropagation();
    console.log(`View program details for coach ${coachId}, program ${programId}`);
  }

  openAddCoachModal(): void {
    this.showAddCoachModal = true;
    this.imagePreview = null;
  }

  closeAddCoachModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showAddCoachModal = false;
    this.newCoach = {
      name: '',
      email: '',
      password: '',
      specialties: '',
      imagePath: '',
      role: 'COACH',
      imageFile: undefined
    };
    this.imagePreview = null;
  }

  openEditCoachModal(coach: Coach, event: Event): void {
    event.stopPropagation();
    this.editCoach = {
      id: coach.id,
      name: coach.name,
      email: coach.email,
      password: coach.password || '',
      specialties: coach.specialties,
      imagePath: coach.imagePath,
      role: coach.role || 'COACH',
      imageFile: undefined
    };
    this.editImagePreview = null;
    this.showEditCoachModal = true;
  }

  closeEditCoachModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showEditCoachModal = false;
    this.editCoach = {
      id: 0,
      name: '',
      email: '',
      password: '',
      specialties: '',
      imagePath: '',
      role: 'COACH',
      imageFile: undefined
    };
    this.editImagePreview = null;
  }

  openDeleteConfirmModal(coachId: number, coachName: string, event: Event): void {
    event.stopPropagation();
    this.deleteCoachId = coachId;
    this.deleteCoachName = coachName;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showDeleteConfirmModal = false;
    this.deleteCoachId = null;
    this.deleteCoachName = '';
  }

  confirmDelete(): void {
    if (this.deleteCoachId !== null) {
      this.coachService.deleteCoach(this.deleteCoachId).subscribe({
        next: () => {
          this.coaches = this.coaches.filter(coach => coach.id !== this.deleteCoachId);
          this.closeDeleteConfirmModal();
          alert('Coach deleted successfully.');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting coach:', error);
          this.coachService.getCoach(this.deleteCoachId!).subscribe({
            next: () => {
              alert('Failed to delete coach: ' + (error.error || 'Unknown error'));
            },
            error: () => {
              this.coaches = this.coaches.filter(coach => coach.id !== this.deleteCoachId);
              this.closeDeleteConfirmModal();
              alert('Coach deleted successfully.');
            }
          });
        }
      });
    }
  }

  onImageSelected(event: Event, modalType: 'add' | 'edit'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (modalType === 'add') {
        this.newCoach.imageFile = file;
      } else {
        this.editCoach.imageFile = file;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        if (modalType === 'add') {
          this.imagePreview = imageData;
        } else {
          this.editImagePreview = imageData;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  submitNewCoach(): void {
    if (!this.newCoach.name || !this.newCoach.email || !this.newCoach.password) {
      alert('Please fill in all required fields.');
      return;
    }

    const coachData: CoachRequest = {
      name: this.newCoach.name,
      email: this.newCoach.email,
      password: this.newCoach.password,
      imagePath: '/default-coach-image.jpg',
      specialties: this.newCoach.specialties || 'General'
    };

    if (this.newCoach.imageFile) {
      this.coachService.uploadImage(this.newCoach.imageFile).subscribe({
        next: (imagePath: string) => {
          console.log('Uploaded image path:', imagePath);
          coachData.imagePath = imagePath;
          this.createCoach(coachData);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image: ' + (error.error || error.message || 'Unknown error') + '. Using default image.');
          this.createCoach(coachData); // Proceed with default image
        }
      });
    } else {
      console.log('No image selected, using default image path:', coachData.imagePath);
      this.createCoach(coachData);
    }
  }

  private createCoach(coachData: CoachRequest): void {
    console.log('Submitting coach with imagePath:', coachData.imagePath);
    this.coachService.createCoach(coachData).subscribe({
      next: (newCoach: Coach) => {
        this.coaches.push({
          ...newCoach,
          rating: 0,
          reviews: [],
          programs: newCoach.programs || [],
          specialties: this.newCoach.specialties || 'General'
        });
        this.closeAddCoachModal();
        alert('Coach created successfully.');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating coach:', error);
        alert('Failed to create coach: ' + (error.error || error.message || 'Unknown error'));
      }
    });
  }

  submitEditCoach(): void {
    if (!this.editCoach.id || !this.editCoach.name || !this.editCoach.email) {
      alert('Please fill in all required fields.');
      return;
    }

    const coachData: Coach = {
      id: this.editCoach.id,
      name: this.editCoach.name,
      email: this.editCoach.email,
      password: this.editCoach.password || '',
      imagePath: this.editCoach.imagePath || '/default-coach-image.jpg',
      specialties: this.editCoach.specialties || 'General',
      role: 'COACH',
      rating: 0,
      reviews: [],
      programs: []
    };

    if (this.editCoach.imageFile) {
      this.coachService.uploadImage(this.editCoach.imageFile).subscribe({
        next: (imagePath: string) => {
          console.log('Uploaded image path:', imagePath);
          coachData.imagePath = imagePath;
          this.updateCoach(coachData);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image: ' + (error.error || error.message || 'Unknown error') + '. Keeping existing image.');
          this.updateCoach(coachData); // Proceed with existing imagePath
        }
      });
    } else {
      console.log('No new image selected, using image path:', coachData.imagePath);
      this.updateCoach(coachData);
    }
  }

  private updateCoach(coachData: Coach): void {
    console.log('Updating coach with imagePath:', coachData.imagePath);
    this.coachService.updateCoach(this.editCoach.id!, coachData).subscribe({
      next: (updatedCoach: Coach) => {
        const index = this.coaches.findIndex(coach => coach.id === this.editCoach.id);
        if (index !== -1) {
          this.coaches[index] = {
            ...updatedCoach,
            rating: this.coaches[index].rating,
            reviews: this.coaches[index].reviews,
            programs: this.coaches[index].programs,
            specialties: this.editCoach.specialties || 'General'
          };
        }
        this.closeEditCoachModal();
        alert('Coach updated successfully.');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating coach:', error);
        alert('Failed to update coach: ' + (error.error || error.message || 'Unknown error'));
      }
    });
  }
}