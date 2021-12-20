import { Component, EventEmitter, Output } from '@angular/core';
import { SessionAuthService } from '../session-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wt2-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['../login/login-user.component.sass']
})
export class RegisterUserComponent {

  @Output()
  public created = new EventEmitter();

  @Output()
  public loggedIn = new EventEmitter();

  public username:string = "";
  public password:string = "";

  public errorMessage:string = "";

  constructor(private authService: SessionAuthService, private router: Router) { 
  }

  public registerUser(e: Event): void{
    e.preventDefault();
    this.errorMessage = "";

    this.password = btoa(this.password);

    if (this.validation()) {
      this.authService.createUser(
        this.username, this.password)
        .subscribe(() => {
          this.created.emit();
          this.router.navigate(['']);
          this.setToDefault();
        },
        () => {
          this.errorMessage = 'Fehler beim Erstellen des Nutzeraccounts. Womöglich existiert bereits ein Nutzer mit diesem Nutzernamen.'
          this.setToDefault();
        }
      );
    }
  }

  public validation(): Boolean {
    let success = true;

    if(this.username.trim() == "")
    {
      success = false;
      this.errorMessage = "Es wurde kein gültiger Nutzername angegeben.\n";
    }
    if(this.password.trim() ==  "")
    {
      success = false;
      this.errorMessage = this.errorMessage + "Es wurde kein gültiges Passwort angegeben.\n";
    }

    if(!success)
      this.errorMessage = "Folgende Eingaben sind fehlerhaft:\n" + this.errorMessage;
  
    return success;
}

  public setToDefault():void{
    this.username= "";
    this.password = "";
  }

  debugTest(value : string): void{
    console.log(value);
  }

}
