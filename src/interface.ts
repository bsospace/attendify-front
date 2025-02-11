export interface activity {
    id: string;
    name: string;
    start_at: Date;
    end_at: Date;
    start_check_in: Date;
    end_check_in: Date;
    start_check_out: Date;
    end_check_out: Date;
    token_check_in: string;
    token_check_out: string;
    check_radius: number;
    limit?: number;
    is_register: boolean;
    event_id: string;
    hour: number;
    default_hour_type_id?: string;
    default_join_type_id?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface event {
    id: string;
    name: string;
    event_type_id: string;
    event_type: event_type;
    start_date: Date;
    end_date: Date;
    announce: boolean;
    published_at?: Date;
    description?: string;
    banner?: string;
    year: number;
    file?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface event_type {
    id: string;
    name: string;
    announce: boolean;
    events?: event[];
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface user {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface location {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface sub_location {
    id: string;
    name: string;
    description?: string;
    location_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface group {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface role {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface permission {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface hour_type {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface join_type {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    data_logs?: DataLog[];
}

export interface DataLog {
    action: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    meta: string[];
}
