export class ActivityFilter {
  gear_id: string[] = [];
  description?: string;
  distance_max?: number;
  distance_min?: number;
}

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

  distance_miles: number;
}

export interface ActivityStats {
  all_ride_totals: ActivityTotals;
  all_run_totals: ActivityTotals;
  all_swim_totals: ActivityTotals;
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: ActivityTotals;
  recent_run_totals: ActivityTotals;
  recent_swim_totals: ActivityTotals;
  ytd_ride_totals: ActivityTotals;
  ytd_run_totals: ActivityTotals;
  ytd_swim_totals: ActivityTotals;
}

export interface ActivityTotals {
  count: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  elevation_gain: number;
  achievement_count: number;
}

export interface SummaryActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng: number[];
  end_latlng: number[];
  location_city: string;
  location_state: string;
  location_country: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: PolylineMap;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string;
  from_accepted_tag: boolean;
  upload_id: number;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  average_watts: number;
  weighted_average_watts: number;
  kilojoules: number;
  device_watts: boolean;
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  elev_high: number;
  elev_low: number;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score: number;
  description: string;
  calories: number;
  segment_efforts: any[];
  splits_metric: any[];
  splits_standard: any[];
  best_efforts: any[];
  device_name: string;
  embed_token: string;
  segment_leaderboard_opt_out: boolean;
  leaderboard_opt_out: boolean;
  utc_offset: number;

  bike?: StravaBike;
}

export interface PolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}