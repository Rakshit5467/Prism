import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  constructor(private router: Router){}

  userName!: string

  roomId!: string

  enterRoom(){
    this.router.navigate(['/room'], { queryParams: {roomid: this.roomId}})
  }

}
