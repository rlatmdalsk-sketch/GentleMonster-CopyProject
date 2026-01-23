export interface RegisterFormType {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
}

export interface User {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
}

export interface LoginFormType {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}