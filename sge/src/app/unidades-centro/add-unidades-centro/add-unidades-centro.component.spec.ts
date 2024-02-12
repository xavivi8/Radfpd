import { AddUnidadesCentroComponent } from './add-unidades-centro.component';

import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';
import { UnidadesCentroService } from 'src/app/services/unidades-centro.service';
import { UnidadesCentroServiceStub } from 'src/app/shared/stubs/unidadesCentroServiceStub';


describe('AddUnidadesCentroComponent', () => {
  let component: AddUnidadesCentroComponent;
  let fixture: ComponentFixture<AddUnidadesCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnidadesCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnidadesCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
