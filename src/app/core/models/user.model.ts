export interface UserLogin{
    identifier:string,
    password:string
}

export interface UserRegister{
    email:string,
    password:string,
    username:string,
    first_name:string,
    last_name:string,
    profilePick?: string,
}

export interface User{
    id:number,
    docId?:string;
    admin:boolean,
    first_name:string,
    username:string,
    email:string,
    last_name:string,
    profilePick:string
}