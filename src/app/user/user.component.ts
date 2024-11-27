import { AfterViewInit, Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements AfterViewInit{

  @Input() userId!: any

  displayFrame: HTMLElement | null = null;
  videoFrames: HTMLCollectionOf<Element> | null = null;
  userIdDisplayed: string | null = null;

  ngAfterViewInit(): void {
    this.displayFrame = document.getElementById('streamBox');
    this.videoFrames = document.getElementsByClassName("videoContainer");

    if (this.displayFrame) {
      this.displayFrame.addEventListener('click', (e) => this.minimize(e));
    }
  }

  expand(e: any){

    let child = this.displayFrame?.children[0]
    if(child){
      document.getElementById('streamsContainer')?.appendChild(child)
    }

    if(this.displayFrame){
      this.displayFrame.style.display = 'block'
      this.displayFrame.appendChild(e.currentTarget)
      this.userIdDisplayed = e.currentTarget.id
    } 

    if(this.videoFrames){
      Array.from(this.videoFrames).forEach(element => {
        if(element.id !== this.userIdDisplayed){
          (element as HTMLElement).style.height = '200px';
          (element as HTMLElement).style.width = '200px';
        }
      })
    }
  }

  minimize(e: any){
    let child = this.displayFrame?.children[0]
    if(child){
      document.getElementById('streamsContainer')?.appendChild(child)
    }
    if(this.displayFrame){
      this.displayFrame.style.display = 'none'
      this.userIdDisplayed = null
    }
    if(this.videoFrames){
      Array.from(this.videoFrames).forEach(element => {
        if(element.id !== this.userIdDisplayed){
          (element as HTMLElement).style.height = '300px';
          (element as HTMLElement).style.width = '300px';
        }
      })
    }
  }


}
