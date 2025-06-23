import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the default classes', () => {
    const div: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(div.className).toContain('bg-white');
    expect(div.className).toContain('shadow-md');
    expect(div.className).toContain('rounded-2xl');
    expect(div.className).toContain('p-4');
  });

  it('should add extraClasses to the div', () => {
    component.extraClasses = 'my-extra-class another-class';
    fixture.detectChanges();
    const div: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(div.className).toContain('my-extra-class');
    expect(div.className).toContain('another-class');
  });
});
