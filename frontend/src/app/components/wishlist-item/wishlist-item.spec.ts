import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistItem } from './wishlist-item';

describe('WishlistItem', () => {
  let component: WishlistItem;
  let fixture: ComponentFixture<WishlistItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
