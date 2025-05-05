import { Component, OnInit } from '@angular/core';

interface UserMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  seen: boolean;
  createdAt: Date;
}
@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrl: './admin-contact.component.css'
})
export class AdminContactComponent  implements OnInit{
  messages: UserMessage[] = [];
  isLoading = false;
  showDeleteModal = false;
  deleteAllMode = false;
  messageToDeleteId: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    // Static data instead of service call
    this.messages = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userAvatar: '/training-image-01.jpg',
        content: 'Hello admin, I need help with my subscription. It seems like my payment didn\'t go through but my account was still charged.',
        seen: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userAvatar: '/training-image-01.jpg',
        content: 'Is there any way to change my email address? I don\'t see that option in my account settings.',
        seen: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        userAvatar: '/training-image-01.jpg',
        content: 'The latest update is amazing! But I noticed a small bug in the dashboard where the charts don\'t update correctly when switching tabs.',
        seen: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'Sarah Williams',
        content: 'I\'m having trouble uploading profile pictures. Could you please look into this issue?',
        seen: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: '5',
        userId: 'user5',
        userName: 'Robert Brown',
        userAvatar: '/training-image-01.jpg',
        content: 'Thanks for the quick response to my previous issue. Everything is working great now!',
        seen: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ];
  }

  getUnseenCount(): number {
    return this.messages.filter(message => !message.seen).length;
  }

  hasUnseenMessages(): boolean {
    return this.getUnseenCount() > 0;
  }

  markAsSeen(message: UserMessage): void {
    if (message.seen) return;
    
    // Static implementation
    message.seen = true;
    console.log('Message marked as seen:', message.id);
  }
  
  markAllAsSeen(): void {
    const unseenMessages = this.messages.filter(message => !message.seen);
    if (unseenMessages.length === 0) return;
    
    // Static implementation
    this.messages.forEach(message => message.seen = true);
    console.log('All messages marked as seen');
  }

  deleteMessage(messageId: string): void {
    this.messageToDeleteId = messageId;
    this.deleteAllMode = false;
    this.showDeleteModal = true;
  }

  confirmDeleteAll(): void {
    this.deleteAllMode = true;
    this.messageToDeleteId = null;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteAllMode = false;
    this.messageToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.deleteAllMode) {
      this.performDeleteAll();
    } else if (this.messageToDeleteId) {
      this.performDeleteMessage(this.messageToDeleteId);
    }
    this.showDeleteModal = false;
  }

  private performDeleteMessage(messageId: string): void {
    // Static implementation
    this.messages = this.messages.filter(message => message.id !== messageId);
    console.log('Message deleted:', messageId);
  }

  private performDeleteAll(): void {
    // Static implementation
    this.messages = [];
    console.log('All messages deleted');
  }

}
