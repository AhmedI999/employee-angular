import { Component } from '@angular/core';
import {NavComponent} from '../shared/nav/nav.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [
    NavComponent,
    RouterOutlet
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
