import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MultiTenantService {
  private tenantId: string | null = null;

  constructor(private http: HttpClient) {}

  setTenant(tenantId: string): void {
    this.tenantId = tenantId;
  }

  getTenant(): string | null {
    return this.tenantId;
  }

  fetchTenantData(): void {
    if (this.tenantId) {
      this.http.get(`https://api.example.com/tenants/${this.tenantId}`).subscribe();
    }
  }
}
