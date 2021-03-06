/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cSVGElement_a	= function(){};
cSVGElement_a.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_a.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "href":
						cSVGElement_a.setHref(this, oEvent.newValue);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			if (this.hasAttribute("xlink:href"))
				cSVGElement_a.setHref(this, this.getAttribute("xlink:href"));
		}
	};

	// Static members
	cSVGElement_a.setHref	= function(oElement, sValue) {
		for (var nIndex = 0, oChild, oElementDOM; oChild = oElement.childNodes[nIndex]; nIndex++) {
			if (oChild instanceof cSVGElement_g)
				cSVGElement_a.setHref(oChild, sValue);
			else
			if (oChild instanceof cSVGElement_text)
				oChild.$getContainer("shape").href	= sValue;
			else
			if (oChild.nodeType == 1) {
				oElementDOM	= oChild.$getContainer();
				if (oElementDOM)
					oElementDOM.href	= sValue;
			}
		}
	};

	// presentation
	cSVGElement_a.prototype.$getTagOpen	= function() {
		return '<svg2vml:group class="svg-a' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;left:0;top:0;"\
				>';
	};

	cSVGElement_a.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("a", cSVGElement_a);
