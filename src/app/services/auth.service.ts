import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  authenticateWithStrava() {
    const client_id = environment.strava.client_id;
    const redirect_uri = 'http://localhost:4200/auth';
    const url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&approval_prompt=force&scope=read,activity:read_all`;
    window.location.href = url;
  }

  getStravaAccessToken(code: string) {
    const client_id = environment.strava.client_id;
    const client_secret = environment.strava.client_secret;

    // post request to get access token from Strava
    this.http.post('https://www.strava.com/oauth/token', {
      client_id,
      client_secret,
      code,
      grant_type: 'authorization_code'
    }).subscribe((res: any) => {
      console.log(res);

      let accessToken = res['access_token'];
      let refreshToken = res['refresh_token'];
      let expiration = res['expires_at'];

      // save access token to local storage
      localStorage.setItem('strava_access_token', res['access_token']);
      localStorage.setItem('strava_refresh_token', res['refresh_token']);
      localStorage.setItem('strava_expiration', res['expires_at']);
    });
  }

  isStravaAuthenticated() {
    const accessToken = localStorage.getItem('strava_access_token');
    const tokenExpiresStr = localStorage.getItem('strava_expiration');

    if (!accessToken || !tokenExpiresStr) {
      return false;
    }

    const tokenExpires = +tokenExpiresStr * 1000;
    return tokenExpires > Date.now();
  }

  getAccessToken() {
    return localStorage.getItem('strava_access_token');
  }

  logout() {
    // clear access token from local storage
    localStorage.removeItem('strava_access_token');
    localStorage.removeItem('strava_refresh_token');
    localStorage.removeItem('strava_expiration');

    // clear profile from local storage
    localStorage.removeItem('strava_profile');
  }
}
