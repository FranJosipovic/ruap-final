import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpitnikComponent } from './upitnik.component';

describe('UpitnikComponent', () => {
  let component: UpitnikComponent;
  let fixture: ComponentFixture<UpitnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpitnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpitnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
