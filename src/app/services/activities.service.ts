import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivityStats, StravaAthlete, StravaBike, SummaryActivity } from '../models/strava.model';
import { Observable, of, Subject, switchMap, tap } from 'rxjs';

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

        profile.bikes?.forEach(bike => {
          bike.distance_miles = bike.distance / 1609.34;
        });

        // save the profile to local storage
        localStorage.setItem('strava_profile', JSON.stringify(profile));
      })
    );
  }

  getStats(profile: StravaAthlete): Observable<ActivityStats> {

    const stats = localStorage.getItem('strava_stats');

    if (stats) {
      return of(JSON.parse(stats));
    }

    const accessToken = this.authService.getAccessToken();
    return this.http.get<ActivityStats>(`https://www.strava.com/api/v3/athletes/${profile.id}/stats`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(
      tap((stats: ActivityStats) => {
        localStorage.setItem('strava_stats', JSON.stringify(stats));
      })
    );
  }

  getAllActivities(profile: StravaAthlete, disableCache: boolean = false): Observable<SummaryActivity[]> {

    if (!disableCache) {
      const activities = localStorage.getItem('strava_activities');

      if (activities) {
        return of(JSON.parse(activities));
      }
    }

    const bikeMap = profile.bikes.reduce((acc: { [key: string]: StravaBike }, bike) => {
      acc[bike.id] = bike;
      return acc;
    }, {});
    
    return this.getActivities().pipe(
      tap(activities => {

        activities.forEach(activity => {
          activity.bike = bikeMap[activity.gear_id];
        });

        localStorage.setItem('strava_activities', JSON.stringify(activities));
      })
    );

  }

  getActivities(page: number = 1, allActivities: SummaryActivity[] = []): Observable<SummaryActivity[]> {
    const accessToken = this.authService.getAccessToken();
    const page_size = 200;

    const result = new Subject<SummaryActivity[]>();

    this.http.get<SummaryActivity[]>(`https://www.strava.com/api/v3/athlete/activities`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        page,
        per_page: page_size
      },
    }).pipe(
      switchMap(activities => {
        allActivities.push(...activities);

        if (activities.length === page_size) {
          return this.getActivities(page + 1, allActivities);
        }

        return of(null);
      })
    ).subscribe(() => {
      result.next(allActivities);
      result.complete();
    });

    return result.asObservable();
  }


}
