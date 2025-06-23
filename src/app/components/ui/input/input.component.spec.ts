import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind placeholder', () => {
    component.placeholder = 'Enter text';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.placeholder).toBe('Enter text');
  });

  it('should bind type', () => {
    component.type = 'password';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.type).toBe('password');
  });

  it('should bind value', () => {
    component.value = 'test value';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('test value');
  });

  it('should bind disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.disabled).toBeTrue();
  });

  it('should call handleInput and update value on input event', () => {
    spyOn(component, 'handleInput').and.callThrough();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.handleInput).toHaveBeenCalled();
    expect(component.value).toBe('new value');
  });

  it('should call onChange and onTouched when input changes', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    const onTouchedSpy = jasmine.createSpy('onTouched');
    component.registerOnChange(onChangeSpy);
    component.registerOnTouched(onTouchedSpy);

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'changed';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith('changed');
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should update value when writeValue is called', () => {
    component.writeValue('written');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('written');
  });

  it('should update disabled state when setDisabledState is called', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.disabled).toBeTrue();
    component.setDisabledState(false);
    fixture.detectChanges();
    expect(input.disabled).toBeFalse();
  });
});
