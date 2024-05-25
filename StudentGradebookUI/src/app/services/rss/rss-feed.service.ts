import { Injectable } from '@angular/core';
import * as rssToJson from 'rss-to-json';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RssFeedService {
  constructor() {}

  getFeed(feedUrl: string): Observable<any> {
    return from(rssToJson.Parse(feedUrl));
  }
  
}
