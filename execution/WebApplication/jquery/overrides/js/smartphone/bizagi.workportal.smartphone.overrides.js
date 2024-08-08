//overrides
/**
 * Edit "Image Editor" feature and configurations
 * @type {object}
 * @property enableImageEditor {boolean}             Is true by default, it will use either the image editor view or the automatic properties (with no visual interface) to perform changes on the image, if false the image control will behave as always.
 * @property enableAutomaticProperties {boolean}     Is false by default, when true the image editor view will not be displayed, and the "automaticProperties" items will be applied automatically on the image.
 * @property automaticProperties {object}            It contains the properties to be modified by the client in order to transform the resulting image automatically, it will be applied to every image control in the project.
 * @property resizeOption {string}                   "small" (width:320) , "medium" (width:640) , "large" (width:1280). The height is automatically calculated.
 * @property blackAndWhiteFilter {boolean}           A black and white filter will be automatically applied on the image.
 * @property rotationAngle {number}                  Value (in degrees) to rotate the image, the rotation will be applied in a left to right direction ( only 0, 90, 180 and 270 values are supported, otherwise the rotation value will not be taken in count ).
 * @property resolutionQualityPercentage {double}    Value ( from 0.0 to 1.0 ) to reduce the image quality, a minimum of 60% ( 0.6 ) is recommended to avoid losing too much detail.
 */

bizagi.override.mobileImageEditorParams = {
    enableImageEditor : true,
    enableAutomaticProperties : false,
    automaticProperties : {
        resizeOption: "large",
        blackAndWhiteFilter: true,
        rotationAngle: 0,
        resolutionQualityPercentage: 0.7
    }
};