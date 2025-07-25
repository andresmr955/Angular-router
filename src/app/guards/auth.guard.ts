import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ){}

  // Este es cuando solo queremos verificar el token
  //canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const token = this.tokenService.getToken()
  //   return token ? true: false;
  // }

    // Este es para enrutar

   canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // const token = this.tokenService.getToken()
    // if(!token){
    //   this.router.navigate(['/home']);
    //   return false
    // }
    // return true;

    return this.authService.myuser$
    .pipe(
      map( user => {
        if(!user){
          this.router.navigate(['/home'])
          return false;
        }
        return true;
      })
    )
  }
  
}
