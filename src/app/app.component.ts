import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BodyComponent } from './componets/body/body.component';
import { PerfilComponent } from './componets/perfil/perfil.component';
import { HeaderComponent } from './componets/header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    BodyComponent,
    PerfilComponent,
    HeaderComponent,
    SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portafoliov2';
}
