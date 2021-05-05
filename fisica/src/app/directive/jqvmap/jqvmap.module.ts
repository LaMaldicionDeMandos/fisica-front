import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JqvmapDirective} from "./jqvmap.directive";


@NgModule({
    declarations: [
        JqvmapDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        JqvmapDirective
    ]
})
export class JqvmapModule {
}
