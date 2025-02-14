import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { HomeComponent } from './pages/home/home.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ReturnsComponent } from './pages/returns/returns.component';
import { ShippingComponent } from './pages/shipping/shipping.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'commissions', component: CommissionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'returns', component: ReturnsComponent },
  { path: 'shipping', component: ShippingComponent },
  { path: '**', redirectTo: '' },
];
