import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CodigoQrComponent } from './codigoqr.component';

describe('CodigoqrComponent', () => {
  let component: CodigoQrComponent;
  let fixture: ComponentFixture<CodigoQrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CodigoQrComponent], // Aquí se corrige el error
    }).compileComponents();

    fixture = TestBed.createComponent(CodigoQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
