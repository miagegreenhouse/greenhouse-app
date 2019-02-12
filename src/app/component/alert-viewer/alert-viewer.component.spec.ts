import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertViewerComponent } from './alert-viewer.component';

describe('AlertViewerComponent', () => {
  let component: AlertViewerComponent;
  let fixture: ComponentFixture<AlertViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
