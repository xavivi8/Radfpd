import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUnidadesCentroComponent } from './editar-unidades-centro.component';

describe('EditarUnidadesCentroComponent', () => {
  let component: EditarUnidadesCentroComponent;
  let fixture: ComponentFixture<EditarUnidadesCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarUnidadesCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarUnidadesCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
