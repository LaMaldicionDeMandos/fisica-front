import {Directive, ElementRef, HostBinding} from "@angular/core";

@Directive({
    selector: '[InputFloat]',
    host: {
        '(blur)': 'onBlur()'
    }
})
export class InputFloatDirective {
    @HostBinding('class.form-control--active') inputStatus: boolean;

    constructor(private el: ElementRef) {
    }

    onBlur() {
        let status = true ? this.el.nativeElement.value : false;
        this.inputStatus = status
    }

    ngOnInit() {

    }
}
