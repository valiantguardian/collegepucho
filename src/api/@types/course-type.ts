export interface CourseDTO {
    course_id: number;
    created_at?: string;
    updated_at?: string;
    last_edited_by?: string | null;
    full_name?: string;
    course_name: string;
    name: string;
    is_online: boolean | null;
    short_name: string;
    description: string;
    slug: string;
    duration?: number;
    duration_in_months?: number | null | undefined;
    duration_value?: number;
    duration_type?: string;
    last_update?: string | null;
    is_active: boolean;
    is_approved?: boolean | null;
    course_code?: string | null;
    online_only?: boolean | null;
    kap_score?: string | null;
    kapp_score?: string | null;
    key_article?: string | null;
    course_format?: string | null;
    course_type?: string;
    course_mode?: string;
    course_level?: string;
    degree_type?: string | null;
    is_integrated_course: boolean;
    eligibility?: string | null;
    level?: string | null;
    course_group_id: number;
    specialization_id: number;
    stream_id?: number;
    stream_name?: string;
    specialization?: {
        specialization_id: number;
        name: string;
        full_name: string;
        is_active: boolean;
        kapp_score: string;
    };
    stream?: {
        stream_id: number;
        stream_name: string;
        logo_url: string | null;
        slug: string;
        is_active: boolean;
        kapp_score: string | null;
        is_online: boolean;
    };
    courseGroup?: {
        course_group_id: number;
        name: string;
        full_name: string;
        type: string;
        level: string;
        duration_in_months: number;
        stream_id: number;
        kapp_score: string;
    };
    collegeCourses?: any[];
}
  