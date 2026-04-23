export type RequestOptions = {
    method: string;
    url: string;
    body?: any;
    params?: Record<string, any>;
    headers?: Record<string, string | string[]>;
    silent?: boolean;
};

export type Response<T> = {
    data: T;
    message: string;
    code: string;
    statusCode: number;
};

export const httpMethod = {
    get: "GET",
    post: "POST",
    put: "PUT",
    patch: "PATCH",
    delete: "DELETE",
    head: "HEAD",
    options: "OPTIONS",
} as const;

