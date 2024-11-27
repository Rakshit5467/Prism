import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { UserComponent } from "../user/user.component";

declare const AgoraRTC: any;

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [RouterLink, CommonModule, UserComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit{

  APP_ID = "dd7816d39080420cafce14bcb0af2af9"
  uid!: string;
  token = null

  localTracks: any;
  remoteUsers: { [key: string]: any } = {};
  localScreenTracks!: any;
  sharingScreen = false

  private client: any
  roomId!: string | null


  constructor(private actroute: ActivatedRoute, private router: Router){}

  ngOnInit(): void {

    this.actroute.queryParams.subscribe(params => {
      this.roomId = params['roomid']
    })

    this.uid = String(uuidv4())
    
    this.joinRoom()

  }

  async joinRoom(){
    this.client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})
    await this.client.join(this.APP_ID, this.roomId, this.token, this.uid)

    this.client.on('user-published', (user: any, mediaType: any) => {
      this.handleUserPublished(user, mediaType)
    })
    this.client.on('user-left', (user: any) => {
      this.handleUserLeft(user)
    })


    this.joinStream()

  }

  async joinStream(){
    this.localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    this.localTracks[1].play(`user-${this.uid}`)
    
    await this.client.publish([this.localTracks[1]])
  }

  async handleUserPublished(user: any, mediaType: any) {
    this.remoteUsers[user.uid] = user;

    await this.client.subscribe(user.uid, mediaType);
    
    setTimeout(() => {
      if (mediaType === 'video' && user.videoTrack) {
        user.videoTrack.play(`user-${user.uid}`);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    }, 500);
  }

  numberOfParticipants(){
    return Object.keys(this.remoteUsers).length + 1
  }

  async handleUserLeft(user: any){
    delete this.remoteUsers[user.uid]
    document.getElementById(`userContainer-${user.uid}`)?.remove()
  }

  async toggleControl(e: any, i: number) {
    let button = e.currentTarget
    
    if(this.localTracks[i].muted){
      await this.localTracks[i].setMuted(false)
      button.classList.remove('inactive')
    } else{
      await this.localTracks[i].setMuted(true)
      button.classList.add('inactive')
    }
  }

  async toggleScreen(e: any){
    let screenButton = e.currentTarget
    let cameraButton = document.getElementById('camera')

    if(!this.sharingScreen){
      this.sharingScreen = true
      
      screenButton.classList.remove('inactive')

      this.localScreenTracks = await AgoraRTC.createScreenVideoTrack()

      const displayFrame = document.getElementById('streamBox')
      if(displayFrame){
        displayFrame.style.display = 'block'
      } 
      this.localScreenTracks.play(`user-${this.uid}-screen`)

      // await this.client.unpublish([this.localTracks[1]])

      await this.client.publish([this.localScreenTracks])

    } else{
      screenButton.classList.add('inactive')
      this.sharingScreen = false
    }
  }
  
  async leave(){
    this.localTracks.forEach((track: any) => {
      track.stop()
      track.close()
    });
    await this.client.unpublish(this.localTracks)

    if(this.localScreenTracks){
      await this.localScreenTracks.unpublish([this.localScreenTracks])
    }

    
    this.router.navigate(['/lobby'])
  }

}