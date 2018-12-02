import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}
  
  //code from https://mediuwm.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);
  
    if (
      !this.auth.isAuthenticated() || 
      tokenPayload.role !== expectedRole || tokenPayload.role!='store-manager'
    ) {
      if(tokenPayload.role=='store-manager'){
        return true;
      }
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
