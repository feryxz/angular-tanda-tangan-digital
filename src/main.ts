import 'zone.js/dist/zone';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <canvas #signatureCanvas></canvas><br>
  <button (click)="saveSignature()">Simpan Tanda Tangan</button>
  <button (click)="resetSignature()">Reset Tanda Tangan</button>
  `,
})
export class App {
  @ViewChild('signatureCanvas', { static: true })
  signatureCanvas?: any; //ElementRef<HTMLCanvasElement>;

  private context: any; //CanvasRenderingContext2D;
  private isSigning = false;
  private lastPosition: any;

  name = 'Angular';

  constructor() {
    this.lastPosition = { x: 0, y: 0 };
  }

  ngAfterViewInit() {
    const canvas = this.signatureCanvas.nativeElement;
    this.context = canvas.getContext('2d');
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#000000';

    canvas.addEventListener('mousedown', this.startSigning.bind(this));
    canvas.addEventListener('mousemove', this.sign.bind(this));
    canvas.addEventListener('mouseup', this.stopSigning.bind(this));
    canvas.addEventListener('mouseleave', this.stopSigning.bind(this));
  }

  startSigning(event: MouseEvent) {
    this.isSigning = true;
    const { offsetX, offsetY } = event;
    this.lastPosition = { x: offsetX, y: offsetY };
  }

  sign(event: MouseEvent) {
    if (!this.isSigning) return;
    const { offsetX, offsetY } = event;
    this.context.beginPath();
    this.context.moveTo(this.lastPosition.x, this.lastPosition.y);
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
    this.lastPosition = { x: offsetX, y: offsetY };
  }

  stopSigning() {
    this.isSigning = false;
  }

  resetSignature() {
    const canvas = this.signatureCanvas.nativeElement;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  saveSignature() {
    const canvas = this.signatureCanvas.nativeElement;
    const signatureDataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = signatureDataUrl;
    link.download = 'signature.png';
    link.click();
  }
}

bootstrapApplication(App);
