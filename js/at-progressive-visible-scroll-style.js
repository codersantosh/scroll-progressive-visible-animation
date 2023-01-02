/*Scroll Trigger Transform*/
function AtScrollTriggerStyle(selector, options = {}) {
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const els = Array.from(document.querySelectorAll(selector));
    els.forEach(el => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (options.callBack) {
                        options.callBack(el);
                    } else {
                        if (el.hasAttribute('data-at-new-style')) {
                            const transform = entry.target.getAttribute('data-at-new-style');
                            try {
                                const transformStyles = JSON.parse(transform, (key, value) => {
                                    if (typeof value !== 'string') {
                                        return value;
                                    }
                                    return isNaN(value) ? value : parseFloat(value);
                                });
                                Object.assign(entry.target.style, transformStyles);
                            } catch (e) {
                                console.error('Invalid JSON in data-at-new-style attribute:', e);
                            }
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        observer.observe(el);
    });
}


/*Scroll Down and Up Progressive Transform*/
function AtGetUnitFromString(value){
    if( !value ){
        return null;
    }
    return value.match(/[a-z]+$/i)[0];
}
function AtParseTransform(transformString ){
    // Return an empty object if the input string is invalid
    if (!transformString || typeof transformString !== 'string') {
        return {};
    }

    const translate2dRegex = /translate\(([^)]+)\)/;
    const translate3dRegex = /translate3d\(([^)]+)\)/;
    const scale2dRegex = /scale\(([^)]+)\)/;
    const scale3dRegex = /scale3d\(([^)]+)\)/;
    const rotate2dRegex = /rotate\(([^)]+)\)/;
    const rotate3dRegex = /rotate3d\(([^)]+)\)/;
    const skewRegex = /skew\(([^)]+)\)/;

    const translate2dMatch = transformString.match(translate2dRegex);
    const translate3dMatch = transformString.match(translate3dRegex);
    const scale2dMatch = transformString.match(scale2dRegex);
    const scale3dMatch = transformString.match(scale3dRegex);
    const rotate2dMatch = transformString.match(rotate2dRegex);
    const rotate3dMatch = transformString.match(rotate3dRegex);
    const skewMatch = transformString.match(skewRegex);

    // Initialize the values for the transform properties
    let translateX = null;
    let translateY = null;
    let translateZ = null;
    let translateType = null;
    let scaleX = null;
    let scaleY = null;
    let scaleZ = null;
    let scaleType = null;
    let rotateX = null;
    let rotateY = null;
    let rotateZ = null;
    let rotateA = null;
    let rotateType = null;
    let skewX = null;
    let skewY = null;

    if (translate2dMatch) {
        [translateX, translateY] = translate2dMatch[1].split(',').map((value) => value);
        translateType = '2d';
    } else if (translate3dMatch) {
        [translateX, translateY, translateZ] = translate3dMatch[1].split(',').map((value) => value);
        translateType = '3d';
    }

    if (scale2dMatch) {
        [scaleX, scaleY] = scale2dMatch[1].split(',').map((value) => value);
        scaleType = '2d';
    } else if (scale3dMatch) {
        [scaleX, scaleY, scaleZ] = scale3dMatch[1].split(',').map((value) =>value);
        scaleType = '3d';

    }

    if (rotate2dMatch) {
        rotateA = rotate2dMatch[1];
        rotateType = '2d';

    } else if (rotate3dMatch) {
        [rotateX, rotateY, rotateZ, rotateA] = rotate3dMatch[1].split(',').map((value) => value);
        rotateType = '3d';
    }

    if (skewMatch) {
        const skewValues = skewMatch[1].split(',');
        skewX = skewValues[0];
        skewY = skewValues[1];
    }

    return {
        translateX:parseInt(translateX)||null,
        translateXUnit:AtGetUnitFromString(translateX)||null,
        translateY:parseInt(translateY)||null,
        translateYUnit:AtGetUnitFromString(translateY)||null,
        translateZ:parseInt(translateZ)||null,
        translateZUnit:AtGetUnitFromString(translateZ)||null,
        translateType:translateType,
        scaleX:parseInt(scaleX)||null,
        scaleY:parseInt(scaleY)||null,
        scaleZ:parseInt(scaleZ)||null,
        scaleType:scaleType,
        rotateX:parseInt(rotateX)||null,
        rotateXUnit:AtGetUnitFromString(rotateX)||null,
        rotateY:parseInt(rotateY)||null,
        rotateYUnit:AtGetUnitFromString(rotateY)||null,
        rotateZ:parseInt(rotateZ)||null,
        rotateZUnit:AtGetUnitFromString(rotateZ)||null,
        rotateA:parseInt(rotateA)||null,
        rotateAUnit:AtGetUnitFromString(rotateA)||null,
        rotateType:rotateType,
        skewX:parseInt(skewX)||null,
        skewXUnit:AtGetUnitFromString(skewX)||null,
        skewY:parseInt(skewY)||null,
        skewYUnit:AtGetUnitFromString(skewY)||null,
    }
}

