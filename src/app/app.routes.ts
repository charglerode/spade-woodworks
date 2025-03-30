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
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProductEditComponent } from './pages/admin/product-edit/product-edit.component';
import { GalleryDetailsComponent } from './pages/gallery/gallery-details/gallery-details.component';
import { GalleryEditComponent } from './pages/admin/gallery-edit/gallery-edit.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/products/new',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/products/:id',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/gallery/new',
    component: GalleryEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/gallery/:id',
    component: GalleryEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'gallery/:id', component: GalleryDetailsComponent },
  { path: 'commissions', component: CommissionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'returns', component: ReturnsComponent },
  { path: 'shipping', component: ShippingComponent },
  { path: 'shopping-cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset/:id', component: ResetComponent },
  { path: '**', redirectTo: '' },
];
