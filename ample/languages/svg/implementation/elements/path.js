/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cSVGElement_path	= function(){};
cSVGElement_path.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_path.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "d":
						oElement.path	= cSVGElement_path.convert(oEvent.newValue);
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformation
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_path.convert	= function(sValue) {
		var aCommands	= sValue.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
			iStartX		= 0,
			iStartY		= 0,
			iCurrentX	= 0,
			iCurrentY	= 0,
			aPath		= [];

		if (!aCommands)
			return '';

		for (var i = 0, aCommand, sCommand; i < aCommands.length; i++) {
			sCommand	= aCommands[i].substr(0, 1);
			aParameters	= aCommands[i].substr(1).
								replace(/(\d)-/g, '$1,-').
								replace(/^\s+|\s+$/g, '').
								split(/[,\s]/);

			// Round command parameters values
			for (var j = 0; j < aParameters.length; j++)
				aParameters[j]	= Math.round(aParameters[j]);

			switch (sCommand) {
				// moveto (x y)+
				case "M":
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					aPath.push("m" + aParameters.slice(0, 2) + " ");

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

				// lineto (x y)+
				case "L":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aPath.push("l" + aParameters + " ");
					break;

				case "m":
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;

					aPath.push("t" + aParameters.slice(0, 2) + " ");

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

				case "l":
					for (var j = 0; j < aParameters.length; j+= 2) {
						iCurrentX	+= aParameters[j];
						iCurrentY	+= aParameters[j + 1];
					}
					aPath.push("r" + aParameters + " ");
					break;

				// horizontal lineto x+
				case "H":
					iCurrentX	= aParameters[0];
					aPath.push("l" + iCurrentX + "," + iCurrentY + " ");
					break;

				case "h":
					iCurrentX	+= aParameters[0];
					aPath.push("r" + aParameters[0] + "," + "0" + " ");
					break;

				// vertical lineto y+
				case "V":
					iCurrentY	= aParameters[0];
					aPath.push("l" + iCurrentX + "," + iCurrentY + " ");
					break;

				case "v":
					iCurrentY	+= aParameters[0];
					aPath.push("r" + "0" + "," + aParameters[0] + " ");
					break;

				// curveto (x1 y1 x2 y2 x y)+
				case "C":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aPath.push("c" + aParameters + " ");
					break;

				case "c":
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					aPath.push("v" + aParameters + " ");
					break;

				// shorthand/smooth curveto (x2 y2 x y)+
				case "S":
					iCurrentX	= aParameters[2];
					iCurrentY	= aParameters[3];
					aPath.push("c" + iCurrentX + "," + iCurrentY + "," + aParameters + " ");
					break;

				case "s":
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					aPath.push("v" + iCurrentX + "," + iCurrentY + "," + aParameters + " ");
					break;

				// quadratic Bézier curveto (x1 y1 x y)+
				case "Q":
					iCurrentX	= aParameters[2];
					iCurrentY	= aParameters[3];
					aPath.push("qb" + aParameters + " ");
//									aPath.push("l" + iCurrentX + "," + iCurrentY);
					break;

				case "q":
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					aPath.push("qb" + aParameters[0] + "," + aParameters[1] + "," + iCurrentX + "," + iCurrentY + " ");
//									aPath.push("l" + iCurrentX + "," + iCurrentY);
					break;

				// Shorthand/smooth quadratic Bézier curveto (x y)+
				case "T":
					// TODO
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
//									aPath.push("qb" + aParameters + " ");
					aPath.push("l" + iCurrentX + "," + iCurrentY);
					break;

				case "t":
					// TODO
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
//									aPath.push("qb" + iCurrentX + "," + iCurrentY + " ");
					aPath.push("l" + iCurrentX + "," + iCurrentY);
					break;

				// elliptical arc (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
				case "A":
				case "a":

					var iRadiusX	= aParameters[0],
						iRadiusY	= aParameters[1],
						iRotation	= aParameters[2],
						bLargeArc	= aParameters[3] == "1",
						bSweep		= aParameters[4] == "1",
						iToX		= aParameters[5] + (sCommand == "A" ? 0 : iCurrentX),
						iToY		= aParameters[6] + (sCommand == "A" ? 0 : iCurrentY);

					var iFromX	= iCurrentX,
						iFromY	= iCurrentY,
						a	= (iToX - iFromX) / (2 * iRadiusX),
						b	= (iToY - iFromY) / (2 * iRadiusY),
						x	= Math.atan(a / b),
						y	= Math.asin((bSweep == bLargeArc ? -1 : 1) * Math.sqrt(a * a + b * b)),
						iAngleTo	= x + y,
						iAngleFrom	= x - y,
						iCenterX	= Math.round(iToX + (a < 0 ? 1 :-1) * iRadiusX * Math.cos(iAngleTo)),
						iCenterY	= Math.round(iToY + (b < 0 ? 1 :-1) * iRadiusY * Math.sin(iAngleTo)),
						iLeft	= iCenterX - iRadiusX,
						iTop	= iCenterY - iRadiusY,
						iRight	= iCenterX + iRadiusX,
						iBottom	= iCenterY + iRadiusY;
//alert([x, y]);

//alert("<br /><div style='font-weight:bold; color:" + this.getSVGStyleValueInherited("stroke")+ "'>&gt; " + this.boundElement.getAttribute("d") + "</div>");
//alert(["a, b:", a, b]);
//alert(["x, y:", x, y]);
//alert(["from (x, y, angle):", iFromX, iFromY, Math.round(180 * iAngleFrom / Math.PI)]);
//alert(["to (x, y, angle):", iToX, iToY, Math.round(180 * iAngleTo / Math.PI)]);
//alert(["center:", iCenterX, iCenterY]);

//										aPath.push("l" + iToX + " " + iToY + " ");
					aPath.push(/*(bSweep ? "wa" : */"at"/*)*/ + iLeft + "," + iTop + "," + iRight + "," + iBottom + "," + iFromX + "," + iFromY + "," + iToX + "," + iToY + " ");
/*

					var currDigits	= aParameters;
					var prevEndX	= iCurrentX;
					var prevEndY	= iCurrentY;

					var rx = currDigits[0];
					var ry = currDigits[1];
					var xAxisRotationFlag = currDigits[2];
					var largeArcFlag = currDigits[3];
					var clockwise = currDigits[4];
					var x2 = currDigits[5];
					var y2 = currDigits[6];
					var centers = getEllipseCenter(prevEndX,prevEndY,x2,y2,rx,ry);

					//left, top, right, bottom start(x,y) end(x,y)
					var centerX;
					var centerY;
					if (largeArcFlag == 0 ^ clockwise == 0)
					{
						centerX = centers[0];
						centerY = centers[1];
					}
					else
					{
						centerX = centers[2];
						centerY = centers[3];
					}
					var left = Math.round(centerX - rx);
					var top = Math.round(centerY - ry);
					var right = Math.round(centerX + rx);
					var bottom = Math.round(centerY + ry);
					//wa == clockWise Arc
					//at == AnTiclockwise arc
					aPath.push((clockwise ? "wa" : "at") + left + "," + top + "," + right + "," + bottom + "," + Math.round(prevEndX) + "," + Math.round(prevEndY) + "," + Math.round(x2) + "," + Math.round(y2) + ' ');
*/
					if (sCommand == "A") {
						iCurrentX	= aParameters[5];
						iCurrentY	= aParameters[6];
					}
					else {
						iCurrentX	+= aParameters[5];
						iCurrentY	+= aParameters[6];
					}
					break;

				// closepath (none)
				case "Z":
				case "z":
					aPath.push("x");
					iCurrentX	= iStartX;
					iCurrentY	= iStartY;
					break;
			}
		}

		return aPath.join('') + "e";
	};


	function getEllipseCenter(x1,y1,x2,y2,rx,ry)
	{
		var y1a = y1 * rx/ry; //y1' op aangepaste schaal waar ellipsen cirkels worden
		var y2a = y2 * rx/ry; //y2' op aangepaste schaal waar ellipsen cirkels worden
		var deltaX = x2-x1;
		var deltaY = y2a-y1a; //op aangepaste schaal
		var deltaXsqr = deltaX * deltaX;
		var deltaYsqr = deltaY * deltaY;
		var bigroot = Math.sqrt(Math.abs(rx*rx/(deltaXsqr + deltaYsqr) - 0.25));
		var c1 = 0.5 * (x1 + x2) + bigroot * (y1a - y2a);
		var d1a = 0.5 * (y1a + y2a) + bigroot * (x2 - x1);
		var c2 = 0.5 * (x1 + x2) - bigroot * (y1a - y2a);
		var d2a = 0.5 * (y1a + y2a) - bigroot * (x2 - x1);
		return [c1, d1a*ry/rx, c2, d2a*ry/rx];
	};


	// presentation
	cSVGElement_path.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-path' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_path.convert(this.getAttribute("d")) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_path.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("path", cSVGElement_path);