let AtTransformsData = {};
let AtLastPositions = {};

function AtGetTransformsData(original, toNew) {
    let result = {};
    const properties = ['translateX', 'translateY', 'translateZ', 'scaleX', 'scaleY', 'scaleZ', 'rotateX', 'rotateY', 'rotateZ', 'rotateA', 'skewX', 'skewY'];

    for (let property of properties) {
        if(toNew.hasOwnProperty(property) && toNew.hasOwnProperty(`${property}Unit`)) {
            if (original.hasOwnProperty(`${property}Unit`)) {
                if (toNew[`${property}Unit`] && toNew[`${property}Unit`] === original[`${property}Unit`]) {
                    result[property] = {
                        from: original.hasOwnProperty(property) ? original[property] : 0,
                        to: toNew[property],
                        unit: toNew[`${property}Unit`],
                    };
                }
            } else {
                result[property] = {
                    from: original[property] ? original[property] : 0,
                    to: toNew[property],
                    unit: toNew[`${property}Unit`]
                };
            }
        }
        else if (toNew.hasOwnProperty(property)) {
            if( toNew[property] || original[property] ){
                result[property] = {
                    from: original.hasOwnProperty(property) ? original[property] : 1,
                    to: toNew[property]
                };
            }

        }
    }
    result.translateType = {
        from:original.translateType || null,
        to:toNew.translateType || null,
    }
    result.scaleType = {
        from:original.scaleType || null,
        to:toNew.scaleType || null,
    }
    result.rotateType = {
        from:original.rotateType || null,
        to:toNew.rotateType || null,
    }

    return result;
}

function AtAddScrollDownUpObserver(el, options, index) {
    if( el.hasAttribute('data-at-new-style')){

        const original = el.getAttribute('data-at-original-style');
        let originalTransforms = AtParseTransform(original);

        const transform = el.getAttribute('data-at-new-style');
        let newTransforms = AtParseTransform(transform);

        if(  Object.keys(newTransforms).length !== 0 ){
            el.setAttribute('data-transform-id', index);
            AtTransformsData[index] = AtGetTransformsData(originalTransforms, newTransforms);
            AtLastPositions[index] = 0;
        }
    }

}

