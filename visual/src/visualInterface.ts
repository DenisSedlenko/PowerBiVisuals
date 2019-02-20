module powerbi.extensibility.visual {

    export interface IMargin {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    export interface ISize {
        width: number;
        height: number;
    }

    export interface IItemGroup {
        category: powerbi.PrimitiveValue;
        items: powerbi.PrimitiveValue[];
    }

    export interface VisualData {
        items: IItemGroup[];
        size: ISize;
    }
 }