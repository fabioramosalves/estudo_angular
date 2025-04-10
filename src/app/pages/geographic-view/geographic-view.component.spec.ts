import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicViewComponent } from './geographic-view.component';

describe('GeographicViewComponent', () => {
  let component: GeographicViewComponent;
  let fixture: ComponentFixture<GeographicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeographicViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeographicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
