import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/Store/app.state';
import { getMyMessages, updateMessages } from 'src/app/Store/Messages/messages.actions';
import { selectMyAllMessagesList } from 'src/app/Store/Messages/messages.selcetors';

interface Message {
  id: number;
  date: string;
  time: string;
  title: string;
  type: string;
  description: string;
  doctor: string;
  icon: string;
  archived: boolean;
  isRead: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  activeTab = signal<'all' | 'archived'>('all');

  searchText = signal('');
  selectedFilter = signal('all');

  currentPage = signal(1);
  pageSize = signal(5);

  messages = signal<Message[]>([]);

  loginUser = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    if (this.loginUser?.refId) {

      this.store.dispatch(
        getMyMessages({
          patientId: this.loginUser.refId
        })
      );

    } else {

      console.error('Patient ID not found in localStorage');

    }

    this.store.select(selectMyAllMessagesList).subscribe((res: any[]) => {

      if (res && Array.isArray(res)) {

        const mappedMessages: Message[] = res.map(item => ({
          id: item.messageId,

          date: item.date,
          time: item.time,

          title: item.title,

          type: item.notifType,

          description: item.message,

          doctor: item.doctorName || 'N/A',

          icon: this.getMessageIcon(item.notifType),

          archived: false,

          isRead: String(item.isRead).toLowerCase() === 'true'
        }));

        this.messages.set(mappedMessages);

        // Reset pagination whenever new data comes
        this.currentPage.set(1);
      }

    });

  }
  markAsRead(message: Message) {

    console.log('Clicked message:', message);

    if (message.isRead) {
      console.log('Already read:', message.id);
      return;
    }

    console.log('Dispatching updateMessages:', {
      messageId: message.id,
      isRead: true
    });

    this.store.dispatch(
      updateMessages({
        messageId: message.id,
        isRead: true
      })
    );

    this.messages.update(messages =>
      messages.map(item =>
        item.id === message.id
          ? {
            ...item,
            isRead: true
          }
          : item
      )
    );
  }


  /**
   * Returns icon according to notification type
   */
  getMessageIcon(notifType: string): string {

    switch (notifType) {

      case 'MedicationReminder':
        return 'assets/images/medicine-icon.png';

      case 'OrderUpdate':
        return 'assets/images/transit-icon.png';

      case 'AppointmentCreated':
        return 'assets/images/appointment-icon.png';

      default:
        return 'assets/images/message-icon.png';
    }

  }

  /**
   * Filter + Search + Notification Type
   */
  filteredMessages = computed(() => {

    let result = this.messages();

    // All / Archived
    if (this.activeTab() === 'all') {

      result = result.filter(message => !message.archived);

    } else {

      result = result.filter(message => message.archived);

    }

    // Search
    const search = this.searchText()
      .trim()
      .toLowerCase();

    if (search) {

      result = result.filter(message =>
        message.title.toLowerCase().includes(search) ||
        message.description.toLowerCase().includes(search) ||
        message.doctor.toLowerCase().includes(search) ||
        message.type.toLowerCase().includes(search)
      );

    }

    // Notification type filter
    const filter = this.selectedFilter();

    if (filter !== 'all') {

      result = result.filter(message =>
        message.type === filter
      );

    }

    return result;

  });

  /**
   * All message count
   */
  allCount = computed(() =>
    this.messages()
      .filter(message => !message.archived)
      .length
  );

  /**
   * Archived message count
   */
  archiveCount = computed(() =>
    this.messages()
      .filter(message => message.archived)
      .length
  );

  /**
   * Pagination
   */
  paginatedMessages = computed(() => {

    const start =
      (this.currentPage() - 1) * this.pageSize();

    return this.filteredMessages().slice(
      start,
      start + this.pageSize()
    );

  });

  totalPages = computed(() => {

    const total = Math.ceil(
      this.filteredMessages().length /
      this.pageSize()
    );

    return total || 1;

  });

  switchTab(tab: 'all' | 'archived') {

    this.activeTab.set(tab);

    this.currentPage.set(1);

  }

  archiveMessage(id: number) {

    this.messages.update(messages =>
      messages.map(message =>
        message.id === id
          ? {
            ...message,
            archived: true
          }
          : message
      )
    );

    this.currentPage.set(1);

  }

  unarchiveMessage(id: number) {

    this.messages.update(messages =>
      messages.map(message =>
        message.id === id
          ? {
            ...message,
            archived: false
          }
          : message
      )
    );

    this.currentPage.set(1);

  }

  previousPage() {

    if (this.currentPage() > 1) {

      this.currentPage.update(
        page => page - 1
      );

    }

  }

  nextPage() {

    if (this.currentPage() < this.totalPages()) {

      this.currentPage.update(
        page => page + 1
      );

    }

  }

}