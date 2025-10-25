import {
  CommonModule,
  NgClass
} from "./chunk-KWA24HAJ.js";
import "./chunk-ZMLREZMJ.js";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  Renderer2,
  ViewChild,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵviewQuery
} from "./chunk-KOXFDEHF.js";
import {
  BehaviorSubject
} from "./chunk-RSS3ODKE.js";
import "./chunk-WDMUDEB6.js";

// node_modules/ngx-image-zoom/fesm2020/ngx-image-zoom.mjs
var _c0 = ["zoomContainer"];
var _c1 = ["imageThumbnail"];
var _c2 = ["fullSizeImage"];
var _c3 = (a0) => ({
  ngxImageZoomFullContainer: true,
  ngxImageZoomLensEnabled: a0
});
var NgxImageZoomService = class {
  constructor(changeDetectorRef) {
    this.changeDetectorRef = changeDetectorRef;
    this.zoomDisplay = "none";
    this.thumbWidth = 0;
    this.thumbHeight = 0;
    this.fullImageTop = 0;
    this.fullImageLeft = 0;
    this.lensWidth = 100;
    this.lensHeight = 100;
    this.lensTop = 0;
    this.lensLeft = 0;
    this.magnifiedWidth = 0;
    this.magnifiedHeight = 0;
    this.zoomPosition = new BehaviorSubject(null);
    this.zoomingEnabled = false;
    this.isReady = false;
    this.enableLens = false;
    this.minZoomRatio = 1;
    this.maxZoomRatio = 2;
    this.magnification = 1;
    this.fullWidth = 0;
    this.fullHeight = 0;
    this.xRatio = 0;
    this.yRatio = 0;
    this.latestMouseLeft = -1;
    this.latestMouseTop = -1;
  }
  zoomOn(event) {
    if (this.isReady) {
      this.zoomingEnabled = true;
      this.calculateRatioAndOffset();
      this.zoomDisplay = "block";
      this.calculateZoomPosition(event);
      this.changeDetectorRef.markForCheck();
    }
  }
  zoomOff() {
    this.zoomingEnabled = false;
    this.zoomDisplay = "none";
    this.changeDetectorRef.markForCheck();
  }
  markForCheck() {
    this.changeDetectorRef.markForCheck();
  }
  calculateRatioAndOffset() {
    if (!this.enableLens) {
      this.lensWidth = this.thumbWidth;
      this.lensHeight = this.thumbHeight;
      this.lensLeft = 0;
      this.lensTop = 0;
    }
    if (this.fullImageLoaded) {
      this.baseRatio = Math.max(this.thumbWidth / this.fullWidth, this.thumbHeight / this.fullHeight);
      this.minZoomRatio = Math.max(this.minZoomRatio || 0, this.baseRatio || 0);
      this.calculateRatio();
    }
  }
  calculateRatio() {
    this.magnifiedWidth = this.fullWidth * this.magnification;
    this.magnifiedHeight = this.fullHeight * this.magnification;
    this.xRatio = (this.magnifiedWidth - this.thumbWidth) / this.thumbWidth;
    this.yRatio = (this.magnifiedHeight - this.thumbHeight) / this.thumbHeight;
  }
  calculateZoomPosition(event) {
    const newLeft = Math.max(Math.min(event.offsetX, this.thumbWidth), 0);
    const newTop = Math.max(Math.min(event.offsetY, this.thumbHeight), 0);
    this.setZoomPosition(newLeft, newTop);
    this.calculateImageAndLensPosition();
    this.changeDetectorRef.markForCheck();
  }
  calculateImageAndLensPosition() {
    let lensLeftMod = 0;
    let lensTopMod = 0;
    if (this.enableLens && this.latestMouseLeft > 0) {
      lensLeftMod = this.latestMouseLeft - this.lensWidth / 2;
      lensTopMod = this.latestMouseTop - this.lensHeight / 2;
      this.lensLeft = lensLeftMod;
      this.lensTop = lensTopMod;
    }
    this.fullImageLeft = this.latestMouseLeft * -this.xRatio - lensLeftMod;
    this.fullImageTop = this.latestMouseTop * -this.yRatio - lensTopMod;
  }
  setZoomPosition(left, top) {
    this.latestMouseLeft = Number(left) || this.latestMouseLeft;
    this.latestMouseTop = Number(top) || this.latestMouseTop;
    const newPosition = {
      x: this.latestMouseLeft,
      y: this.latestMouseTop
    };
    this.zoomPosition.next(newPosition);
  }
};
NgxImageZoomService.ɵfac = function NgxImageZoomService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxImageZoomService)(ɵɵinject(ChangeDetectorRef));
};
NgxImageZoomService.ɵprov = ɵɵdefineInjectable({
  token: NgxImageZoomService,
  factory: NgxImageZoomService.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxImageZoomService, [{
    type: Injectable
  }], function() {
    return [{
      type: ChangeDetectorRef
    }];
  }, null);
})();
var ClickZoomMode = class {
  constructor(zoomService) {
    this.zoomService = zoomService;
  }
  onClick(event) {
    if (this.zoomService.zoomingEnabled === false) {
      this.zoomService.zoomOn(event);
    }
  }
  onMouseEnter() {
  }
  onMouseLeave() {
    this.zoomService.zoomOff();
  }
  onMouseMove(event) {
    if (this.zoomService.zoomingEnabled) {
      this.zoomService.calculateZoomPosition(event);
    }
  }
  onMouseWheel() {
    return true;
  }
};
var HoverFreezeZoomMode = class {
  constructor(zoomService) {
    this.zoomService = zoomService;
    this.zoomFrozen = false;
  }
  onClick(event) {
    if (this.zoomService.zoomingEnabled && this.zoomFrozen) {
      this.zoomFrozen = false;
    } else if (this.zoomService.zoomingEnabled) {
      this.zoomFrozen = true;
      this.zoomService.markForCheck();
    } else {
      this.zoomService.zoomOn(event);
    }
  }
  onMouseEnter(event) {
    if (!this.zoomFrozen) {
      this.zoomService.zoomOn(event);
    }
  }
  onMouseLeave() {
    if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
      this.zoomService.zoomOff();
    }
  }
  onMouseMove(event) {
    if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
      this.zoomService.calculateZoomPosition(event);
    }
  }
  onMouseWheel() {
    return !this.zoomFrozen;
  }
};
var HoverZoomMode = class {
  constructor(zoomService) {
    this.zoomService = zoomService;
  }
  onClick() {
  }
  onMouseEnter(event) {
    this.zoomService.zoomOn(event);
  }
  onMouseLeave() {
    this.zoomService.zoomOff();
  }
  onMouseMove(event) {
    this.zoomService.calculateZoomPosition(event);
  }
  onMouseWheel() {
    return true;
  }
};
var ToggleClickZoomMode = class {
  constructor(zoomService) {
    this.zoomService = zoomService;
  }
  onClick(event) {
    if (this.zoomService.zoomingEnabled) {
      this.zoomService.zoomOff();
    } else {
      this.zoomService.zoomOn(event);
    }
  }
  onMouseEnter() {
  }
  onMouseLeave() {
    this.zoomService.zoomOff();
  }
  onMouseMove(event) {
    if (this.zoomService.zoomingEnabled) {
      this.zoomService.calculateZoomPosition(event);
    }
  }
  onMouseWheel() {
    return true;
  }
};
var ToggleFreezeZoomMode = class {
  constructor(zoomService) {
    this.zoomService = zoomService;
    this.zoomFrozen = false;
  }
  onClick(event) {
    if (this.zoomService.zoomingEnabled && this.zoomFrozen) {
      this.zoomFrozen = false;
      this.zoomService.zoomOff();
    } else if (this.zoomService.zoomingEnabled) {
      this.zoomFrozen = true;
      this.zoomService.markForCheck();
    } else {
      this.zoomService.zoomOn(event);
    }
  }
  onMouseEnter() {
  }
  onMouseLeave() {
    if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
      this.zoomService.zoomOff();
    }
  }
  onMouseMove(event) {
    if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
      this.zoomService.calculateZoomPosition(event);
    }
  }
  onMouseWheel() {
    return !this.zoomFrozen;
  }
};
var ToggleZoomMode = class {
  constructor(zoomService) {
    this.zoomService = zoomService;
  }
  onClick(event) {
    if (this.zoomService.zoomingEnabled) {
      this.zoomService.zoomOff();
    } else {
      this.zoomService.zoomOn(event);
    }
  }
  onMouseEnter() {
  }
  onMouseLeave() {
  }
  onMouseMove() {
  }
  onMouseWheel() {
    return true;
  }
};
var NgxImageZoomComponent = class _NgxImageZoomComponent {
  constructor(zoomService, renderer) {
    this.zoomService = zoomService;
    this.renderer = renderer;
    this.zoomScroll = new EventEmitter();
    this.zoomPosition = new EventEmitter();
    this.imagesLoaded = new EventEmitter();
    this.lensBorderRadius = 0;
    this.zoomMode = "hover";
    this.enableScrollZoom = false;
    this.scrollStepSize = 0.1;
    this.circularLens = false;
    this.thumbImageLoaded = false;
    this.subscriptions = [];
    this.eventListeners = [];
    this.zoomModesMap = /* @__PURE__ */ new Map([["click", ClickZoomMode], ["hover-freeze", HoverFreezeZoomMode], ["hover", HoverZoomMode], ["toggle-click", ToggleClickZoomMode], ["toggle-freeze", ToggleFreezeZoomMode], ["toggle", ToggleZoomMode]]);
    this.altText = "";
    this.titleText = "";
  }
  set setThumbImage(thumbImage) {
    this.thumbImageLoaded = false;
    this.setIsReady(false);
    this.thumbImage = thumbImage;
  }
  set setFullImage(fullImage) {
    this.zoomService.fullImageLoaded = false;
    this.setIsReady(false);
    this.fullImage = fullImage;
  }
  set setZoomMode(zoomMode) {
    if (_NgxImageZoomComponent.validZoomModes.some((m) => m === zoomMode)) {
      this.zoomMode = zoomMode;
    }
  }
  set setMagnification(magnification) {
    this.zoomService.magnification = Number(magnification) || this.zoomService.magnification;
    this.zoomScroll.emit(this.zoomService.magnification);
  }
  set setMinZoomRatio(minZoomRatio) {
    const ratio = Number(minZoomRatio) || this.zoomService.minZoomRatio || this.zoomService.baseRatio || 0;
    this.zoomService.minZoomRatio = Math.max(ratio, this.zoomService.baseRatio || 0);
  }
  set setMaxZoomRatio(maxZoomRatio) {
    this.zoomService.maxZoomRatio = Number(maxZoomRatio) || this.zoomService.maxZoomRatio;
  }
  set setScrollStepSize(stepSize) {
    this.scrollStepSize = Number(stepSize) || this.scrollStepSize;
  }
  set setEnableLens(enable) {
    this.zoomService.enableLens = Boolean(enable);
  }
  set setLensWidth(width) {
    this.zoomService.lensWidth = Number(width) || this.zoomService.lensWidth;
  }
  set setLensHeight(height) {
    this.zoomService.lensHeight = Number(height) || this.zoomService.lensHeight;
  }
  set setCircularLens(enable) {
    this.circularLens = Boolean(enable);
  }
  set setEnableScrollZoom(enable) {
    this.enableScrollZoom = Boolean(enable);
  }
  ngOnInit() {
    if (this.fullImage === void 0) {
      this.fullImage = this.thumbImage;
    }
    this.registerServiceSubscriptions();
    this.loadZoomMode();
    this.registerEventListeners();
    this.calculateLensBorder();
  }
  ngOnChanges() {
    this.calculateLensBorder();
    this.zoomService.calculateRatioAndOffset();
    this.zoomService.calculateImageAndLensPosition();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.eventListeners.forEach((destroyFn) => destroyFn());
  }
  registerServiceSubscriptions() {
    this.subscriptions.push(this.zoomService.zoomPosition.subscribe((position) => this.zoomPosition.emit(position)));
  }
  loadZoomMode() {
    const ZoomModeClass = this.zoomModesMap.get(this.zoomMode);
    if (ZoomModeClass) {
      this.zoomInstance = new ZoomModeClass(this.zoomService);
    } else {
      console.error(`Unsupported zoom mode: ${this.zoomMode}`);
    }
  }
  registerEventListeners() {
    if (this.zoomInstance) {
      const nativeElement = this.zoomContainer.nativeElement;
      this.eventListeners.push(
        this.renderer.listen(nativeElement, "mouseenter", (event) => this.zoomInstance.onMouseEnter(event)),
        this.renderer.listen(nativeElement, "mouseleave", (event) => this.zoomInstance.onMouseLeave(event)),
        this.renderer.listen(nativeElement, "mousemove", (event) => this.zoomInstance.onMouseMove(event)),
        this.renderer.listen(nativeElement, "click", (event) => this.zoomInstance.onClick(event)),
        // Chrome: 'mousewheel', Firefox: 'DOMMouseScroll', IE: 'onmousewheel'
        this.renderer.listen(nativeElement, "mousewheel", (event) => {
          if (this.zoomInstance.onMouseWheel(event)) {
            this.onMouseWheel(event);
          }
        }),
        this.renderer.listen(nativeElement, "DOMMouseScroll", (event) => {
          if (this.zoomInstance.onMouseWheel(event)) {
            this.onMouseWheel(event);
          }
        }),
        this.renderer.listen(nativeElement, "onmousewheel", (event) => {
          if (this.zoomInstance.onMouseWheel(event)) {
            this.onMouseWheel(event);
          }
        })
      );
    }
  }
  /**
   * Template helper methods
   */
  onThumbImageLoaded() {
    this.zoomService.thumbWidth = this.imageThumbnail.nativeElement.width;
    this.zoomService.thumbHeight = this.imageThumbnail.nativeElement.height;
    this.thumbImageLoaded = true;
    this.checkImagesLoaded();
  }
  onFullImageLoaded() {
    this.zoomService.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
    this.zoomService.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;
    this.zoomService.fullImageLoaded = true;
    this.checkImagesLoaded();
  }
  calculateLensBorder() {
    if (this.zoomService.enableLens) {
      if (this.circularLens) {
        this.lensBorderRadius = this.zoomService.lensWidth / 2;
      } else {
        this.lensBorderRadius = 0;
      }
    }
  }
  checkImagesLoaded() {
    this.zoomService.calculateRatioAndOffset();
    if (this.thumbImageLoaded && this.zoomService.fullImageLoaded) {
      this.zoomService.calculateImageAndLensPosition();
      this.setIsReady(true);
    }
  }
  setIsReady(value) {
    this.zoomService.isReady = value;
    this.imagesLoaded.emit(value);
  }
  /**
   * Mouse wheel event
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseWheel(event) {
    if (!this.enableScrollZoom || !this.zoomService.zoomingEnabled) {
      return;
    }
    event = window.event || event;
    const direction = Math.max(Math.min(event.wheelDelta || -event.detail, 1), -1);
    if (direction > 0) {
      this.setMagnification = Math.min(this.zoomService.magnification + this.scrollStepSize, this.zoomService.maxZoomRatio);
    } else {
      this.setMagnification = Math.max(this.zoomService.magnification - this.scrollStepSize, this.zoomService.minZoomRatio);
    }
    this.zoomService.calculateRatio();
    this.zoomService.calculateZoomPosition(event);
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
};
NgxImageZoomComponent.validZoomModes = ["hover", "toggle", "click", "toggle-click", "toggle-freeze", "hover-freeze"];
NgxImageZoomComponent.ɵfac = function NgxImageZoomComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxImageZoomComponent)(ɵɵdirectiveInject(NgxImageZoomService), ɵɵdirectiveInject(Renderer2));
};
NgxImageZoomComponent.ɵcmp = ɵɵdefineComponent({
  type: NgxImageZoomComponent,
  selectors: [["lib-ngx-image-zoom"]],
  viewQuery: function NgxImageZoomComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c0, 7);
      ɵɵviewQuery(_c1, 7);
      ɵɵviewQuery(_c2, 7);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.zoomContainer = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.imageThumbnail = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.fullSizeImage = _t.first);
    }
  },
  inputs: {
    setThumbImage: [0, "thumbImage", "setThumbImage"],
    setFullImage: [0, "fullImage", "setFullImage"],
    setZoomMode: [0, "zoomMode", "setZoomMode"],
    setMagnification: [0, "magnification", "setMagnification"],
    setMinZoomRatio: [0, "minZoomRatio", "setMinZoomRatio"],
    setMaxZoomRatio: [0, "maxZoomRatio", "setMaxZoomRatio"],
    setScrollStepSize: [0, "scrollStepSize", "setScrollStepSize"],
    setEnableLens: [0, "enableLens", "setEnableLens"],
    setLensWidth: [0, "lensWidth", "setLensWidth"],
    setLensHeight: [0, "lensHeight", "setLensHeight"],
    setCircularLens: [0, "circularLens", "setCircularLens"],
    setEnableScrollZoom: [0, "enableScrollZoom", "setEnableScrollZoom"],
    altText: "altText",
    titleText: "titleText"
  },
  outputs: {
    zoomScroll: "zoomScroll",
    zoomPosition: "zoomPosition",
    imagesLoaded: "imagesLoaded"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([NgxImageZoomService]), ɵɵNgOnChangesFeature],
  decls: 7,
  vars: 35,
  consts: [["zoomContainer", ""], ["imageThumbnail", ""], ["fullSizeImage", ""], [1, "ngxImageZoomContainer"], [1, "ngxImageZoomThumbnail", 3, "load", "alt", "title", "src"], [3, "ngClass"], [1, "ngxImageZoomFull", 3, "load", "alt", "title", "src"]],
  template: function NgxImageZoomComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = ɵɵgetCurrentView();
      ɵɵelementStart(0, "div", 3, 0)(2, "img", 4, 1);
      ɵɵlistener("load", function NgxImageZoomComponent_Template_img_load_2_listener() {
        ɵɵrestoreView(_r1);
        return ɵɵresetView(ctx.onThumbImageLoaded());
      });
      ɵɵelementEnd();
      ɵɵelementStart(4, "div", 5)(5, "img", 6, 2);
      ɵɵlistener("load", function NgxImageZoomComponent_Template_img_load_5_listener() {
        ɵɵrestoreView(_r1);
        return ɵɵresetView(ctx.onFullImageLoaded());
      });
      ɵɵelementEnd()()();
    }
    if (rf & 2) {
      ɵɵstyleProp("width", ctx.zoomService.thumbWidth, "px")("height", ctx.zoomService.thumbHeight, "px");
      ɵɵadvance(2);
      ɵɵproperty("alt", ctx.altText)("title", ctx.titleText)("src", ctx.thumbImage, ɵɵsanitizeUrl);
      ɵɵadvance(2);
      ɵɵstyleProp("display", ctx.zoomService.zoomDisplay)("top", ctx.zoomService.lensTop, "px")("left", ctx.zoomService.lensLeft, "px")("width", ctx.zoomService.lensWidth, "px")("height", ctx.zoomService.lensHeight, "px")("border-radius", ctx.lensBorderRadius, "px");
      ɵɵproperty("ngClass", ɵɵpureFunction1(33, _c3, ctx.zoomService.enableLens));
      ɵɵadvance();
      ɵɵstyleProp("display", ctx.zoomService.zoomDisplay)("top", ctx.zoomService.fullImageTop, "px")("left", ctx.zoomService.fullImageLeft, "px")("width", ctx.zoomService.magnifiedWidth, "px")("height", ctx.zoomService.magnifiedHeight, "px");
      ɵɵproperty("alt", ctx.altText)("title", ctx.titleText)("src", ctx.fullImage, ɵɵsanitizeUrl);
    }
  },
  dependencies: [NgClass],
  styles: [".ngxImageZoomContainer[_ngcontent-%COMP%]{position:relative;margin:auto;overflow:hidden;pointer-events:none}.ngxImageZoomThumbnail[_ngcontent-%COMP%]{pointer-events:all}.ngxImageZoomFull[_ngcontent-%COMP%]{position:absolute;max-width:none;max-height:none;display:none;pointer-events:none}.ngxImageZoomFullContainer[_ngcontent-%COMP%]{position:absolute;overflow:hidden;pointer-events:none}.ngxImageZoomFullContainer.ngxImageZoomLensEnabled[_ngcontent-%COMP%]{border:2px solid red;cursor:crosshair;pointer-events:none}"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxImageZoomComponent, [{
    type: Component,
    args: [{
      selector: "lib-ngx-image-zoom",
      providers: [NgxImageZoomService],
      template: '<div\n    #zoomContainer\n    class="ngxImageZoomContainer"\n    [style.width.px]="this.zoomService.thumbWidth"\n    [style.height.px]="this.zoomService.thumbHeight"\n>\n    <img\n        #imageThumbnail\n        class="ngxImageZoomThumbnail"\n        [alt]="altText"\n        [title]="titleText"\n        [src]="thumbImage"\n        (load)="onThumbImageLoaded()"\n    />\n\n    <div\n        [ngClass]="{\n            ngxImageZoomFullContainer: true,\n            ngxImageZoomLensEnabled: this.zoomService.enableLens\n        }"\n        [style.display]="this.zoomService.zoomDisplay"\n        [style.top.px]="this.zoomService.lensTop"\n        [style.left.px]="this.zoomService.lensLeft"\n        [style.width.px]="this.zoomService.lensWidth"\n        [style.height.px]="this.zoomService.lensHeight"\n        [style.border-radius.px]="this.lensBorderRadius"\n    >\n        <img\n            #fullSizeImage\n            class="ngxImageZoomFull"\n            [alt]="altText"\n            [title]="titleText"\n            [src]="fullImage"\n            (load)="onFullImageLoaded()"\n            [style.display]="this.zoomService.zoomDisplay"\n            [style.top.px]="this.zoomService.fullImageTop"\n            [style.left.px]="this.zoomService.fullImageLeft"\n            [style.width.px]="this.zoomService.magnifiedWidth"\n            [style.height.px]="this.zoomService.magnifiedHeight"\n        />\n    </div>\n</div>\n',
      styles: [".ngxImageZoomContainer{position:relative;margin:auto;overflow:hidden;pointer-events:none}.ngxImageZoomThumbnail{pointer-events:all}.ngxImageZoomFull{position:absolute;max-width:none;max-height:none;display:none;pointer-events:none}.ngxImageZoomFullContainer{position:absolute;overflow:hidden;pointer-events:none}.ngxImageZoomFullContainer.ngxImageZoomLensEnabled{border:2px solid red;cursor:crosshair;pointer-events:none}\n"]
    }]
  }], function() {
    return [{
      type: NgxImageZoomService
    }, {
      type: Renderer2
    }];
  }, {
    zoomContainer: [{
      type: ViewChild,
      args: ["zoomContainer", {
        static: true
      }]
    }],
    imageThumbnail: [{
      type: ViewChild,
      args: ["imageThumbnail", {
        static: true
      }]
    }],
    fullSizeImage: [{
      type: ViewChild,
      args: ["fullSizeImage", {
        static: true
      }]
    }],
    zoomScroll: [{
      type: Output
    }],
    zoomPosition: [{
      type: Output
    }],
    imagesLoaded: [{
      type: Output
    }],
    setThumbImage: [{
      type: Input,
      args: ["thumbImage"]
    }],
    setFullImage: [{
      type: Input,
      args: ["fullImage"]
    }],
    setZoomMode: [{
      type: Input,
      args: ["zoomMode"]
    }],
    setMagnification: [{
      type: Input,
      args: ["magnification"]
    }],
    setMinZoomRatio: [{
      type: Input,
      args: ["minZoomRatio"]
    }],
    setMaxZoomRatio: [{
      type: Input,
      args: ["maxZoomRatio"]
    }],
    setScrollStepSize: [{
      type: Input,
      args: ["scrollStepSize"]
    }],
    setEnableLens: [{
      type: Input,
      args: ["enableLens"]
    }],
    setLensWidth: [{
      type: Input,
      args: ["lensWidth"]
    }],
    setLensHeight: [{
      type: Input,
      args: ["lensHeight"]
    }],
    setCircularLens: [{
      type: Input,
      args: ["circularLens"]
    }],
    setEnableScrollZoom: [{
      type: Input,
      args: ["enableScrollZoom"]
    }],
    altText: [{
      type: Input
    }],
    titleText: [{
      type: Input
    }]
  });
})();
var NgxImageZoomModule = class {
};
NgxImageZoomModule.ɵfac = function NgxImageZoomModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxImageZoomModule)();
};
NgxImageZoomModule.ɵmod = ɵɵdefineNgModule({
  type: NgxImageZoomModule,
  declarations: [NgxImageZoomComponent],
  imports: [CommonModule],
  exports: [NgxImageZoomComponent]
});
NgxImageZoomModule.ɵinj = ɵɵdefineInjector({
  imports: [CommonModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxImageZoomModule, [{
    type: NgModule,
    args: [{
      declarations: [NgxImageZoomComponent],
      imports: [CommonModule],
      exports: [NgxImageZoomComponent]
    }]
  }], null, null);
})();
export {
  NgxImageZoomComponent,
  NgxImageZoomModule
};
//# sourceMappingURL=ngx-image-zoom.js.map
