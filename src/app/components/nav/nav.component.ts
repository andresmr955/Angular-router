import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../services/store.service'
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { TokenService } from './../../services/token.service';
import { FilesService } from 'src/app/services/files.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  token =  '';
  profile: User | null = null;
  imgRta = ''
  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private tokenService: TokenService, 
    private fileService: FilesService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.loginAndGet('john@mail.com', 'changeme')
    .subscribe(user => {
      this.profile = user;
      
      const token = this.tokenService.getToken();
      console.log('Perfil de usuario:', user);
      console.log('Token de acceso:', token);
    });
  }

  downloadPdf() {
  if (this.imgRta) {
    const filename = this.imgRta.split('/').pop() || 'file'; // extrae el nombre del archivo de la URL
    let mimeType = 'application/octet-stream'; // fallback

    if (filename.endsWith('.pdf')) mimeType = 'application/pdf';
    else if (filename.endsWith('.png')) mimeType = 'image/png';
    else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mimeType = 'image/jpeg';

    this.fileService.getFile(filename, this.imgRta, mimeType).subscribe();
    return;
  } else {
    this.fileService.getFile('helloworld.pdf', 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf', 'application/pdf').subscribe();
  }
}

  onUpload(event: Event) {
  const element = event.target as HTMLInputElement;
  const file = element.files?.item(0);

  if (file) {
    this.fileService.uploadFile(file).subscribe({
      next: (rta) => {
        console.log('Respuesta del backend:', rta);
        this.imgRta = rta.location;
      }
    });
  }
}

}
