import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/core/Models/Messages';

@Component({
  selector: "app-messages",
  imports: [FormsModule],
  templateUrl: "./messages.component.html",
  styleUrl: "./messages.component.css",
})
export class MessagesComponent {
  activeTab = signal<'all' | 'archived'>('all');
  searchText = signal('');
  selectedFilter = signal('all');

  currentPage = signal(1);
  pageSize = signal(5);
  messages = signal<Message[]>([
    {
      id: 1,
      date: '2026-05-01',
      time: '10:30 AM',
      title: 'Refill due in 3 days for Metformin 500mg',
      type: 'Medication Reminder',
      description: 'This is a reminder to refill your prescription for Metformin 500mg.',
      doctor: 'Dr Arun',
      icon: 'assets/images/medicine-icon.png',
      archived: false
    },
    {
      id: 2,
      date: '2026-05-05',
      time: '04:15 PM',
      title: 'Your order #12345 is out for delivery',
      type: 'Order Update',
      description: 'Your medicine order #12345 is on the way and will be delivered soon.',
      doctor: 'Dr Doss',
      icon: 'assets/images/transit-icon.png',
      archived: false
    }
  ]);

  filteredMessages = computed(() => {

    if (this.activeTab() === 'all') {
      return this.messages().filter(m => !m.archived);
    }

    return this.messages().filter(m => m.archived);

  });

  allCount = computed(() =>
    this.messages().filter(m => !m.archived).length
  );

  archiveCount = computed(() =>
    this.messages().filter(m => m.archived).length
  );

  switchTab(tab: 'all' | 'archived') {
    this.activeTab.set(tab);
  }

  archiveMessage(id: number) {

    this.messages.update(messages =>
      messages.map(message =>
        message.id === id
          ? { ...message, archived: true }
          : message
      )
    );

  }

  unarchiveMessage(id: number) {

    this.messages.update(messages =>
      messages.map(message =>
        message.id === id
          ? { ...message, archived: false }
          : message
      )
    );

  }
  paginatedMessages = computed(() => {

    const start =
      (this.currentPage() - 1) * this.pageSize();

    return this.filteredMessages().slice(
      start,
      start + this.pageSize()
    );

  });

  totalPages = computed(() =>
    Math.ceil(
      this.filteredMessages().length /
      this.pageSize()
    )
  );



  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
}