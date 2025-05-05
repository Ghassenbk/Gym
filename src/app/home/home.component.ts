import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

ngOnInit(): void {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0); // or any other window logic
  }
}

}
