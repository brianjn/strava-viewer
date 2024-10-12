import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { StravaAthlete } from './models/strava.model';
import { ActivitiesService } from './services/activities.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
  title = 'svclient';

  ngOnInit() {
    this.isLoggedIn = this.authService.isStravaAuthenticated();

    if (this.isLoggedIn) {
      this.activitiesService.getProfileFromStrava().subscribe((profile: StravaAthlete) => {
        this.profile = profile;
      });
    }
  }
  
  login() {
    this.authService.authenticateWithStrava();
  }

  logout() {
    this.authService.logout();
  }
}
