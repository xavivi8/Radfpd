import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnadoUnidadesCentroComponent } from './alumnado-unidades-centro.component';

describe('AlumnadoUnidadesCentroComponent', () => {
  let component: AlumnadoUnidadesCentroComponent;
  let fixture: ComponentFixture<AlumnadoUnidadesCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnadoUnidadesCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnadoUnidadesCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
