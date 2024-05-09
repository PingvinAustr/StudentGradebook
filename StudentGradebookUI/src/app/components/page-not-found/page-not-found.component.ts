import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import { TranslationService } from 'src/app/services/translation/translation-service.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit {
  constructor(public translationService: TranslationService) { }


  ngOnInit(): void {
    this.animateElements();
  }

  animateElements() {
    let t1 = gsap.timeline();
    let t2 = gsap.timeline();
    let t3 = gsap.timeline();

    t1.to(".cog1", {
      transformOrigin: "50% 50%",
      rotation: "+=360",
      repeat: -1,
      ease: "none",
      duration: 8
    });

    t2.to(".cog2", {
      transformOrigin: "50% 50%",
      rotation: "-=360",
      repeat: -1,
      ease: "none",
      duration: 8
    });

    t3.fromTo(".wrong-para", {
      opacity: 0
    }, {
      opacity: 1,
      duration: 1,
      stagger: {
        repeat: -1,
        yoyo: true
      }
    });
  }
}
