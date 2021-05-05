import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputFloatDirective} from "./input-float.directive";

@NgModule({
    declarations: [InputFloatDirective],
    imports: [
        CommonModule
    ],
    exports: [
        InputFloatDirective
    ]
})
export class InputFloatModule {
}