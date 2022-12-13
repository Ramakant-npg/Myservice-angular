import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGenerationComponent } from './new-generation.component';

describe('NewGenerationComponent', () => {
  let component: NewGenerationComponent;
  let fixture: ComponentFixture<NewGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
