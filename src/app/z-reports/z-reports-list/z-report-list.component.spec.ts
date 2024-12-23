import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZReportListComponent } from './z-report-list.component';

describe('ZReportListComponent', () => {
  let component: ZReportListComponent;
  let fixture: ComponentFixture<ZReportListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZReportListComponent]
    });
    fixture = TestBed.createComponent(ZReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
