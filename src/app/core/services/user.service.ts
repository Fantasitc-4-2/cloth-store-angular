import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
@Injectable({
    providedIn: "root"
})
export class UserService {
    currUser: User | null = null;
    constructor(private http: HttpClient) {}
    public signUser(userData: RegisterData) {
        return this.http.post(environment.apiUrl + "/auth/register", userData, {observe: "response"});
    }

    public authenticateUser(credintials: LoginData) {
        return this.http.post(environment.apiUrl + "/auth/login", credintials, {withCredentials: true, observe: "response"})
    }

    public isAuthenticated() {
        return this.http.get(environment.apiUrl + "/auth/me", {withCredentials: true}).subscribe(
            (user) => {
                return user;
            },
            err => {
                return null;
            }
        )
    }

    public getUserInfo() {
        return this.http.get(environment.apiUrl + "/auth/me", {withCredentials: true});
    }

    public setUser(user: User) {
        this.currUser = user;
    }

    public getUser() {
        return this.currUser;
    }

    public logout() {
        return this.http.post(environment.apiUrl + "/auth/logout", {}, {withCredentials: true}).subscribe(
            res => {
                this.currUser = null;
            },
            err => {
                console.log(err);
            }
        );
    }

    public authenticateWithGoogle(response: any) {
        const token = response.credential;
        this.http.post(environment.apiUrl + "/auth/google", {token: token}, {withCredentials: true})
            .subscribe(
                (res) => {
                    console.log(res);
                }
                , (err) => {
                    console.log(err.message);
                }
            )

    }
}