import { Component } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}
  
  ngOnInit() {
    // get the authorization code from the URL
    const code = this.activatedRoute.snapshot.queryParams['code'];

    // if the code is present, get the access token
    if (code) {
      this.authService.getStravaAccessToken(code);
      this.isLoggedIn = true;
      this.router.navigate(['/']);
    }

  }
}
