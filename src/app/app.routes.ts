import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'sobremi', loadComponent: () => import('./componets/sobremi/sobremi.component').then(m => m.SobremiComponent) },
    { path: 'resumen', loadComponent: () => import('./componets/resumen/resumen.component').then(m => m.ResumenComponent) },
    { path: '', redirectTo: '/sobremi', pathMatch: 'full' },
    { path: '**', redirectTo: '/sobremi' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { } 
