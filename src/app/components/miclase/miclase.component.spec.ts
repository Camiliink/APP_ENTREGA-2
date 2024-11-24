import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MiclaseComponent } from './miclase.component';

describe('MiclaseComponent', () => {
  let component: MiclaseComponent;
  let fixture: ComponentFixture<MiclaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MiclaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiclaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
