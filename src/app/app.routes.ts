import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';

export const routes: Routes = [
    { path: 'lobby', component: LobbyComponent },
    { path: 'room', component: RoomComponent },
    { path: '**', redirectTo: '/lobby', pathMatch: 'full' }
];
