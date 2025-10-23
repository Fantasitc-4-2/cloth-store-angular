import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bag } from './bag';

describe('Bag', () => {
  let component: Bag;
  let fixture: ComponentFixture<Bag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
