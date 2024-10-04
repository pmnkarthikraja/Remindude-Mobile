export interface User {
    userName?: string,
    email: string,
    password?: string
    profilePicture?: string
    googlePicture?: string
}

export interface GoogleUser {
    id: string,
    email: string,
    name: string,
    picture: string
}