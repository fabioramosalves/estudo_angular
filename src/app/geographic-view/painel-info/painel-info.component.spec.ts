import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelInfoComponent } from './painel-info.component';

describe('PainelInfoComponent', () => {
  let component: PainelInfoComponent;
  let fixture: ComponentFixture<PainelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
