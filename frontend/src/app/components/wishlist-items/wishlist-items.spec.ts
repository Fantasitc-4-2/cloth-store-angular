import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistItems } from './wishlist-items';

describe('WishlistItems', () => {
  let component: WishlistItems;
  let fixture: ComponentFixture<WishlistItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
