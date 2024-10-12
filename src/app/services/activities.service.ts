import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { StravaAthlete } from '../models/strava.model';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getProfileFromStrava(): Observable<StravaAthlete> {

    // if it's in local storage, return it
    const profile = localStorage.getItem('strava_profile');
    
    if (profile) {
      return of(JSON.parse(profile));
    }

    const accessToken = this.authService.getAccessToken();
    return this.http.get<StravaAthlete>('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(
      tap((profile: StravaAthlete) => {
        // save the profile to local storage
        localStorage.setItem('strava_profile', JSON.stringify(profile));
      })
    );
  }
}
