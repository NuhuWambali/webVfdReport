import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportListComponent } from './sales-report-list.component';

describe('SalesReportListComponent', () => {
  let component: SalesReportListComponent;
  let fixture: ComponentFixture<SalesReportListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesReportListComponent]
    });
    fixture = TestBed.createComponent(SalesReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
