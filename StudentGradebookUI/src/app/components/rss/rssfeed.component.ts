import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RssFeedService } from 'src/app/services/rss/rss-feed.service';

@Component({
  selector: 'app-rss-feed',
  styleUrls: ['./rssfeed.component.scss'],
  template: `
    <div *ngIf="feed">
      <h2>{{ feed.title }}</h2>
        <div *ngFor="let item of feed.items" style="margin-top: 20px" >
          <a [href]="item.link" target="_blank" class="feed-item-link">{{ item.title }}</a>
          <div class="feed-item-container">
            <img [src]="GetItemImageSrc(item)" style="width: 150px; height: 200px"/>
            <p class="feed-item-description">{{ GetItemDescription(item) }}</p>
          </div>
        </div>
    </div>
  `,
  styles: []
})
export class RssFeedComponent implements OnInit {
  feed: any;

  constructor(private rssFeedService: RssFeedService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('assets/feed.xml', { responseType: 'text' }).subscribe((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const channel = xml.querySelector('channel');
      this.feed = {
        title: channel.querySelector('title').textContent,
        items: Array.from(channel.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          description: item.querySelector('description').textContent
        }))
      };
    });
  }

  GetItemImageSrc(item) {
    const description = item.description;

    // Regular expression to extract the src attribute from the img tag
    const imgSrcMatch = description.match(/<img [^>]*src="([^"]*)"[^>]*>/);
    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;

    console.log('Image SRC:', imgSrc);

    return imgSrc;
  }

  GetItemDescription(item) {
    const description = item.description;

    // Extract the text after the img tag
    const textAfterImgTag = description.replace(/<img[^>]*>/, '');

    console.log('Description:', textAfterImgTag.trim());

    return textAfterImgTag.trim();
  }
}
