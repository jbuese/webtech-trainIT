import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../base-auth.service';
import { ProviderAst } from '@angular/compiler';
import { SessionAuthService } from '../session-auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'wt2-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.sass'],
  providers: []
})
export class LoginUserComponent {

  constructor(private http: HttpClient, private authService: SessionAuthService, private router: Router) {
  }

  @Output()
  public loggedIn = new EventEmitter<void>();

  public username: string = "";
  public password: string = "";
  public errorMessage: string;

  login(e: Event) {
    e.preventDefault();
    this.errorMessage = null;
    if (this.username != "" && this.password != "") {
      this.authService.login(this.username, this.password).subscribe(
        () => {
          this.loggedIn.emit();
          this.router.navigate(['']);
        },
        () => this.errorMessage = "Failed to login"
      );
    }
  }

}
