import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/components/login/service/login-service.service';
import { LoginCredentials } from 'src/app/components/login/models/auth.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginServiceService);
  private router = inject(Router);

  loading = false;
  errorMessage: string | null = null;


  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;


    const credentials: LoginCredentials = this.loginForm.getRawValue();

    this.loginService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
    
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
    
        if (error.status === 422 || error.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage =
            'Ocurrió un error en el servidor. Intenta de nuevo.';
        }
      },
    });
  }
}
