export interface CollegeData {
  id: string;
  name: string;
  location: string;
  rating: number;
  courses: string;
  nirf: string;
  placement: string;
  accreditation: {
    type: string;
    grade: string;
  }[];
  logo?: string;
} 