function AtElementPositionPercentage(rect, el, elIndex){
    if( !AtTransformsData || !AtTransformsData[elIndex]){
        return null;
    }

    const indexTransformData = AtTransformsData[elIndex];

    const elementCenterY = rect.top + (rect.height / 2);

    // Calculate the center position of the viewport
    const viewportHeight = window.innerHeight;
    const viewportCenterY = viewportHeight / 2;

    // Calculate the distance between the element and the center of the viewport
    const distanceY = elementCenterY - viewportCenterY;

    // 0 is center of the viewport
    let percentage;
    if( viewportCenterY > distanceY ){
        percentage = (distanceY / viewportCenterY) * 100;
    }
    else{
        percentage = ( viewportCenterY/ distanceY) * 100;
    }
    let percentageProps = {}
    if( percentage >= 0 && percentage <= 100 ){
        percentage = 100-percentage;

        let finalTransformData = {
            translateType:indexTransformData.translateType && indexTransformData.translateType.to?indexTransformData.translateType.to:null,
            scaleType:indexTransformData.scaleType && indexTransformData.scaleType.to?indexTransformData.scaleType.to:null,
            rotateType:indexTransformData.rotateType && indexTransformData.rotateType.to?indexTransformData.rotateType.to:null
        };

        let transform = '';
        for (const property in indexTransformData) {
            if(!['translateType','scaleType','rotateType'].includes(property)){
                const fromTo = indexTransformData[property];
                /* let value = (percentage/100) * (15-5) + 5;*/
                let newValue = (percentage / 100) * (fromTo.to - fromTo.from) + fromTo.from
                if( fromTo.unit ){
                    newValue += fromTo.unit;
                }
                finalTransformData[property] = newValue;
            }

        }

        console.log(finalTransformData )
        if( finalTransformData.translateType && (finalTransformData.translateX || finalTransformData.translateY ||finalTransformData.translateZ) ){
            if( '3d' === finalTransformData.translateType ){
                transform += `translate3d(${finalTransformData.translateX||0}, ${finalTransformData.translateY||0}, ${finalTransformData.translateZ||0})`;
            }
            else{
                transform += `translate(${finalTransformData.translateX||0}, ${finalTransformData.translateY||0})`;
            }
        }
        if( finalTransformData.scaleType && (finalTransformData.scaleX || finalTransformData.scaleY ||finalTransformData.scaleZ) ){
            if( '3d' === finalTransformData.scaleType ){
                transform += `scale3d(${finalTransformData.scaleX||0}, ${finalTransformData.scaleY||0}, ${finalTransformData.scaleZ||0})`;
            }
            else{
                transform += `scale(${finalTransformData.scaleX||0}, ${finalTransformData.scaleY||0})`;
            }
        }
        if (finalTransformData.rotateType && (finalTransformData.rotateX || finalTransformData.rotateY || finalTransformData.rotateZ || finalTransformData.rotateA)) {
            if( '3d' === finalTransformData.rotateType ) {
                transform += ` rotate3d(${finalTransformData.rotateX || 0}, ${finalTransformData.rotateY || 0}, ${finalTransformData.rotateZ || 0}, ${finalTransformData.rotateA || 0})`;
            } else {
                transform += ` rotate(${finalTransformData.rotateA || 0})`;
            }
        }

        if( finalTransformData.skewX || finalTransformData.skewY ){
            transform += ` skew(${finalTransformData.skewX || 0}, ${finalTransformData.skewY || 0})`;
        }
        if( transform ){
            percentageProps.transform = transform;
            Object.assign(el.style, percentageProps)
        }
    }
}
function AtOnScrollY(elements) {
    let scrollY = window.scrollY;
    let viewportHeight = window.innerHeight;


    elements.forEach(element => {
        if( element.hasAttribute('data-transform-id')) {
            const elIndex = parseInt(element.getAttribute('data-transform-id'));

            let rect = element.getBoundingClientRect();
            let elementTop = rect.top;
            let elementHeight = element.offsetHeight;
            // Calculate current position of element in percentage
            let currentPosition = (scrollY - elementTop) / (elementHeight - viewportHeight);
            // Check if element is inside the viewport
            if (elementTop <= viewportHeight && elementTop + elementHeight >= 0) {
                // Check if element is scrolling down or up
                if (currentPosition > AtLastPositions[elIndex]) {
                    // console.log('Element is scrolling down');
                    AtElementPositionPercentage(rect, element, elIndex)
                } else if (currentPosition < AtLastPositions[elIndex]) {
                    // console.log('Element is scrolling up');
                    AtElementPositionPercentage(rect, element, elIndex)

                }
            }
            // Update last position of element
            AtLastPositions[elIndex] = currentPosition;
        }

    });
}

function AtScrollProgressiveStyle(selector, options = {}) {
    let els = document.querySelectorAll(selector);

    if (els.length > 0) {
        els = Array.from(els);
        els.forEach((el,index) => {
            AtAddScrollDownUpObserver(el, options, index);
        });
        window.addEventListener('scroll',() => AtOnScrollY(els),true);
    }
}
