import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  protected metrics = signal<Metrics>({
    inDraft: null,
    underReview: null,
    returned: null,
    rejected: null,
    completed: null,
  });

  ngOnInit(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    setTimeout(
      () => {
        this.metrics.set({
          inDraft: 2,
          underReview: 3,
          returned: 4,
          rejected: 5,
          completed: 1,
        });
      },
      2500
    );
  }

  protected createRequest(): void {
    // TODO: Apply actual code
    window.alert('Create new request!');
  }
}

// TODO: Transfer in a dedicated file
interface Metrics {
  inDraft: number | null,
  underReview: number | null,
  returned: number | null,
  rejected: number | null,
  completed: number | null,
}
