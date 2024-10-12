export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  profile: string;
  profile_medium: string;
  ftp: number;
  bikes: StravaBike[];
}

export interface StravaBike {
  id: string;
  name: string;
  primary: boolean;
  distance: number;
}