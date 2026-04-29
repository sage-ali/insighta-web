export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export interface ProfilesResponse {
  status: "success";
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: Profile[];
}
