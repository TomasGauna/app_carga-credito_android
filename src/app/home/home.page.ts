import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { FirestoreService } from '../services/firestore.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  obser$: any;
  abierta: boolean = false;
  userAuth: any  = this.auth.get_user();
  usuario: any;
  puntosACargar: number = 0;
  codigoACargar: string = '';
  credito: number = 0;
  mostrarSpinner = false;

  constructor(private router: Router, private toastController: ToastController, private auth: AuthService, private firestore: Firestore) {}

  async ngOnInit()
  {
    this.mostrarSpinner = true;
    this.obser$ = FirestoreService.traerFs('usuariosCarga', this.firestore).subscribe((data)=>{
      data.forEach(u => {
        if(u.email === this.userAuth.email)
        {
          this.usuario = u;
          this.credito = this.calcularCreditoTotal();
          this.mostrarSpinner = false;
        }
      });
    }); 
  }

  ngOnDestroy(): void 
  {
    this.stopScan();
  }

  async checkPermission()
  {
    let ret = false;
    try
    {
      const status = await BarcodeScanner.checkPermission({force: true});
      if(status.granted)
      {
        ret = true;
      }
    }
    catch(error)
    { 
     (error);
    }

    return ret;
  }

  async startScan()
  {
    try
    {
      const permission = await this.checkPermission();
      if(!permission)
      {
        return;
      }

      this.abierta = true;
      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      const result = await BarcodeScanner.startScan();
      
      this.mostrarSpinner = true;
      if(result?.hasContent)
      {
        BarcodeScanner.showBackground();
        document.querySelector('body')?.classList.add('scanner-active');
        this.asignarEscan(result.content);
        this.abierta = false;
      }
    }
    catch(error)
    {
      (error);
      this.stopScan();
    }
  }

  async stopScan()
  {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  asignarEscan(escaneado: string)
  {
    setTimeout(async ()=>{
      let codigo: number = 0;

      switch(escaneado)
      {
        case '8c95def646b6127282ed50454b73240300dccabc':
          codigo = 10;
        break;
  
        case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ':
          codigo = 50;
        break;
  
        case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
          codigo = 100;
        break;
  
        default:
          const toast = await this.toastController.create({
            message: 'Error. Debe escanear un codigo QR correcto.',
            duration: 1500,
            position: 'top',
            color: "danger",
          });
          await toast.present();
        break;
      }
  
      if(codigo != 0)
      {
        this.puntosACargar = codigo;
        this.codigoACargar = escaneado;
      }

      this.mostrarSpinner = false;
    }, 2500);
  }

  async asignarPuntos(importe: number, codigo: string)
  {
    let esta = false;
    let jsonCodigo: any = {};
    let colorToast: string = 'success';
    let mensajeToast: string = 'Crédito cargado correctamente';
    
    this.usuario.codigos.forEach((c: any) => {
      if(c.codigo === codigo)
      { 
        esta = true;
        jsonCodigo = c;
      }
    });
    
    if(esta)
    {
      if(this.usuario.perfil === 'administrador')
      {
        if(jsonCodigo.cantidad < 2)
        {
          this.usuario.codigos.forEach((c:any) => {
            if(c.codigo === jsonCodigo.codigo)
            {
              c.cantidad++;
            }
          });
        }
        else
        {
          colorToast = 'danger';
          mensajeToast = 'Ya tiene cargado mas de dos veces este codigo...';
        }
      }
      else
      {
        colorToast = 'danger';
        mensajeToast = 'Ya tiene cargado este codigo...';
      }
    }
    else
    {
      this.usuario.codigos.push({importe: importe, codigo: codigo, cantidad: 1});
    }
    
    const toast = await this.toastController.create({
      message: mensajeToast,
      duration: 1500,
      position: 'top',
      color: colorToast,
    });
    await toast.present();
    
    FirestoreService.actualizarFs('usuariosCarga', this.usuario, this.firestore).then(async ()=>{
      this.puntosACargar = 0;
      this.codigoACargar = '';
    });
  }

  borrarPuntos()
  {
    this.mostrarSpinner = true;
    this.usuario.codigos = [];
    setTimeout(()=>{
      FirestoreService.actualizarFs('usuariosCarga', this.usuario, this.firestore).then(async ()=>{
        const toast = await this.toastController.create({
          message: 'Datos actualizados correctamente',
          duration: 1500,
          position: 'middle',
          color: 'tertiary',
        });
        this.mostrarSpinner = false;
        await toast.present();
      });
    }, 2000);
  }

  calcularCreditoTotal(): number
  {
    let credito: number = 0;

    this.usuario.codigos.forEach((c:any) => {
      credito += c.importe * c.cantidad;
    });

    return credito;
  }

  logOut()
  {
    this.mostrarSpinner = true;
    this.auth.logout()
    ?.then(()=>{
      setTimeout(() => {
        this.router.navigate(["/login"]);
        this.mostrarSpinner = false;
      }, 2000);
    })
    .catch((error)=>{
      setTimeout(() => {
        console.log("ERROR: ", error);
        this.mostrarSpinner = false;
      }, 1500);
    })
  }
}
