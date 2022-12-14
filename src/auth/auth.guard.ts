import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/components/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router:Router, private userService:UserService){}

// canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean{
//       if (localStorage.getItem('userToken') != null){
//         return true;
//       }
//       else{
//         this.router.navigate(['/SignIn']);
//         alert("Not logged in")
//         return false;
//       }
//   }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      if (localStorage.getItem('userToken') != null)
      {
        let roles = next.data["roles"] as Array<string>;
        if (roles) {
          var match = this.userService.roleMatch(roles);
          if (match) return true;
          else {
            this.router.navigate(['/forbidden']);
            return false;
          }
        }
        else
          return true;
      }
      this.router.navigate(['/SignIn']);
      return false;
  }
  
}
