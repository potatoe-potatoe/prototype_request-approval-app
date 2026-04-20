import { Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApprovalReference } from '../../types/approval-type';

export type CommentFormGroup = FormGroup<{
  text: FormControl<string | null>;
  references: FormControl<ApprovalReference[]>;
}>;

@Component({
  selector: 'app-comment-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './comment-editor.html',
})
export class CommentEditor {
  @Input({ required: true }) commentGroup!: CommentFormGroup;

  protected newRefLabel = signal('');
  protected newRefUrl = signal('');
  protected editingRefIndex = signal<number | null>(null);

  protected hasReference(): boolean {
    const label = this.newRefLabel().trim();
    const url = this.newRefUrl().trim();
    return !!label && !!url;
  }

  protected addReference(): void {
    if (!this.hasReference()) return;
    const label = this.newRefLabel().trim();
    const url = this.newRefUrl().trim();
    const index = this.editingRefIndex();
    const currentRefs = this.commentGroup.controls.references.value;

    if (index !== null) this.updateReference(index, label, url);
    else {
      this.commentGroup.controls.references.setValue([...currentRefs, { label, url }]);
    }

    this.newRefLabel.set('');
    this.newRefUrl.set('');
  }

  private updateReference(index: number, label: string, url: string): void {
    const currentRefs = this.commentGroup.controls.references.value;
    this.commentGroup.controls.references.setValue(
      currentRefs.map((r, i) => i === index ? { label, url } : r)
    );
    this.editingRefIndex.set(null);
  }

  protected editReference(index: number): void {
    const ref = this.commentGroup.controls.references.value[index];
    this.newRefLabel.set(ref.label);
    this.newRefUrl.set(ref.url);
    this.editingRefIndex.set(index);
  }

  protected cancelEditReference(): void {
    this.editingRefIndex.set(null);
    this.newRefLabel.set('');
    this.newRefUrl.set('');
  }

  protected removeReference(index: number): void {
    const currentRefs = this.commentGroup.controls.references.value;
    this.commentGroup.controls.references.setValue(
      currentRefs.filter((_, i) => i !== index)
    );

    if (this.editingRefIndex() === index) {
      this.editingRefIndex.set(null);
      this.newRefLabel.set('');
      this.newRefUrl.set('');
    }
  }
}
