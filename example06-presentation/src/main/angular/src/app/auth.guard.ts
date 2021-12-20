import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { SessionAuthService } from './session-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: SessionAuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log("checking for login");
    console.log(this.authService);
    if (this.authService.isLoggedIn) {
      console.log("logged in"); 
      return true; 
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}