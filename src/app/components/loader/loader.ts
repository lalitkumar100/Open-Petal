import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() mode: 'inline' | 'page' | 'global' = 'inline'; 
  @Input() message: string = '';

  // Tracks whether the custom GIF has finished loading from assets/public
  isGifLoaded: boolean = false;

  onGifLoad() {
    this.isGifLoaded = true;
  }

  onGifError() {
    this.isGifLoaded = false; // Keeps the CSS spinner fallback visible if GIF path fails
  }
}
