/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_object	= function(){};
cXHTMLElement_object.prototype	= new cXHTMLElement;

cXHTMLElement_object.prototype.$getTag	= function()
{
	if (window.navigator.userAgent.indexOf("Gecko") >-1)
	{
		var sHtml   = '<embed';
		for (var sName in this.attributes)
			if (sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
				sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
		sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
		for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
			sHtml	+= ' ' + this.childNodes[nIndex].attributes["name"] + '="' + this.childNodes[nIndex].attributes["value"] + '"';
		return sHtml + ' />';
	}
	else
		return this.AMLElement.$getTag.call(this);
};

// Register Element with language
oXHTMLNamespace.setElement("object", cXHTMLElement_object);
