import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-comment-editor',
  imports: [],
  templateUrl: './comment-editor.html',
})
export class CommentEditor {
  protected commentText = signal('');
  protected commentRefs = signal<{ label: string; url: string }[]>([]);
  protected newRefLabel = signal('');
  protected newRefUrl = signal('');
  protected editingRefIndex = signal<number | null>(null);

  protected addCommentRef(): void {
    const label = this.newRefLabel().trim();
    const url = this.newRefUrl().trim();
    if (!label || !url) return;
    const idx = this.editingRefIndex();
    if (idx !== null) {
      this.commentRefs.update(refs => refs.map((r, i) => i === idx ? { label, url } : r));
      this.editingRefIndex.set(null);
    } else {
      this.commentRefs.update(refs => [...refs, { label, url }]);
    }
    this.newRefLabel.set('');
    this.newRefUrl.set('');
  }

  protected editCommentRef(index: number): void {
    const ref = this.commentRefs()[index];
    this.newRefLabel.set(ref.label);
    this.newRefUrl.set(ref.url);
    this.editingRefIndex.set(index);
  }

  protected cancelEditRef(): void {
    this.editingRefIndex.set(null);
    this.newRefLabel.set('');
    this.newRefUrl.set('');
  }

  protected removeCommentRef(index: number): void {
    if (this.editingRefIndex() === index) {
      this.editingRefIndex.set(null);
      this.newRefLabel.set('');
      this.newRefUrl.set('');
    }
    this.commentRefs.update(refs => refs.filter((_, i) => i !== index));
  }
}
