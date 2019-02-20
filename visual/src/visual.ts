/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private mainSvgElement: d3.Selection<SVGElement>;
        private visualSvgGroup: d3.Selection<SVGElement>;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            // Create d3 selection from main HTML element
            const mainElement = d3.select(options.element);
            // Append SVG element to it. This SVG will contain our visual
            this.mainSvgElement = mainElement.append("svg");
            // Append an svg group that will contain our visual
            this.visualSvgGroup = this.mainSvgElement.append("g");
        }

        private static transform(dataView: DataView): IItemGroup[] {
            // Mock data
            const items: IItemGroup[] = [
                { category: 3, items: [0.15, 0.33]},
                { category: 1, items: [0.23, null]},
                { category: 4, items: [0.7659, 1.69]},
                { category: 2, items: [null, 0.12]},
                { category: 5, items: [0.555, 0.943]},
            ];

            return items;
        }

        public update(options: VisualUpdateOptions) {
            const dataView = options && options.dataViews && options.dataViews[0];
            if (!dataView) {
                return;
            }

            // Parse settings
            this.settings = Visual.parseSettings(dataView);
            // Parse data from update options
            const items = Visual.transform(dataView);

            if (this.mainSvgElement) {
                this.mainSvgElement
                    .attr("width", options.viewport.width)
                    .attr("height", options.viewport.height);
            }

            const visualMargin: IMargin = { top: 20, bottom: 20, left: 20, right: 20 };

            const visualSize: ISize = {
                width: options.viewport.width - visualMargin.left - visualMargin.right,
                height: options.viewport.height - visualMargin.top - visualMargin.bottom,
            };

            this.visualSvgGroup.attr("transform", `translate(${visualMargin.left}, ${visualMargin.top})`);
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /**
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
         * objects and properties you want to expose to the users in the property pane.
         *
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}