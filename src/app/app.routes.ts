import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { HomeComponent } from './pages/home/home.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ReturnsComponent } from './pages/returns/returns.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ItemDetailsComponent } from './pages/inventory/item-details/item-details.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { ResetComponent } from './pages/auth/reset/reset.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory/new',
    component: ItemDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory/:id',
    component: ItemDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'gallery', component: GalleryComponent },
  { path: 'commissions', component: CommissionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'returns', component: ReturnsComponent },
  { path: 'shipping', component: ShippingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset/:id', component: ResetComponent },
  { path: '**', redirectTo: '' },
];
