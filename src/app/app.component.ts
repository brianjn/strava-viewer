import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ActivityFilter, ActivityStats, StravaAthlete, SummaryActivity } from './models/strava.model';
import { ActivitiesService } from './services/activities.service';
import { debounceTime, forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DecimalPipe,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private activitiesService: ActivitiesService,
  ) {}

  isLoggedIn: boolean = false;
  profile?: StravaAthlete;
  stats?: ActivityStats;
  activities?: SummaryActivity[];
  filteredActivities?: SummaryActivity[];

  activityFilter = new ActivityFilter();
  textChanged = new Subject<string>();
  destroy$ = new Subject<void>();

  ngOnInit() {
    this.isLoggedIn = this.authService.isStravaAuthenticated();

    if (this.isLoggedIn) {
      this.activitiesService.getProfileFromStrava().pipe(
        tap(profile => this.profile = profile),
        switchMap(profile => this.activitiesService.getStats(profile))
      ).subscribe(stats => {
        this.stats = stats;

        this.activitiesService.getAllActivities(this.profile!).subscribe(activities => {
          this.activities = activities;
          this.filterActivities();
        });
      });
    }

    this.textChanged.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
    ).subscribe(() => {
      this.filterActivities();
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onFilterTextChanged(filterText: string) {
    this.activityFilter.description = filterText;
    this.textChanged.next(filterText);
  }

  filterActivities() {
    this.filteredActivities = this.activities?.filter(activity => {
      return (
        !this.activityFilter.gear_id.length || this.activityFilter.gear_id?.includes(activity.gear_id)) 
        && (!this.activityFilter.distance_min || (activity.distance / 1609.34) >= this.activityFilter.distance_min)
        && (!this.activityFilter.distance_max || (activity.distance / 1609.34) <= this.activityFilter.distance_max)
        && (!this.activityFilter.description || activity.name.toLowerCase().includes(this.activityFilter.description.toLowerCase()));        
    });
  }

  refreshActivities() {
    this.activitiesService.getAllActivities(this.profile!, true).subscribe(activities => {
      this.activities = activities;
      this.filterActivities();
    });
  }

  login() {
    this.authService.authenticateWithStrava();
  }

  logout() {
    this.authService.logout();
  }
}
