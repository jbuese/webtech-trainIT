import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../base-auth.service';
import { ProviderAst } from '@angular/compiler';
import { SessionAuthService } from '../session-auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'wt2-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.sass'],
  providers: []
})
export class StageComponent {

  constructor(private http: HttpClient, private authService: SessionAuthService, private router: Router) {
  }

  logout(): void {
    console.log("loggin out");
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

}
