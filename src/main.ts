import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withInMemoryScrolling,
  RouterConfigOptions,
} from '@angular/router';
import { AppComponent } from './app/pages/app.component';
import { routes } from './app/app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { DecodePipe } from './app/pipes/decode.pipe';
import { provideNgxStripe } from 'ngx-stripe';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DecodePipe,
    provideNgxStripe(
      'pk_test_51R0xOiCIYtvEEQ0rTSS7B9BvW8XWn9Zrq3CmIaPtF1c41QMsfcYhhXJq5XsM6wAS0gdfEitLLaqzh8GbCDENxgl900frxcyKQf',
    ),
  ],
}).catch((err) => console.error(err));
