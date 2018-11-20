import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardtextComponent } from './cardtext.component';

describe('CardtextComponent', () => {
  let component: CardtextComponent;
  let fixture: ComponentFixture<CardtextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardtextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardtextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
