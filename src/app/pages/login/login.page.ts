import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mensajeError = '';
  correo = "";
  clave = "";
  mostrarSpinner = false;
  usuarios : any[] = [];

  constructor(private router : Router, private auth : AuthService) { }

  iniciarSesion()
  {
    this.mostrarSpinner = true;
    this.auth.login(this.correo, this.clave)
    ?.then(()=>{
      setTimeout(() => {
        this.mostrarSpinner = false;
        this.reiniciar()
        this.router.navigateByUrl("/home");
      }, 1500);
    })
    .catch(error =>
      {
        setTimeout(()=>{
          this.mostrarSpinner = false;
          switch(error.code)
          {
            case 'auth/invalid-email':
              this.mensajeError =  "Email inválido.";
            break;
            case 'auth/missing-password':
              this.mensajeError = "Contraseña inválida.";
            break;
            case 'auth/invalid-login-credentials':
              this.mensajeError = 'Email y/o contraseña incorrectos.';
            break;
          }
          this.auth.mostrarToastError(this.mensajeError);
          console.log(error);
        }, 2000);
      });
  }

  reiniciar()
  {
    this.correo = "";
    this.clave = "";
  } 

  ngOnInit() {}

  cargarDatos(usuario : string)
  {
    switch(usuario)
    {
      case "admin":
        this.correo = "admin@admin.com";
        this.clave = "111111";
        break;
      case "usuario":
        this.correo = "usuario@usuario.com";
        this.clave = "333333";
        break;
      case "tester":
        this.correo = "tester@tester.com";
        this.clave = "555555";
        break;
      case "anonimo":
        this.correo = "anonimo@anonimo.com";
        this.clave = "444444";
        break;
      case "invitado":
        this.correo = "invitado@invitado.com";
        this.clave = "222222";
        break;
    }
  }

}
