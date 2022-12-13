import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MwOrKwComponent } from './mw-or-kw.component';

describe('MwOrKwComponent', () => {
  let component: MwOrKwComponent;
  let fixture: ComponentFixture<MwOrKwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MwOrKwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MwOrKwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
