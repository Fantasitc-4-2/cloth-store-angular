import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getUserInfo().pipe(
      map((user) => {
        if (user) {
          console.log('Authenticated user:', user);
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
          return of(false); 
        }
        throw err;
      })
    );
  }
}
