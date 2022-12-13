import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingGenerationFormComponent } from './existing-generation-form.component';

describe('ExistingGenerationFormComponent', () => {
  let component: ExistingGenerationFormComponent;
  let fixture: ComponentFixture<ExistingGenerationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingGenerationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingGenerationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
