import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseStrategyComponent } from './choose-strategy.component';

describe('ChooseStrategyComponent', () => {
  let component: ChooseStrategyComponent;
  let fixture: ComponentFixture<ChooseStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
